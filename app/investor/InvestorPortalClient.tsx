'use client'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const CROWN_JEWELS = [
  {
    id: 'B',
    name: 'Krapivin Secret-Context Invariant',
    tier: 'Crown jewel — file first',
    status: 'Provisional pending',
    searches: 3,
    art: 'No direct prior art found across three independent searches.',
    claim: 'Hash-map declarations whose key or value type carries a security classification are rejected at compile time regardless of storage size — independently of and in addition to the hardware cache-line threshold check. The dual-trigger is the novel element.',
    moat: 'Nothing in the literature conditions hash-map access strategy on the stored type\'s classification. Distinguished from all cache-line threshold prior art on the independence axis.',
  },
  {
    id: 'TT',
    name: 'Structured Correctness Certificate',
    tier: 'Crown jewel — file with RR+SS',
    status: 'Not yet filed',
    searches: 2,
    art: 'No direct prior art on AI-synthesised machine-verifiable compiler correctness certificates.',
    claim: 'A structured, machine-verifiable correctness certificate synthesised from the full multi-track manifest chain. Independently checkable by third parties without running the compiler or accessing source code. Addresses the CompCert gap via property-space completeness.',
    moat: 'CompCert achieves semantic preservation via Coq proof of backend. Aether achieves a complementary property: completeness and consistency of declared invariants across 46 enforcement tracks. Three independent claims with RR and SS.',
  },
  {
    id: 'RR+SS',
    name: 'AI Correctness Pipeline',
    tier: 'Crown jewel — 3 independent claims',
    status: 'Not yet filed',
    searches: 2,
    art: 'No prior art on deterministic AI invariant inference over compiler manifest chains.',
    claim: 'Track RR: deterministic logical deduction of implied invariants from verified manifest chain (9 rules, no probabilistic outputs). Track SS: 10-rule structural gap detection — programs with incomplete invariant coverage rejected at compile time when fail_on_gaps is set.',
    moat: 'Novel intersection of AI-assisted reasoning and compile-time certification. Every output is machine-verifiable. No existing compiler system detects cross-track manifest gaps or synthesises invariants from a manifest chain.',
  },
]

const FILING_ROADMAP = [
  { order: '1', tracks: 'Track B', action: 'File provisional immediately', timing: 'Now', priority: 'critical' },
  { order: '2', tracks: 'Tracks RR + SS + TT', action: 'File as group — 3 independent claims', timing: 'Q3 2026', priority: 'critical' },
  { order: '3', tracks: 'Universal I/O (UI-1, UI-3)', action: 'File before v8.0 ships — C/C++ sidecar claim', timing: 'Q3 2026', priority: 'high' },
  { order: '4', tracks: 'Tracks A, C, D, E', action: 'Expand existing provisional', timing: 'Q3 2026', priority: 'high' },
  { order: '5', tracks: 'F–J (Safety budgets)', action: 'WCET · zero-heap · stack · power · interrupt', timing: 'Q4 2026', priority: 'medium' },
  { order: '6', tracks: 'K–Q (Security layer)', action: 'MLS · SMP · constant-time · CCBP · formal verify', timing: 'Q4 2026', priority: 'medium' },
  { order: '7', tracks: 'Z · AA (Post-quantum)', action: 'NIST FIPS 203/204/205 mandate — market timing excellent', timing: 'Q4 2026', priority: 'medium' },
  { order: '8', tracks: 'AI safety + Privacy + Supply chain', action: 'EU AI Act · GDPR · EO 14028 domain groups', timing: 'Q1 2027', priority: 'medium' },
]

const COMPETITIVE_MOAT = [
  { competitor: 'CompCert', claim: 'Machine-checked Coq proof of semantic preservation', aether: 'Complementary: 46 compile-time property invariants + TT correctness certificate. Track GG (v8.0) closes the formal backend gap permanently.', verdict: 'Distinguished' },
  { competitor: 'F★ / Z3', claim: 'Formal verification of cryptographic protocols', aether: 'Faster compile time (0.13ms vs seconds). Energy-state and security-classification axes not present in F★. Track B has no F★ analogue.', verdict: 'Distinguished' },
  { competitor: 'TrustZone', claim: 'Hardware-enforced security zones', aether: 'Variable-level granularity vs hardware-zone granularity. Aether enforces at individual variable binding, not hardware partition. Compile-time, not runtime.', verdict: 'Distinguished' },
  { competitor: 'MISRA-C tooling', claim: 'Static analysis for embedded C', aether: 'MISRA-C Rule 20.4 and 17.2 satisfied structurally — not via advisory lint. Cannot be suppressed. 38 additional invariants beyond MISRA scope.', verdict: 'Exceeds' },
  { competitor: 'Halide / Spatial', claim: 'Domain-specific energy-aware compilation', aether: 'Security-classification axis absent from both. Track B invariant has no analogue. MLS enforcement not present.', verdict: 'Distinguished' },
]

const MARKET = [
  { segment: 'Defence & aerospace', size: 'DO-178C Level A recertification market', hook: 'Single compiler replaces months of manual traceability. DER engagement hook.' },
  { segment: 'Automotive', size: 'ISO 26262 ASIL-D + AUTOSAR AP', hook: 'Zero-heap + stack depth + interrupt latency enforced structurally. V&V cost reduction.' },
  { segment: 'Industrial / OT', size: 'IEC 62443 SL4 + IEC 61508 SIL4', hook: 'MLS + network classification enforced at compile time. ICS attack surface eliminated.' },
  { segment: 'US Federal / NATO', size: 'EO 14028 · SBOM · NATO DIANA 2027', hook: 'SBOM by construction. DIANA Challenge Call submitted. Post-quantum mandate (FIPS 203/204/205) enforced structurally.' },
  { segment: 'AI governance', size: 'EU AI Act Art.13/17 · DoD AI Strategy', hook: 'Model card, explainability, output classification enforced at compile time. Structural EU AI Act compliance.' },
  { segment: 'Anchor target', size: 'Telus (enterprise)', hook: 'Contact pending. 5G network software certification use case.' },
]

export default function InvestorPortalClient({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const S = { section: { marginBottom: '5rem' } as React.CSSProperties }
  const secTitle = (label: string) => (
    <div style={{ fontSize:'11px', letterSpacing:'.14em', textTransform:'uppercase' as const, color:'#ffcc33', borderBottom:'0.5px solid rgba(255,204,51,.2)', paddingBottom:'.75rem', marginBottom:'2rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
      <span style={{ display:'inline-block', width:'20px', height:'1px', background:'#ffcc33' }} />
      {label}
    </div>
  )

  return (
    <div style={{ background:'#050406', color:'#f0efeb', fontFamily:'Space Mono, monospace', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'0.5px solid rgba(255,204,51,.2)', background:'rgba(5,4,6,.96)', backdropFilter:'blur(12px)' }}>
        <span style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'16px', color:'#ffcc33' }}>Æ AETHER — INVESTOR BRIEF</span>
        <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <span style={{ fontSize:'10px', padding:'.3rem .8rem', border:'0.5px solid rgba(255,204,51,.4)', color:'#ffcc33', letterSpacing:'.1em', textTransform:'uppercase' }}>CONFIDENTIAL · PRE-FILING</span>
          <span style={{ fontSize:'12px', color:'#888780' }}>{user.email}</span>
          <button onClick={signOut} style={{ fontSize:'11px', letterSpacing:'.08em', textTransform:'uppercase', color:'#888780', background:'none', border:'none', fontFamily:'Space Mono, monospace', cursor:'pointer' }}>[ exit ]</button>
        </div>
      </nav>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'4rem 2rem 8rem' }}>

        {/* HEADER */}
        <div style={{ marginBottom:'4rem', paddingBottom:'3rem', borderBottom:'0.5px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontSize:'10px', letterSpacing:'.16em', textTransform:'uppercase', color:'#ffcc33', marginBottom:'1rem' }}>Aether-Lang.org Inc. · CBCA Federal · Kamloops, BC</div>
          <h1 style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'clamp(24px,3vw,42px)', color:'#f0efeb', lineHeight:1.15, marginBottom:'1.5rem' }}>
            IP Investor Brief<br/><span style={{ color:'#ffcc33' }}>v7.3 · June 2026</span>
          </h1>
          <p style={{ fontSize:'14px', color:'#888780', maxWidth:'680px', lineHeight:'1.8', marginBottom:'2rem' }}>
            Aether is a compile-time certification compiler enforcing 46 structural safety, security, and reliability invariants before a single byte of machine code is generated. This brief covers the patent portfolio, competitive moat, filing roadmap, and market position for investor evaluation.
          </p>
          <div style={{ padding:'1rem 1.5rem', border:'0.5px solid rgba(255,170,0,.3)', borderLeft:'3px solid #ffaa00', background:'rgba(255,170,0,.04)', fontSize:'12px', color:'#888780', lineHeight:'1.7' }}>
            <strong style={{ color:'#f0efeb' }}>Confidentiality.</strong> This document is provided under NDA for investment evaluation purposes only. All 46 patent tracks are pre-filing as of June 2026. Do not reproduce or circulate claim language without written authorisation from Emilio R. Bruno, sole inventor and CEO, Aether-Lang.org Inc.
          </div>
        </div>

        {/* SNAPSHOT */}
        <div style={S.section}>
          {secTitle('portfolio snapshot')}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'1px', border:'0.5px solid rgba(255,255,255,.08)' }}>
            {[
              ['46', 'patent tracks', 'A through TT'],
              ['27', 'independent claims', 'provisional + pending'],
              ['3', 'crown jewels', 'B · RR+SS · TT'],
              ['0', 'prior art hits', 'Track B — 3 searches'],
              ['39', 'manifest types', 'machine-verifiable'],
              ['18', 'standards covered', 'DO-178C → EU AI Act'],
              ['0.13ms', 'avg compile', 'release mode'],
              ['154', 'test fixtures', '0 failures'],
            ].map(([n, l, s]) => (
              <div key={l} style={{ padding:'1.5rem', borderRight:'0.5px solid rgba(255,255,255,.08)' }}>
                <span style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'26px', color:'#ffcc33', display:'block', marginBottom:'.2rem' }}>{n}</span>
                <span style={{ fontSize:'10px', color:'#888780', letterSpacing:'.06em', textTransform:'uppercase' }}>{l}</span>
                <span style={{ fontSize:'11px', color:'#1a7a08', display:'block', marginTop:'.2rem' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CROWN JEWELS */}
        <div style={S.section}>
          {secTitle('crown jewel patent tracks')}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
            {CROWN_JEWELS.map(t => (
              <div key={t.id} style={{ border:'0.5px solid rgba(255,204,51,.3)', background:'rgba(255,204,51,.02)', padding:'2rem', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'1.5rem', right:'1.5rem', fontFamily:'Cinzel Decorative, serif', fontSize:'48px', color:'rgba(255,204,51,.06)', lineHeight:1 }}>{t.id}</div>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'13px', fontWeight:700, color:'#ffcc33', fontFamily:'Space Mono, monospace' }}>Track {t.id}</span>
                  <span style={{ fontSize:'10px', padding:'.25rem .6rem', background:'rgba(255,204,51,.12)', color:'#ffcc33', letterSpacing:'.06em' }}>{t.tier}</span>
                  <span style={{ fontSize:'10px', padding:'.25rem .6rem', background:'rgba(57,255,20,.08)', color:'#39ff14', letterSpacing:'.06em' }}>{t.status}</span>
                  <span style={{ fontSize:'10px', padding:'.25rem .6rem', background:'rgba(133,183,235,.08)', color:'#85b7eb', letterSpacing:'.06em' }}>{t.searches} independent prior art searches</span>
                </div>
                <h3 style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'18px', color:'#f0efeb', marginBottom:'1rem', lineHeight:1.3 }}>{t.name}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', fontSize:'12px', lineHeight:'1.7' }}>
                  <div>
                    <div style={{ fontSize:'10px', color:'#ffaa00', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.5rem' }}>Prior art finding</div>
                    <p style={{ color:'#888780' }}>{t.art}</p>
                  </div>
                  <div>
                    <div style={{ fontSize:'10px', color:'#ffaa00', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.5rem' }}>Competitive moat</div>
                    <p style={{ color:'#888780' }}>{t.moat}</p>
                  </div>
                </div>
                <div style={{ marginTop:'1.25rem', padding:'1rem', background:'rgba(5,4,6,.5)', borderLeft:'2px solid #ffcc33' }}>
                  <div style={{ fontSize:'10px', color:'#ffcc33', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.5rem' }}>Core claim</div>
                  <p style={{ fontSize:'12px', color:'#f0efeb', lineHeight:'1.7' }}>{t.claim}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPETITIVE MOAT */}
        <div style={S.section}>
          {secTitle('competitive analysis')}
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr style={{ borderBottom:'0.5px solid rgba(255,255,255,.08)' }}>
                {['Competitor / prior art', 'Their claim', 'Aether distinction', 'Status'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'.75rem 1rem', fontSize:'10px', color:'#888780', fontWeight:400, letterSpacing:'.1em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPETITIVE_MOAT.map(r => (
                <tr key={r.competitor} style={{ borderBottom:'0.5px solid rgba(255,255,255,.06)' }}>
                  <td style={{ padding:'.9rem 1rem', fontWeight:700, color:'#f0efeb', whiteSpace:'nowrap' }}>{r.competitor}</td>
                  <td style={{ padding:'.9rem 1rem', color:'#888780', lineHeight:'1.6' }}>{r.claim}</td>
                  <td style={{ padding:'.9rem 1rem', color:'#888780', lineHeight:'1.6' }}>{r.aether}</td>
                  <td style={{ padding:'.9rem 1rem', whiteSpace:'nowrap' }}>
                    <span style={{ fontSize:'10px', padding:'.25rem .6rem', background: r.verdict === 'Exceeds' ? 'rgba(57,255,20,.1)' : 'rgba(133,183,235,.1)', color: r.verdict === 'Exceeds' ? '#39ff14' : '#85b7eb', letterSpacing:'.06em' }}>{r.verdict}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FILING ROADMAP */}
        <div style={S.section}>
          {secTitle('patent filing roadmap')}
          <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {FILING_ROADMAP.map(r => (
              <div key={r.order} style={{ display:'grid', gridTemplateColumns:'40px 200px 1fr 120px 100px', gap:'1rem', alignItems:'center', padding:'.9rem 1rem', borderBottom:'0.5px solid rgba(255,255,255,.06)', fontSize:'12px' }}>
                <span style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'18px', color:'rgba(255,204,51,.3)' }}>{r.order}</span>
                <code style={{ color:'#ffcc33', fontSize:'11px', fontFamily:'Space Mono, monospace' }}>{r.tracks}</code>
                <span style={{ color:'#888780', lineHeight:'1.5' }}>{r.action}</span>
                <span style={{ color:'#f0efeb', fontSize:'11px' }}>{r.timing}</span>
                <span style={{ fontSize:'10px', padding:'.2rem .5rem', background: r.priority === 'critical' ? 'rgba(255,95,87,.12)' : r.priority === 'high' ? 'rgba(255,204,51,.1)' : 'rgba(133,183,235,.08)', color: r.priority === 'critical' ? '#ff5f57' : r.priority === 'high' ? '#ffcc33' : '#85b7eb', letterSpacing:'.06em', textAlign:'center' }}>{r.priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MARKET */}
        <div style={S.section}>
          {secTitle('market segments')}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
            {MARKET.map(m => (
              <div key={m.segment} style={{ padding:'1.5rem', border:'0.5px solid rgba(255,255,255,.08)', transition:'border-color .2s' }}
                onMouseOver={e=>(e.currentTarget.style.borderColor='rgba(255,204,51,.3)')}
                onMouseOut={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,.08)')}>
                <div style={{ fontSize:'13px', fontWeight:700, color:'#f0efeb', marginBottom:'.5rem' }}>{m.segment}</div>
                <div style={{ fontSize:'11px', color:'#ffcc33', marginBottom:'.75rem', letterSpacing:'.04em' }}>{m.size}</div>
                <div style={{ fontSize:'12px', color:'#888780', lineHeight:'1.6' }}>{m.hook}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CORPORATE */}
        <div style={S.section}>
          {secTitle('corporate & IP structure')}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              ['Operating company', 'Aether-Lang.org Inc.', 'CBCA federal incorporation · June 26 2026 · Kamloops, BC'],
              ['Holdco (pending)', 'Bruno IP Holdings Ltd.', 'BC Registry incorporation pending · planned IP holdco structure'],
              ['Sole inventor & CEO', 'Emilio R. Bruno', 'All IP currently held personally · no transfer docs signed pre-counsel'],
              ['Patent counsel', 'Oyen Wiggs Green & Mutala LLP', 'Max Guld · Vancouver BC · meeting June 30 2026'],
              ['Non-dilutive pipeline', 'SR&ED · NRC IRAP · Mitacs · BC Innovates', 'NATO DIANA Challenge Call submitted · deadline July 3 2026'],
              ['Investor path', 'Track B → Telus anchor → angels → seed', 'BDC Capital · Real Ventures · Panache Ventures · 12–18mo horizon'],
            ].map(([label, name, desc]) => (
              <div key={label} style={{ padding:'1.25rem', border:'0.5px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontSize:'10px', color:'#888780', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:'.4rem' }}>{label}</div>
                <div style={{ fontSize:'13px', fontWeight:700, color:'#f0efeb', marginBottom:'.4rem' }}>{name}</div>
                <div style={{ fontSize:'11px', color:'#888780', lineHeight:'1.5' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ padding:'2.5rem', border:'0.5px solid rgba(255,204,51,.3)', background:'rgba(255,204,51,.02)', textAlign:'center' }}>
          <div style={{ fontFamily:'Cinzel Decorative, serif', fontSize:'20px', color:'#f0efeb', marginBottom:'.75rem' }}>Next steps</div>
          <p style={{ fontSize:'13px', color:'#888780', marginBottom:'1.5rem', maxWidth:'500px', margin:'0 auto 1.5rem', lineHeight:'1.7' }}>
            To proceed with diligence, request a technical deep-dive, or discuss terms, contact Emilio R. Bruno directly.
          </p>
          <div style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap', fontSize:'13px' }}>
            <span>email <a href="mailto:info@bruno-protocol.org" style={{ color:'#ffcc33', textDecoration:'none' }}>info@bruno-protocol.org</a></span>
            <span>phone <a href="tel:7782205112" style={{ color:'#ffcc33', textDecoration:'none' }}>778-220-5112</a></span>
          </div>
        </div>

        <div style={{ marginTop:'2rem', fontSize:'10px', color:'#888780', textAlign:'center', lineHeight:'1.8' }}>
          © 2026 Emilio R. Bruno · Aether-Lang.org Inc. (CBCA federal) · Kamloops, BC, Canada<br/>
          Patent applications pending CA, US · All IP pre-filing · Confidential · AI assistance (Claude/Anthropic) disclosed
        </div>

      </div>
    </div>
  )
}
