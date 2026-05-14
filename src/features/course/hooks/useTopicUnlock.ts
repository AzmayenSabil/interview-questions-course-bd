'use client'

import { useMemo } from 'react'
import { useProgressStore } from '@/features/course/store/progressStore'
import { isTopicUnlocked } from '@/features/course/utils/progress'
import { UNLOCK_THRESHOLD } from '@/features/course/constants/course.constants'
import type { Topic } from '@/features/course/types/course.types'

export function useTopicUnlock(topic: Topic, allTopics: Topic[]) {
  const completed = useProgressStore((s) => s.completed)
  return useMemo(
    () => isTopicUnlocked(topic, allTopics, completed, UNLOCK_THRESHOLD),
    [topic, allTopics, completed],
  )
}
