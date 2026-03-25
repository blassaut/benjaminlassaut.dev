import { describe, it, expect } from 'vitest'
import { web3Features, web3Practices, web3Stats } from '../../data/web3-features'

describe('web3-features data', () => {
  describe('web3Features', () => {
    it('contains exactly 5 feature files', () => {
      expect(web3Features).toHaveLength(5)
    })

    it('every feature starts with "Feature:"', () => {
      for (const raw of web3Features) {
        expect(raw.trimStart()).toMatch(/^Feature:/)
      }
    })

    it('every feature has at least one scenario', () => {
      for (const raw of web3Features) {
        expect(raw).toMatch(/Scenario(?: Outline)?:/)
      }
    })

    it('features cover all 5 expected journeys', () => {
      const names = web3Features.map((f) => f.split('\n')[0].replace('Feature: ', ''))
      expect(names).toContain('Visitor connects wallet')
      expect(names).toContain('Visitor stakes successfully')
      expect(names).toContain('Visitor rejects transaction')
      expect(names).toContain('Visitor is on wrong network')
      expect(names).toContain('Visitor unstakes successfully')
    })

    it('contains a total of 13 scenarios across all features', () => {
      const total = web3Features.reduce((sum, raw) => {
        return sum + (raw.match(/^\s*Scenario(?: Outline)?:/gm) || []).length
      }, 0)
      expect(total).toBe(13)
    })
  })

  describe('web3Practices', () => {
    it('contains exactly 4 practice cards', () => {
      expect(web3Practices).toHaveLength(4)
    })

    it('every card has required fields', () => {
      for (const p of web3Practices) {
        expect(p.label).toBeTruthy()
        expect(p.description).toBeTruthy()
        expect(p.detail).toBeTruthy()
        expect(p.icon).toBeTruthy()
        expect(p.source.label).toBeTruthy()
        expect(p.source.href).toBeTruthy()
      }
    })

    it('all source links point to web3-staking-demo repo', () => {
      for (const p of web3Practices) {
        expect(p.source.href).toContain('github.com/blassaut/web3-staking-demo')
      }
    })

    it('every card has a Dappwright + Playwright caption', () => {
      for (const p of web3Practices) {
        expect(p.caption).toBe('Dappwright + Playwright')
      }
    })
  })

  describe('web3Stats', () => {
    it('contains exactly 4 stats', () => {
      expect(web3Stats).toHaveLength(4)
    })

    it('every stat has value and label', () => {
      for (const s of web3Stats) {
        expect(s.value).toBeTruthy()
        expect(s.label).toBeTruthy()
      }
    })

    it('has the expected values', () => {
      const map = Object.fromEntries(web3Stats.map((s) => [s.label, s.value]))
      expect(map['User journeys']).toBe('5')
      expect(map['Scenarios']).toBe('13')
      expect(map['Failure modes']).toBe('2')
      expect(map['Wallet interactions']).toBe('Real')
    })
  })
})
