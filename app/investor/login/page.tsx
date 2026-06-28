'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

type State = 'idle' | 'sending' | 'sent' | 'err' | 'login' | 'link-sent'

export default function InvestorLogin() {
  const [state, setState] = useState<State>('idle')
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' })
  const [loginEmail, setLoginEmail] = useState('')
  const supabase = createClient()

  async function requestAccess(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'investor-request' }),
      })
      setState(res.ok ? 'sent' : 'err')
    } catch { setState('err') }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: { emailRedirectTo: `${window.location.origin}/api/auth?next=/investor` },
    })
    setState(error ? 'err' : 'link-sent')
  }

  const I = { width:'100%', padding:'.75rem 1rem', background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,204,51,.15)', color:'#f0efeb', fontFamily:'Space Mono, monospace', fontSize:'13px', outline:'none', marginBottom:'1rem', transition:'border-color .2s' }
  const L = { display:'block', fontSize:'10px', color:'#888780', letterSpacing:'.1em', textTransform:'uppercase' as const, marginBottom:'.5rem' }

  return (
    <div style={{ minHeight:'100vh', background:'#050406', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'Space Mono, monospace' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{ position:'fixed', top:'20vh', right:0, width:'400px', height:'400px', background:'radial-gradient(circle,rgba(255,204,51,.05) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'22px', color:'#ffcc33', marginBottom:'.4rem', letterSpacing:'.05em' }}>Æ AETHER</div>
      <div style={{ fontSize:'10px', color:'#ffcc33', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:'.4rem' }}>⬡ investor access</div>
      <div style={{ fontSize:'11px', color:'#888780', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'3rem' }}>by invitation only</div>

      <div style={{ width:'100%', maxWidth:'420px' }}>

        {/* TABS */}
        <div style={{ display:'flex', borderBottom:'0.5px solid rgba(255,204,51,.2)', marginBottom:'2rem' }}>
          {(['request','login'] as const).map(t => (
            <button key={t} onClick={() => setState(t === 'request' ? 'idle' : 'login')}
              style={{ flex:1, padding:'.75rem', background:'none', border:'none', fontFamily:'Space Mono, monospace', fontSize:'11px', letterSpacing:'.08em', textTransform:'uppercase', cursor:'pointer', color: (state === 'login') === (t === 'login') ? '#ffcc33' : '#888780', borderBottom: (state === 'login') === (t === 'login') ? '2px solid #ffcc33' : '2px solid transparent', marginBottom:'-1px' }}>
              {t === 'request' ? 'request access' : 'already invited'}
            </button>
          ))}
        </div>

        {/* REQUEST FORM */}
        {state !== 'login' && state !== 'link-sent' && (
          <>
            {state === 'sent' ? (
              <div style={{ textAlign:'center', padding:'2rem', border:'0.5px solid rgba(255,204,51,.3)', background:'rgba(255,204,51,.03)' }}>
                <div style={{ fontSize:'24px', marginBottom:'1rem' }}>✓</div>
                <p style={{ color:'#ffcc33', fontSize:'13px', marginBottom:'.75rem' }}>Request received.</p>
                <p style={{ color:'#888780', fontSize:'12px', lineHeight:'1.7' }}>We review all investor requests manually. If your profile is a fit, you'll receive a private access link within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={requestAccess} style={{ border:'0.5px solid rgba(255,204,51,.25)', padding:'2rem', background:'rgba(255,204,51,.02)' }}>
                <div style={{ fontSize:'12px', color:'#888780', lineHeight:'1.7', marginBottom:'1.5rem' }}>
                  Access to Aether's investor IP brief is by invitation only. Submit your details and we'll review your request.
                </div>
                <label style={L}>full name</label>
                <input style={I} required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} onFocus={e=>(e.target.style.borderColor='rgba(255,204,51,.5)')} onBlur={e=>(e.target.style.borderColor='rgba(255,204,51,.15)')} />
                <label style={L}>email</label>
                <input style={I} type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} onFocus={e=>(e.target.style.borderColor='rgba(255,204,51,.5)')} onBlur={e=>(e.target.style.borderColor='rgba(255,204,51,.15)')} />
                <label style={L}>firm / organisation</label>
                <input style={I} required value={form.org} onChange={e=>setForm(p=>({...p,org:e.target.value}))} onFocus={e=>(e.target.style.borderColor='rgba(255,204,51,.5)')} onBlur={e=>(e.target.style.borderColor='rgba(255,204,51,.15)')} />
                <label style={L}>why you're interested (optional)</label>
                <textarea style={{...I, height:'90px', resize:'vertical'}} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} onFocus={e=>(e.target.style.borderColor='rgba(255,204,51,.5)')} onBlur={e=>(e.target.style.borderColor='rgba(255,204,51,.15)')} />
                <button type="submit" disabled={state==='sending'} style={{ width:'100%', padding:'.85rem', background:'#ffcc33', color:'#050406', fontFamily:'Space Mono, monospace', fontSize:'13px', fontWeight:700, letterSpacing:'.08em', border:'none', cursor:'pointer' }}>
                  {state === 'sending' ? 'submitting...' : 'submit request →'}
                </button>
                {state === 'err' && <p style={{ color:'#ff5f57', fontSize:'12px', marginTop:'.75rem', textAlign:'center' }}>Something went wrong. Email info@bruno-protocol.org directly.</p>}
              </form>
            )}
          </>
        )}

        {/* MAGIC LINK LOGIN */}
        {(state === 'login' || state === 'link-sent') && (
          <>
            {state === 'link-sent' ? (
              <div style={{ textAlign:'center', padding:'2rem', border:'0.5px solid rgba(255,204,51,.3)', background:'rgba(255,204,51,.03)' }}>
                <p style={{ color:'#ffcc33', fontSize:'13px', marginBottom:'.75rem' }}>✓ Access link sent</p>
                <p style={{ color:'#888780', fontSize:'12px' }}>Check your email for your private investor access link.</p>
              </div>
            ) : (
              <form onSubmit={sendMagicLink} style={{ border:'0.5px solid rgba(255,204,51,.25)', padding:'2rem', background:'rgba(255,204,51,.02)' }}>
                <div style={{ fontSize:'12px', color:'#888780', lineHeight:'1.7', marginBottom:'1.5rem' }}>Enter the email address your invitation was sent to.</div>
                <label style={L}>invited email address</label>
                <input style={I} type="email" required value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onFocus={e=>(e.target.style.borderColor='rgba(255,204,51,.5)')} onBlur={e=>(e.target.style.borderColor='rgba(255,204,51,.15)')} />
                <button type="submit" disabled={state==='sending'} style={{ width:'100%', padding:'.85rem', background:'#ffcc33', color:'#050406', fontFamily:'Space Mono, monospace', fontSize:'13px', fontWeight:700, letterSpacing:'.08em', border:'none', cursor:'pointer' }}>
                  {state === 'sending' ? 'sending...' : 'send access link →'}
                </button>
                {state === 'err' && <p style={{ color:'#ff5f57', fontSize:'12px', marginTop:'.75rem', textAlign:'center' }}>Not authorised. Contact info@bruno-protocol.org</p>}
              </form>
            )}
          </>
        )}

      </div>

      <p style={{ marginTop:'2rem', fontSize:'11px', color:'#888780' }}>
        <Link href="/" style={{ color:'#39ff14', textDecoration:'none' }}>← aether-lang.org</Link>
      </p>
    </div>
  )
}
