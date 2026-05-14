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
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">🇧🇩 Interview BD Course</h1>
        <p className="mt-2 text-muted-foreground">
          Topic-wise preparation for Bangladeshi tech company interviews
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard value={data.stats.totalQuestions} label="Questions" />
        <StatCard value={data.stats.totalTopics} label="Topics" />
        <StatCard value={data.stats.totalCompanies} label="Companies" />
        <StatCard value={`${progress.percentage}%`} label="Your Progress" />
      </div>

      {/* Topic grid */}
      <div>
        <h2 className="text-base font-bold mb-4">All Topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {topicsWithQuestions.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  )
}
