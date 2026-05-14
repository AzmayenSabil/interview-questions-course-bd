import { z } from 'zod'

export const DifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const QuestionSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  sourceFile: z.string(),
  topic: z.string().min(1),
  content: z.string().min(1),
  hasAnswer: z.boolean(),
  difficulty: DifficultySchema,
  ojUrl: z.string().url().nullable(),
})

export const TopicSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().int().nonnegative(),
  description: z.string(),
  keywords: z.array(z.string()),
  questions: z.array(QuestionSchema),
})

export const GuideSectionSchema = z.object({
  title: z.string().min(1),
  body: z.string(),
})

export const GuideSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  sections: z.array(GuideSectionSchema),
})

export const CourseStatsSchema = z.object({
  totalQuestions: z.number().int().nonnegative(),
  totalTopics: z.number().int().nonnegative(),
  totalCompanies: z.number().int().nonnegative(),
})

export const CourseDataSchema = z.object({
  version: z.number().int().positive(),
  generatedAt: z.string(),
  stats: CourseStatsSchema,
  topics: z.array(TopicSchema),
  guides: z.array(GuideSchema).default([]),
})

export const ProgressStateSchema = z.object({
  version: z.number().int().positive(),
  completed: z.record(z.string(), z.boolean()),
})

export type ValidatedCourseData = z.infer<typeof CourseDataSchema>
export type ValidatedProgressState = z.infer<typeof ProgressStateSchema>
