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
                padding:'.4
