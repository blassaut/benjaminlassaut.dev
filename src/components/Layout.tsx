import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 text-light bg-grain">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
