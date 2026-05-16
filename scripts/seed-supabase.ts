/**
 * Seeds Supabase with data from src/data/course.json.
 * Run once after creating the DB schema:
 *
 *   npx tsx scripts/seed-supabase.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = val
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment / .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  // ws required for Node.js < 22 (no native WebSocket)
  realtime: { transport: ws },
})

// ---------------------------------------------------------------------------
// Load course.json
// ---------------------------------------------------------------------------

interface RawQuestion {
  id: string
  title?: string
  company?: string
  sourceFile?: string
  topic?: string
  content?: string
  hasAnswer?: boolean
  difficulty?: 'easy' | 'medium' | 'hard'
  ojUrl?: string | null
}

interface RawTopic {
  id: string
  name: string
  icon?: string
  order?: number
  description?: string
  keywords?: string[]
  questions?: RawQuestion[]
}

interface RawCourse {
  topics?: RawTopic[]
}

const courseJsonPath = path.join(root, 'src', 'data', 'course.json')
const course: RawCourse = JSON.parse(fs.readFileSync(courseJsonPath, 'utf-8'))
const topics: RawTopic[] = course.topics ?? []

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function upsert(table: string, rows: Record<string, unknown>[], label: string) {
  if (rows.length === 0) return
  const BATCH = 200
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`Error upserting ${label} batch ${i}:`, error.message)
      process.exit(1)
    }
    inserted += batch.length
    process.stdout.write(`\r  ${label}: ${inserted}/${rows.length}`)
  }
  console.log()
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log('Seeding Supabase from course.json…\n')

  // Topics
  const topicRows = topics.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon ?? '📚',
    display_order: t.order ?? 0,
    description: t.description ?? '',
    keywords: t.keywords ?? [],
  }))
  process.stdout.write('  topics: 0/' + topicRows.length)
  await upsert('topics', topicRows, 'topics')

  // Questions (flatten from all topics)
  const questionRows = topics.flatMap((t) =>
    (t.questions ?? []).map((q) => ({
      id: q.id,
      topic_id: t.id,
      company: q.company ?? '',
      source_file: q.sourceFile ?? '',
      title: q.title ?? null,
      content: q.content ?? '',
      has_answer: q.hasAnswer ?? false,
      difficulty: q.difficulty ?? 'medium',
      oj_url: q.ojUrl ?? null,
    })),
  )
  process.stdout.write('  questions: 0/' + questionRows.length)
  await upsert('questions', questionRows, 'questions')

  console.log(`\nDone! Seeded ${topicRows.length} topics and ${questionRows.length} questions.`)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
