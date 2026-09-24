/**
 * Applies one mutant to a Playwright page.
 *
 * Two injection points, both outside the application code:
 *   - `dom`: a script injected before the page runs, which edits the rendered
 *     page and keeps re-applying its edits when the app re-renders (SPA).
 *   - `response`: a network interception that rewrites matching responses.
 *
 * Every effective change calls `onApplied()`. The fixture uses that counter to
 * flag mutants that never touched anything ("not applied"): a mutant that does
 * not change the page proves nothing when the tests stay green.
 */
import type { Page, Route } from '@playwright/test'
import type { DomOperation, Mutant, ResponseMutation } from './catalog.ts'

export const APPLIED_CALLBACK = '__mutantApplied'

/** Test annotation added by the fixture when a mutant changed nothing during a scenario; read by the runner. */
export const NOT_APPLIED_ANNOTATION = 'mutant-not-applied'

export async function applyMutant(page: Page, mutant: Mutant, onApplied: () => void): Promise<void> {
  await page.exposeFunction(APPLIED_CALLBACK, onApplied)
  if (mutant.dom) await page.addInitScript(buildDomScript(mutant.dom))
  if (mutant.response) await page.route(mutant.response.url, responseHandler(mutant.response, onApplied))
}

// ---------------------------------------------------------------------------
// DOM mutants
// ---------------------------------------------------------------------------

/**
 * Builds the script injected into the page. Declarative operations are applied
 * once the DOM exists and again after every DOM change (MutationObserver), so
 * that a React re-render cannot silently undo the mutant. Each operation is
 * idempotent: it only reports "applied" when it actually changed something.
 * `script` operations run once, immediately, before any page script.
 */
export function buildDomScript(operations: DomOperation[]): string {
  const scripts = operations.filter((op): op is { script: string } => 'script' in op).map((op) => op.script)
  const declarative = operations.filter((op) => !('script' in op))

  return `(() => {
  const operations = ${JSON.stringify(declarative)};
  const report = (n) => { if (n > 0 && typeof window.${APPLIED_CALLBACK} === 'function') window.${APPLIED_CALLBACK}(); };

  ${scripts.map((code) => `(function () {\n${code}\n})();`).join('\n  ')}
  report(${scripts.length});

  const all = (selector) => Array.from(document.querySelectorAll(selector));

  function applyOne(op) {
    let changed = 0;
    if (op.remove) {
      for (const el of all(op.remove)) { el.remove(); changed++; }
    } else if (op.keepOnlyFirst) {
      for (const el of all(op.keepOnlyFirst).slice(1)) { el.remove(); changed++; }
    } else if (op.disable) {
      for (const el of all(op.disable)) if (!el.hasAttribute('disabled')) { el.setAttribute('disabled', ''); changed++; }
    } else if (op.setText) {
      for (const el of all(op.setText.selector)) if (el.textContent !== op.setText.text) { el.textContent = op.setText.text; changed++; }
    } else if (op.replaceText) {
      const { selector, from, to } = op.replaceText;
      for (const root of all(selector)) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (node.data.includes(from)) { node.data = node.data.split(from).join(to); changed++; }
        }
      }
    } else if (op.setAttribute) {
      const { selector, name, value } = op.setAttribute;
      for (const el of all(selector)) if (el.getAttribute(name) !== value) { el.setAttribute(name, value); changed++; }
    }
    return changed;
  }

  let scheduled = false;
  function applyAll() {
    scheduled = false;
    let changed = 0;
    for (const op of operations) changed += applyOne(op);
    report(changed);
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(applyAll);
  }

  if (operations.length > 0) {
    new MutationObserver(schedule).observe(document, {
      childList: true, subtree: true, characterData: true, attributes: true,
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyAll);
    else applyAll();
  }
})();`
}

// ---------------------------------------------------------------------------
// Response mutants
// ---------------------------------------------------------------------------

function responseHandler(mutation: ResponseMutation, onApplied: () => void) {
  return async (route: Route) => {
    const request = route.request()
    if (mutation.resourceTypes && !mutation.resourceTypes.includes(request.resourceType())) {
      return route.fallback()
    }

    const original = await route.fetch()
    let body = await original.text()
    let changed = false

    if (mutation.replaceText) {
      for (const { from, to } of mutation.replaceText) {
        if (body.includes(from)) {
          body = body.split(from).join(to)
          changed = true
        }
      }
    }
    if (mutation.json) {
      const data = JSON.parse(body)
      for (const edit of mutation.json) {
        if (applyJsonEdit(data, edit)) changed = true
      }
      body = JSON.stringify(data)
    }
    if (mutation.status !== undefined && mutation.status !== original.status()) changed = true

    if (changed) onApplied()

    // Body may have changed size; let Playwright recompute length and skip
    // the original encoding, which no longer matches the rewritten bytes.
    const headers = { ...original.headers() }
    delete headers['content-length']
    delete headers['content-encoding']
    await route.fulfill({ response: original, status: mutation.status ?? original.status(), headers, body })
  }
}

/** Applies `set` or `delete` at a dot path ("data.items.0.price"). Returns true when something changed. */
export function applyJsonEdit(data: unknown, edit: { path: string; set?: unknown; delete?: true }): boolean {
  const keys = edit.path.split('.')
  const last = keys.pop() as string
  let parent: unknown = data
  for (const key of keys) {
    if (parent === null || typeof parent !== 'object') return false
    parent = (parent as Record<string, unknown>)[key]
  }
  if (parent === null || typeof parent !== 'object') return false
  const target = parent as Record<string, unknown>
  if (edit.delete) {
    if (!(last in target)) return false
    if (Array.isArray(target)) target.splice(Number(last), 1)
    else delete target[last]
    return true
  }
  if (JSON.stringify(target[last]) === JSON.stringify(edit.set)) return false
  target[last] = edit.set
  return true
}
