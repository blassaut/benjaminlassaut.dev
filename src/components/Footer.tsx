export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted font-body">
        © {new Date().getFullYear()} Benjamin Lassaut. All rights reserved.
      </div>
    </footer>
  )
}
