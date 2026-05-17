import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from '@/providers/AppProviders'
import { AppShell } from '@/components/layouts/AppShell'
import { PageTracker } from '@/components/analytics/PageTracker'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Interview BD — Topic-wise Course',
  description: 'Topic-wise preparation for Bangladeshi tech company interviews',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProviders>
          <PageTracker />
          <AppShell>{children}</AppShell>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
