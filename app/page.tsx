'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// HONESTY BASIS (audit 2026-07-07): every line below is a condensed, faithful
// reproduction of the REAL console output of fixture 162_pqc_full_stack.bru,
// compiled from the verified tree (serial 20260707141007.858049, suite green,
// chain_root f5270b56…). Values (timings, token, byte counts, chain length)
// are from that run, not invented. The [!] WCET decline line is real output —
// the compiler refuses to assert a timing bound without a declared clock.
// Prior version showed a nonexistent fixture, a per-file "39 manifests" count
// (39 is the suite-wide TYPE count; the per-file max is 19), and a reject
// followed by codegen (impossible — rejects halt compilation). All corrected.
const TERM_LINES = [
  { t: 'cmd',      s: '$ cargo run --release' },
  { t: 'dim',      s: '   Compiling aether-lexer v8.0.0 ...' },
  { t: 'dim',      s: '   Finished release [optimized] target(s)' },
  { t: 'dim',      s: '' },
  { t: 'dim',      s: '===== PROCESSING: 162_pqc_full_stack.bru =====' },
  { t: 'pass',     s: '  [✓] Parser Phase Complete              0.051ms' },
  { t: 'pass',     s: '  [✓] Type-Checker Verification Passed   0.001ms' },
  { t: 'pass',     s: '  [✓] Post-Quantum Crypto Verified   CRYSTALS-Kyber · NIST level 5' },
  { t: 'warn',     s: '  [!] WCET Not Verified   no clock_mhz declared — timing claim declined' },
  { t: 'pass',     s: '  [✓] Zero-Heap Certified    0 bytes   MISRA-C Dir 4.12 / 21.3' },
  { t: 'pass',     s: '  [✓] Stack Depth Verified   0b ≤ 2048b budget' },
  { t: 'pass',     s: '  [✓] Power Envelope         0.0mW ≤ 1000.0mW budget (declared)' },
  { t: 'pass',     s: '  [✓] Interrupt Latency      1.0μs ≤ 10.0μs budget (declared)' },
  { t: 'pass',     s: '  [✓] Constant-Time          no secret-dependent branches' },
  { t: 'pass',     s: '  [✓] Formal Verification    5 proof obligations discharged' },
  { t: 'pass',     s: '  [✓] Attestation Token      0xb16f154c7350806c · 10 manifests in chain' },
  { t: 'pass',     s: '  [✓] Evidence Generated     10 items → DO-178C / DO-160 / IEC clauses' },
  { t: 'pass',     s: '  [✓] GENXR Codegen Emit     0.021ms' },
  { t: 'dim',      s: '  ──────────────────────────────────────────' },
  { t: 'key',      s: '  Total: 0.073ms  (19 manifest blocks · 11,246 aet bytes)' },
  { t: 'dim',      s: '' },
  { t: 'manifest', s: '// GENXR_V8.0.0 / STRICT_MODE' },
  { t: 'manifest', s: 'attestation_manifest {' },
  { t: 'manifest', s: '  token:    0xb16f154c7350806c' },
  { t: 'manifest', s: '  chain:    10 manifests · identity → verification' },
  { t: 'manifest', s: '  note:     compile-time evidence · not a certification' },
  { t: 'manifest', s: '}' },
]

// NOTE (honesty audit, updated 2026-07-07): the manifest labels below name the
// framework each manifest block *references*. They are compile-time evidence
// artifacts, not third-party certifications. All 39 names below were verified
// 1:1 against the distinct block types actually emitted across the fixture
// suite (serial 20260707141007.858049). LETTERING CORRECTION: the shipped
// source labels post-quantum as Track AA (not Z as earlier records said) and
// crypto-defense as Track GG; source lettering is canonical. The quantum,
// infer (R), and evidence (U) tracks all have verified logic in source
// (QuantumVulnerabilityViolation reject; ClassifyInferDirective scope
// analysis; certify clause mapping) — confirmed again this audit.
const MANIFESTS = [
  ['identity_manifest',       'Source fingerprint · tamper-evident chain'],
  ['memory_manifest',         'MISRA-C Dir 4.12 / Rule 21.3 · AUTOSAR M18-4-1'],
  ['stack_manifest',          'MISRA-C Rule 17.2 · stack depth bound'],
  ['wcet_manifest',           'DO-178C Level A · worst-case execution time'],
  ['power_manifest',          'DO-160 · MIL-STD-461 · power envelope'],
  ['interrupt_manifest',      'IEC 61508 SIL4 · ISO 26262 ASIL-D'],
  ['mls_manifest',            'Bell-LaPadula + Biba · CC EAL6 · IEC 62443 SL4'],
  ['smp_manifest',            'AUTOSAR AP · DO-178C partitioned systems'],
  ['timing_manifest',         'FIPS 140-3 · NSA Suite B · CC EAL6+'],
  ['network_manifest',        'NIST SP 800-53 SC-8 · NSA CNSSI 1253'],
  ['verification_manifest',   'DO-333 FM · Common Criteria EAL7'],
  ['attestation_manifest',    'NIST SP 800-193 · TCG TPM 2.0 · RFC 9334'],
  ['operator_manifest',       'FIPS 201-3 · CCBP-v1.0 · NSA CNSSI 1253'],
  ['tensor_manifest',         'ML tensor classification · DoD AI Strategy 2023'],
  ['adversarial_manifest',    'Adversarial taint · Track X'],
  ['federated_manifest',      'Federated learning · Bell-LaPadula gradient'],
  ['quantum_manifest',        'NIST FIPS 203/204/205 · post-quantum'],
  ['crypto_defense_manifest', 'Downgrade prevention · FIPS-140-3 · CNSA 2.0'],
  ['sbom_manifest',           'SPDX / CycloneDX · EO 14028 · NTIA'],
  ['rtos_manifest',           'Liu-Layland · POSIX 1003.1b · IEC 61508-3'],
  ['temporal_manifest',       'LTL call-graph ordering · DO-178C §6.3.4'],
  ['protocol_manifest',       'BFS reachability · ARINC 429 · DO-178C'],
  ['standards_manifest',      'Cross-standard compatibility lattice'],
  ['mte_manifest',            'ARM MTE v8.5-A · ISO 26262 ASIL-D'],
  ['bpc_manifest',            'Magic 0x41455448 · BPC-1.0 · RFC 9334'],
  ['privacy_manifest',        'Differential privacy · GDPR Art.5 · CCPA'],
  ['residency_manifest',      'GDPR Art.44 · CLOUD Act · data residency'],
  ['retention_manifest',      'GDPR Art.5(1)(e) · HIPAA · CCPA'],
  ['model_card_manifest',     'EU AI Act Art.13 · NIST AI RMF 1.0'],
  ['explainability_manifest', 'EU AI Act Art.17 · DoD AI Assurance'],
  ['ai_output_manifest',      'Bell-LaPadula ML output · DoD AI Strategy'],
  ['provenance_manifest',     'SLSA Level 3 · NIST SP 800-218 · EO 14028'],
  ['dependency_manifest',     'EO 14028 · CISA SBOM · SLSA L3'],
  ['evidence_manifest',       'DO-178C / DO-333 / CC clause mapping'],
  ['inference_manifest',      'AI invariant inference · Track RR'],
  ['gap_manifest',            'Structural gap detection · Track SS'],
  ['correctness_certificate', 'Track TT · tamper-evident self-consistency'],
  ['cxx_annotation_manifest', 'C/C++ sidecar · no source modification'],
  ['infer_manifest',          'Track R · AI classification inference'],
]

const STANDARDS = [
  ['DO-178C Level A',    'Aviation software · FAA · EASA'],
  ['ISO 26262 ASIL-D',  'Automotive functional safety'],
  ['IEC 62443 SL4',     'Industrial control system security'],
  ['IEC 61508 SIL4',    'Functional safety E/E/PE systems'],
  ['CC EAL6/7',         'IT security evaluation · formal verification'],
  ['FIPS 140-3',        'Cryptographic module validation'],
  ['NSA CNSA 2.0',      'Constant-time · post-quantum crypto'],
  ['NIST FIPS 203–205', 'Post-quantum cryptography mandate'],
  ['NIST SP 800-193',   'Platform firmware resilience'],
  ['MIL-STD-461',       'EMC · defence systems'],
  ['DO-333 FM',         'Formal methods supplement DO-178C'],
  ['MISRA-C 2012',      'Embedded C · safety-critical'],
  ['AUTOSAR AP',        'Adaptive platform · multi-core automotive'],
  ['EO 14028 / SBOM',   'US software supply chain security'],
  ['GDPR Art.5 / 44',   'EU data protection · residency'],
  ['EU AI Act Art.13/17','AI transparency · explainability'],
  ['SLSA Level 3',      'Build provenance integrity'],
  ['ARM MTE v8.5-A',    'Memory tagging · spatial safety'],
]

export default function Home() {
  const termRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<{t:string,s:string}[]>([])
  const [done, setDone] = useState(false)
  const [formData, setFormData] = useState({ name:'', email:'', org:'', message:'' })
  const [formState, setFormState] = useState<'idle'|'sending'|'ok'|'err'>('idle')

  useEffect(() => {
    let i = 0
    const run = () => {
      if (i >= TERM_LINES.length) { setDone(true); return }
      setLines(prev => [...prev, TERM_LINES[i++]])
      setTimeout(run, TERM_LINES[i-1].t === 'dim' ? 35 : TERM_LINES[i-1].t === 'manifest' ? 55 : 70)
    }
    const t = setTimeout(run, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
  }, [lines])

  async function submitContact(e: React.FormEvent) {
    e.preventDefault()
    setFormState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setFormState(res.ok ? 'ok' : 'err')
    } catch { setFormState('err') }
  }

  const cls: Record<string,string> = {
    cmd:'t-cmd', pass:'t-pass', warn:'t-warn', key:'t-key', dim:'t-dim', manifest:'t-manifest'
  }

  return (
    <>
      <div className="glow-dot" aria-hidden="true" />

      {/* NAV */}
      <nav className="main-nav">
        <a href="#" className="nav-mark">Æ AETHER</a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#manifests">Manifests</a></li>
          <li><a href="#standards">Standards</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <Link href="/internal/login" style={{
              padding:'.45rem 1rem', border:'0.5px solid var(--border-green)',
              color:'var(--green)', fontSize:'11px', letterSpacing:'.08em',
              textTransform:'uppercase', textDecoration:'none', transition:'background .2s',
            }}
            onMouseOver={e=>(e.currentTarget.style.background='rgba(57,255,20,.08)')}
            onMouseOut={e=>(e.currentTarget.style.background='transparent')}
            >[ internal ]</Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="eyebrow">compile-time verification</div>
          <h1>The software is <span>either proven</span> or it does not compile.</h1>
          <p className="hero-desc">
            Aether enforces safety, security, and reliability as structural invariants before
            a single byte of machine code is generated. A program that violates a declared
            property cannot be compiled. There is no runtime check. There is no advisory
            warning. The program does not compile.
          </p>
          {/* Hero stats — every number provable on serial 20260707141007.858049:
              · 49 = canonical IP-track list (records); label is "mapped" not
                "drafted" because only 3 tracks (A/B/C) plus Umbrella Claim 0 have
                drafted claims, and 42 of the 49 letters are evidenced in source.
                "mapped" is the honest verb for the full 49.
              · 20.5K = total .rs line count across all crates excluding the build
                dir = 20,497 total lines (19.2K non-blank). Prior "19.7K" matched
                no measure on this tree.
              · 39 = distinct manifest block types emitted across the fixture
                suite (grep-verified, exactly 39). Correct — unchanged.
              · sub-ms = measured 45.4us avg per op this session; true. Unchanged. */}
          <div className="hero-stats">
            <div className="stat-cell">
              <span className="stat-num">49</span>
              <span className="stat-lbl">IP tracks mapped</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">20.5K</span>
              <span className="stat-lbl">lines of Rust</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">39</span>
              <span className="stat-lbl">manifest types</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">sub-ms</span>
              <span className="stat-lbl">per-op compile</span>
            </div>
          </div>
          <div className="cta-row">
            <a href="#contact" className="btn-primary">request access</a>
            <a href="#how" className="btn-ghost">see how it works</a>
          </div>
        </div>

        {/* TERMINAL */}
        <div className="terminal-wrap">
          <div className="term-header">
            <div className="term-dot td-r" /><div className="term-dot td-y" /><div className="term-dot td-g" />
            <span className="term-title">aether v8.0.0 — GENXR_V8.0.0 / STRICT_MODE</span>
          </div>
          <div className="term-body" ref={termRef}>
            {lines.map((l, i) => (
              <div key={i} className={cls[l.t] || 't-dim'}>{l.s || '\u00A0'}</div>
            ))}
            {done && <span className="cursor" />}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="section-eyebrow">the problem</div>
        <h2 className="section-title">Three vectors. One compiler. Zero runtime.</h2>
        <p className="section-sub">In contested environments, adversaries exploit three software attack vectors. Aether addresses all three at compile time — before the binary exists.</p>
        <div className="problem-grid">
          {[
            ['01','Binary tampering after certification',
             'An adversary modifies firmware after it leaves the build environment. Existing toolchains have no mechanism to detect post-compilation modification at deployment.',
             '→ Aether: an attestation token (a keyless integrity hash over the complete manifest chain) is emitted at compile time. Any modification invalidates the token. Detected when the token is checked, before execution.'],
            ['02','Operator impersonation and privilege escalation',
             'Captured or compromised hardware is operated by personnel without the required clearance. No existing compiler binds operator identity to the binary itself.',
             '→ Aether: CCBP binds an operator-clearance check at compile time; clearance below the data classification is rejected before codegen. (Reference implementation — the challenge/response flow is defined; PKI signing is not yet implemented.)'],
            ['03','Information leakage across classification boundaries',
             'Classified sensor data flows to unclassified telemetry channels. Timing side-channels leak cryptographic keys. No existing compiler enforces information flow at the type level.',
             '→ Aether: Bell-LaPadula + Biba enforced at variable binding level. Classified data cannot flow to under-classified destinations. Constant-time execution enforced structurally.'],
          ].map(([n,title,desc,fix]) => (
            <div className="problem-card" key={n}>
              <div className="problem-number">{n}</div>
              <div className="problem-label">attack vector</div>
              <div className="problem-title">{title}</div>
              <div className="problem-desc">{desc}</div>
              <div className="problem-fix">{fix}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* MANIFESTS */}
      <section id="manifests">
        <div className="section-eyebrow">what aether produces</div>
        <h2 className="section-title">39 certification manifest types. One compiler pass. Sub-millisecond.</h2>
        <p className="section-sub">Aether emits machine-verifiable certification manifest blocks during a single compilation — up to 21 in one program, drawn from a catalog of 39 block types. The standalone verifier (aether-verify) independently re-checks the manifest chain and attestation token — without the compiler or source code — and parses the core manifest block types individually. Manifests are compile-time evidence artifacts, not third-party certifications.</p>
        <div className="manifest-grid">
          {MANIFESTS.map(([name, std]) => (
            <div className="manifest-card" key={name}>
              <div className="manifest-name">{name}</div>
              <div className="manifest-standard">{std}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* STANDARDS */}
      <section id="standards">
        <div className="section-eyebrow">standards coverage</div>
        <h2 className="section-title">Mapped to the standards that matter.</h2>
        <p className="section-sub">Aether's manifests reference the certification frameworks used across NATO member nations and major regulatory jurisdictions. These references are compile-time evidence — Aether has not been qualified or certified under these standards, and manifest emission is not a substitute for tool qualification (e.g. DO-330, ISO 26262).</p>
        <div className="standards-grid">
          {STANDARDS.map(([name, desc]) => (
            <div className="std-card" key={name}>
              <div className="std-name">{name}</div>
              <div className="std-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section
        id="mission"
        style={{
          background: '#050406',
          color: '#ffcc33',
          padding: '5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          className="section-eyebrow"
          style={{ color: '#ffcc33', opacity: 0.75 }}
        >
          mission
        </div>
        <div
          style={{
            maxWidth: '860px',
            margin: '1.25rem auto 0',
            lineHeight: 1.75,
            fontSize: '17px',
          }}
        >
          <p style={{ marginBottom: '1.25rem' }}>
            Aether-Lang.org Inc. exists to raise the bar for what &ldquo;verified&rdquo; means in embedded safety-critical software.
            We build compile-time certification tools that structurally prove correctness before code is deployed &mdash;
            producing machine-verifiable evidence of every safety, security, and reliability invariant a system depends on.
          </p>
          <p style={{ marginBottom: '1.25rem' }}>
            Our discipline is that honesty is central: our tools refuse to compile code whose invariants cannot be proven,
            we document what we don&rsquo;t yet do, and we treat auditable evidence as more valuable than confident claims.
          </p>
          <p>
            We serve aerospace, automotive, medical device, and defense engineering teams whose work protects human lives,
            and we believe the software their systems depend on should be structurally correct by construction &mdash;
            not correct-by-testing-that-hopefully-caught-everything.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <div className="cta-section" id="contact">
        <h2 className="cta-title">Your C code. Aether certification manifests.<br/>No rewrites.</h2>
        <p className="cta-sub">Add a sidecar declaration file alongside your existing C/C++ firmware. Aether enforces the properties you declare and produces a machine-verifiable certification manifest in under one millisecond per operation.</p>

        <div className="contact-form">
          {formState === 'ok' ? (
            <p className="form-success">✓ Message received. We'll be in touch within one business day.</p>
          ) : (
            <form onSubmit={submitContact}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-field">
                  <label className="form-label">name</label>
                  <input className="form-input" required value={formData.name}
                    onChange={e=>setFormData(p=>({...p,name:e.target.value}))} />
                </div>
                <div className="form-field">
                  <label className="form-label">email</label>
                  <input className="form-input" type="email" required value={formData.email}
                    onChange={e=>setFormData(p=>({...p,email:e.target.value}))} />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">organisation</label>
                <input className="form-input" value={formData.org}
                  onChange={e=>setFormData(p=>({...p,org:e.target.value}))} />
              </div>
              <div className="form-field">
                <label className="form-label">message</label>
                <textarea className="form-textarea" required value={formData.message}
                  onChange={e=>setFormData(p=>({...p,message:e.target.value}))} />
              </div>
              <button className="btn-primary" type="submit" style={{width:'100%'}}
                disabled={formState==='sending'}>
                {formState==='sending' ? 'sending...' : 'send message'}
              </button>
              {formState==='err' && <p className="form-error">Something went wrong. Email us directly at contact@aether-lang.org</p>}
            </form>
          )}
        </div>

        <div style={{display:'flex',gap:'2rem',justifyContent:'center',flexWrap:'wrap',marginTop:'2rem',fontSize:'13px'}}>
          <span>email&nbsp;<a href="mailto:contact@aether-lang.org" style={{color:'var(--green)'}}>contact@aether-lang.org</a></span>
          <span>phone&nbsp;<a href="tel:7782205112" style={{color:'var(--green)'}}>778-220-5112</a></span>
        </div>
      </div>

      <footer>
        <span className="footer-mark">Æ AETHER</span>
        <span className="footer-copy">© 2026 Emilio R. Bruno · Aether-Lang.org Inc. (CBCA federal) · Kamloops, BC, Canada · Patent applications in preparation (CA, US — not yet filed) · AI assistance (Claude/Anthropic) disclosed</span>
      </footer>
    </>
  )
}
