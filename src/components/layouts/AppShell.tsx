import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background" id="main-content" tabIndex={-1}>
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-7 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
