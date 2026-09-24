const sizes = {
  md: 'px-7 py-3',
  sm: 'px-5 py-2.5 text-sm',
}

/** Classes of the teal call-to-action, for an <a>, a <Link> or a <button>. */
export function primaryButton(size: keyof typeof sizes = 'md') {
  return `${sizes[size]} bg-teal-400 text-ink font-body font-semibold rounded-lg hover:shadow-[0_0_30px] hover:shadow-teal-400/30 transition-all`
}
