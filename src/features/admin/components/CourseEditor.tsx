'use client'

import { useEffect, useReducer, useState } from 'react'
import type { TopicWithCount, QuestionRow } from '@/lib/courseDb'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function randomId() {
  return `q-${Math.random().toString(36).slice(2, 8)}`
}

function difficultyColor(d: string) {
  if (d === 'easy') return 'text-green-600 dark:text-green-400'
  if (d === 'hard') return 'text-red-600 dark:text-red-400'
  return 'text-yellow-600 dark:text-yellow-400'
}

// ---------------------------------------------------------------------------
// Topic form state
// ---------------------------------------------------------------------------

interface TopicForm {
  id: string
  name: string
  icon: string
  display_order: string
  description: string
  keywords: string
}

function emptyTopicForm(): TopicForm {
  return { id: '', name: '', icon: '📚', display_order: '0', description: '', keywords: '' }
}

function topicToForm(t: TopicWithCount): TopicForm {
  return {
    id: t.id,
    name: t.name,
    icon: t.icon,
    display_order: String(t.display_order),
    description: t.description,
    keywords: (t.keywords ?? []).join('\n'),
  }
}

// ---------------------------------------------------------------------------
// Question form state
// ---------------------------------------------------------------------------

interface QuestionForm {
  id: string
  topic_id: string
  company: string
  title: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
  has_answer: boolean
  oj_url: string
  source_file: string
}

function emptyQuestionForm(topicId: string): QuestionForm {
  return {
    id: randomId(),
    topic_id: topicId,
    company: '',
    title: '',
    content: '',
    difficulty: 'medium',
    has_answer: false,
    oj_url: '',
    source_file: '',
  }
}

function questionToForm(q: QuestionRow): QuestionForm {
  return {
    id: q.id,
    topic_id: q.topic_id,
    company: q.company,
    title: q.title ?? '',
    content: q.content,
    difficulty: q.difficulty,
    has_answer: q.has_answer,
    oj_url: q.oj_url ?? '',
    source_file: q.source_file,
  }
}

// ---------------------------------------------------------------------------
// Modal state (discriminated union)
// ---------------------------------------------------------------------------

type Modal =
  | { type: 'none' }
  | { type: 'addTopic' }
  | { type: 'editTopic'; topic: TopicWithCount }
  | { type: 'addQuestion'; topicId: string }
  | { type: 'editQuestion'; question: QuestionRow }

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CourseEditor() {
  const [topics, setTopics] = useState<TopicWithCount[]>([])
  const [questions, setQuestions] = useState<Record<string, QuestionRow[]>>({})
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [topicForm, setTopicForm] = useState<TopicForm>(emptyTopicForm())
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestionForm(''))
  // force re-renders for toggled states
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  // ---- fetch topics --------------------------------------------------------

  async function fetchTopics() {
    setLoading(true)
    const res = await fetch('/api/admin/course/topics')
    if (res.ok) setTopics(await res.json())
    setLoading(false)
  }

  async function fetchQuestions(topicId: string) {
    const res = await fetch(`/api/admin/course/questions?topicId=${topicId}`)
    if (res.ok) {
      const rows = await res.json()
      setQuestions((prev) => ({ ...prev, [topicId]: rows }))
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch('/api/admin/course/topics')
      if (res.ok) setTopics(await res.json())
      setLoading(false)
    }
    load()
  }, [])

  // ---- expand / collapse ---------------------------------------------------

  async function toggleExpand(topicId: string) {
    const next = new Set(expanded)
    if (next.has(topicId)) {
      next.delete(topicId)
    } else {
      next.add(topicId)
      if (!questions[topicId]) await fetchQuestions(topicId)
    }
    setExpanded(next)
    forceUpdate()
  }

  // ---- open modals ---------------------------------------------------------

  function openAddTopic() {
    setTopicForm(emptyTopicForm())
    setErr(null)
    setModal({ type: 'addTopic' })
  }

  function openEditTopic(topic: TopicWithCount) {
    setTopicForm(topicToForm(topic))
    setErr(null)
    setModal({ type: 'editTopic', topic })
  }

  function openAddQuestion(topicId: string) {
    setQuestionForm(emptyQuestionForm(topicId))
    setErr(null)
    setModal({ type: 'addQuestion', topicId })
  }

  function openEditQuestion(q: QuestionRow) {
    setQuestionForm(questionToForm(q))
    setErr(null)
    setModal({ type: 'editQuestion', question: q })
  }

  function closeModal() {
    setModal({ type: 'none' })
    setErr(null)
  }

  // ---- save topic ----------------------------------------------------------

  async function saveTopic() {
    setSaving(true)
    setErr(null)
    const payload = {
      id: topicForm.id || slugify(topicForm.name),
      name: topicForm.name,
      icon: topicForm.icon,
      display_order: Number(topicForm.display_order),
      description: topicForm.description,
      keywords: topicForm.keywords
        .split('\n')
        .map((k) => k.trim())
        .filter(Boolean),
    }
    try {
      let res: Response
      if (modal.type === 'addTopic') {
        res = await fetch('/api/admin/course/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else if (modal.type === 'editTopic') {
        res = await fetch(`/api/admin/course/topics/${modal.topic.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error ?? 'Save failed')
        return
      }
      closeModal()
      await fetchTopics()
    } catch (e) {
      setErr(String(e))
    } finally {
      setSaving(false)
    }
  }

  // ---- delete topic --------------------------------------------------------

  async function deleteTopic(id: string) {
    if (!confirm('Delete this topic and ALL its questions? This cannot be undone.')) return
    const res = await fetch(`/api/admin/course/topics/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTopics((prev) => prev.filter((t) => t.id !== id))
      setExpanded((prev) => {
        const s = new Set(prev)
        s.delete(id)
        return s
      })
    }
  }

  // ---- save question -------------------------------------------------------

  async function saveQuestion() {
    setSaving(true)
    setErr(null)
    const payload = {
      id: questionForm.id,
      topic_id: questionForm.topic_id,
      company: questionForm.company,
      title: questionForm.title || null,
      content: questionForm.content,
      difficulty: questionForm.difficulty,
      has_answer: questionForm.has_answer,
      oj_url: questionForm.oj_url || null,
      source_file: questionForm.source_file,
    }
    try {
      let res: Response
      if (modal.type === 'addQuestion') {
        res = await fetch('/api/admin/course/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else if (modal.type === 'editQuestion') {
        res = await fetch(`/api/admin/course/questions/${modal.question.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error ?? 'Save failed')
        return
      }
      closeModal()
      await fetchQuestions(questionForm.topic_id)
      // refresh topic question count
      await fetchTopics()
    } catch (e) {
      setErr(String(e))
    } finally {
      setSaving(false)
    }
  }

  // ---- delete question -----------------------------------------------------

  async function deleteQuestion(q: QuestionRow) {
    if (!confirm('Delete this question?')) return
    const res = await fetch(`/api/admin/course/questions/${q.id}`, { method: 'DELETE' })
    if (res.ok) {
      setQuestions((prev) => ({
        ...prev,
        [q.topic_id]: (prev[q.topic_id] ?? []).filter((x) => x.id !== q.id),
      }))
      await fetchTopics() // refresh count
    }
  }

  // ---- render --------------------------------------------------------------

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Course Editor
        </h2>
        <button
          onClick={openAddTopic}
          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity font-medium"
        >
          + Add Topic
        </button>
      </div>

      {/* Topics table */}
      <div className="rounded-lg border border-border overflow-hidden">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
        ) : topics.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No topics yet. Add one to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-8">#</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-8">
                  Icon
                </th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Name</th>
                <th className="text-right px-3 py-2.5 font-medium text-muted-foreground w-16">
                  Qs
                </th>
                <th className="px-3 py-2.5 w-32" />
              </tr>
            </thead>
            <tbody>
              {topics.map((topic, i) => (
                <>
                  <tr
                    key={topic.id}
                    className={
                      i % 2 === 0
                        ? 'border-b border-border/50'
                        : 'bg-muted/20 border-b border-border/50'
                    }
                  >
                    <td className="px-3 py-2 text-muted-foreground tabular-nums">
                      {topic.display_order}
                    </td>
                    <td className="px-3 py-2">{topic.icon}</td>
                    <td className="px-3 py-2 font-medium text-foreground">{topic.name}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {topic.question_count}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => toggleExpand(topic.id)}
                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted/50 transition-colors"
                        >
                          {expanded.has(topic.id) ? '▲' : '▼'}
                        </button>
                        <button
                          onClick={() => openEditTopic(topic)}
                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted/50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded: questions sub-table */}
                  {expanded.has(topic.id) && (
                    <tr key={`${topic.id}-questions`}>
                      <td colSpan={5} className="bg-muted/30 px-4 py-3 border-b border-border">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Questions ({(questions[topic.id] ?? []).length})
                            </span>
                            <button
                              onClick={() => openAddQuestion(topic.id)}
                              className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded hover:opacity-90 transition-opacity"
                            >
                              + Add Question
                            </button>
                          </div>

                          {(() => {
                            const topicQs = questions[topic.id]
                            if (!topicQs)
                              return (
                                <p className="text-xs text-muted-foreground">Loading questions…</p>
                              )
                            if (topicQs.length === 0)
                              return (
                                <p className="text-xs text-muted-foreground">No questions yet.</p>
                              )
                            return (
                              <div className="rounded border border-border overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-border bg-background">
                                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                        Company
                                      </th>
                                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                        Difficulty
                                      </th>
                                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                                        Preview
                                      </th>
                                      <th className="px-3 py-2 w-24" />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {topicQs.map((q, qi) => (
                                      <tr key={q.id} className={qi % 2 === 0 ? '' : 'bg-muted/10'}>
                                        <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                                          {q.company || '—'}
                                        </td>
                                        <td
                                          className={`px-3 py-2 font-medium capitalize ${difficultyColor(q.difficulty)}`}
                                        >
                                          {q.difficulty}
                                        </td>
                                        <td className="px-3 py-2 text-foreground max-w-[280px] truncate">
                                          {q.title || q.content.slice(0, 80)}
                                        </td>
                                        <td className="px-3 py-2">
                                          <div className="flex gap-1.5 justify-end">
                                            <button
                                              onClick={() => openEditQuestion(q)}
                                              className="text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded border border-border hover:bg-muted/50 transition-colors"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={() => deleteQuestion(q)}
                                              className="text-red-500 hover:text-red-600 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                            >
                                              Del
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal overlay */}
      {modal.type !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {modal.type === 'addTopic' && 'Add Topic'}
                {modal.type === 'editTopic' && 'Edit Topic'}
                {modal.type === 'addQuestion' && 'Add Question'}
                {modal.type === 'editQuestion' && 'Edit Question'}
              </h3>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {err && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded px-3 py-2">
                  {err}
                </p>
              )}

              {/* Topic form */}
              {(modal.type === 'addTopic' || modal.type === 'editTopic') && (
                <TopicFormFields
                  form={topicForm}
                  isNew={modal.type === 'addTopic'}
                  onChange={setTopicForm}
                />
              )}

              {/* Question form */}
              {(modal.type === 'addQuestion' || modal.type === 'editQuestion') && (
                <QuestionFormFields
                  form={questionForm}
                  topics={topics}
                  isNew={modal.type === 'addQuestion'}
                  onChange={setQuestionForm}
                />
              )}
            </div>

            <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="text-sm px-4 py-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  modal.type === 'addTopic' || modal.type === 'editTopic' ? saveTopic : saveQuestion
                }
                disabled={saving}
                className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Topic form fields (sub-component)
// ---------------------------------------------------------------------------

function TopicFormFields({
  form,
  isNew,
  onChange,
}: {
  form: TopicForm
  isNew: boolean
  onChange: (f: TopicForm) => void
}) {
  function set(key: keyof TopicForm, value: string) {
    onChange({ ...form, [key]: value })
  }

  return (
    <>
      <Field label="Name" required>
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => {
            const name = e.target.value
            onChange({ ...form, name, id: isNew ? slugify(name) : form.id })
          }}
          placeholder="e.g. System Design"
        />
      </Field>
      <Field label="ID (slug)" hint={isNew ? 'Auto-filled from name' : undefined}>
        <input
          className={inputCls}
          value={form.id}
          onChange={(e) => set('id', e.target.value)}
          placeholder="e.g. system-design"
          readOnly={!isNew}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Icon (emoji)">
          <input
            className={inputCls}
            value={form.icon}
            onChange={(e) => set('icon', e.target.value)}
            placeholder="📚"
          />
        </Field>
        <Field label="Order">
          <input
            className={inputCls}
            type="number"
            value={form.display_order}
            onChange={(e) => set('display_order', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Description">
        <textarea
          className={`${inputCls} h-20 resize-none`}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </Field>
      <Field label="Keywords" hint="One regex per line — used to auto-classify questions">
        <textarea
          className={`${inputCls} h-24 resize-none font-mono text-xs`}
          value={form.keywords}
          onChange={(e) => set('keywords', e.target.value)}
          placeholder={'puzzle\nsequence.*\\d+'}
        />
      </Field>
    </>
  )
}

// ---------------------------------------------------------------------------
// Question form fields (sub-component)
// ---------------------------------------------------------------------------

function QuestionFormFields({
  form,
  topics,
  isNew,
  onChange,
}: {
  form: QuestionForm
  topics: TopicWithCount[]
  isNew: boolean
  onChange: (f: QuestionForm) => void
}) {
  function set(key: keyof QuestionForm, value: string | boolean) {
    onChange({ ...form, [key]: value })
  }

  return (
    <>
      <Field label="ID" hint={isNew ? 'Auto-generated' : undefined}>
        <input className={inputCls} value={form.id} onChange={(e) => set('id', e.target.value)} />
      </Field>
      <Field label="Topic" required>
        <select
          className={inputCls}
          value={form.topic_id}
          onChange={(e) => set('topic_id', e.target.value)}
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Company">
          <input
            className={inputCls}
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Acme Corp"
          />
        </Field>
        <Field label="Difficulty">
          <select
            className={inputCls}
            value={form.difficulty}
            onChange={(e) => set('difficulty', e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
      </div>
      <Field label="Title" hint="Optional — shown as card header">
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </Field>
      <Field label="OJ URL" hint="Link to online judge (optional)">
        <input
          className={inputCls}
          value={form.oj_url}
          onChange={(e) => set('oj_url', e.target.value)}
          placeholder="https://..."
        />
      </Field>
      <Field label="Content" required hint="Supports Markdown">
        <textarea
          className={`${inputCls} h-40 resize-y font-mono text-xs`}
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={form.has_answer}
          onChange={(e) => set('has_answer', e.target.checked)}
          className="rounded"
        />
        Has answer / solution
      </label>
    </>
  )
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const inputCls =
  'w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="font-normal ml-1.5 text-muted-foreground/70">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}
