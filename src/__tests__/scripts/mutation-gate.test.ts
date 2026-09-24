// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  countOnChangedLines,
  findUncaughtOnChangedLines,
  formatAnnotation,
  formatMarkdown,
  parseChangedLines,
  summarizeScore,
  type MutationReport,
  type ReportMutant,
  type ScoreSummary,
} from '../../../scripts/mutation-gate.ts'

const diff = `diff --git a/src/a.ts b/src/a.ts
index 1..2 100644
--- a/src/a.ts
+++ b/src/a.ts
@@ -3,2 +3,3 @@ function a() {
@@ -10 +11 @@ function b() {
@@ -20,4 +21,0 @@ function c() {
diff --git a/src/new.ts b/src/new.ts
new file mode 100644
--- /dev/null
+++ b/src/new.ts
@@ -0,0 +1,2 @@
diff --git a/src/gone.ts b/src/gone.ts
deleted file mode 100644
--- a/src/gone.ts
+++ /dev/null
@@ -1,3 +0,0 @@`

describe('parseChangedLines', () => {
  it('collects the added or changed lines of every file in the diff', () => {
    const changed = parseChangedLines(diff)
    expect([...changed.keys()]).toEqual(['src/a.ts', 'src/new.ts'])
    // +3,3 -> 3..5, +11 (no count) -> 11, +21,0 is a pure deletion
    expect([...changed.get('src/a.ts')!]).toEqual([3, 4, 5, 11])
    expect([...changed.get('src/new.ts')!]).toEqual([1, 2])
  })
})

function mutant(line: number, status: string, endLine = line): ReportMutant {
  return {
    id: `${line}-${status}`,
    mutatorName: 'StringLiteral',
    replacement: '""',
    status,
    // columns 11..16 cover the string literal of the fixture lines below
    location: { start: { line, column: 11 }, end: { line: endLine, column: 16 } },
  }
}

const source = ['line 1', 'line 2', 'const x = "abc"', 'line 4', 'const y = "def"', 'line 6'].join('\n')

describe('findUncaughtOnChangedLines', () => {
  const changed = new Map([['src/a.ts', new Set([3, 5])]])

  it('flags a surviving or uncovered mutant on a changed line, with the code it replaced', () => {
    const report: MutationReport = { files: { 'src/a.ts': { source, mutants: [mutant(3, 'Survived'), mutant(5, 'NoCoverage')] } } }
    expect(findUncaughtOnChangedLines(report, changed)).toEqual([
      { file: 'src/a.ts', line: 3, column: 11, mutator: 'StringLiteral', status: 'Survived', original: '"abc"', replacement: '""' },
      { file: 'src/a.ts', line: 5, column: 11, mutator: 'StringLiteral', status: 'NoCoverage', original: '"def"', replacement: '""' },
    ])
  })

  it('lets through killed, timed-out and deliberately ignored mutants', () => {
    const report: MutationReport = {
      files: { 'src/a.ts': { mutants: [mutant(3, 'Killed'), mutant(3, 'Timeout'), mutant(3, 'Ignored')] } },
    }
    expect(findUncaughtOnChangedLines(report, changed)).toEqual([])
  })

  it('leaves survivors on untouched lines and untouched files to the global threshold', () => {
    const report: MutationReport = {
      files: {
        'src/a.ts': { mutants: [mutant(4, 'Survived')] },
        'src/b.ts': { mutants: [mutant(3, 'Survived')] },
      },
    }
    expect(findUncaughtOnChangedLines(report, changed)).toEqual([])
  })

  it('flags a multi-line mutant when any of its lines changed', () => {
    const report: MutationReport = { files: { 'src/a.ts': { mutants: [mutant(1, 'Survived', 3)] } } }
    expect(findUncaughtOnChangedLines(report, changed).map((u) => u.line)).toEqual([1])
  })
})

describe('summarizeScore', () => {
  it('computes the score as Stryker does: detected over detected plus undetected', () => {
    const report: MutationReport = {
      thresholds: { break: 80 },
      files: {
        'src/a.ts': { mutants: [mutant(1, 'Killed'), mutant(2, 'Killed'), mutant(3, 'Timeout'), mutant(4, 'Survived')] },
        // Ignored and error statuses stay out of the score
        'src/b.ts': { mutants: [mutant(1, 'NoCoverage'), mutant(2, 'Ignored'), mutant(3, 'CompileError')] },
      },
    }
    expect(summarizeScore(report)).toEqual({
      score: 60,
      breakAt: 80,
      counts: { Killed: 2, Timeout: 1, Survived: 1, NoCoverage: 1, Ignored: 1, CompileError: 1 },
    })
  })

  it('has no score when no mutant counts, instead of dividing by zero', () => {
    const report: MutationReport = { files: { 'src/a.ts': { mutants: [mutant(1, 'Ignored')] } } }
    expect(summarizeScore(report)).toEqual({ score: null, breakAt: null, counts: { Ignored: 1 } })
  })
})

describe('countOnChangedLines', () => {
  it('counts the tested mutants on changed lines, so "all killed" is told apart from "nothing to check"', () => {
    const report: MutationReport = {
      files: {
        'src/a.ts': { mutants: [mutant(3, 'Killed'), mutant(5, 'Survived'), mutant(1, 'Timeout', 3), mutant(3, 'Ignored'), mutant(4, 'Killed')] },
        'src/b.ts': { mutants: [mutant(3, 'Killed')] },
      },
    }
    // line 3, line 5, and the multi-line 1..3; not Ignored, not untouched line 4, not the untouched file
    expect(countOnChangedLines(report, new Map([['src/a.ts', new Set([3, 5])]]))).toBe(3)
  })
})

describe('formatMarkdown', () => {
  const summary: ScoreSummary = { score: 89.0334, breakAt: 80, counts: { Killed: 617, Survived: 75, NoCoverage: 1, Ignored: 1 } }

  it('shows the overall score next to the break threshold, and every status count', () => {
    const md = formatMarkdown([], summary, 12)
    expect(md.split('\n').slice(0, 3)).toEqual([
      '### Mutation score: 89.03% (break threshold 80%)',
      '',
      '617 killed · 0 timed out · 75 survived · 1 no coverage · 1 ignored',
    ])
  })

  it('says how many changed-line mutants were checked when all were killed', () => {
    expect(formatMarkdown([], summary, 12)).toContain('### Mutation gate: all 12 mutant(s) on changed lines were killed ✅')
  })

  it('says so when the PR changes no mutated line, rather than claiming kills', () => {
    expect(formatMarkdown([], summary, 0)).toContain('### Mutation gate: no mutant on a changed line ✅')
  })

  it('shows n/a without a score and leaves out a missing threshold', () => {
    expect(formatMarkdown([], { score: null, breakAt: null, counts: {} }, 0).split('\n')[0]).toBe('### Mutation score: n/a')
  })

  it('lists each uncaught mutant and how to resolve it, keeping the table intact', () => {
    const md = formatMarkdown(
      [{ file: 'src/a.ts', line: 3, column: 7, mutator: 'LogicalOperator', status: 'Survived', original: 'a || b', replacement: 'a && b' }],
      summary,
      4,
    )
    expect(md).toContain('### Mutation gate: 1 of 4 mutant(s) on changed lines not killed ❌')
    expect(md).toContain('`// Stryker disable next-line <Mutator>: <reason>`')
    expect(md).toContain('| `src/a.ts:3` | LogicalOperator | Survived | `a \\|\\| b` | `a && b` |')
  })
})

describe('formatAnnotation', () => {
  it('points GitHub at the exact line of the diff', () => {
    expect(
      formatAnnotation({ file: 'src/a.ts', line: 3, column: 11, mutator: 'StringLiteral', status: 'Survived', original: '"abc"', replacement: '""' }),
    ).toBe('::error file=src/a.ts,line=3,col=11::StringLiteral mutant survived: "abc" → ""')
  })

  // Unescaped, GitHub decodes "%0A" in the code into a line break and garbles the annotation
  it('escapes the characters GitHub would otherwise decode', () => {
    expect(
      formatAnnotation({ file: 'src/a,b:c.ts', line: 1, column: 1, mutator: 'StringLiteral', status: 'NoCoverage', original: '"50%0A"', replacement: '"a\nb"' }),
    ).toBe('::error file=src/a%2Cb%3Ac.ts,line=1,col=1::StringLiteral mutant nocoverage: "50%250A" → "a%0Ab"')
  })
})
