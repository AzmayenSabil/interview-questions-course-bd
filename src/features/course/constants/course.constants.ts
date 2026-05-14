export const COURSE_QUERY_KEY = ['course'] as const

export const UNLOCK_THRESHOLD = 0.5

export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
} as const

export const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
} as const
