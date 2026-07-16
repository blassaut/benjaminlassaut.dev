export interface Certification {
  name: string
  issuer: string
  year: string
  logo: string
}

export const certifications: Certification[] = [
  {
    name: 'Certified Tester, Foundation Level',
    issuer: 'ISTQB',
    year: '2019',
    logo: '/logos/istqb.svg',
  },
  {
    name: 'Solutions Architect Associate',
    issuer: 'Amazon Web Services',
    year: '2020',
    logo: '/logos/aws.svg',
  },
]
