'use client'

import { ThemeProvider } from 'next-themes'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
