'use client'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Doc = {
  id: string; name: string; description: string
  filename: string; category: string; version: string
}

const TRACKS_SUMMARY = [
  { id:'B',    tier:'Crown jewel', name:'Krapivin Secret-context invariant', status:'Provisional pending' },
  { id:'TT',   tier:'Crown jewel', name:'Structured correctness certificate', status:'File with RR+SS' },
  { id:'RR',   tier:'Crown jewel', name:'AI invariant inference engine', status:'File with SS+TT' },
  { id:'SS',   tier:'Crown jewel', name:'Compile-time structural gap detection', status:'File with RR+TT' },
  { id:'A',    tier:'Original',    name:'Energy/security type system', status:'In provisional' },
  { id:'C',    tier:'Original',    name:'Energy-state monomorphization', status:'In provisional' },
  { id:'D',    tier:'Original',    name:'Cross-energy spawn capture', status:'In provisional' },
  { id:'E',    tier:'Original',    name:'Compile-time epoch-key binding', status:'In provisional' },
  { id:'F–J',  tier:'Safety',      name:'WCET · zero-heap · stack · power · interrupt', status:'Not filed' },
  { id:'K–Q',  tier:'Security',    name:'MLS · SMP · constant-time · network · formal verify', status:'Not filed' },
  { id:'Z·AA', tier:'PQC',         name:'Post-quantum · cryptographic defense', status:'Not filed' },
  { id:'BB·PP·QQ', tier:'Supply', name:'SBOM · provenance · dependency classification', status:'Not filed' },
  { id:'S·T·V', tier:'Paper-spec', name:'AI threat model · cross-manifest · behavioral', status:'Do not file' },
]

const TIER_COLOR: Record<string,string> = {
  'Crown jewel': 'rgba(57,255,20,.1); color:var(--green)',
  'Original':    'rgba(255,204,51,.1); color:var(--gold)',
  'Safety':      'rgba(133,183,235,.1); color:#85b7eb',
  'Security':    'rgba(127,119,221,.1); color:#afa9ec',
  'PQC':         'rgba(127,119,221,.1); color:#afa9ec',
  'Supply':      'rgba(216,90,48,.1); color:#f0997b',
  'Paper-spec':  'rgba(136,135,128,.08); color:var(--muted)',
}

export default function InternalPortalClient({ user, docs }: { user: any, docs: Doc[] }) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function downloadDoc(filename: string, name: string) {
    const res = await fetch(`/api/docs?file=${encodeURIComponent(filename)}`)
    if (!res.ok) { alert('Download unavailable.'); return }
    const { url } = await res.json()
    window.open(url, '_blank')
  }

  return (
    <>
      <nav className="portal-nav">
        <span style={{fontFamily:'var(--font-display)',fontSize:'16px',color:'var(--green)'}}>Æ AETHER — INTERNAL</span>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <span style={{fontSize:'10px',letterSpacing:'.1em',textTransform:'uppercase',padding:'.3rem .7rem',border:'0.5px solid var(--border-green)',color:'var(--green)'}}>
            v7.3 · RESTRICTED
          </span>
          <span style={{fontSize:'12px',color:'var(--muted)'}}>{user.email}</span>
          <button onClick={signOut} style={{fontSize:'11px',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted)',background:'none',border:'none',fontFamily:'var(--font-mono)',cursor:'pointer'}}>
            [ sign out ]
          </button>
        </div>
      </nav>

      <div className="portal-body">
        <p style={{fontSize:'10px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--green)',marginBottom:'.75rem'}}>
          internal reference · june 2026
        </p>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(20px,2.5vw,32px)',color:'var(--off-white)',marginBottom:'.75rem'}}>
          Aether v7.3 — Internal Reference
        </h1>
        <p style={{fontSize:'13px',color:'var(--muted)',maxWidth:'640px',marginBottom:'3rem',lineHeight:'1.7'}}>
          Patent filings, technical documentation, performance data, and flowcharts.
          Not for public distribution. All materials are pre-filing.
        </p>

        <div className="notice">
          <strong>Pre-filing notice.</strong> All 46 patent tracks are pre-filing as of June 2026. Track B (Krapivin) provisional is first priority. Paper-spec tracks S, T, V must not be described as implemented. No IP transfer documents signed — pending counsel (Oyen Wiggs, June 30 2026).
        </div>

        {/* KPI SNAPSHOT */}
        <div className="portal-section">
          <div className="portal-section-title">v7.3 confirmed snapshot</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'1px',border:'0.5px solid var(--border)'}}>
            {[
              ['154','fixtures','0 failures'],
              ['0','warnings','0 errors'],
              ['108','operations','confirmed'],
              ['46','patent tracks','A through TT'],
              ['39','manifest types','SEML format'],
              ['0.094ms','p50 compile','release mode'],
              ['0.256ms','max clean','TT capstone'],
              ['95W','benchmark TDP','Sandy Bridge i7-2600'],
            ].map(([n,l,s]) => (
              <div key={l} style={{padding:'1.25rem',borderRight:'0.5px solid var(--border)'}}>
                <span style={{fontFamily:'var(--font-display)',fontSize:'22px',color:'var(--gold)',display:'block'}}>{n}</span>
                <span style={{fontSize:'10px',color:'var(--muted)',letterSpacing:'.06em',textTransform:'uppercase'}}>{l}</span>
                <span style={{fontSize:'11px',color:'var(--green-dim)',marginTop:'.2rem',display:'block'}}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="portal-section">
          <div className="portal-section-title">documents — v7.3 first editions</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
            {docs.map(doc => (
              <div key={doc.id} style={{padding:'1.5rem',border:'0.5px solid var(--border)',position:'relative',overflow:'hidden',transition:'border-color .2s',cursor:'pointer'}}
                onMouseOver={e=>(e.currentTarget.style.borderColor='var(--border-green)')}
                onMouseOut={e=>(e.currentTarget.style.borderColor='var(--border)')}>
                <div style={{fontSize:'11px',color:'var(--green)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.5rem'}}>{doc.version}</div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'var(--off-white)',marginBottom:'.5rem'}}>{doc.name}</div>
                <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:'1.6',marginBottom:'1rem'}}>{doc.description}</div>
                <button onClick={() => downloadDoc(doc.filename, doc.name)}
                  style={{fontSize:'11px',padding:'.4rem .9rem',border:'0.5px solid var(--border-green)',color:'var(--green)',background:'transparent',fontFamily:'var(--font-mono)',cursor:'pointer',letterSpacing:'.06em'}}>
                  download →
                </button>
              </div>
            ))}
            {docs.length === 0 && (
              <p style={{color:'var(--muted)',fontSize:'13px',gridColumn:'1/-1'}}>
                No documents uploaded yet. Upload .docx files to the Supabase Storage "documents" bucket.
              </p>
            )}
          </div>
        </div>

        {/* PATENT TRACK TABLE */}
        <div className="portal-section">
          <div className="portal-section-title">patent tracks — ranked by importance (A–TT designators)</div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
            <thead>
              <tr style={{borderBottom:'0.5px solid var(--border)'}}>
                {['Track','Tier','Name','Status'].map(h => (
                  <th key={h} style={{textAlign:'left',padding:'.6rem 1rem',fontSize:'10px',color:'var(--muted)',fontWeight:'400',letterSpacing:'.1em',textTransform:'uppercase'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRACKS_SUMMARY.map(tr => (
                <tr key={tr.id} style={{borderBottom:'0.5px solid var(--border)'}}>
                  <td style={{padding:'.7rem 1rem'}}>
                    <span style={{display:'inline-block',padding:'.2rem .6rem',fontSize:'12px',fontWeight:'700',background:TIER_COLOR[tr.tier]?.split(';')[0]+')',color:TIER_COLOR[tr.tier]?.split('color:')[1]||'var(--muted)'}}>
                      {tr.id}
                    </span>
                  </td>
                  <td style={{padding:'.7rem 1rem',fontSize:'11px',color:'var(--muted)'}}>{tr.tier}</td>
                  <td style={{padding:'.7rem 1rem',fontSize:'12px',color:'var(--off-white)'}}>{tr.name}</td>
                  <td style={{padding:'.7rem 1rem',fontSize:'11px',color:'var(--muted)'}}>{tr.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CORPORATE STATUS */}
        <div className="portal-section">
          <div className="portal-section-title">corporate &amp; IP status</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
            {[
              ['Aether-Lang.org Inc.','CBCA federal. June 26 2026. IP held personally by Emilio R. Bruno. No transfer docs before counsel.','CBCA · incorporated'],
              ['Bruno IP Holdings Ltd.','BC Registry pending. Planned holdco. Three questions for Max: (1) which entity files, (2) assignment vs licence, (3) consideration.','BC Registry · pending'],
              ['Patent counsel','Oyen Wiggs Green & Mutala LLP. Meeting June 30 2026. Track B files first.','Meeting June 30 2026'],
              ['NATO DIANA','Deadline July 3 2026. Awaiting DUNS number — update DIANA short-form doc when received.','⚠ July 3 deadline'],
              ['Founders Agreement','Required before onboarding Todd Horie, Ernie Bruno, Brandon Bruno, Michael Bruno.','Sign before onboarding'],
              ['Filing order','1. Track B · 2. RR+SS+TT · 3. UI-3+UI-1 · 4. Expand A+C provisional · 5. Domain groups','Track B — file first'],
            ].map(([name, desc, meta]) => (
              <div key={name} style={{padding:'1.5rem',border:'0.5px solid var(--border)'}}>
                <div style={{fontSize:'13px',fontWeight:'700',color:'var(--off-white)',marginBottom:'.5rem'}}>{name}</div>
                <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:'1.6',marginBottom:'.75rem'}}>{desc}</div>
                <div style={{fontSize:'10px',color:'var(--green-dim)',letterSpacing:'.06em',textTransform:'uppercase'}}>{meta}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="notice">
          <strong>Session info.</strong> Signed in as {user.email}. Sessions expire in 1 hour. This portal uses Supabase Auth — magic link sign-in only, no passwords stored.
        </div>
      </div>
    </>
  )
}
