// app/layout.tsx
// Root layout — loads Inter (body) and JetBrains Mono (headings/labels) fonts.
// Stealth Terminal design system — pure black background, no blur/glow.

import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Body font — paragraphs, descriptions, form fields
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '600'],
})

// Mono font — headings, labels, numbers, dates, code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-[var(--font-inter)] antialiased bg-black text-[#F8FAFC]`}>
        {children}
      </body>
    </html>
  )
}
