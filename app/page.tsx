'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const TERM_LINES = [
  { t: 'cmd',      s: '$ cargo run --release' },
  { t: 'dim',      s: '   Compiling aether-lexer v7.3.0 ...' },
  { t: 'dim',      s: '   Finished release profile in 1.1s' },
  { t: 'dim',      s: '' },
  { t: 'dim',      s: '===== PROCESSING: missile_guidance.bru =====' },
  { t: 'pass',     s: '  [✓] Parser Phase Complete              0.083ms' },
  { t: 'pass',     s: '  [✓] Type-Checker: Low+Secret = REJECTED before codegen' },
  { t: 'pass',     s: '  [✓] Monomorphization   0.009ms  (3 instantiation(s))' },
  { t: 'pass',     s: '  [✓] Zero-Heap Certified   0 bytes  MISRA-C Rule 20.4' },
  { t: 'pass',     s: '  [✓] Stack Depth Verified  192b ≤ 2048b budget' },
  { t: 'pass',     s: '  [✓] Power Verified        285mW ≤ 500mW  MIL-STD-461' },
  { t: 'pass',     s: '  [✓] Interrupt Verified    2.5μs ≤ 50μs  IEC-61508' },
  { t: 'pass',     s: '  [✓] Constant-Time         no secret branches  FIPS-140-3' },
  { t: 'pass',     s: '  [✓] MLS Lattice           Bell-LaPadula+Biba  CC-EAL6' },
  { t: 'pass',     s: '  [✓] Post-Quantum          NIST FIPS 203/204/205  PASS' },
  { t: 'pass',     s: '  [✓] Attestation Token     0x5ce1beb75a928c4c  RFC-9334' },
  { t: 'pass',     s: '  [✓] Correctness Cert (TT) machine-verifiable  PASS' },
  { t: 'pass',     s: '  [✓] GENXR Codegen Emit    0.073ms' },
  { t: 'dim',      s: '  ──────────────────────────────────────────' },
  { t: 'key',      s: '  Total: 0.164ms  (39 manifests · 7,110 aet bytes)' },
  { t: 'dim',      s: '' },
  { t: 'manifest', s: '// GENXR_V7.3 / STRICT_MODE' },
  { t: 'manifest', s: 'attestation_manifest {' },
  { t: 'manifest', s: '  token:    0x5ce1beb75a928c4c' },
  { t: 'manifest', s: '  chain:    39 blocks · depth 7' },
  { t: 'manifest', s: '  standard: NIST_SP_800-193 / TCG_TPM2.0' },
  { t: 'manifest', s: '}' },
]

const MANIFESTS = [
  ['identity_manifest',       'Source fingerprint · tamper-evident chain'],
  ['memory_manifest',         'MISRA-C Rule 20.4 · AUTOSAR M18-4-1'],
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
  ['correctness_certificate', 'Track TT · independently checkable'],
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
    <div className="page-layout">
      {/* LEFT RAIL */}
      <aside className="left-rail" aria-hidden="true">
        <div className="left-rail-inner">
          <Image
            src="/aetc.png"
            alt="Aether logomark"
            width={200}
            height={200}
            className="rail-logo"
          />
        </div>
      </aside>

      <div className="page-content">
      <div className="glow-dot" aria-hidden="true" />

      {/* NAV */}
      <nav className="main-nav">
        <a href="#" className="nav-mark" style={{lineHeight:'1.2'}}>
          Æ AETHER
          <span style={{display:'block',fontSize:'9px',letterSpacing:'.18em',color:'var(--green)',opacity:.7,textTransform:'uppercase',fontWeight:400,marginTop:'2px'}}>
            Proven correct. Before it runs. Every time.
          </span>
        </a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#manifests">Manifests</a></li>
          <li><a href="#standards">Standards</a></li>
          <li><a href="#milestones">Milestones</a></li>
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
          <div className="eyebrow">Proven correct. Before it runs. Every time.</div>
          <h1>The software is <span>either certified</span> or it does not compile.</h1>
          <p className="hero-desc">
            Other compilers reason about program behavior.<br/>
            Aether reasons about physical consequences.<br/>
            That is a different foundation.
          </p>
          <div className="hero-stats">
            <div className="stat-cell">
              <span className="stat-num">44</span>
              <span className="stat-lbl">patent tracks</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">39</span>
              <span className="stat-lbl">cert manifests</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">0.13ms</span>
              <span className="stat-lbl">avg compile</span>
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
            <span className="term-title">aether v7.3 — GENXR_V7.3 / STRICT_MODE</span>
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
        <p className="section-sub">The adjacent work is not in type theory or formal verification. It is in hardware design, power management, and side-channel research. None of those fields have a compiler. Aether does.</p>
        <div className="problem-grid">
          {[
            ['01','Binary tampering after certification',
             'An adversary modifies firmware after it leaves the build environment. Existing toolchains have no mechanism to detect post-compilation modification at deployment.',
             '→ Aether: cryptographic attestation token covers the complete manifest chain. Any modification invalidates the token. Detected before execution.'],
            ['02','Operator impersonation and privilege escalation',
             'Captured or compromised hardware is operated by personnel without the required clearance. No existing compiler binds operator identity to the binary itself.',
             '→ Aether: CCBP embeds a PKI challenge at compile time. Operator clearance below data classification is rejected. Cannot be bypassed at runtime.'],
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
       + <h2 className="section-title">39 certification manifests.One compilation.Milliseconds, not runtime.</h2>
        <p className="section-sub">Every Aether binary carries machine-verifiable certification manifest blocks, each independently verifiable by the open BPC verifier — without the compiler or source code.</p>
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
        <h2 className="section-title">Every standard. One compiler.</h2>
        <p className="section-sub">Aether's manifests map directly to the certification frameworks used across all NATO member nations and major regulatory jurisdictions.</p>
        <div className="standards-grid">
          {STANDARDS.map(([name, desc]) => (
            <div className="std-card" key={name}>
              <div className="std-name">{name}</div>
              <div className="std-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* MILESTONES */}
      <section id="milestones">
        <div className="section-eyebrow">build log</div>
        <h2 className="section-title">What's been proven. What's next.</h2>
        <p className="section-sub">Every confirmed milestone is compiler-verified. Zero failures. Zero exceptions.</p>

        <div className="milestones-grid">

          <div className="milestone-card milestone-confirmed">
            <span className="milestone-badge badge-confirmed">CONFIRMED</span>
            <h3 className="milestone-heading">Machine code emission</h3>
            <p className="milestone-body">
              Aether v7.3 produces real ARM Cortex-M4 Thumb-2 binary from <code>.bru</code> source.
              Linked ELF: 12,436 bytes. Flashable binary: 668 bytes.
              Five WFI instructions confirmed in silicon at flash addresses
              0x08000010, 0x0800004e, 0x08000070, 0x080001c8, 0x0800023a.
            </p>
          </div>

          <div className="milestone-card milestone-confirmed">
            <span className="milestone-badge badge-confirmed">CONFIRMED</span>
            <h3 className="milestone-heading">39 certification manifests</h3>
            <p className="milestone-body">
              Single compilation produces 39 simultaneous machine-verifiable certification
              manifests across 7 regulated industries — defence, aviation, automotive,
              medical, telecom, AI/ML, and critical infrastructure.
              154 fixtures, 108 operations, 0 failures.
            </p>
          </div>

          <div className="milestone-card milestone-confirmed">
            <span className="milestone-badge badge-confirmed">CONFIRMED</span>
            <h3 className="milestone-heading">44 patent tracks</h3>
            <p className="milestone-body">
              Core IP drafted as provisional application with 44 tracks and Umbrella Claim 0,
              including newly-drafted post-quantum algorithm enforcement and cryptographic
              downgrade defense tracks, pending counsel review and prior art search.
              Track B (Secret-Context Hash-Map Invariant): no direct prior art found in
              three independent searches. Track TT (correctness certificate) is the
              capstone. Tracks RR/SS/TT form the AI correctness pipeline.
            </p>
          </div>

          <div className="milestone-card milestone-confirmed">
            <span className="milestone-badge badge-confirmed">CONFIRMED</span>
            <h3 className="milestone-heading">Millisecond-scale certification</h3>
             <p className="milestone-body">
    Aetherate v0.2.0 achieves 2.2ms median certification latency across
    the Core 10 tracks — below the 13ms human unconscious perception threshold.
            </p>
          </div>
          <div className="milestone-card milestone-pending">
            <span className="milestone-badge badge-pending">IN PROGRESS</span>
            <h3 className="milestone-heading">v8.0 — extern contracts</h3>
            <p className="milestone-body">
              <code>#extern_contract</code> directive binding HAL stubs to certification
              manifests. Real register allocation (current emission uses placeholder
              moves; WFI and control flow are real). Standalone <code>aether-verify</code>
              binary for TT correctness certificates independently checkable without
              the compiler.
            </p>
          </div>

          <div className="milestone-card milestone-pending">
            <span className="milestone-badge badge-pending">IN PROGRESS</span>
            <h3 className="milestone-heading">NATO DIANA submission</h3>
            <p className="milestone-body">
              Defense Innovation Accelerator for the North Atlantic — dual-use
              deep-tech cohort. Targeting next available application cycle.
            </p>
          </div>

        </div>

        <div className="milestone-proof">
          <div className="proof-label">MACHINE CODE PROOF — v7.3 DISASSEMBLY EXCERPT</div>
          <pre className="proof-code">{`08000010: bf30  wfi
0800004e: bf30  wfi
08000070: bf30  wfi
080001c8: bf30  wfi
0800023a: bf30  wfi`}</pre>
          <div className="proof-meta">
            Target: STM32F4xx · Cortex-M4 · FLASH 0x08000000 ·
            Toolchain: arm-gnu-toolchain 15.2.Rel1 ·
            Engine: GENXR_V7.3
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <div className="cta-section" id="contact">
        <h2 className="cta-title">Your C code. Aether certification.<br/>No rewrites.</h2>
        <p className="cta-sub">Add a sidecar declaration file alongside your existing C/C++ firmware. Aether enforces the properties you declare and produces a machine-verifiable certified binary in under one millisecond.</p>

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
        <span className="footer-copy">© 2026 Emilio R. Bruno · Aether-Lang.org Inc. (CBCA federal) · Kamloops, BC, Canada · Patent applications in preparation · AI assistance (Claude/Anthropic) disclosed</span>
      </footer>
      </div>
    </div>
  )
}
