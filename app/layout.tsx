// app/layout.tsx — Root layout: Inter font, premium minimal colors
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IIMS Cybersecurity Club',
  description: 'The premier cybersecurity club at IIMS College, Kathmandu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#FAFAFA] text-[#111827] antialiased">
        {children}
      </body>
    </html>
  )
}
