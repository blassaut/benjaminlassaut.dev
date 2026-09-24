import Intro from '../components/sections/Intro'
import About from '../components/sections/About'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'
import { LINKEDIN_URL, GITHUB_URL, SITE_URL } from '../data/links'
import { profile } from '../data/profile'

export default function Home() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        url: SITE_URL,
        jobTitle: profile.role,
        alumniOf: { '@type': 'Organization', name: 'Kiln' },
        knowsAbout: ['QA', 'Test Automation', 'BDD', 'CI/CD', 'Playwright', 'Cypress'],
        sameAs: [LINKEDIN_URL, GITHUB_URL],
      })}</script>
      <Intro />
      <About />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
    </>
  )
}
