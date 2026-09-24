/** Turns a label into a kebab-case id: "Who tests the tester?" -> "who-tests-the-tester". */
export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
