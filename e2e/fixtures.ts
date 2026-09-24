/**
 * Shared Playwright test object for every step file.
 *
 * Adds one automatic fixture: when the MUTANT environment variable names a
 * mutant from e2e/mutation/mutants/*.yaml, that bug is planted on every page
 * of the scenario. Without MUTANT, the suite runs exactly as before.
 *
 * Usage in step files:  const { Given, When, Then } = createBdd(test)
 */
import { test as base } from 'playwright-bdd'
import { findMutant, loadCatalog } from './mutation/catalog.ts'
import { applyMutant, NOT_APPLIED_ANNOTATION } from './mutation/inject.ts'

const catalog = process.env.MUTANT ? loadCatalog() : []

export const test = base.extend<{ mutant: void }>({
  mutant: [
    async ({ page }, use, testInfo) => {
      const id = process.env.MUTANT
      if (!id) {
        await use()
        return
      }
      const mutant = findMutant(id, catalog)
      let applied = 0
      await applyMutant(page, mutant, () => {
        applied++
      })
      testInfo.annotations.push({ type: 'mutant', description: `${mutant.id} — ${mutant.concern}` })

      await use()

      if (applied === 0) {
        testInfo.annotations.push({
          type: NOT_APPLIED_ANNOTATION,
          description: `Mutant "${mutant.id}" did not change anything during this scenario`,
        })
      }
    },
    { auto: true },
  ],
})
