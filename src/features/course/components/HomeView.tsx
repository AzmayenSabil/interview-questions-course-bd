'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronDown, Check, X, Building2, ChevronRight, Trophy } from 'lucide-react'
import { StatCard } from '@/components/course/StatCard'
import { TopicCard } from '@/components/course/TopicCard'
import { useOverallProgress } from '@/features/course/hooks/useTopicProgress'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'
import type { CourseData, Topic, RankingEntry } from '@/features/course/types/course.types'

interface HomeViewProps {
  data: CourseData
}

// ── Icons ────────────────────────────────────────────────────────────────────

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3.5 h-3.5"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3.5 h-3.5"
    aria-hidden="true"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

// ── Credits modal ─────────────────────────────────────────────────────────────

function CreditsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Credits"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Credits &amp; Acknowledgements
            </p>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="rounded-2xl border border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">
                🙏
              </span>
              <p className="text-sm font-semibold text-foreground">Tamim Ehsan Bhai</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This entire project is inspired by and built upon the incredible work of Tamim Ehsan
              Bhai. His meticulous effort to document and compile Bangladeshi tech interview
              questions has been both the{' '}
              <span className="text-foreground font-medium">data source</span> and the{' '}
              <span className="text-foreground font-medium">motivation</span> behind this course.
              Huge respect and gratitude.
            </p>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <a
                href="https://www.linkedin.com/in/tamimehsan/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-indigo-400 transition-colors"
              >
                <LinkedInIcon /> LinkedIn
              </a>
              <a
                href="https://tamimehsan.github.io/interview-questions-bangladesh/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-indigo-400 transition-colors"
              >
                <GitHubIcon /> Interview Questions BD
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">
                ⌨️
              </span>
              <p className="text-sm font-semibold text-foreground">Azmayen Fayek Sabil</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sole developer of this platform — designed and built the entire course experience,
              from data pipeline to UI, from scratch. Obviously using AI. Mostly Claude, but
              let&apos;s not get into that.
            </p>
            <a
              href="https://www.linkedin.com/in/azmayensabil/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/60 dark:border-indigo-700/50 bg-white/60 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-indigo-950/70 transition-colors"
            >
              <LinkedInIcon /> Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Company filter ────────────────────────────────────────────────────────────

function CompanyFilter({
  companies,
  selected,
  onChange,
}: {
  companies: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  function toggle(company: string) {
    if (selected.includes(company)) {
      onChange(selected.filter((c) => c !== company))
    } else {
      onChange([...selected, company])
    }
  }

  const label =
    selected.length === 0
      ? 'All Companies'
      : `${selected.length} ${selected.length === 1 ? 'company' : 'companies'}`

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-200',
          selected.length > 0
            ? 'border-indigo-400/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
            : 'border-border/60 bg-muted/40 hover:bg-muted/70 text-foreground',
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Building2 className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          aria-label="Clear company filter"
          className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label="Filter by company"
          className={cn(
            'absolute top-full left-0 mt-2 z-50 w-60 rounded-2xl border border-border/60',
            'bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-150',
          )}
        >
          <div className="p-2 max-h-72 overflow-y-auto space-y-0.5">
            {selected.length > 0 && (
              <button
                onClick={() => {
                  onChange([])
                  setOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
            {companies.map((company) => {
              const active = selected.includes(company)
              return (
                <button
                  key={company}
                  role="option"
                  aria-selected={active}
                  onClick={() => toggle(company)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'hover:bg-muted/60 text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border shrink-0 transition-colors',
                      active ? 'border-indigo-500 bg-indigo-500' : 'border-border',
                    )}
                  >
                    {active && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span className="truncate">{company}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Leaderboard modal ─────────────────────────────────────────────────────────

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function RankCell({ rank, isMe }: { rank: number; isMe: boolean }) {
  return (
    <td className="py-3 pl-4 pr-2 w-14 shrink-0">
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={cn(
            'tabular-nums leading-none',
            rank <= 3 ? 'text-base' : 'text-xs font-bold text-muted-foreground',
          )}
        >
          {rank <= 3 ? MEDAL[rank] : `#${rank}`}
        </span>
        {isMe && (
          <span className="text-[9px] font-extrabold text-indigo-500 dark:text-indigo-400 leading-none tracking-wide uppercase">
            you
          </span>
        )}
      </div>
    </td>
  )
}

function RankTableRow({ entry, isMe }: { entry: RankingEntry; isMe: boolean }) {
  return (
    <tr
      className={cn(
        'border-b border-border/40 last:border-0 transition-colors relative',
        isMe
          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-l-2 border-l-indigo-500'
          : 'border-l-2 border-l-transparent',
      )}
    >
      <RankCell rank={entry.rank} isMe={isMe} />

      <td className="py-3 px-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white select-none',
              isMe
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-indigo-400/60 ring-offset-1 ring-offset-background'
                : 'bg-gradient-to-br from-indigo-500 to-violet-600',
            )}
          >
            {entry.displayName.charAt(0).toUpperCase()}
          </span>
          <span
            className={cn('text-sm truncate', isMe ? 'font-bold text-foreground' : 'font-medium')}
          >
            {entry.displayName}
          </span>
        </div>
      </td>

      <td className="py-3 px-2 text-right tabular-nums text-xs text-muted-foreground font-medium whitespace-nowrap">
        {entry.completed}
        <span className="text-border/80 dark:text-border/60">/{entry.total}</span>
      </td>

      <td className="py-3 pl-2 pr-4 w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-border/50 overflow-hidden">
            <div
              className="h-full gradient-progress rounded-full"
              style={{ width: `${entry.percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold gradient-text tabular-nums w-8 text-right shrink-0">
            {entry.percentage}%
          </span>
        </div>
      </td>
    </tr>
  )
}

function LeaderboardModal({
  entries,
  loading,
  currentUserName,
  onClose,
}: {
  entries: RankingEntry[]
  loading: boolean
  currentUserName?: string
  onClose: () => void
}) {
  const top10 = entries.slice(0, 10)
  const userEntry = currentUserName
    ? entries.find((e) => e.displayName === currentUserName)
    : undefined
  const userBeyondTop10 = userEntry && userEntry.rank > 10

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Leaderboard"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border/60 bg-background/97 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Top gradient strip */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-indigo-500 to-violet-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <Trophy className="h-4.5 w-4.5 text-amber-500" strokeWidth={2} />
            <h2 className="text-base font-bold tracking-tight">Leaderboard</h2>
            {!loading && entries.length > 0 && (
              <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground tabular-nums">
                {entries.length} learners
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close leaderboard"
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-8 rounded bg-muted/60 animate-pulse" />
                  <div className="h-7 w-7 rounded-full bg-muted/60 animate-pulse shrink-0" />
                  <div className="h-4 flex-1 rounded bg-muted/60 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted/60 animate-pulse" />
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <span className="text-4xl mb-3" aria-hidden="true">
                🏆
              </span>
              <p className="text-sm font-semibold text-foreground">No rankings yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to complete questions and claim the top spot!
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="py-2.5 pl-4 pr-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center w-10">
                    #
                  </th>
                  <th className="py-2.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left">
                    Learner
                  </th>
                  <th className="py-2.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                    Done
                  </th>
                  <th className="py-2.5 pl-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-left w-32">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {top10.map((entry) => (
                  <RankTableRow
                    key={entry.rank}
                    entry={entry}
                    isMe={entry.displayName === currentUserName}
                  />
                ))}

                {/* Current user below top 10 */}
                {userBeyondTop10 && userEntry && (
                  <>
                    <tr>
                      <td colSpan={4} className="py-0">
                        <div className="flex items-center gap-2 px-4 py-2">
                          <div className="flex-1 h-px bg-border/50" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 shrink-0">
                            your rank
                          </span>
                          <div className="flex-1 h-px bg-border/50" />
                        </div>
                      </td>
                    </tr>
                    <RankTableRow entry={userEntry} isMe={true} />
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Leaderboard trigger card ──────────────────────────────────────────────────

function LeaderboardTrigger({
  count,
  loading,
  top3,
  currentUserRank,
  onClick,
}: {
  count: number
  loading: boolean
  top3: RankingEntry[]
  currentUserRank?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-border/60',
        'bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30',
        'transition-all duration-200 group text-left',
      )}
    >
      {/* Trophy icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950/60 dark:to-yellow-950/40 shadow-sm">
        <Trophy className="h-4.5 w-4.5 text-amber-500" strokeWidth={2} />
      </div>

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-bold text-foreground">Leaderboard</span>
          {!loading && count > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {count} {count === 1 ? 'learner' : 'learners'} competing
            </span>
          )}
        </div>

        {/* Top 3 avatars or "You are rank N" */}
        {!loading && top3.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex -space-x-1.5">
              {top3.map((e) => {
                const isMe = !!currentUserRank && e.rank === currentUserRank
                return (
                  <span
                    key={e.rank}
                    title={isMe ? 'You' : e.displayName}
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2 bg-gradient-to-br from-indigo-500 to-violet-600 text-[9px] font-bold text-white select-none',
                      isMe
                        ? 'border-indigo-400 ring-1 ring-indigo-400/70 scale-110 z-10'
                        : 'border-background',
                    )}
                  >
                    {e.displayName.charAt(0).toUpperCase()}
                  </span>
                )
              })}
            </div>
            {currentUserRank ? (
              <span className="text-[11px] text-muted-foreground">
                You&apos;re{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  #{currentUserRank}
                </span>
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                {MEDAL[1]} {top3[0]?.displayName}
                {top3.length > 1 && ` · ${MEDAL[2]} ${top3[1]?.displayName}`}
              </span>
            )}
          </div>
        )}
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  )
}

// ── HomeView ──────────────────────────────────────────────────────────────────

export function HomeView({ data }: HomeViewProps) {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [rankingLoading, setRankingLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/ranking')
      .then((r) => r.json())
      .then(({ ranking: r }: { ranking: RankingEntry[] }) => setRanking(r ?? []))
      .catch(console.error)
      .finally(() => setRankingLoading(false))
  }, [])

  const allTopicsWithQuestions = useMemo(
    () => data.topics.filter((t) => t.questions.length > 0),
    [data.topics],
  )

  const progress = useOverallProgress(allTopicsWithQuestions)

  const allCompanies = useMemo(() => {
    const set = new Set<string>()
    for (const t of data.topics) for (const q of t.questions) set.add(q.company)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [data.topics])

  const displayTopics = useMemo<Topic[]>(() => {
    if (selectedCompanies.length === 0) return allTopicsWithQuestions
    return allTopicsWithQuestions
      .map((t) => ({
        ...t,
        questions: t.questions.filter((q) => selectedCompanies.includes(q.company)),
      }))
      .filter((t) => t.questions.length > 0)
  }, [allTopicsWithQuestions, selectedCompanies])

  const filteredQuestionCount = useMemo(
    () => displayTopics.reduce((s, t) => s + t.questions.length, 0),
    [displayTopics],
  )

  const currentUserRank = user?.displayName
    ? ranking.find((e) => e.displayName === user.displayName)?.rank
    : undefined

  return (
    <div className="space-y-10">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-10 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50/60 to-cyan-50/40 dark:from-indigo-950/40 dark:via-violet-950/25 dark:to-cyan-950/10" />
        <div
          className="aurora-orb w-80 h-80 bg-indigo-400/25 dark:bg-indigo-500/15 -top-20 -left-16"
          style={{ animationDelay: '0s' }}
          aria-hidden="true"
        />
        <div
          className="aurora-orb w-72 h-72 bg-violet-400/20 dark:bg-violet-500/12 top-0 right-0"
          style={{ animationDelay: '-6s' }}
          aria-hidden="true"
        />
        <div
          className="aurora-orb w-56 h-56 bg-cyan-400/15 dark:bg-cyan-500/10 bottom-0 left-1/2"
          style={{ animationDelay: '-12s' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 rounded-3xl border border-indigo-200/60 dark:border-indigo-800/30 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 dark:border-indigo-700/50 bg-white/60 dark:bg-indigo-950/50 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Topic-wise Interview Preparation
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="gradient-text">Interview BD</span>
            <br />
            <span className="text-foreground">Course</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Structured, topic-wise preparation for Bangladeshi tech company interviews. Master every
            concept, one question at a time.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex-1 max-w-[160px] h-1.5 rounded-full bg-border/60 overflow-hidden">
              <div
                className="h-full gradient-progress rounded-full transition-all duration-700"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="text-sm font-bold gradient-text tabular-nums">
              {progress.percentage}%
            </span>
            <span className="text-xs text-muted-foreground">complete</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard value={data.stats.totalQuestions} label="Questions" />
          <StatCard value={data.stats.totalTopics} label="Topics" />
          <StatCard value={data.stats.totalCompanies} label="Companies" />
          <StatCard value={`${progress.percentage}%`} label="Your Progress" />
        </div>
      </section>

      {/* ── Leaderboard trigger ── */}
      <LeaderboardTrigger
        count={ranking.length}
        loading={rankingLoading}
        top3={ranking.slice(0, 3)}
        currentUserRank={currentUserRank}
        onClick={() => setLeaderboardOpen(true)}
      />

      {/* ── Topics grid ── */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-base font-bold tracking-tight shrink-0">All Topics</h2>
            {selectedCompanies.length > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {filteredQuestionCount} questions in {displayTopics.length}{' '}
                {displayTopics.length === 1 ? 'topic' : 'topics'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {selectedCompanies.length === 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {allTopicsWithQuestions.length} topics
              </span>
            )}
            <CompanyFilter
              companies={allCompanies}
              selected={selectedCompanies}
              onChange={setSelectedCompanies}
            />
          </div>
        </div>

        {displayTopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-4" aria-hidden="true">
              🏢
            </span>
            <p className="text-sm font-semibold text-foreground">
              No topics for selected companies
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try selecting different companies or{' '}
              <button
                onClick={() => setSelectedCompanies([])}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                clear the filter
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-stretch">
            {displayTopics.map((topic, i) => (
              <div
                key={topic.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <TopicCard topic={topic} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Credits ── */}
      <section className="pb-2">
        <button
          onClick={() => setCreditsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 group"
        >
          <span className="h-px flex-1 bg-border/40 group-hover:bg-border/60 transition-colors" />
          <span className="flex items-center gap-1.5 shrink-0">
            <span>Built by Azmayen</span>
            <span className="opacity-40">·</span>
            <span>Data &amp; inspiration: Tamim Ehsan Bhai</span>
            <span className="opacity-40">·</span>
            <span className="underline underline-offset-2 decoration-dotted">Credits</span>
          </span>
          <span className="h-px flex-1 bg-border/40 group-hover:bg-border/60 transition-colors" />
        </button>
      </section>

      {/* ── Modals ── */}
      {creditsOpen && <CreditsModal onClose={() => setCreditsOpen(false)} />}
      {leaderboardOpen && (
        <LeaderboardModal
          entries={ranking}
          loading={rankingLoading}
          currentUserName={user?.displayName}
          onClose={() => setLeaderboardOpen(false)}
        />
      )}
    </div>
  )
}
