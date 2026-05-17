'use client'

import { useState } from 'react'
import { StatCard } from '@/components/course/StatCard'
import { TopicCard } from '@/components/course/TopicCard'
import { useOverallProgress } from '@/features/course/hooks/useTopicProgress'
import type { CourseData } from '@/features/course/types/course.types'

interface HomeViewProps {
  data: CourseData
}

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

function CreditsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Credits"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Top gradient strip */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />

        <div className="p-6 space-y-6">
          {/* Close */}
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

          {/* Thank you section */}
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

          {/* Built by section */}
          <div className="rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base" aria-hidden="true">
                ⌨️
              </span>
              <p className="text-sm font-semibold text-foreground">Azmayen Fayek Sabil</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sole developer of this platform — designed and built the entire course experience,
              from data pipeline to UI, from scratch.
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

export function HomeView({ data }: HomeViewProps) {
  const topicsWithQuestions = data.topics.filter((t) => t.questions.length > 0)
  const progress = useOverallProgress(topicsWithQuestions)
  const [creditsOpen, setCreditsOpen] = useState(false)

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-stretch">
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

      {/* ── Credits banner ── */}
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

      {/* ── Credits modal ── */}
      {creditsOpen && <CreditsModal onClose={() => setCreditsOpen(false)} />}
    </div>
  )
}
