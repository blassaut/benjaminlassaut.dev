import { useId } from 'react'

/** The "BL" hexagon. Each instance gets its own gradient id, so several can share a page. */
export default function Logo() {
  const gradientId = useId()
  const gradient = `url(#${gradientId})`
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-8 h-8" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#14b8a6'}} />
          <stop offset="100%" style={{stopColor:'#0d9488'}} />
        </linearGradient>
      </defs>
      <polygon points="100,14 180,54 180,146 100,186 20,146 20,54" fill="transparent" stroke={gradient} strokeWidth="2.5"/>
      <text x="100" y="126" textAnchor="middle" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="80" letterSpacing="-4" fill={gradient}>BL</text>
    </svg>
  )
}
