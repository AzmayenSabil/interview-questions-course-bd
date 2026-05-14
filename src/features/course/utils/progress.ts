import type { Topic, TopicProgress, OverallProgress } from '@/features/course/types/course.types'

export function calcTopicProgress(topic: Topic, completed: Record<string, boolean>): TopicProgress {
  const total = topic.questions.length
  const done = topic.questions.filter((q) => Boolean(completed[q.id])).length
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0
  return { topicId: topic.id, completed: done, total, percentage, isComplete: done === total }
}

export function calcOverallProgress(
  topics: Topic[],
  completed: Record<string, boolean>,
): OverallProgress {
  const total = topics.reduce((sum, t) => sum + t.questions.length, 0)
  const done = topics.reduce(
    (sum, t) => sum + t.questions.filter((q) => Boolean(completed[q.id])).length,
    0,
  )
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0
  return { completed: done, total, percentage }
}

export function isTopicUnlocked(
  topic: Topic,
  allTopics: Topic[],
  completed: Record<string, boolean>,
  threshold: number,
): boolean {
  const withQuestions = allTopics.filter((t) => t.questions.length > 0)
  const idx = withQuestions.findIndex((t) => t.id === topic.id)
  if (idx <= 0) return true
  const prev = withQuestions[idx - 1]
  if (!prev) return true
  const { percentage } = calcTopicProgress(prev, completed)
  return percentage >= threshold * 100
}
