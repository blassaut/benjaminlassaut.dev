import { Helmet } from 'react-helmet-async'
import Intro from '../components/sections/Intro'
import About from '../components/sections/About'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import BlogPreview from '../components/sections/BlogPreview'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Benjamin Lassaut - QA Lead | Web3 Quality Engineering</title>
        <meta name="description" content="Benjamin Lassaut - QA Lead at Kiln with 10+ years building quality into software. From fintech to blockchain, across 20+ networks." />
        <link rel="canonical" href="https://benjaminlassaut.dev" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Benjamin Lassaut',
          url: 'https://benjaminlassaut.dev',
          jobTitle: 'Lead QA Engineer',
          worksFor: { '@type': 'Organization', name: 'Kiln' },
          knowsAbout: ['QA', 'Test Automation', 'Smart Contract Testing', 'Web3', 'EVM'],
          sameAs: [
            'https://linkedin.com/in/benjaminlassaut',
            'https://github.com/blassaut',
          ],
        })}</script>
      </Helmet>
      <Intro />
      <About />
      <Experience />
      <Skills />
      <BlogPreview />
      <Contact />
    </>
  )
}
