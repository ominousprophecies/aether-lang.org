'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const TERM_LINES = [
  { t: 'cmd',      s: '$ cargo run --release' },
  { t: 'dim',      s: '   Compiling aether-lexer v8.0.0 ...' },
  { t: 'dim',      s: '   Finished release profile in 1.1s' },
  { t: 'dim',      s: '' },
  { t: 'dim',      s: '===== PROCESSING: missile_guidance.bru =====' },
  { t: 'pass',     s: '  [✓] Parser Phase Complete              0.011ms' },
  { t: 'pass',     s: '  [✓] Type-Checker: Low+Secret = REJECTED before codegen' },
  { t: 'pass',     s: '  [✓] Monomorphization   0.003ms  (3 instantiation(s))' },
  { t: 'pass',     s: '  [✓] Zero-Heap Certified   0 bytes  MISRA-C Dir 4.12/21.3' },
  { t: 'pass',     s: '  [✓] Stack Depth Verified  192b ≤ 2048b budget' },
  { t: 'pass',     s: '  [✓] Power Verified        285mW ≤ 500mW  MIL-STD-461' },
  { t: 'pass',     s: '  [✓] Interrupt Verified    2.5μs ≤ 50μs  IEC-61508' },
  { t: 'pass',     s: '  [✓] Constant-Time         no secret branches  FIPS-140-3' },
  { t: 'pass',     s: '  [✓] MLS Lattice           Bell-LaPadula+Biba model' },
  { t: 'pass',     s: '  [✓] Attestation Token     0x5ce1beb75a928c4c  RFC-9334' },
  { t: 'pass',     s: '  [✓] Correctness Cert (TT) machine-verifiable  PASS' },
  { t: 'pass',     s: '  [✓] GENXR Codegen Emit    0.019ms' },
  { t: 'dim',      s: '  ──────────────────────────────────────────' },
  { t: 'key',      s: '  Total: 0.037ms  (39 manifests · 440,919 aet bytes · 132 ops)' },
  { t: 'dim',      s: '' },
  { t: 'manifest', s: '// GENXR_V8.0 / STRICT_MODE' },
  { t: 'manifest', s: 'attestation_manifest {' },
  { t: 'manifest', s: '  token:    0x5ce1beb75a928c4c' },
  { t: 'manifest', s: '  chain:    39 blocks · depth 7' },
  { t: 'manifest', s: '  standard: NIST_SP_800-193 / TCG_TPM2.0' },
  { t: 'manifest', s: '}' },
]

const MANIFESTS: [string, string, ('declared')?][] = [
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
    <>
      <div className="glow-dot" aria-hidden="true" />

      {/* FLOATING Æ MARK — extruded treatment, v2.0
          Desktop: left side, 84px.  Mobile: right side, 56px.  Very narrow: hidden. */}
      <div className="floating-mark" aria-hidden="true">
        <img
          src="/AE_mark_extruded_512.png"
          alt=""
          className="floating-mark-img"
        />
      </div>

      {/* Responsive rules for the floating mark and grid layouts.
          Scoped by class name; overrides only fire below the given breakpoint. */}
      <style>{`
        .floating-mark {
          position: fixed;
          left: 1.5rem;
          right: auto;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          opacity: 0.88;
          filter: drop-shadow(0 0 14px rgba(57,255,20,0.4));
          pointer-events: none;
          user-select: none;
        }
        .floating-mark-img {
          width: 84px;
          height: auto;
          display: block;
        }
        /* Mobile: move mark to right, shrink */
        @media (max-width: 900px) {
          .floating-mark {
            left: auto;
            right: 1rem;
            opacity: 0.72;
          }
          .floating-mark-img {
            width: 56px;
          }
        }
        /* Very narrow screens: hide entirely (would crowd reading area) */
        @media (max-width: 480px) {
          .floating-mark {
            display: none;
          }
        }
        /* Card grids: force left-aligned single column below tablet size,
           so cards don't center-collapse into visually-orphaned islands. */
        @media (max-width: 720px) {
          .problem-grid,
          .manifest-grid,
          .standards-grid {
            grid-template-columns: 1fr !important;
            text-align: left;
          }
          .problem-card,
          .manifest-card,
          .std-card {
            text-align: left;
          }
          /* Section titles and eyebrows also left-align on mobile */
          .section-title,
          .section-eyebrow,
          .section-sub,
          .cta-title,
          .cta-sub {
            text-align: left !important;
          }
          /* CTA form grid: stack name/email vertically on mobile */
          .form-row-2col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className="main-nav">
        <a href="#" className="nav-mark">Æ AETHER</a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#manifests">Manifests</a></li>
          <li><a href="#standards">Standards</a></li>
          <li><a href="#verification">Verification</a></li>
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
          <div className="eyebrow">compile-time certification</div>
          <h1>The software is <span>either certified</span> or it does not compile.</h1>
          <p className="hero-desc">
            Aether enforces safety, security, and reliability as structural invariants before
            a single byte of machine code is generated. A program that violates a declared
            property cannot be compiled. There is no runtime check. There is no advisory
            warning. The program does not compile.
          </p>
          <div className="hero-stats">
            <div className="stat-cell">
              <span className="stat-num">46</span>
              <span className="stat-lbl">patent-track drafts</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">39</span>
              <span className="stat-lbl">cert manifests</span>
            </div>
            <div className="stat-cell">
              <span className="stat-num">37μs</span>
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
            <span className="term-title">aether v8.0 — GENXR_V8.0 / STRICT_MODE</span>
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
             '→ Aether: an attestation token (a keyed integrity hash over the complete manifest chain) is emitted at compile time. Any modification invalidates the token. Detected before execution.'],
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
        <h2 className="section-title">39 certification manifests. One compilation. Sub-millisecond.</h2>
        <p className="section-sub">Every Aether binary carries machine-verifiable certification manifest blocks, each independently checkable by the standalone verifier (aether-verify) — without the compiler or source code. Manifests are compile-time evidence artifacts, not third-party certifications.</p>
        <div className="manifest-grid">
          {MANIFESTS.map(([name, std, declared]) => (
            <div className="manifest-card" key={name} style={declared ? {opacity:.75} : undefined}>
              <div className="manifest-name">{name}</div>
              <div className="manifest-standard">{std}</div>
              {declared && (
                <div style={{
                  marginTop:'.45rem', display:'inline-block', padding:'.15rem .5rem',
                  border:'0.5px solid rgba(255,196,0,.5)', color:'rgba(255,196,0,.9)',
                  fontSize:'10px', letterSpacing:'.08em', textTransform:'uppercase',
                }}>declared — not yet implemented</div>
              )}
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

      <hr className="divider" />

      {/* VERIFICATION — every claim below maps to a hash-chained build serial */}
      <section id="verification">
        <div className="section-eyebrow">verified, not asserted</div>
        <h2 className="section-title">Four verification tiers. Two independent environments.</h2>
        <p className="section-sub">
          Every claim in this section is backed by an immutable, hash-chained build serial
          (SHA-256, each archive carrying its full source, fixtures, outputs, and a written
          validation-evidence record). Verification status as of serial 20260704023843.650787 — July 4, 2026:
        </p>
        <div className="standards-grid">
          {[
            ['Tier 1 — Deterministic hashes',
             'Every emitted artifact is byte-hashed. Twenty-two consecutive builds byte-identical across two platforms (Linux container and Windows/WSL2), with the Rust toolchain pinned via rust-toolchain.toml — cross-platform reproducibility is now an enforced invariant, not just an empirical one.'],
            ['Tier 2 — Register-level traces',
             'Emitted Thumb-2 is hand-verified register-by-register per change, with worked traces recorded in each serial’s validation evidence.'],
            ['Tier 3 — Reference assembler',
             'The complete emitted-assembly corpus (61 files, 130 golden manifest hashes) assembles clean under GNU arm-none-eabi-as 2.42, machine-checked on every gate — output validity is not an eyeball claim. Tool versions documented in TOOLCHAIN.md.'],
            ['Tier 4 — Execution on target architecture',
             '35 runtime value assertions pass on emulated Cortex-M4 (QEMU mps2-an386): arithmetic, bounds-proven array loops, struct operations, comparisons, control flow, calls, and signed-integer semantics — every documented computation executed and checked, reproduced in both environments. Distinguishing runtime tests included: the signed comparison -5 < 3 returns 1 (would be 0 under unsigned execution). 187 fixtures total across the corpus.'],
          ].map(([name, desc]) => (
            <div className="std-card" key={name}>
              <div className="std-name">{name}</div>
              <div className="std-desc">{desc}</div>
            </div>
          ))}
        </div>
        <p className="section-sub" style={{marginTop:'1.5rem'}}>
          The language core these tiers verify: nested expressions, arrays and loops with
          compile-time bounds proofs (a for-range is itself the proof — no runtime checks),
          structs with initialization-completeness and field-existence proofs, functions with
          parse-time arity- and type-proven calls, by-reference struct passing observed
          live at runtime, signed and unsigned integer arithmetic with strict mixing rejection
          (I32/U32 combinations refused at parse), module-level overflow policy
          (#overflow[policy: reject|wrap|saturate|trap], fail-closed default with compile-time
          constant-fold detection), and a const keyword with mandatory type annotation for
          compile-time known values. Emulated-target results are not silicon results; hardware
          calibration is a stated, pending step.
        </p>
        <p className="section-sub" style={{marginTop:'1.5rem'}}>
          Discriminating power is itself measured: mutation-testing probes deliberately
          corrupt emitted assembly before rebuilding the harness, and the runtime
          assertions must fail. If a mutated build passes, the assertions were tautologies.
          Current status: four independent assertion classes have proven discriminating power
          across arithmetic, comparison codes, array bounds offsets, and struct field offsets —
          not just green checkmarks.
        </p>
        <p className="section-sub" style={{marginTop:'1.5rem', opacity:0.9}}>
          Every compile emits over 8,600 lines of verification output — parser phase, type-checker,
          monomorphization, the full certification manifest chain, round-trip decompilation,
          hardware constraint lint, and formal-methods proof obligations, each with a
          machine-verifiable pass or fail.
          Aether does not ask you to trust the output; it produces the evidence.
        </p>
      </section>

      {/* CONTACT */}
      <div className="cta-section" id="contact">
        <h2 className="cta-title">Your C code. Aether certification manifests.<br/>No rewrites.</h2>
        <p className="cta-sub">Add a sidecar declaration file alongside your existing C/C++ firmware. Aether enforces the properties you declare and produces a machine-verifiable certification manifest in under one millisecond.</p>

        <div className="contact-form">
          {formState === 'ok' ? (
            <p className="form-success">✓ Message received. We'll be in touch within one business day.</p>
          ) : (
            <form onSubmit={submitContact}>
              <div className="form-row-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
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

      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem 3rem',
        borderTop: '1px solid rgba(57,255,20,0.06)',
      }}>
        <div style={{
          fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
          color: 'var(--green)',
          textShadow: '0 0 32px rgba(57,255,20,0.45)',
          letterSpacing: '0.08em',
          lineHeight: 1.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35em',
          flexWrap: 'wrap',
        }}>
          <span style={{fontFamily:"'Space Mono', monospace", fontSize:'0.6em', opacity:.7}}>lim</span>
          <span style={{fontFamily:"'Cinzel', serif", fontSize:'0.5em', opacity:.5}}>t → ∞</span>
          <span style={{fontFamily:"'Cinzel Decorative', serif", fontSize:'1.1em', letterSpacing:'0.05em'}}>Æ</span>
          <span style={{fontFamily:"'Cinzel', serif", opacity:.5}}>/</span>
          <span style={{fontFamily:"'Cinzel', serif", fontStyle:'italic'}}>t</span>
          <span style={{fontFamily:"'Space Mono', monospace", opacity:.6}}>→</span>
          <span style={{fontFamily:"'Cinzel', serif", fontStyle:'italic'}}>c</span>
        </div>
        <p style={{
          marginTop: '1.4rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          color: 'var(--silver)',
          letterSpacing: '0.1em',
          maxWidth: '520px',
          margin: '1.4rem auto 0',
          lineHeight: 1.7,
          opacity: 0.7,
        }}>
          As compile time <em style={{color:'var(--green)',fontStyle:'normal'}}>t</em> approaches
          zero, the ratio of Aether work <em style={{color:'var(--green)',fontStyle:'normal'}}>Æ</em> to
          time converges toward <em style={{color:'var(--green)',fontStyle:'normal'}}>c</em> —
          the speed of light. Every compiler generation closes the gap.
        </p>
      </div>

      <footer>
        <span className="footer-mark">Æ AETHER</span>
        <span className="footer-copy">© 2026 Emilio R. Bruno · Aether-Lang.org Inc. (CBCA federal) · Kamloops, BC, Canada · Patent applications in preparation (CA, US — not yet filed) · AI assistance (Claude/Anthropic) disclosed</span>
        <span className="footer-copy" style={{marginTop:'.35rem',opacity:.5,fontSize:'10px'}}>site build · 2026-07-04 05:20 UTC · serial 20260704023843.650787</span>
      </footer>
    </>
  )
}
