import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="MickyCodes"
            className="h-9 w-9 rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-white">
              MickyCodes
            </span>
            <span className="text-[0.65rem] tracking-widest uppercase text-neutral-500">
              Portfolio
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.8rem] text-neutral-400 tracking-wide uppercase transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:alazartesfaye42@gmail.com"
            className="ml-2 rounded-full border border-white/15 px-5 py-2 text-[0.8rem] text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-light text-white transition-all duration-300 hover:tracking-widest"
              style={{
                transitionDelay: open ? `${i * 60}ms` : '0ms',
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(16px)',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:alazartesfaye42@gmail.com"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-full border border-white/20 px-8 py-3 text-sm text-white transition-all duration-300 hover:bg-white hover:text-black"
            style={{
              transitionDelay: open ? `${navLinks.length * 60}ms` : '0ms',
              opacity: open ? 1 : 0,
            }}
          >
            Get in touch
          </a>
        </div>
      </div>
    </nav>
  )
}

export default NavBar