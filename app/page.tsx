/* ============================================================================
   AETHER homepage — ADDITIVE UPDATE (2026-09-04)
   Purpose: give BIND (and any) evaluators landing on aether-lang.org a video
   and a clear "what a pilot looks like" area, without touching the existing
   hero/canvas or any current section. THREE inserts only. Nothing else changes.

   Every factual claim below is drawn from what the page already states:
   working compiler, STM32 hardware results, two-board replication of the
   compiler-determined properties, reproducible builds, four US provisionals on
   file, pre-revenue / no pilots yet, not formally certified. No BIND naming,
   no partner-company names, no cost or ROI promises. Honesty rule preserved.
   ============================================================================ */


/* ── INSERT #1 · NAV LINK ─────────────────────────────────────────────────────
   In the <ul className="nav-links"> list, add this <li> immediately BEFORE:
       <li><a href="#contact">Contact</a></li>
   ---------------------------------------------------------------------------- */

        <li><a href="#partners">For partners</a></li>


/* ── INSERT #2 · INTRO VIDEO SECTION ─────────────────────────────────────────
   Paste this whole block immediately BEFORE the line:
       {/* HOW IT WORKS *​/}
   (i.e. right after the plain-terms section and its <hr className="divider" />)
   ---------------------------------------------------------------------------- */

      {/* INTRO VIDEO */}
      <section id="intro-video" style={{ textAlign: 'center' }}>
        <div className="section-eyebrow">watch</div>
        <h2 className="section-title">See it explained.</h2>
        <p className="section-sub" style={{ margin: '0 auto' }}>
          A short introduction to what Aether does &mdash; and why proving a
          property at build time is different from testing for it after the
          fact &mdash; in plain language.
        </p>
        <div style={{
          maxWidth: '820px', margin: '1.8rem auto 0', aspectRatio: '16 / 9',
          borderRadius: '12px', overflow: 'hidden',
          border: '1px solid rgba(120,150,140,.18)', background: '#0d1114',
        }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/nTkuMzQwG60"
            title="Aether — introduction"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          />
        </div>
      </section>
      <hr className="divider" />


/* ── INSERT #3 · FOR PARTNERS / "WHAT A PILOT LOOKS LIKE" SECTION ─────────────
   Paste this whole block immediately BEFORE the line:
       {/* MISSION *​/}
   (i.e. right after the Standards section closes, before the dark Mission block)
   ---------------------------------------------------------------------------- */

      <hr className="divider" />
      {/* FOR PARTNERS — what a design-partner pilot looks like */}
      <section id="partners" style={{ maxWidth: 'none' }}>
        <div className="section-eyebrow">for evaluators &amp; design partners</div>
        <h2 className="section-title">What a pilot looks like.</h2>
        <p className="section-sub">
          If you build or certify safety-critical embedded software, the fastest
          way to judge Aether is to put it on one of your own modules. A
          design-partner pilot is deliberately small and concrete &mdash; one
          module, a measured before/after, and evidence you can re-verify
          yourself.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '1rem', marginTop: '1.8rem',
        }}>
          {[
            ['You choose the module',
             'You pick one real embedded module and the properties that matter for it — memory and timing safety, an energy or power budget, constant-time execution, information-flow security.'],
            ['We run Aether on it',
             'We compile it with those rules as build-time gates, alongside your team. A build that cannot be proven to obey the rules is not produced — the unsafe binary never exists.'],
            ['You get a measured before/after',
             'Which non-conforming builds Aether refuses that your current toolchain would have passed, plus a byte-reproducible manifest recording every rule enforced and its result.'],
            ['You verify it independently',
             'You keep the pinned build, its source, and a one-command verification battery, and rebuild the identical artifact in your own environment. You do not have to take our word for anything.'],
          ].map(([h, b]) => (
            <div key={h} style={{
              background: '#0d1114', border: '1px solid rgba(120,150,140,.18)',
              borderRadius: '12px', padding: '1.15rem 1.2rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: '15.5px', color: 'var(--gold)' }}>{h}</div>
              <p style={{ margin: '.5rem 0 0', color: '#c7d1d4', fontSize: '14px', lineHeight: 1.55 }}>{b}</p>
            </div>
          ))}
        </div>
        <p className="section-sub" style={{ marginTop: '1.6rem' }}>
          <b style={{ color: '#e8eef0' }}>Honest scope.</b> Aether acts at the
          embedded-software layer &mdash; it complements your existing analyzers,
          test suites, and asset monitoring rather than replacing them. It is a
          working compiler with results measured on real STM32 hardware and
          reproduced across two boards for the compiler-determined properties;
          it is pre-revenue with no pilots yet, and it has not been formally
          qualified or certified under any of the standards it maps to. A first
          pilot is exactly how we prove it on real work.
        </p>
        <div style={{ marginTop: '1.6rem' }}>
          <a
            href="mailto:contact@aether-lang.org?subject=Aether%20design-partner%20pilot"
            className="btn-primary"
          >start a pilot conversation</a>
        </div>
      </section>
