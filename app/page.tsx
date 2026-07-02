'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const termRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<{t:string,s:string}[]>([])
  const [done, setDone] = useState(false)
  const [formData, setFormData] = useState({ name:'', email:'', org:'', message:'' })
  const [formState, setFormState] = useState<'idle'|'sending'|'ok'|'err'>('idle')

  const TERM_LINES = [
    { t: 'cmd',      s: '$ cargo run --release' },
    { t: 'dim',      s: '   Compiling aether-lexer v7.3.0 ...' },
    { t: 'dim',      s: '   Finished release profile in 1.1s' },
    { t: 'dim',      s: '' },
    { t: 'dim',      s: '===== PROCESSING: missile_guidance.bru =====' },
    { t: 'pass',     s: '  [✓] Parser Phase Complete              0.083ms' },
    { t: 'pass',     s: '  [✓] Type-Checker Verification Passed   0.008ms' },
    { t: 'pass',     s: '  [✓] Monomorphization Resolved          0.009ms  (3 instantiation(s))' },
    { t: 'pass',     s: '  [✓] Zero-Heap Invariant Certified      0 bytes  MISRA-C Rule 20.4' },
    { t: 'pass',     s: '  [✓] Stack Depth Verified               192b ≤ 2048b budget' },
    { t: 'pass',     s: '  [✓] Power Envelope Verified            285mW ≤ 500mW  MIL-STD-461' },
    { t: 'pass',     s: '  [✓] Interrupt Latency Verified         2.5μs ≤ 50μs  IEC-61508' },
    { t: 'pass',     s: '  [✓] Constant-Time Timing Closure       no secret branches  FIPS-140-3' },
    { t: 'pass',     s: '  [✓] Cross-Standard Consistency Valid   primary: DO-178C-LevelA' },
    { t: 'pass',     s: '  [✓] Dynamic Memory Tagging Verified    ARM-MTE-v8.5-A  PASS' },
    { t: 'pass',     s: '  [✓] Thumb-2 Machine Code Emission      1 .s file(s) → asm_out/' },
    { t: 'pass',     s: '  [✓] HAL Stubs Generated Successfully   hal_stubs.c (1654 bytes)' },
    { t: 'pass',     s: '  [✓] Attestation Manifest Token Gen     0x5ce1beb75a928c4c  RFC-9334' },
    { t: 'pass',     s: '  [✓] AI Invariant Inference Complete    7 certified  Track-RR' },
    { t: 'pass',     s: '  [✓] Structured Correctness Certificate Emitted  Track-TT  PASS' },
    { t: 'pass',     s: '  [✓] GENXR Codegen Emit                 0.073ms' },
    { t: 'dim',      s: '  ─────────────────────────────────────────────────────────────────' },
    { t: 'key',      s: '  Total: 0.164ms  (17 verified tracks · 7,110 aet bytes)' },
    { t: 'dim',      s: '' },
    { t: 'manifest', s: '// GENXR_V7.3 / STRICT_MODE' },
    { t: 'manifest', s: 'correctness_certificate {' },
    { t: 'manifest', s: '  chain:    "full" · tracks_verified: 16' },
    { t: 'manifest', s: '  token:    0x46726486cfb1b21a' },
    { t: 'manifest', s: '  standard: Track-TT / DO-330_TQL-2 / CE-EAL7' },
    { t: 'manifest', s: '}' },
  ]

  const MANIFESTS = [
    ['identity_manifest',         'Source fingerprint · 0x64a8c3a03692b551 · tamper-evident chain'],
    ['memory_manifest',           'MISRA-C Rule 20.4 satisfied · structural zero-heap'],
    ['stack_manifest',            'MISRA-C Rule 17.2 · stack depth bound verification'],
    ['wcet_manifest',             'DO-178C Level A · compile-time static budget timing'],
    ['power_manifest',            'DO-160 · MIL-STD-461 · micro-allocated power envelope'],
    ['interrupt_manifest',        'IEC 61508 SIL4 · worst-case interrupt response safety'],
    ['timing_manifest',           'FIPS 140-3 · NSA Suite B · constant-time loop evaluation'],
    ['cxx_annotation_manifest',   'C/C++ sidecar processing · zero source modification required'],
    ['verification_manifest',     'DO-333 FM · machine-verifiable proof obligations discharged'],
    ['attestation_manifest',      'NIST SP 800-193 · TCG TPM 2.0 · compile-time token generation'],
    ['rtos_manifest',             'Liu & Layland utilization bound enforced structurally'],
    ['temporal_manifest',         'LTL call-graph ordering constraints verified'],
    ['protocol_manifest',         'ARINC 429 · compile-time transition reachability'],
    ['standards_manifest',        'Cross-standard compatibility verification lattice'],
    ['mte_manifest',              'ARM MTE v8.5-A · compile-time memory tagging invariants'],
    ['bpc_manifest',              'Magic bytes 0x41455448 · BPC-1.0 verification spec'],
    ['privacy_manifest',          'Differential privacy budget mapping · epsilon-budget checks'],
    ['residency_manifest',        'GDPR Art.44 cross-border transfer · CLOUD Act jurisdiction restrictions'],
    ['retention_manifest',        'GDPR Art.5(1)(e) storage limitation · structural expiry tagging'],
    ['model_card_manifest',       'EU AI Act Art.13 compliance · bias assessment audits'],
    ['explainability_manifest',   'EU AI Act Art.17 transparency framework · SHAP/LIME metrics'],
    ['ai_output_manifest',        'Bell-LaPadula ML output security classification inheritance'],
    ['provenance_manifest',       'SLSA Level 3 build provenance mapping · toolchain footprints'],
    ['dependency_manifest',       'EO 14028 software supply chain security propagation checks'],
    ['inference_manifest',        'AI-driven compile-time invariant logical deductions · Track RR'],
    ['gap_manifest',              'Structural manifest chain completeness analysis · Track SS'],
    ['correctness_certificate',   'Track TT capstone · independently checkable structured certificate'],
  ]

  const STANDARDS = [
    ['DO-178C Level A',     'Aviation firmware compliance · formal methods verification bounds'],
    ['ISO 26262 ASIL-D',    'Automotive functional safety · strict hardware risk allocation'],
    ['IEC 62443 SL4',       'Industrial automation control system infrastructure tracking'],
    ['IEC 61508 SIL4',      'Functional safety validation across electronic command platforms'],
    ['Common Criteria EAL7','Highest-assurance evaluation criteria · formal verification proofs'],
    ['FIPS 140-3',          'Cryptographic boundary checks · zero secret-dependent branches'],
    ['NSA Suite B / CNSA',  'Constant-time execution architecture · timing side-channel blocking'],
    ['NIST FIPS 203–205',   'Post-quantum signature and encapsulation enforcement mandates'],
    ['NIST SP 800-193',     'Platform firmware resilience standard checking'],
    ['MIL-STD-461',         'Electromagnetic compatibility verification constraints for defense assets'],
    ['DO-333 FM',           'Formal methods supplementary certification tracks for aviation platforms'],
    ['MISRA-C 2012',        'Embedded system reliability lints · prohibition of rules like heap allocation'],
    ['EO 14028 / SBOM',     'US Executive Order on software supply chain transparency tracking'],
    ['ARINC 429',           'Aeronautical protocol state machine validation rules'],
    ['GDPR Art.5 & 44',     'Sovereign privacy regulations · regional data residency constraints'],
    ['EU AI Act Art.13/17', 'Trustworthy artificial intelligence · mandatory explainability and bias tracking'],
    ['SLSA Level 3',        'Build environment provenance mapping and toolchain authentication'],
    ['ARM MTE v8.5-A',      'Hardware memory tagging loops · prevention of spatial overflow vulnerabilities'],
  ]

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
              >
                [ internal ]
              </Link>
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
                <span className="stat-num">17</span>
                <span className="stat-lbl">cert manifests</span>
              </div>
              <div className="stat-cell">
                <span className="stat-num">0.11ms</span>
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
          <h2 className="section-title">17 simultaneous certification tracks. One compilation. Milliseconds, not runtime.</h2>
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
              <h3 className="milestone-heading">17 certification manifests</h3>
              <p className="milestone-body">
                Single compilation produces simultaneous machine-verifiable certification
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
                Aetherrate v0.2.0 achieves 2.2ms median certification latency across
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
              <h3 className="mil
