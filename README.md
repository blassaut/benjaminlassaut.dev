# benjaminlassaut.dev

Personal portfolio site for **Benjamin Lassaut** - Lead QA Engineer / SDET, ex-[Kiln](https://kiln.fi), specializing in test automation, BDD, and CI/CD quality engineering.

## Tech Stack

- **Framework:** React 19 + Vite 7 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Routing:** React Router 7
- **Testing:** Vitest + Playwright + playwright-bdd (Gherkin/Cucumber)
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:mutation` | Run mutation testing (Stryker) against the unit tests |
| `npm run test:mutation:e2e` | Plant catalogued bugs and check the E2E suite notices ([method](e2e/mutation/README.md)) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |

## Project Structure

```
src/
  components/
    sections/       Home page sections (Intro, About, Experience, Skills, etc.)
    qa/             QA portfolio showcase components
    ui/             Reusable UI components
  pages/            Route pages (Home, QA)
  data/             Static data (experience, skills, testimonials)
  lib/              Utilities (resume generator, Gherkin parser)
  hooks/            Custom React hooks
  __tests__/        Unit & component tests
e2e/
  features/         Gherkin feature files
  steps/            Playwright step definitions
  fixtures.ts       Shared Playwright test object (plants a mutant when MUTANT is set)
  mutation/         E2E mutation testing: catalog of planted bugs, runner, method
```

## Site Structure

- **`/`** - Single-page scroll: Intro, About, Experience, Skills, Testimonials, Contact
- **`/qa`** - Interactive QA portfolio ("Who Tests the Tester?")

## Design System

- **Background:** `#0a0a0f` (deep dark) with grain texture
- **Accent:** `#14b8a6` (electric teal)
- **Text:** `#f0f0f0` / `#6b7280`
- **Headings:** Exo 2
- **Body:** IBM Plex Sans
- **Monospace:** JetBrains Mono

## Mutation Testing

Coverage only proves a line was *executed*; it says nothing about whether a test would notice if that line were wrong. This matters with AI-written tests, which often pass whatever the code does.

[StrykerJS](https://stryker-mutator.io) plants small bugs (mutants) in the source (`<` becomes `<=`, a condition becomes `true`, a block becomes empty...) and reruns the unit tests. A mutant that survives means the line is covered but not actually checked.

```bash
npm run test:mutation          # ~2 min, report in reports/mutation/index.html
```

- Scope, thresholds and excluded files live in `stryker.config.mjs`. Static data and purely presentational sections are excluded on purpose (they are covered by the E2E suite); widen the `mutate` list when a file gains logic.
- CI runs it on every PR and fails when the global score drops under `thresholds.break`. That value is a ratchet: raise it as the tests improve, never lower it.
- Rule for new tests: a test that kills none of the mutants in the code it claims to cover is not a test. Open the HTML report, find the survivors on the lines you touched, and add the missing assertion.

### End-to-end tests

Stryker only covers unit tests. For the Playwright suite, bugs are planted outside the application code, at the DOM and network boundary, from a catalog tied to tickets:

```bash
npm run test:mutation:e2e -- --list    # the catalog
npm run test:mutation:e2e              # plant every bug, report which ones the suite missed
```

The method, the catalog format, the merge rule and how to port it to another project are documented in [`e2e/mutation/README.md`](e2e/mutation/README.md).

## Deployment

Push to `main` - Vercel auto-deploys. CI runs on every push/PR via GitHub Actions (build, unit tests, mutation testing, E2E).

## License

All rights reserved.
