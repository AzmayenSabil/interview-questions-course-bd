export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  title: string
  company: string
  sourceFile: string
  topic: string
  content: string
  hasAnswer: boolean
  difficulty: Difficulty
  ojUrl: string | null
}

export interface Topic {
  id: string
  name: string
  icon: string
  order: number
  description: string
  keywords: string[]
  questions: Question[]
}

export interface GuideSection {
  title: string
  body: string
}

export interface Guide {
  id: string
  title: string
  sections: GuideSection[]
}

export interface CourseStats {
  totalQuestions: number
  totalTopics: number
  totalCompanies: number
}

export interface CourseData {
  version: number
  generatedAt: string
  stats: CourseStats
  topics: Topic[]
  guides: Guide[]
}

export interface TopicProgress {
  topicId: string
  completed: number
  total: number
  percentage: number
  isComplete: boolean
}

export interface OverallProgress {
  completed: number
  total: number
  percentage: number
}
