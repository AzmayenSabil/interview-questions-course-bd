'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { TopicView } from '@/features/course/components/TopicView'
import { TopicViewSkeleton } from '@/components/shared/CourseSkeletons'
import { useCourseData } from '@/features/course/hooks/useCourseData'

interface TopicPageProps {
  params: Promise<{ topicId: string }>
}

export default function TopicPage({ params }: TopicPageProps) {
  const { topicId } = use(params)
  const { data, isLoading, isError, error } = useCourseData()

  if (isLoading) return <TopicViewSkeleton />

  if (isError) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <span className="text-5xl mb-4" aria-hidden="true">
          ❌
        </span>
        <h2 className="text-lg font-semibold mb-2">Failed to load course data</h2>
        <p className="text-sm text-muted-foreground">{(error as Error)?.message}</p>
      </div>
    )
  }

  if (!data) return null

  const topic = data.topics.find((t) => t.id === topicId)
  if (!topic) notFound()

  return <TopicView topic={topic} data={data} />
}
