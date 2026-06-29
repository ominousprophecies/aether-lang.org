import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aether — Compile-Time Certification for Safety-Critical Software',
  description: 'Aether enforces safety, security, and reliability as structural invariants before a single byte of machine code is generated. 49 patent tracks. 39 certification manifests. Under 1ms.',
  keywords: 'compile-time certification, DO-178C, ISO 26262, safety-critical software, formal verification, Aether compiler',
  icons: {
    icon: '/aetc.png',
    apple: '/aetc.png',
  },
  openGraph: {
    title: 'Aether — Compile-Time Certification',
    description: 'The software is either certified or it does not compile.',
    url: 'https://aether-lang.org',
    siteName: 'Aether',
    locale: 'en_CA',
    type: 'website',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://aether-lang.org'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.22.0/dist/tabler-icons.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
