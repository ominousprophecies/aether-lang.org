import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Reports — Aether',
  description:
    'Development and milestone reports for the Aether compiler, recorded under the project honesty rule.',
}

type Milestone = { status: 'confirmed' | 'pending'; heading: string; body: ReactNode }

const REPORT_2026_09_15: Milestone[] = [
  {
    status: 'confirmed',
    heading: 'Compiler runs natively on-device',
    body: (
      <>
        The Aether compiler is built as a native <code>arm64</code> library and called through JNI
        from the Android app <code>Aether Certify</code>. Source compiles to a certification
        manifest on the handset itself, offline.
      </>
    ),
  },
  {
    status: 'confirmed',
    heading: 'Full certification battery on device',
    body: (
      <>
        The native path invokes the full driver (<code>compile_full</code>), with the energy gate
        measured on-device. A real compile produced an <code>EMITTED</code> manifest on a physical
        Google Pixel 2 XL.
      </>
    ),
  },
  {
    status: 'confirmed',
    heading: 'Operator console',
    body: (
      <>
        Source editor with built-in samples, file open and save, copy-to-clipboard report, print
        with a Save-as-PDF option, and manifest download. The compile button is colour-coded: blue
        when edited, green when certified, amber when declined, red on error.
      </>
    ),
  },
  {
    status: 'confirmed',
    heading: 'Per-parameter pragma selectors',
    body: (
      <>
        A dropdown for each certification parameter — identity, memory, stack, WCET, power,
        interrupt, timing, verification, energy, operator and attestation — assembles editable
        pragma lines and inserts them into the source. What compiles is always the visible source.
      </>
    ),
  },
  {
    status: 'confirmed',
    heading: 'Help and walkthrough',
    body: (
      <>
        A full in-app reference covering every certification gate, every verdict, and every control,
        plus an eight-step guided walkthrough for a first-time operator.
      </>
    ),
  },
  {
    status: 'confirmed',
    heading: 'Honest recording',
    body: (
      <>
        Each result carries the engine banner, an on-device compile-time-only note, and a disclaimer
        that a declined row is the compiler refusing to assert what it cannot ground.
      </>
    ),
  },
  {
    status: 'pending',
    heading: 'Accredited certification',
    body: (
      <>
        The manifest is a compile-time record produced on-device. It is not an accredited
        third-party certificate. Stated as a limit, not a claim.
      </>
    ),
  },
  {
    status: 'pending',
    heading: 'Certified authorization',
    body: (
      <>
        Authorized use via a keyed daily-code system at{' '}
        <Link href="/certified" style={{ color: 'var(--green)', textDecoration: 'none' }}>
          /certified
        </Link>{' '}
        is designed, not yet built.
      </>
    ),
  },
]

export default function ReportsPage() {
  return (
    <>
      <nav className="main-nav">
        <Link href="/" className="nav-mark">
          Æ AETHER
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/certified">Certified</Link>
          </li>
        </ul>
      </nav>

      <main className="portal-body" style={{ paddingTop: '6rem' }}>
        <div className="section-eyebrow">Reports</div>
        <h1 className="section-title">Development and milestone reports</h1>
        <p className="section-sub">
          Progress recorded under the project honesty rule. Every entry is either a stated fact,
          traceable to a build or a file, or marked as pending. Confirmed items are proven; pending
          items are declared, not asserted.
        </p>

        <div className="notice">
          <strong>Scope.</strong> This page currently lists reports as static, publicly readable
          entries. It is not yet connected to a live submission backend, and it is not yet placed
          behind certified access. Both are planned; see{' '}
          <Link href="/certified" style={{ color: 'var(--green)', textDecoration: 'none' }}>
            /certified
          </Link>
          .
        </div>

        <section className="portal-section">
          <div className="portal-section-title">
            2026-09-15 · Aether Certify · native on-device compiler (mobile)
          </div>

          <div className="milestones-grid">
            {REPORT_2026_09_15.map((m, i) => (
              <div
                key={i}
                className={`milestone-card ${
                  m.status === 'confirmed' ? 'milestone-confirmed' : 'milestone-pending'
                }`}
              >
                <span
                  className={`milestone-badge ${
                    m.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'
                  }`}
                >
                  {m.status === 'confirmed' ? 'confirmed' : 'pending'}
                </span>
                <div className="milestone-heading">{m.heading}</div>
                <div className="milestone-body">{m.body}</div>
              </div>
            ))}
          </div>

          <div className="milestone-proof">
            <div className="proof-label">Proof · verified this session</div>
            <pre className="proof-code">{`Gradle :app   ->  BUILD SUCCESSFUL
Install       ->  finished, Google Pixel 2 XL (arm64)
Native compile->  EMITTED, full certification manifest
Engine        ->  full battery, energy gate measured on-device`}</pre>
            <div className="proof-meta">
              Recorded from the Android Studio build panel and the device. The compiler ran natively
              on the handset; it certifies source to a manifest and does not execute the compiled
              program. Not an accredited third-party certificate.
            </div>
          </div>
        </section>

        <p style={{ marginTop: '2rem', fontSize: '11px', color: 'var(--muted)' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>
            ← back to aether-lang.org
          </Link>
        </p>
      </main>

      <footer>
        <span className="footer-mark">Æ AETHER</span>
        <span className="footer-copy">
          © 2026 Emilio R. Bruno · Aether-Lang.org Inc. · Kamloops, BC, Canada · Prepared with AI
          assistance (Claude/Anthropic), disclosed, under the project honesty rule
        </span>
      </footer>
    </>
  )
}
