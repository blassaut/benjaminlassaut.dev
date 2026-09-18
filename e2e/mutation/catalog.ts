/**
 * Mutant catalog: loads and validates `e2e/mutation/mutants/*.yaml`.
 *
 * A mutant is a bug we plant on purpose, described as data. The catalog is
 * the single source of truth shared by the Playwright fixture (which applies
 * a mutant) and the runner (which loops over mutants and reports).
 *
 * Every rule enforced here is documented in ./README.md, section "Catalog
 * reference". Keep the two in sync.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { basename, join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { config } from './config.ts'

/** One change to the rendered page. Exactly one key per operation. */
export type DomOperation =
  | { remove: string }
  | { keepOnlyFirst: string }
  | { disable: string }
  | { setText: { selector: string; text: string } }
  | { replaceText: { selector: string; from: string; to: string } }
  | { setAttribute: { selector: string; name: string; value: string } }
  | { script: string }

/** One change to a network response, applied to every request matching `url`. */
export interface ResponseMutation {
  url: string
  resourceTypes?: string[]
  status?: number
  replaceText?: { from: string; to: string }[]
  json?: ({ path: string; set: unknown } | { path: string; delete: true })[]
}

export interface Mutant {
  id: string
  ticket: string
  concern: string
  expect: string
  scope: { files: string[]; tags?: string[] }
  dom?: DomOperation[]
  response?: ResponseMutation
  /** Catalog file the mutant was read from, relative to the repo. */
  file: string
}

export const DOM_OPERATIONS = [
  'remove',
  'keepOnlyFirst',
  'disable',
  'setText',
  'replaceText',
  'setAttribute',
  'script',
] as const

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export class CatalogError extends Error {}

/** Reads every catalog file, validates it, and returns all mutants sorted by id. */
export function loadCatalog(dir = config.mutantsDir): Mutant[] {
  if (!existsSync(dir)) throw new CatalogError(`Catalog directory not found: ${dir}`)
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort()
  if (files.length === 0) throw new CatalogError(`No .yaml file in ${dir}`)

  const testFiles = listTestFiles()
  const mutants: Mutant[] = []
  const seen = new Map<string, string>()

  for (const file of files) {
    const path = join(dir, file)
    const label = `e2e/mutation/mutants/${file}`
    const doc = parseYaml(readFileSync(path, 'utf8'))
    if (!doc || typeof doc !== 'object' || !Array.isArray(doc.mutants)) {
      throw new CatalogError(`${label}: expected a top-level "mutants:" list`)
    }
    doc.mutants.forEach((raw: unknown, index: number) => {
      const where = `${label} › mutants[${index}]`
      const mutant = validateMutant(raw, where, testFiles)
      const duplicate = seen.get(mutant.id)
      if (duplicate) throw new CatalogError(`${where}: id "${mutant.id}" already used in ${duplicate}`)
      seen.set(mutant.id, label)
      mutants.push({ ...mutant, file: label })
    })
  }
  return mutants.sort((a, b) => a.id.localeCompare(b.id))
}

/** Returns the mutant with this id, or throws with the list of known ids. */
export function findMutant(id: string, catalog = loadCatalog()): Mutant {
  const mutant = catalog.find((m) => m.id === id)
  if (!mutant) {
    const known = catalog.map((m) => `  - ${m.id}`).join('\n')
    throw new CatalogError(`Unknown mutant "${id}". Known mutants:\n${known}`)
  }
  return mutant
}

/** Test file names without extension, e.g. "visitor-reads-legal-notice". */
export function listTestFiles(): string[] {
  return readdirSync(config.testFilesDir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith(config.testFileExtension))
    .map((f) => basename(f, config.testFileExtension))
    .sort()
}

// ---------------------------------------------------------------------------
// Validation. Every message names the file, the index and the field, so that a
// broken catalog entry is fixed in seconds, without reading this code.
// ---------------------------------------------------------------------------

function validateMutant(raw: unknown, where: string, testFiles: string[]): Omit<Mutant, 'file'> {
  const m = expectObject(raw, where)

  const id = expectString(m.id, `${where}.id`)
  if (!ID_PATTERN.test(id)) {
    throw new CatalogError(`${where}.id: "${id}" must be kebab-case (letters, digits, hyphens)`)
  }
  const at = `${where} (${id})`

  const ticket = expectString(m.ticket, `${at}.ticket`)
  const concern = expectString(m.concern, `${at}.concern`)
  const expect = expectString(m.expect, `${at}.expect`)

  const scope = expectObject(m.scope, `${at}.scope`)
  const files = expectStringList(scope.files, `${at}.scope.files`)
  if (files.length === 0) throw new CatalogError(`${at}.scope.files: list at least one test file`)
  for (const f of files) {
    if (!testFiles.includes(f)) {
      throw new CatalogError(
        `${at}.scope.files: "${f}" is not a ${config.testFileExtension} file in ${config.testFilesDir}. Known: ${testFiles.join(', ')}`,
      )
    }
  }
  const tags = scope.tags === undefined ? undefined : expectStringList(scope.tags, `${at}.scope.tags`)
  for (const t of tags ?? []) {
    if (!t.startsWith('@')) throw new CatalogError(`${at}.scope.tags: "${t}" must start with "@"`)
  }

  const dom = m.dom === undefined ? undefined : validateDom(m.dom, `${at}.dom`)
  const response = m.response === undefined ? undefined : validateResponse(m.response, `${at}.response`)
  if (!dom && !response) throw new CatalogError(`${at}: add a "dom:" list or a "response:" block`)

  const allowed = ['id', 'ticket', 'concern', 'expect', 'scope', 'dom', 'response']
  for (const key of Object.keys(m)) {
    if (!allowed.includes(key)) throw new CatalogError(`${at}: unknown field "${key}". Allowed: ${allowed.join(', ')}`)
  }

  return { id, ticket, concern, expect, scope: { files, tags }, dom, response }
}

function validateDom(raw: unknown, where: string): DomOperation[] {
  if (!Array.isArray(raw) || raw.length === 0) throw new CatalogError(`${where}: expected a non-empty list of operations`)
  return raw.map((op, i) => {
    const at = `${where}[${i}]`
    const o = expectObject(op, at)
    const keys = Object.keys(o)
    if (keys.length !== 1) throw new CatalogError(`${at}: one operation per list item, got ${keys.length} keys (${keys.join(', ')})`)
    const kind = keys[0] as (typeof DOM_OPERATIONS)[number]
    if (!DOM_OPERATIONS.includes(kind)) throw new CatalogError(`${at}: unknown operation "${kind}". Allowed: ${DOM_OPERATIONS.join(', ')}`)
    const value = o[kind]
    switch (kind) {
      case 'remove':
      case 'keepOnlyFirst':
      case 'disable':
      case 'script':
        expectString(value, `${at}.${kind}`)
        break
      case 'setText':
        expectFields(value, `${at}.setText`, ['selector', 'text'])
        break
      case 'replaceText':
        expectFields(value, `${at}.replaceText`, ['selector', 'from', 'to'])
        break
      case 'setAttribute':
        expectFields(value, `${at}.setAttribute`, ['selector', 'name', 'value'])
        break
    }
    return o as DomOperation
  })
}

function validateResponse(raw: unknown, where: string): ResponseMutation {
  const r = expectObject(raw, where)
  const url = expectString(r.url, `${where}.url`)
  const out: ResponseMutation = { url }
  if (r.resourceTypes !== undefined) out.resourceTypes = expectStringList(r.resourceTypes, `${where}.resourceTypes`)
  if (r.status !== undefined) {
    if (typeof r.status !== 'number') throw new CatalogError(`${where}.status: expected a number`)
    out.status = r.status
  }
  if (r.replaceText !== undefined) {
    if (!Array.isArray(r.replaceText)) throw new CatalogError(`${where}.replaceText: expected a list`)
    r.replaceText.forEach((item: unknown, i: number) => expectFields(item, `${where}.replaceText[${i}]`, ['from', 'to']))
    out.replaceText = r.replaceText
  }
  if (r.json !== undefined) {
    if (!Array.isArray(r.json)) throw new CatalogError(`${where}.json: expected a list`)
    r.json.forEach((item: unknown, i: number) => {
      const o = expectObject(item, `${where}.json[${i}]`)
      expectString(o.path, `${where}.json[${i}].path`)
      if (!('set' in o) && o.delete !== true) {
        throw new CatalogError(`${where}.json[${i}]: add "set: <value>" or "delete: true"`)
      }
    })
    out.json = r.json
  }
  const effects = ['status', 'replaceText', 'json'].filter((k) => k in out)
  if (effects.length === 0) throw new CatalogError(`${where}: add at least one of status, replaceText, json`)
  return out
}

function expectObject(value: unknown, where: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CatalogError(`${where}: expected a mapping (key: value)`)
  return value as Record<string, unknown>
}

function expectString(value: unknown, where: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new CatalogError(`${where}: expected a non-empty text`)
  return value
}

function expectStringList(value: unknown, where: string): string[] {
  if (!Array.isArray(value)) throw new CatalogError(`${where}: expected a list`)
  return value.map((v, i) => expectString(v, `${where}[${i}]`))
}

function expectFields(value: unknown, where: string, fields: string[]) {
  const o = expectObject(value, where)
  for (const f of fields) expectString(o[f], `${where}.${f}`)
}
