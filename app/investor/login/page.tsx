'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function InvestorLogin() {
  const [tab, setTab] = useState<'request' | 'login'>('request')
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'err'>('idle')
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' })
  const [loginEmail, setLoginEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const supabase = createClient()

  async function requestAccess(e: React.FormEvent) {
    e.preventDefault()
    setFormState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'investor-request' }),
      })
      setFormState(res.ok ? 'sent' : 'err')
    } catch { setFormState('err') }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setFormState('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: { emailRedirectTo: `${window.location.origin}/api/auth?next=/investor` },
    })
    if (error) { setFormState('err') } else { setLinkSent(true); setFormState('idle') }
  }

  const I: React.CSSProperties = { width:'100%', padding:'.75rem 1rem', background:'rgba(255,255,255,.04)', border:'0.5px solid rgba(255,204,51,.15)', color:'#f0efeb', fontFamily:'Space Mono, monospace', fontSize:'13px', outline:'none',
