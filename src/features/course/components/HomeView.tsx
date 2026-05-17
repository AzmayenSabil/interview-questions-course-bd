'use client'

import { StatCard } from '@/components/course/StatCard'
import { TopicCard } from '@/components/course/TopicCard'
import { useOverallProgress } from '@/features/course/hooks/useTopicProgress'
import type { CourseData } from '@/features/course/types/course.types'

interface HomeViewProps {
  data: CourseData
}

export function HomeView({ data }: HomeViewProps) {
  const topicsWithQuestions = data.topics.filter((t) => t.questions.length > 0)
  const progress = useOverallProgress(topicsWithQuestions)

  return (
    <div className="space-y-10">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl px-6 py-12 md:px-10 md:py-16">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50/60 to-cyan-50/40 dark:from-indigo-950/40 dark:via-violet-950/25 dark:to-cyan-950/10" />

        {/* Aurora orbs */}
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

        {/* Subtle noise grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-3xl border border-indigo-200/60 dark:border-indigo-800/30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-lg mx-auto">
          {/* Live pill */}
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

          {/* Mini progress indicator */}
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

      {/* ── Stats bento ── */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard value={data.stats.totalQuestions} label="Questions" />
          <StatCard value={data.stats.totalTopics} label="Topics" />
          <StatCard value={data.stats.totalCompanies} label="Companies" />
          <StatCard value={`${progress.percentage}%`} label="Your Progress" />
        </div>
      </section>

      {/* ── Topics grid ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold tracking-tight">All Topics</h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {topicsWithQuestions.length} topics
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {topicsWithQuestions.map((topic, i) => (
            <div
              key={topic.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <TopicCard topic={topic} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
