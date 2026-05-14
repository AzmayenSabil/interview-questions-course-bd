'use client'

import { useMemo } from 'react'
import { useProgressStore } from '@/features/course/store/progressStore'
import { calcTopicProgress, calcOverallProgress } from '@/features/course/utils/progress'
import type { Topic } from '@/features/course/types/course.types'

export function useTopicProgress(topic: Topic) {
  const completed = useProgressStore((s) => s.completed)
  return useMemo(() => calcTopicProgress(topic, completed), [topic, completed])
}

export function useOverallProgress(topics: Topic[]) {
  const completed = useProgressStore((s) => s.completed)
  return useMemo(() => calcOverallProgress(topics, completed), [topics, completed])
}
