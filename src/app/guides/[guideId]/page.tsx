'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { GuideView } from '@/features/course/components/GuideView'
import { useCourseData } from '@/features/course/hooks/useCourseData'
import { Skeleton } from '@/components/ui/skeleton'

interface GuidePageProps {
  params: Promise<{ guideId: string }>
}

export default function GuidePage({ params }: GuidePageProps) {
  const { guideId } = use(params)
  const { data, isLoading, isError, error } = useCourseData()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <span className="text-5xl mb-4" aria-hidden="true">
          ❌
        </span>
        <p className="text-sm text-muted-foreground">{(error as Error)?.message}</p>
      </div>
    )
  }

  if (!data) return null

  const guide = data.guides.find((g) => g.id === guideId)
  if (!guide) notFound()

  return <GuideView guide={guide} />
}
