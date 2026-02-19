// app/layout.tsx
// Root layout — wraps every page in the app.
// Sets up the Inter font (from Google Fonts via Next.js) and global styles.

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load Inter font — this is the recommended font from our design guidelines
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Club Member Portal',
  description: 'A private portal for club members to connect, share, and collaborate.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
