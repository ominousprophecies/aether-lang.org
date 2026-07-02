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
    { t: 'dim',      s: '   Compiling aether-lexer v7.3.0 ...\n   Finished release profile in 1.1s\n' },
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
    { t: 'manifest', s: '// GENXR_V7.3 / STRICT_MODE\ncorrectness_certificate {\n  chain:    "full" · tracks_verified: 16\n  token:    0x46726486cfb1b21a\n  standard: Track-TT / DO-330_TQL-2 / CE-EAL7\n}' },
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
    ['verification_manifest',     'DO-333 FM · proof obligations discharged'],
    ['attestation_manifest',      'NIST SP 800-193 · TCG TPM 2.0 · token generation'],
    ['rtos_manifest',             'Liu & Layland utilization bound enforced structurally'],
    ['temporal_manifest',         'LTL call-graph ordering constraints verified'],
    ['protocol_manifest',         'ARINC 429 · transition reachability proofs'],
    ['standards_manifest',        'Cross-standard compatibility verification lattice'],
    ['mte_manifest',              'ARM MTE v8.5-A · memory tagging invariants'],
    ['bpc_manifest',              'Magic bytes 0x41455448 · BPC-1.0 verification spec'],
    ['privacy_manifest',          'Differential privacy budget mapping · epsilon-budget checks'],
    ['residency_manifest',        'GDPR Art.44 transfer · CLOUD Act jurisdiction restrictions'],
    ['retention_manifest',        'GDPR Art.5(1)(e) storage limit · structural expiry tagging'],
    ['model_card_manifest',       'EU AI Act Art.13 compliance · bias assessment audits'],
    ['explainability_manifest',   'EU AI Act Art.17 framework · SHAP/LIME metrics'],
    ['ai_output_manifest',        'Bell-LaPadula ML output security classification inheritance'],
    ['provenance_manifest',       'SLSA Level 3 build provenance · toolchain footprints'],
    ['dependency_manifest',       'EO 14028 software supply chain security propagation checks'],
    ['inference_manifest',        'AI compile-time invariant logical deductions · Track RR'],
    ['gap_manifest',              'Structural manifest chain completeness analysis · Track SS'],
    ['correctness_certificate',   'Track TT capstone · independently checkable structured certificate'],
  ]

  const STANDARDS = [
    ['DO-178C Level A',     'Aviation firmware compliance · formal methods bounds'],
    ['ISO 26262 ASIL-D',    'Automotive functional safety · strict hardware risk models'],
    ['IEC 62443 SL4',       'Industrial automation control infrastructure tracking'],
    ['IEC 61508 SIL4',      'Functional safety validation across hardware platforms'],
    ['Common Criteria EAL7','Highest-assurance evaluation · formal verification proofs'],
    ['FIPS 140-3',          'Cryptographic boundary checks · zero secret-dependent branches'],
    ['NSA Suite B / CNSA',  'Constant-time execution architecture · side-channel blocking'],
    ['NIST FIPS 203–205',   'Post-quantum signature and encapsulation mandates'],
    ['NIST SP 800-193',     'Platform firmware resilience standard checking'],
    ['MIL-STD-461',         'Electromagnetic compatibility verification constraints'],
    ['DO-333 FM',           'Formal methods supplementary aviation certification tracks'],
    ['MISRA-C 2012',        'Embedded safety lints · dynamic allocation prohibition'],
    ['EO 14028 / SBOM',     'US Executive Order supply chain transparency loops'],
    ['ARINC 429',           'Aeronautical protocol state machine validation rules'],
    ['GDPR Art.5 & 44',     'Sovereign privacy rules · regional residency constraints'],
    ['EU AI Act Art.13/17', 'Trustworthy AI · mandatory explainability and bias tracking'],
    ['SLSA Level 3',        'Build environment provenance mapping and toolchain authentication'],
    ['ARM MTE v8.5-A',      'Memory tagging loops · prevention of spatial overflows'],
  ]

  const MILESTONES = [
    { c: true,  h: "Machine code emission", b: "Aether v7.3 produces real ARM Cortex-M4 Thumb-2 binary from .bru source. Linked ELF: 12,436 bytes. Flashable binary: 668 bytes. Five WFI instructions confirmed in silicon at flash addresses 0x08000010, 0x0800004e, 0x08000070, 0x080001c8, 0x0800023a." },
    { c: true,  h: "17 certification manifests", b: "Single compilation produces simultaneous machine-verifiable certification manifests across 7 regulated industries — defence, aviation, automotive, medical, telecom, AI/ML, and critical infrastructure. 154 fixtures, 108 operations, 0 failures." },
    { c: true,  h: "44 patent tracks", b: "Core IP drafted as provisional application with 44 tracks and Umbrella Claim 0, including newly-drafted post-quantum algorithm enforcement and cryptographic downgrade defense tracks, pending counsel review. Tracks RR/SS/TT form the AI correctness pipeline." },
    { c: true,  h: "Millisecond-scale certification", b: "Aetherrate v0.2.0 achieves 2.2ms median certification latency across the Core 10 tracks — below the 13ms human unconscious perception threshold." },
    { c: false, h: "v8.0 — extern contracts", b: "#extern_contract directive binding HAL stubs to certification manifests. Real register allocation. Standalone aether-verify binary for TT correctness certificates independently checkable without the compiler." },
    { c: false, h: "NATO DIANA submission", b: "Defense Innovation Accelerator for the North Atlantic — dual-use deep-tech cohort. Targeting next available application cycle." }
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
    } catch { setFormState
