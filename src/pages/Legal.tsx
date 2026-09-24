import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { LINKEDIN_URL, REPO_URL, SITE_URL, SITE_HOST, OG_IMAGE_URL } from '../data/links'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-3">{title}</h2>
      <div className="text-sm text-muted font-body leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function Legal() {
  return (
    <div data-testid="legal-page" className="max-w-3xl mx-auto px-6 py-24">
      <Helmet>
        <title>Legal Notice - Benjamin Lassaut</title>
        <meta
          name="description"
          content={`Legal notice for ${SITE_HOST} - publisher, hosting and personal data information.`}
        />
        <link rel="canonical" href={`${SITE_URL}/legal`} />
        <meta property="og:title" content="Legal Notice - Benjamin Lassaut" />
        <meta
          property="og:description"
          content={`Legal notice for ${SITE_HOST} - publisher, hosting and personal data information.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/legal`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
      </Helmet>

      <h1 className="text-4xl font-heading font-bold text-content mb-12">Legal Notice</h1>

      <Section title="Website publisher">
        <p>
          This website is published by Benjamin Lassaut, Lead QA Engineer / SDET.
          <br />
          Director of publication: Benjamin Lassaut.
        </p>
        <p>
          Contact: via the{' '}
          <Link to="/#contact" className="text-teal-400 underline hover:text-teal-300">
            contact form
          </Link>{' '}
          or{' '}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 underline hover:text-teal-300"
          >
            LinkedIn
          </a>
          .
        </p>
      </Section>

      <Section title="Professional status">
        <p>
          Benjamin Lassaut carries out his professional activity under a CAPE agreement
          (Contrat d&apos;Appui au Projet d&apos;Entreprise) with the business incubator COSENS,
          which provides the legal and administrative framework for this activity.
        </p>
        <p>
          <span className="text-content font-semibold">COSENS</span>
          <br />
          Registered office: 2A rue de Rome, 13001 Marseille, France
          <br />
          Phone: +33 (0)4 91 59 82 80 &mdash; Email:{' '}
          <a href="mailto:info@cosens.fr" className="text-teal-400 underline hover:text-teal-300">
            info@cosens.fr
          </a>{' '}
          &mdash;{' '}
          <a
            href="https://www.cosens.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 underline hover:text-teal-300"
          >
            www.cosens.fr
          </a>
          <br />
          SIRET: 419 369 798 00030
          <br />
          EU VAT number: FR 06 419 369 798
        </p>
      </Section>

      <Section title="Hosting">
        <p>
          This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
          United States &mdash;{' '}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 underline hover:text-teal-300"
          >
            vercel.com
          </a>
          .
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          Unless otherwise stated, all content on this website (texts, visuals, code) is the
          property of Benjamin Lassaut. Any reproduction or distribution without prior written
          consent is prohibited. The source code of this website is available on{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 underline hover:text-teal-300"
          >
            GitHub
          </a>
          .
        </p>
      </Section>

      <Section title="Personal data">
        <p>
          This website does not use analytics or tracking cookies. Data submitted through the
          contact form (name, email address, message) is processed by Formspree Inc. for the sole
          purpose of responding to your enquiry, and is never shared with third parties or used
          for any other purpose.
        </p>
        <p>
          In accordance with the GDPR, you may request access to, rectification or deletion of
          your personal data by getting in touch through the contact form.
        </p>
      </Section>
    </div>
  )
}
