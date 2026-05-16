import { supabase } from './supabase'
import type { CourseData, Topic, Question, Difficulty } from '@/features/course/types/course.types'

// ---------------------------------------------------------------------------
// Types matching the DB columns (snake_case)
// ---------------------------------------------------------------------------

export interface TopicRow {
  id: string
  name: string
  icon: string
  display_order: number
  description: string
  keywords: string[]
  created_at: string
  updated_at: string
}

export interface TopicWithCount extends TopicRow {
  question_count: number
}

export interface QuestionRow {
  id: string
  topic_id: string
  company: string
  source_file: string
  title: string | null
  content: string
  has_answer: boolean
  difficulty: Difficulty
  oj_url: string | null
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Public reads (used by /api/course)
// ---------------------------------------------------------------------------

export async function getCourseData(): Promise<CourseData> {
  const [{ data: topicRows }, { data: questionRows }] = await Promise.all([
    supabase.from('topics').select('*').order('display_order'),
    supabase.from('questions').select('*'),
  ])

  const questionsByTopic: Record<string, Question[]> = {}
  for (const q of (questionRows ?? []) as QuestionRow[]) {
    if (!questionsByTopic[q.topic_id]) questionsByTopic[q.topic_id] = []
    ;(questionsByTopic[q.topic_id] as Question[]).push({
      id: q.id,
      title: q.title ?? '',
      company: q.company,
      sourceFile: q.source_file,
      topic: q.topic_id,
      content: q.content,
      hasAnswer: q.has_answer,
      difficulty: q.difficulty,
      ojUrl: q.oj_url,
    })
  }

  const topics: Topic[] = ((topicRows ?? []) as TopicRow[]).map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    order: t.display_order,
    description: t.description,
    keywords: t.keywords ?? [],
    questions: questionsByTopic[t.id] ?? [],
  }))

  const companies = new Set<string>()
  for (const t of topics) for (const q of t.questions) companies.add(q.company)

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    stats: {
      totalQuestions: topics.reduce((s, t) => s + t.questions.length, 0),
      totalTopics: topics.length,
      totalCompanies: companies.size,
    },
    topics,
    guides: [],
  }
}

export async function getCourseStats() {
  const [{ count: totalTopics }, { count: totalQuestions }, { data: companyRows }] =
    await Promise.all([
      supabase.from('topics').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('company'),
    ])

  const totalCompanies = new Set((companyRows ?? []).map((r) => r.company)).size

  return {
    totalTopics: totalTopics ?? 0,
    totalQuestions: totalQuestions ?? 0,
    totalCompanies,
  }
}

// ---------------------------------------------------------------------------
// Admin reads
// ---------------------------------------------------------------------------

export async function getTopicsWithCount(): Promise<TopicWithCount[]> {
  const { data: topics } = await supabase.from('topics').select('*').order('display_order')
  const { data: counts } = await supabase.from('questions').select('topic_id')

  const countMap: Record<string, number> = {}
  for (const r of counts ?? []) countMap[r.topic_id] = (countMap[r.topic_id] ?? 0) + 1

  return ((topics ?? []) as TopicRow[]).map((t) => ({
    ...t,
    question_count: countMap[t.id] ?? 0,
  }))
}

export async function getQuestionsByTopic(topicId: string): Promise<QuestionRow[]> {
  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at')
  return (data ?? []) as QuestionRow[]
}

// ---------------------------------------------------------------------------
// Admin writes — Topics
// ---------------------------------------------------------------------------

export async function createTopic(
  data: Omit<TopicRow, 'created_at' | 'updated_at'>,
): Promise<TopicRow> {
  const { data: row, error } = await supabase
    .from('topics')
    .insert({
      id: data.id,
      name: data.name,
      icon: data.icon,
      display_order: data.display_order,
      description: data.description,
      keywords: data.keywords,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return row as TopicRow
}

export async function updateTopic(
  id: string,
  data: Partial<Omit<TopicRow, 'id' | 'created_at' | 'updated_at'>>,
): Promise<TopicRow> {
  const { data: row, error } = await supabase
    .from('topics')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return row as TopicRow
}

export async function deleteTopic(id: string): Promise<void> {
  const { error } = await supabase.from('topics').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ---------------------------------------------------------------------------
// Admin writes — Questions
// ---------------------------------------------------------------------------

export async function createQuestion(
  data: Omit<QuestionRow, 'created_at' | 'updated_at'>,
): Promise<QuestionRow> {
  const { data: row, error } = await supabase
    .from('questions')
    .insert({
      id: data.id,
      topic_id: data.topic_id,
      company: data.company,
      source_file: data.source_file,
      title: data.title ?? null,
      content: data.content,
      has_answer: data.has_answer,
      difficulty: data.difficulty,
      oj_url: data.oj_url ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return row as QuestionRow
}

export async function updateQuestion(
  id: string,
  data: Partial<Omit<QuestionRow, 'id' | 'created_at' | 'updated_at'>>,
): Promise<QuestionRow> {
  const { data: row, error } = await supabase
    .from('questions')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return row as QuestionRow
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
