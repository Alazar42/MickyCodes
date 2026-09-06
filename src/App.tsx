import { useEffect } from 'react'
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import NavBar from './components/NavBar'
import {
  projects,
  focusAreas,
  experience,
  skills,
  strengths,
  awards,
  languages,
  metrics,
} from './lib/data'

function App() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px',
      },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="noise-overlay min-h-screen bg-black text-white">
      <NavBar />

      <main>
        {/* ─── HERO ─── */}
        <section
          id="home"
          className="relative flex min-h-screen items-center"
        >
          {/* Subtle grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          <div className="relative mx-auto w-full max-w-6xl px-5 py-32 md:px-8 md:py-40">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left: text content */}
              <div className="reveal" data-reveal>
                <p className="mono-label mb-6">Software Engineer / Computer Scientist</p>

                <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  Mickyas
                  <br />
                  Tesfaye
                </h1>

                <p className="mt-8 max-w-lg text-base leading-relaxed text-neutral-400 md:text-lg">
                  Backend-first developer building full-stack tools, games, and
                  systems. I focus on practical software delivery across Django,
                  Spring Boot, React, FastAPI, Flutter, and game development.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href="#projects"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-neutral-200"
                  >
                    View work
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                  <a
                    href="mailto:alazartesfaye42@gmail.com"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm text-white transition-all duration-300 hover:border-white/40"
                  >
                    <Mail size={14} />
                    Email me
                  </a>
                </div>
              </div>

              {/* Right: morphing gradient logo */}
              <div className="reveal hidden lg:block" data-reveal>
                <div className="hero-logo-container aspect-square w-full">
                  <div className="hero-logo-blob" />
                  <div className="hero-logo-blob-2" />
                  <img
                    src="/logo.png"
                    alt=""
                    className="hero-logo-img"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Metrics row */}
            <div
              className="reveal mt-20 grid grid-cols-3 gap-px rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden"
              data-reveal
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col items-center px-4 py-6 md:px-8 md:py-8"
                >
                  <span className="text-2xl font-bold text-white md:text-3xl">
                    {metric.value}
                  </span>
                  <span className="mt-2 text-center text-[0.7rem] uppercase tracking-widest text-neutral-500">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ─── ABOUT ─── */}
        <section id="about" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="reveal" data-reveal>
            <p className="mono-label mb-4">About</p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              A developer profile shaped by real delivery, not just theory.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="reveal space-y-6" data-reveal>
              <p className="text-base leading-8 text-neutral-400">
                Aspiring Software Developer with practical skills in Django, eager
                to apply my knowledge to advanced projects and gain professional
                experience in backend development. Passionate about cybersecurity,
                innovation, and creating impactful software solutions.
              </p>
              <p className="text-base leading-8 text-neutral-400">
                I enjoy working on products that have a clear purpose: student
                systems, ERP tools, educational games, 3D drawing studios, and
                interfaces that make complex work feel approachable.
              </p>

              {/* Contact details */}
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <MapPin size={14} />
                  Gerji, Addis Ababa
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <Phone size={14} />
                  +251 965 161 472
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <Mail size={14} />
                  alazartesfaye42@gmail.com
                </div>
              </div>
            </div>

            <div className="reveal" data-reveal>
              <p className="mono-label mb-5">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 transition-colors duration-300 hover:border-white/20 hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10">
                <p className="mono-label mb-5">Education</p>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="text-base font-semibold text-white">
                    Kibur College, Addis Ababa
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    Bachelor's Degree in Computer Science
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">2021 -- 2025</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="mono-label mb-4">Languages</p>
                <div className="flex gap-6">
                  {languages.map((lang) => (
                    <div key={lang.name} className="text-sm">
                      <span className="text-white">{lang.name}</span>
                      <span className="ml-2 text-neutral-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ─── PROJECTS ─── */}
        <section
          id="projects"
          className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32"
        >
          <div className="reveal" data-reveal>
            <p className="mono-label mb-4">Selected Work</p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Things I have built and shipped.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {projects.map((project, i) => {
              const Wrapper = project.link ? 'a' : 'div'
              const wrapperProps = project.link
                ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
                : {}

              return (
                <Wrapper
                  key={project.title}
                  {...wrapperProps}
                  data-reveal
                  className="reveal group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] md:p-8"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[0.65rem] uppercase tracking-widest ${
                        project.status === 'Live'
                          ? 'border border-white/20 text-white'
                          : project.status === 'Shipped'
                            ? 'border border-white/10 text-neutral-500'
                            : 'border border-white/10 text-neutral-500'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-[0.7rem] text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors duration-300 group-hover:text-white">
                      View live
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  )}
                </Wrapper>
              )
            })}
          </div>
        </section>

        <hr className="divider" />

        {/* ─── EXPERIENCE ─── */}
        <section
          id="experience"
          className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32"
        >
          <div className="reveal" data-reveal>
            <p className="mono-label mb-4">Experience</p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Where I have worked and what I have helped ship.
            </h2>
          </div>

          <div className="mt-12 space-y-0">
            {experience.map((item, i) => (
              <div
                key={item.title + item.place}
                data-reveal
                className="reveal group border-t border-white/[0.06] py-8 transition-colors duration-500 first:border-t-0 hover:bg-white/[0.015] md:grid md:grid-cols-[200px_1fr] md:gap-8 md:px-4"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="mb-2 md:mb-0">
                  <span className="text-sm text-neutral-500">{item.period}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {item.title}{' '}
                    <span className="font-normal text-neutral-500">
                      / {item.place}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ─── SKILLS ─── */}
        <section
          id="skills"
          className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32"
        >
          <div className="reveal" data-reveal>
            <p className="mono-label mb-4">Skills</p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Technical depth across backend, frontend, mobile, and game
              development.
            </h2>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="reveal" data-reveal>
              <p className="mono-label mb-5">Stack</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((item, i) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="reveal" data-reveal>
              <p className="mono-label mb-5">Strengths</p>
              <ul className="space-y-3">
                {strengths.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-neutral-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-neutral-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ─── AWARDS ─── */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
          <div className="reveal" data-reveal>
            <p className="mono-label mb-4">Recognition</p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Awards and acknowledgments.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {awards.map((item, i) => (
              <div
                key={item.title}
                data-reveal
                className="reveal rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="mono-label">0{i + 1}</span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ─── CONTACT ─── */}
        <section
          id="contact"
          className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32"
        >
          <div className="reveal" data-reveal>
            <p className="mono-label mb-4">Contact</p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Let's build something reliable, useful, and cleanly engineered.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-400">
              Mickyas Tesfaye -- Software Engineer and Computer Scientist based
              in Addis Ababa. Open to collaboration, freelance work, and
              full-time opportunities.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="mailto:alazartesfaye42@gmail.com"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-neutral-200"
              >
                <Mail size={14} />
                Email me
              </a>
              <a
                href="#home"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm text-white transition-all duration-300 hover:border-white/40"
              >
                Back to top
              </a>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-white/[0.06] px-5 py-8 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MickyCodes"
                className="h-6 w-6 rounded object-contain"
              />
              <span className="text-xs text-neutral-500">
                MickyCodes -- Mickyas Tesfaye
              </span>
            </div>
            <span className="text-xs text-neutral-600">
              Addis Ababa, Ethiopia
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
