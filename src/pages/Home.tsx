import { Helmet } from 'react-helmet-async'
import Intro from '../components/sections/Intro'
import About from '../components/sections/About'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'
import { LINKEDIN_URL, GITHUB_URL, SITE_URL } from '../data/links'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Benjamin Lassaut - Lead QA Engineer / SDET</title>
        <meta name="description" content="Benjamin Lassaut - Lead QA Engineer / SDET, ex-Kiln, with 10+ years building quality into software. From fintech to blockchain, across 20+ networks." />
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Benjamin Lassaut',
          url: SITE_URL,
          jobTitle: 'Lead QA Engineer / SDET',
          alumniOf: { '@type': 'Organization', name: 'Kiln' },
          knowsAbout: ['QA', 'Test Automation', 'BDD', 'CI/CD', 'Playwright', 'Cypress'],
          sameAs: [LINKEDIN_URL, GITHUB_URL],
        })}</script>
      </Helmet>
      <Intro />
      <About />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
    </>
  )
}
