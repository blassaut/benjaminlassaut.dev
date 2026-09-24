// Site navigation, shared by the navbar and the footer.
// `hash` links scroll to a home page section, `href` links go to another page.
export type NavLink = { label: string; hash: `#${string}` } | { label: string; href: string }

export const navLinks: NavLink[] = [
  { label: 'About', hash: '#about' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Who tests the tester?', href: '/qa' },
  { label: 'Contact', hash: '#contact' },
]
