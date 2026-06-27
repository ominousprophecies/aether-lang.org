'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function VIPLogin() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle'|'sending'|'sent'|'err'>('idle')
  const supabase = createClient()

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth?next=/vip`,
      },
    })
    setState(error ? 'err' : 'sent')
  }

  return (
    <div className="login-screen">
      <div className="glow-dot" style={{background:'radial-gradient(circle,rgba(255,204,51,.04) 0%,transparent 70%)'}} aria-hidden="true" />
      <div className="login-mark" style={{color:'var(--gold)'}}>Æ AETHER</div>
      <div style={{fontSize:'11px',color:'var(--gold)',letterSpacing:'.16em',textTransform:'uppercase',marginBottom:'.5rem'}}>⬡ VIP access</div>
      <div className="login-sub">restricted technical portal</div>

      <div className="login-box" style={{borderColor:'rgba(255,204,51,.3)'}}>
        {state === 'sent' ? (
          <div style={{textAlign:'center'}}>
            <p style={{color:'var(--gold)',fontSize:'13px',marginBottom:'1rem'}}>✓ Magic link sent</p>
            <p style={{color:'var(--muted)',fontSize:'12px'}}>Check {email} for your VIP sign-in link.</p>
          </div>
        ) : (
          <form onSubmit={sendMagicLink}>
            <label className="login-label" htmlFor="vip-email">VIP email address</label>
            <input
              className="login-input"
              id="vip-email"
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{borderColor:'rgba(255,204,51,.2)'}}
            />
            <button className="login-btn" style={{background:'var(--gold)'}} type="submit" disabled={state==='sending'}>
              {state === 'sending' ? 'sending...' : 'enter VIP portal'}
            </button>
            {state === 'err' && (
              <p className="login-err">Not authorised. Contact info@bruno-protocol.org</p>
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
