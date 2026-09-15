'use client'
import { useState } from 'react'
import Link from 'next/link'

// Published Aether verification keys, by key id. Raw Ed25519 public keys, base64url.
// NOTE: this is a NON-PRODUCTION test key. Replace with Aether's published production
// key(s) once the server-side signer holds the real private key.
const KEYS: Record<string, string> = {
  'test-401c8fdd': 'XL3_gxW0Iw0yAJ_JUGEs0iDFgyCLJzyblokcLINsP6g',
}

type Verdict = 'IDLE' | 'PROVISIONAL' | 'VALIDATED' | 'EXPIRED' | 'TAMPERED' | 'UNKNOWN_KEY' | 'ERROR'

function canonicalize(m: string): string {
  return (
    m
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter((l) => !l.trimStart().startsWith('#validation_cert['))
      .map((l) => l.replace(/\s+$/, ''))
      .join('\n')
      .replace(/\n+$/, '') + '\n'
  )
}

async function sha256hex(s: string): Promise<string> {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s) as BufferSource)
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function b64urlToBytes(s: string): Uint8Array {
  let t = s.replace(/-/g, '+').replace(/_/g, '/')
  while (t.length % 4) t += '='
  const bin = atob(t)
  const u = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i)
  return u
}

function parseCert(aet: string): Record<string, string> | null {
  const m = aet.match(/^#validation_cert\[(.*)\]\s*$/m)
  if (!m) return null
  const out: Record<string, string> = {}
  for (const x of m[1].matchAll(/(\w+):\s*("([^"]*)"|[^,]+)/g)) {
    out[x[1]] = (x[3] !== undefined ? x[3] : x[2]).trim()
  }
  return out
}

export default function VerifyPage() {
  const [aet, setAet] = useState('')
  const [verdict, setVerdict] = useState<Verdict>('IDLE')
  const [detail, setDetail] = useState('')
  const [cert, setCert] = useState<Record<string, string> | null>(null)
  const [busy, setBusy] = useState(false)

  async function run() {
    setBusy(true)
    setCert(null)
    try {
      const c = parseCert(aet)
      if (!c) {
        setVerdict('PROVISIONAL')
        setDetail('No validation certificate is attached. This is a compiler result only, not a durable certification. To make it durable, validate it at aether-lang.org.')
        setBusy(false)
        return
      }
      setCert(c)
      const hNow = await sha256hex(canonicalize(aet))
      if (hNow !== c.manifest_sha256) {
        setVerdict('TAMPERED')
        setDetail('The manifest hash does not match the certificate. The content was altered after it was signed.')
        setBusy(false)
        return
      }
      const pub = KEYS[c.kid]
      if (!pub) {
        setVerdict('UNKNOWN_KEY')
        setDetail('The certificate is signed by a key id (' + c.kid + ') that is not a published Aether key.')
        setBusy(false)
        return
      }
      const si = ['aether-cert-v1', c.cert_id, c.kid, c.engine_version, c.issued_at, c.valid_until, c.manifest_sha256].join('\n')
      let key: CryptoKey
      try {
        key = await crypto.subtle.importKey('raw', b64urlToBytes(pub) as BufferSource, { name: 'Ed25519' }, false, ['verify'])
      } catch {
        setVerdict('ERROR')
        setDetail('This browser does not support Ed25519 verification (WebCrypto). Try a current version of Chrome, Edge, Safari or Firefox.')
        setBusy(false)
        return
      }
      const ok = await crypto.subtle.verify('Ed25519', key, b64urlToBytes(c.signature) as BufferSource, new TextEncoder().encode(si) as BufferSource)
      if (!ok) {
        setVerdict('UNKNOWN_KEY')
        setDetail('The signature did not verify against the published key. The certificate is not authentic.')
        setBusy(false)
        return
      }
      if (new Date() > new Date(c.valid_until)) {
        setVerdict('EXPIRED')
        setDetail('The signature is authentic, but the certification expired on ' + c.valid_until + '. It must be re-validated.')
        setBusy(false)
        return
      }
      setVerdict('VALIDATED')
      setDetail('Authentic and current. Signed by Aether key ' + c.kid + ', valid until ' + c.valid_until + '.')
    } catch (e) {
      setVerdict('ERROR')
      setDetail('Could not process this input.')
    }
    setBusy(false)
  }

  const V: Record<Verdict, { label: string; bg: string; fg: string }> = {
    IDLE: { label: 'awaiting input', bg: 'transparent', fg: 'var(--muted)' },
    PROVISIONAL: { label: 'PROVISIONAL', bg: 'var(--gold)', fg: 'var(--black)' },
    VALIDATED: { label: 'VALIDATED', bg: 'var(--green)', fg: 'var(--black)' },
    EXPIRED: { label: 'EXPIRED', bg: 'var(--amber)', fg: 'var(--black)' },
    TAMPERED: { label: 'TAMPERED', bg: '#ff5f57', fg: '#1a0000' },
    UNKNOWN_KEY: { label: 'NOT AUTHENTIC', bg: '#ff5f57', fg: '#1a0000' },
    ERROR: { label: 'ERROR', bg: '#ff5f57', fg: '#1a0000' },
  }
  const v = V[verdict]

  return (
    <>
      <nav className="main-nav">
        <Link href="/" className="nav-mark">Æ AETHER</Link>
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/certified">Certified</Link></li>
        </ul>
      </nav>

      <main className="portal-body" style={{ paddingTop: '6rem' }}>
        <div className="section-eyebrow">Verify</div>
        <h1 className="section-title">Verify a certification manifest</h1>
        <p className="section-sub">
          Paste a <code style={{ color: 'var(--green)' }}>.aet</code> manifest below. The check runs entirely in
          your browser: it recomputes the manifest hash and verifies the Ed25519 validation certificate against
          Aether's published key. Nothing is uploaded.
        </p>

        <div className="notice">
          <strong>Live cryptographic verifier, non-production key.</strong> This page performs a real Ed25519
          signature check. It currently trusts a labelled TEST key, so only test certificates read as VALIDATED.
          It will trust Aether's published production key once the server-side signer holds the real private key.
          Issuance of real certificates is separately gated on the fail-open fix.
        </div>

        <textarea
          value={aet}
          onChange={(e) => setAet(e.target.value)}
          placeholder="Paste a .aet manifest here"
          spellCheck={false}
          style={{
            width: '100%',
            height: '220px',
            background: 'rgba(255,255,255,.04)',
            border: '0.5px solid var(--border)',
            color: 'var(--off-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.6,
            padding: '12px',
            outline: 'none',
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={run} disabled={busy || !aet.trim()}>
            {busy ? 'verifying…' : 'verify'}
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              setAet('')
              setVerdict('IDLE')
              setDetail('')
              setCert(null)
            }}
          >
            clear
          </button>
        </div>

        {verdict !== 'IDLE' && (
          <div style={{ marginTop: '2rem', border: '0.5px solid var(--border)', padding: '1.5rem', background: 'rgba(255,255,255,.02)' }}>
            <div style={{ display: 'inline-block', background: v.bg, color: v.fg, fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '15px', letterSpacing: '.06em', padding: '6px 14px', borderRadius: '4px' }}>
              {v.label}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginTop: '1rem' }}>{detail}</p>
            {cert && (
              <div style={{ marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.9, wordBreak: 'break-all' }}>
                <div>cert_id: {cert.cert_id}</div>
                <div>kid: {cert.kid} &nbsp; engine: {cert.engine_version}</div>
                <div>issued: {cert.issued_at}</div>
                <div>valid_until: {cert.valid_until}</div>
                <div>manifest_sha256: {cert.manifest_sha256}</div>
              </div>
            )}
          </div>
        )}

        <p style={{ marginTop: '2.5rem', fontSize: '11px', color: 'var(--muted)' }}>
          <Link href="/" style={{ color: 'var(--green)', textDecoration: 'none' }}>← back to aether-lang.org</Link>
        </p>
      </main>

      <footer>
        <span className="footer-mark">Æ AETHER</span>
        <span className="footer-copy">
          © 2026 Emilio R. Bruno · Aether-Lang.org Inc. · Kamloops, BC, Canada · Client-side Ed25519 verification ·
          Prepared with AI assistance (Claude/Anthropic), disclosed, under the project honesty rule
        </span>
      </footer>
    </>
  )
}
