'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function CertifiedPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'noted'>('idle')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Honest scaffold: no authorization backend is wired. Nothing is authenticated,
    // no session is created, and no certified authorization is issued here yet.
    setState('noted')
  }

  return (
    <div className="login-screen">
      <div
        className="glow-dot"
        style={{ background: 'radial-gradient(circle,rgba(255,204,51,.05) 0%,transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="login-mark" style={{ color: 'var(--gold)' }}>
        Æ AETHER
      </div>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--gold)',
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          marginBottom: '.5rem',
        }}
      >
        ⬡ Certified access
      </div>
      <div className="login-sub">authorized use of the Aether compiler</div>

      <div className="notice" style={{ maxWidth: '480px' }}>
        <strong>Not yet active.</strong> This is a scaffold. The certified-authorization system —
        identity plus a keyed daily code that authorizes use — is in development. Signing in here
        does not create a session and does not issue any certified authorization. No access is
        granted until that backend is built. Stated plainly under the project honesty rule.
      </div>

      <div className="login-box" style={{ borderColor: 'rgba(255,204,51,.3)' }}>
        {state === 'noted' ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--gold)', fontSize: '13px', marginBottom: '1rem' }}>
              Recorded locally only
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
              Certified authorization is not yet issued. Nothing was sent and no access was granted.
              For access enquiries, contact info@bruno-protocol.org.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="login-label" htmlFor="cert-email">
              work email address
            </label>
            <input
              className="login-input"
              id="cert-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: 'rgba(255,204,51,.2)' }}
            />
            <button className="login-btn" style={{ background: 'var(--gold)' }} type="submit">
              request certified access
            </button>
          </form>
        )}
      </div>

      <div
        style={{
          maxWidth: '480px',
          marginTop: '2rem',
          fontSize: '11px',
          color: 'var(--muted)',
          lineHeight: 1.7,
        }}
      >
        <div
          style={{
            color: 'var(--gold)',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            fontSize: '10px',
            marginBottom: '.5rem',
          }}
        >
          Planned mechanism (design, not yet built)
        </div>
        Identity by email link, then a keyed daily code validated server-side authorizes a session to
        use the compiler. The daily code must use keyed cryptography; a public hash would be
        forgeable. Until this is implemented, no page on this site grants certified authorization.
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '11px', color: 'var(--muted)' }}>
        <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>
          ← back to aether-lang.org
        </Link>
      </p>
    </div>
  )
}
