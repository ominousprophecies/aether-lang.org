'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function InternalLogin() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle'|'sending'|'sent'|'err'>('idle')
  const supabase = createClient()

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth?next=/internal`,
      },
    })
    setState(error ? 'err' : 'sent')
  }

  return (
    <div className="login-screen">
      <div className="glow-dot" aria-hidden="true" />
      <div className="login-mark">Æ AETHER</div>
      <div className="login-sub">internal access · authorised personnel only</div>

      <div className="login-box">
        {state === 'sent' ? (
          <div style={{textAlign:'center'}}>
            <p style={{color:'var(--green)',fontSize:'13px',marginBottom:'1rem'}}>✓ Magic link sent</p>
            <p style={{color:'var(--muted)',fontSize:'12px'}}>Check {email} for a sign-in link. It expires in 1 hour.</p>
          </div>
        ) : (
          <form onSubmit={sendMagicLink}>
            <label className="login-label" htmlFor="email">authorised email address</label>
            <input
              className="login-input"
              id="email"
              type="email"
              required
              placeholder="you@organisation.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <button className="login-btn" type="submit" disabled={state==='sending'}>
              {state === 'sending' ? 'sending...' : 'send magic link'}
            </button>
            {state === 'err' && (
              <p className="login-err">Could not send link. Contact info@bruno-protocol.org</p>
            )}
          </form>
        )}
      </div>

      <p style={{marginTop:'1.5rem',fontSize:'11px',color:'var(--muted)'}}>
        <Link href="/" style={{color:'var(--green)',textDecoration:'none'}}>← back to aether-lang.org</Link>
      </p>
    </div>
  )
}
