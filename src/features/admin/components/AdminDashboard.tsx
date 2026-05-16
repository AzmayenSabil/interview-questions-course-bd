import type { Stats } from '@/lib/analyticsStore'

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-1">{value.toLocaleString()}</p>
    </div>
  )
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function uaShort(ua: string): string {
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Unknown'
}

interface CourseStats {
  totalTopics: number
  totalQuestions: number
  totalCompanies: number
}

interface Props {
  stats: Stats
  courseStats: CourseStats
}

export function AdminDashboard({ stats, courseStats }: Props) {
  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Site Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visitor analytics &amp; course overview
          </p>
        </div>
        <a
          href="/api/admin/logout"
          className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 transition-colors"
        >
          Logout
        </a>
      </div>

      {/* Visitor stats */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Visitor Stats
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="All-time views" value={stats.total} />
          <StatCard label="Today" value={stats.today} />
          <StatCard label="This week" value={stats.thisWeek} />
          <StatCard label="Unique sessions" value={stats.uniqueSessions} />
          <StatCard label="Sessions today" value={stats.uniqueSessionsToday} />
        </div>
      </section>

      {/* Course stats */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Course Content
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Topics" value={courseStats.totalTopics} />
          <StatCard label="Questions" value={courseStats.totalQuestions} />
          <StatCard label="Companies" value={courseStats.totalCompanies} />
        </div>
      </section>

      {/* Top pages */}
      {stats.topPages.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Top Pages
          </h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Page</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.map(({ page, count }, i) => (
                  <tr key={page} className={i % 2 === 0 ? '' : 'bg-muted/20'}>
                    <td className="px-4 py-2 font-mono text-xs text-foreground truncate max-w-[240px]">
                      {page}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums text-foreground">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recent visits */}
      {stats.recent.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recent Visits
          </h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">When</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Page</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                    Browser
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((v, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'bg-muted/20'}>
                    <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                      {timeAgo(v.ts)}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-foreground truncate max-w-[200px]">
                      {v.path}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{uaShort(v.ua)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {stats.total === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No visits recorded yet. Data appears once someone visits the site.
        </p>
      )}
    </div>
  )
}
