// app/layout.tsx
// Root layout — sets up Google Fonts (Orbitron, Exo 2, Share Tech Mono) and metadata.
// These fonts form the "Cyber Blue Matrix" design system.

import type { Metadata } from 'next'
import { Orbitron, Exo_2, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

// Heading font — used for titles and emphasis
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['700', '900'],
})

// Body font — used for paragraphs and general text
const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  weight: ['300', '400', '700'],
})

// Monospace font — used for labels, dates, and section markers
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'IIMS Cybersecurity Club',
  description: 'Securing the Digital Future — IIMS College, Kathmandu, Nepal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${orbitron.variable} ${exo2.variable} ${shareTechMono.variable} font-[var(--font-exo2)] antialiased bg-[#0D0D0D] text-white`}>
        {children}
      </body>
    </html>
  )
}
