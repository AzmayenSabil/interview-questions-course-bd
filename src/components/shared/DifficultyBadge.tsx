import { Badge } from '@/components/ui/badge'
import { DIFFICULTY_LABELS } from '@/features/course/constants/course.constants'
import type { Difficulty } from '@/features/course/types/course.types'

interface DifficultyBadgeProps {
  difficulty: Difficulty
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return <Badge variant={difficulty}>{DIFFICULTY_LABELS[difficulty]}</Badge>
}
