'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type Doc = { id:string; name:string; description:string; filename:string; category:string; version:string }

const MANIFESTS = [
  'identity','memory','stack','wcet','power','interrupt','mls','smp',
  'timing','network','verification','attestation','operator','tensor',
  'adversarial','federated','quantum','crypto_defense','sbom','rtos',
  'temporal','protocol','standards','mte','bpc','privacy','residency',
  'retention','model_card','explainability','ai_output','provenance',
  'dependency','evidence','inference','gap','correctness_certificate',
  'cxx_annotation','infer',
]

const STANDARDS = [
  { id:'do178c',   name:'DO-178C Level A',      desc:'Aviation · FAA · EASA' },
  { id:'do333',    name:'DO-333 FM',             desc:'Formal methods supplement' },
  { id:'iso26262', name:'ISO 26262 ASIL-D',      desc:'Automotive functional safety' },
  { id:'iec61508', name:'IEC 61508 SIL4',        desc:'Functional safety E/E/PE' },
  { id:'iec62443', name:'IEC 62443 SL4',         desc:'Industrial OT security' },
  { id:'cc_eal6',  name:'Common Criteria EAL6',  desc:'Security evaluation' },
  { id:'cc_eal7',  name:'Common Criteria EAL7',  desc:'Formal verification' },
  { id:'fips140',  name:'FIPS 140-3',            desc:'Cryptographic module' },
  { id:'nsa',      name:'NSA CNSA 2.0',          desc:'CNSSI 1253 constant-time' },
  { id:'nist800',  name:'NIST SP 800-193',       desc:'Firmware resilience' },
  { id:'misra',    name:'MISRA-C 2012',          desc:'Embedded C safety' },
  { id:'milstd',   name:'MIL-STD-461',           desc:'EMC defence' },
  { id:'gdpr',     name:'GDPR Art.5/44',         desc:'EU data protection' },
  { id:'eo14028',  name:'EO 14028 / SBOM',       desc:'US supply chain' },
  { id:'slsa',     name:'SLSA Level 3',          desc:'Build provenance' },
  { id:'euai',     name:'EU AI Act Art.13/17',   desc:'AI transparency' },
  { id:'nist_ai',  name:'NIST AI RMF 1.0',       desc:'AI risk management' },
  { id:'pqc',      name:'NIST FIPS 203/204/205', desc:'Post-quantum mandate' },
]

const SAMPLE_MANIFEST = `// AETHER PROTOCOL COMPILED TARGET MANIFEST
// GENERATOR ENGINE: GENXR_V7.3 / STRICT_MODE

identity_manifest {
  classifier:   SECRET
  authority:    "Collins-Aerospace-2026"
  source_fingerprint: 0xd4725433d09530f5
}
memory_manifest {
  heap_budget:  0 bytes
  standard:     MISRA-C_Rule_20.4
}
attestation_manifest {
  hardware_profile: "ARM-Cortex-A72-TrustZone"
  attestation_token: 0xefdb264785a35c4d
  chain_depth:  7
  standard:     NIST_SP_800-193 / TCG_TPM2.0 / IETF_RFC_9334
}
mls_manifest {
  max_confidentiality: SECRET
  lattice: dual
  standard: Bell-LaPadula + Biba / CC_EAL6
}
correctness_certificate {
  chain: full
  third_party_verifiable: true
  standard: Track-TT / Common_Criteria_EAL7
}`

export default function VIPPortalClient({ user, docs }: { user: any, docs: Doc[] }) {
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState('evidence')
  const [manifestText, setManifestText] = useState('')
  const [selectedManifests, setSelectedManifests] = useState<Set<string>>(new Set())
  const [selectedStd, setSelectedStd] = useState<string|null>(null)
  const [apiKey, setApiKey] = useState('')
  const [keyValid, setKeyValid] = useState<boolean|null>(null)
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function toggleManifest(m: string) {
    setSelectedManifests(prev => {
      const next = new Set(prev)
      next.has(m) ? next.delete(m) : next.add(m)
      return next
    })
  }

  function autoDetect(text: string) {
    const detected = new Set<string>()
    MANIFESTS.forEach(m => {
      if (text.includes(m+'_manifest') || text.includes(m+'_certificate')) detected.add(m)
    })
    setSelectedManifests(detected)
  }

  function checkKey(val: string) {
    setApiKey(val)
    setKeyValid(val.startsWith('sk-ant-') ? true : val.length > 0 ? false : null)
  }

  async function downloadDoc(filename: string) {
    const res = await fetch(`/api/docs?file=${encodeURIComponent(filename)}`)
    if (!res.ok) { alert('Download unavailable — check Supabase Storage.'); return }
    const { url } = await res.json()
    window.open(url, '_blank')
  }

  async function generateEvidence() {
    if (!apiKey || !selectedManifests.size || !selectedStd) return
    setGenerating(true)
    setOutput('')

    const stdObj = STANDARDS.find(s => s.id === selectedStd)!
    const selList = [...selectedManifests].join(', ')
    const tokenMatch = manifestText.match(/attestation_token:\s*(0x[0-9a-f]+)/i)
    const token = tokenMatch?.[1] || '0x' + Math.floor(Math.random()*0xFFFFFFFFFF).toString(16)

    const prompt = `You are a senior certification engineer specialising in ${stdObj.name} for safety-critical systems compiled with Aether v7.3 (GENXR_V7.3 / STRICT_MODE, Aether-Lang.org Inc., Kamloops BC).

MANIFEST:
${manifestText || '(no manifest pasted — generate generic evidence for selected blocks)'}

SELECTED BLOCKS: ${selList}
TARGET STANDARD: ${stdObj.name} — ${stdObj.desc}

Generate a professional certification evidence package:

1. EXECUTIVE SUMMARY (2–3 sentences)
2. COMPLIANCE ASSERTION TABLE — each selected manifest block: property, ${stdObj.name} clause, Aether enforcement mechanism, status (PASS/STRUCTURAL)
3. TRACEABILITY MATRIX — map each block to 2–3 standard requirements with clause numbers
4. SCOPE AND LIMITATIONS
5. FORMAL CERTIFICATION STATEMENT — referencing attestation token ${token}, BPC-v1.0, Aether v7.3 / GENXR_V7.3 / STRICT_MODE

Use correct clause numbers. Formal certification authority style. Under 700 words.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop()!
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6); if (data === '[DONE]') continue
          try {
            const p = JSON.parse(data)
            if (p.type === 'content_block_delta' && p.delta?.text) {
              setOutput(prev => prev + p.delta.text)
            }
          } catch {}
        }
      }
    } catch (err: any) {
      setOutput('API error: ' + err.message)
    }
    setGenerating(false)
  }

  const G = { fontSize:'10px', color:'var(--muted)', letterSpacing:'.1em', textTransform:'uppercase' as const, display:'block', marginBottom:'.6rem', marginTop:'1.25rem' }
  const INPUT_STYLE = { width:'100%', padding:'.6rem .75rem', background:'rgba(255,255,255,.03)', border:'0.5px solid var(--border)', color:'var(--off-white)', fontFamily:'var(--font-mono)', fontSize:'12px', outline:'none' }
  const CHIP = (on:boolean) => ({ padding:'.4rem .7rem', border:`0.5px solid ${on?'var(--border-green)':'var(--border)'}`, fontSize:'11px', color: on?'var(--green)':'var(--muted)', background: on?'rgba(57,255,20,.08)':'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:'.35rem', transition:'all .15s' })

  return (
    <>
      <nav className="portal-nav" style={{borderColor:'rgba(255,204,51,.3)'}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:'16px',color:'var(--gold)'}}>Æ AETHER VIP</span>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          {(['evidence','diagrams','docs','tracks'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{background:'none',border:'none',fontFamily:'var(--font-mono)',fontSize:'11px',letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',color:tab===t?'var(--gold)':'var(--muted)',borderBottom:tab===t?'2px solid var(--gold)':'2px solid transparent',paddingBottom:'2px'}}>
              {t}
            </button>
          ))}
          <span style={{fontSize:'10px',padding:'.3rem .7rem',border:'0.5px solid rgba(255,204,51,.4)',color:'var(--gold)',letterSpacing:'.1em',textTransform:'uppercase'}}>
            ⬡ VIP · v7.3
          </span>
          <button onClick={signOut} style={{fontSize:'11px',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted)',background:'none',border:'none',fontFamily:'var(--font-mono)',cursor:'pointer'}}>
            [ exit ]
          </button>
        </div>
      </nav>

      <div className="portal-body">
        <p style={{fontSize:'10px',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'.75rem'}}>restricted · technical access · june 2026</p>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(20px,2.5vw,32px)',color:'var(--off-white)',marginBottom:'.75rem'}}>Aether v7.3 — VIP Technical Portal</h1>
        <p style={{fontSize:'13px',color:'var(--muted)',maxWidth:'700px',marginBottom:'2rem',lineHeight:'1.7'}}>Full technical reference for counsel, evaluators, and enterprise prospects under NDA. Pre-filing.</p>

        {/* EVIDENCE GENERATOR */}
        {tab === 'evidence' && (
          <div className="portal-section">
            <div className="portal-section-title" style={{color:'var(--gold)'}}>Certification evidence generator — AI-powered · BPC v1.0</div>
            <div style={{border:'0.5px solid rgba(255,204,51,.3)',background:'rgba(255,204,51,.02)',padding:'2rem'}}>

              <label style={G}>Anthropic API key (in-memory only, never stored)</label>
              <div style={{display:'flex',gap:'.5rem',alignItems:'center',marginBottom:'.75rem'}}>
                <input type="password" placeholder="sk-ant-api03-..." value={apiKey}
                  onChange={e=>checkKey(e.target.value)} style={{...INPUT_STYLE,flex:1}} />
                {keyValid === true && <span style={{fontSize:'11px',color:'#28c840',whiteSpace:'nowrap'}}>✓ valid</span>}
                {keyValid === false && <span style={{fontSize:'11px',color:'var(--amber)',whiteSpace:'nowrap'}}>⚠ check format</span>}
              </div>

              <label style={G}>1. paste .aet manifest</label>
              <textarea value={manifestText}
                onChange={e=>{setManifestText(e.target.value);autoDetect(e.target.value)}}
                placeholder="Paste .aet manifest — blocks auto-detected..."
                style={{...INPUT_STYLE,height:'140px',resize:'vertical'}} />
              <button onClick={()=>{setManifestText(SAMPLE_MANIFEST);autoDetect(SAMPLE_MANIFEST)}}
                style={{marginTop:'.5rem',padding:'.4rem .9rem',border:'0.5px solid var(--border)',color:'var(--muted)',background:'transparent',fontFamily:'var(--font-mono)',fontSize:'11px',cursor:'pointer'}}>
                load sample v7.3 manifest
              </button>

              <label style={G}>2. manifest blocks ({selectedManifests.size} selected) <span onClick={()=>setSelectedManifests(new Set(MANIFESTS))} style={{color:'var(--green)',cursor:'pointer',marginLeft:'1rem'}}>all</span> <span onClick={()=>setSelectedManifests(new Set())} style={{color:'var(--muted)',cursor:'pointer',marginLeft:'.5rem'}}>clear</span></label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'.4rem'}}>
                {MANIFESTS.map(m => (
                  <div key={m} onClick={()=>toggleManifest(m)} style={CHIP(selectedManifests.has(m))}>
                    <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'currentColor',opacity:.6,flexShrink:0}}/>
                    <span>{m.replace(/_/g,' ')}</span>
                  </div>
                ))}
              </div>

              <label style={G}>3. target standard</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'.5rem'}}>
                {STANDARDS.map(s => (
                  <div key={s.id} onClick={()=>setSelectedStd(s.id)}
                    style={{padding:'.75rem 1rem',border:`0.5px solid ${selectedStd===s.id?'var(--gold)':'var(--border)'}`,cursor:'pointer',background:selectedStd===s.id?'rgba(255,204,51,.06)':'transparent',transition:'all .15s'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:'var(--off-white)',marginBottom:'.25rem'}}>{s.name}</div>
                    <div style={{fontSize:'10px',color:'var(--muted)'}}>{s.desc}</div>
                  </div>
                ))}
              </div>

              <button onClick={generateEvidence} disabled={generating||!apiKey||!selectedManifests.size||!selectedStd}
                style={{width:'100%',marginTop:'1.5rem',padding:'1rem',background:generating?'rgba(255,204,51,.5)':'var(--gold)',color:'var(--black)',fontFamily:'var(--font-mono)',fontSize:'13px',fontWeight:'700',letterSpacing:'.08em',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem'}}>
                {generating ? <>
                  <span style={{width:'16px',height:'16px',border:'2px solid rgba(5,4,6,.3)',borderTopColor:'var(--black)',borderRadius:'50%',display:'inline-block',animation:'spin .6s linear infinite'}} />
                  generating evidence package...
                </> : 'generate certification evidence package →'}
              </button>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

              {output && (
                <div style={{marginTop:'1.5rem',border:'0.5px solid var(--border-green)',background:'var(--green-bg)'}}>
                  <div style={{padding:'1rem 1.25rem',borderBottom:'0.5px solid var(--border-green)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'13px',fontWeight:'700',color:'var(--off-white)'}}>Evidence package — {STANDARDS.find(s=>s.id===selectedStd)?.name}</span>
                    <button onClick={()=>{navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),2000)}}
                      style={{padding:'.35rem .8rem',border:'0.5px solid var(--border-green)',background:'transparent',color:'var(--green)',fontFamily:'var(--font-mono)',fontSize:'11px',cursor:'pointer'}}>
                      {copied ? '✓ copied' : 'copy'}
                    </button>
                  </div>
                  <div style={{padding:'1.25rem',fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--off-white)',whiteSpace:'pre-wrap',lineHeight:'1.7'}}>
                    {output}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DIAGRAMS */}
        {tab === 'diagrams' && (
          <div className="portal-section">
            <div className="portal-section-title" style={{color:'var(--gold)'}}>Technical flowcharts — v7.3</div>
            <p style={{color:'var(--muted)',fontSize:'13px',marginBottom:'1rem'}}>
              Full-resolution SVG diagrams are included in the aether-vip.html standalone file. For this portal session, download the relevant document above for offline reference, or request the diagram package via <a href="mailto:info@bruno-protocol.org" style={{color:'var(--green)'}}>info@bruno-protocol.org</a>.
            </p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1rem'}}>
              {['Compiler pipeline v7.3 (detailed)','Compiler pipeline (alt flow)','Universal I/O architecture','Universal I/O pipeline','46 enforcement tracks map'].map(name => (
                <div key={name} style={{padding:'1.5rem',border:'0.5px solid var(--border)',background:'var(--green-bg)'}}>
                  <div style={{height:'80px',border:'0.5px solid var(--border-green)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem',fontSize:'11px',color:'var(--green-dim)',letterSpacing:'.06em',textTransform:'uppercase'}}>
                    SVG
                  </div>
                  <div style={{fontSize:'12px',color:'var(--off-white)'}}>{name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {tab === 'docs' && (
          <div className="portal-section">
            <div className="portal-section-title" style={{color:'var(--gold)'}}>All documents — v7.3 first editions</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem'}}>
              {docs.map(doc => (
                <div key={doc.id} style={{padding:'1.5rem',border:'0.5px solid var(--border)',transition:'border-color .2s'}}
                  onMouseOver={e=>(e.currentTarget.style.borderColor='rgba(255,204,51,.3)')}
                  onMouseOut={e=>(e.currentTarget.style.borderColor='var(--border)')}>
                  <div style={{fontSize:'10px',color:'var(--gold)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.5rem'}}>
                    {doc.category} · {doc.version}
                  </div>
                  <div style={{fontSize:'14px',fontWeight:'700',color:'var(--off-white)',marginBottom:'.5rem'}}>{doc.name}</div>
                  <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:'1.6',marginBottom:'1rem'}}>{doc.description}</div>
                  <button onClick={() => downloadDoc(doc.filename)}
                    style={{fontSize:'11px',padding:'.4rem .9rem',border:'0.5px solid rgba(255,204,51,.4)',color:'var(--gold)',background:'transparent',fontFamily:'var(--font-mono)',cursor:'pointer',letterSpacing:'.06em'}}>
                    download →
                  </button>
                </div>
              ))}
              {docs.length === 0 && <p style={{color:'var(--muted)',fontSize:'13px'}}>No documents uploaded yet.</p>}
            </div>
          </div>
        )}

        {/* TRACKS */}
        {tab === 'tracks' && (
          <div className="portal-section">
            <div className="portal-section-title" style={{color:'var(--gold)'}}>46 patent tracks — A through TT</div>
            <p style={{color:'var(--muted)',fontSize:'13px',marginBottom:'1.5rem'}}>
              Full interactive track ranking with tier badges is in the aether-vip.html standalone file.
              Below is the complete track index for quick reference.
            </p>
            {[
              ['B · TT · RR · SS','Crown jewels','File immediately — no prior art on B across 3 searches. RR+SS+TT = 3 independent AI correctness claims.'],
              ['A · C · D · E','Original five','In existing provisional. Expand and strengthen before non-provisional.'],
              ['F · G · H · I · J','Safety budgets','WCET, zero-heap, stack depth, power, interrupt. File as group — DO-178C Level A / IEC 61508.'],
              ['K · L · M · N · O · P · Q','Security layer','MLS, SMP, constant-time, network, formal verify, attestation, CCBP. CC EAL6/7.'],
              ['Z · AA','Post-quantum','NIST FIPS 203/204/205. Government mandates live — excellent timing.'],
              ['BB · PP · QQ','Supply chain','SBOM, compiler provenance, dependency. EO 14028 / SLSA L3 / CISA.'],
              ['W · X · Y · MM · NN · OO','AI safety','ML tensor, adversarial, federated, model card, explainability, AI output. EU AI Act.'],
              ['FF · KK · LL','Privacy','Differential privacy, residency, retention. GDPR Art.5/44. Novel structural enforcement.'],
              ['CC · DD · EE · HH · II · JJ','Protocol / RT','RTOS, protocol SM, ARM MTE, BPC, cross-standard, temporal LTL.'],
              ['R · GG · U · V','Supporting','AI classification inference, formal verify extension, cert evidence, behavioral attestation.'],
              ['S · T · V','Paper-spec ⚠','Not implemented. Must not be described as implemented anywhere.'],
            ].map(([tracks, label, desc]) => (
              <div key={tracks} style={{padding:'1rem 1.25rem',borderBottom:'0.5px solid var(--border)',display:'grid',gridTemplateColumns:'180px 130px 1fr',gap:'1rem',alignItems:'start'}}>
                <code style={{fontSize:'12px',color:'var(--gold)',fontFamily:'var(--font-mono)'}}>{tracks}</code>
                <span style={{fontSize:'11px',color:'var(--muted)',letterSpacing:'.04em'}}>{label}</span>
                <span style={{fontSize:'12px',color:'var(--off-white)',lineHeight:'1.6'}}>{desc}</span>
              </div>
            ))}
          </div>
        )}

        <div className="notice" style={{marginTop:'1rem'}}>
          <strong>Session.</strong> Signed in as {user.email} · VIP role. Pre-filing — do not reproduce claim language externally without written authorisation. AI assistance (Claude/Anthropic) disclosed.
        </div>
      </div>
    </>
  )
}
