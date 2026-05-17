import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'
import type { Guide } from '@/features/course/types/course.types'

interface GuideViewProps {
  guide: Guide
}

export function GuideView({ guide }: GuideViewProps) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          <span aria-hidden="true">📖</span>
          {guide.title}
        </h1>
      </header>

      {guide.sections.map((section, i) => (
        <section key={i} className="space-y-3">
          <h2 className="text-lg font-bold gradient-text border-b border-border/60 pb-2">
            {section.title}
          </h2>
          <MarkdownRenderer content={section.body} />
        </section>
      ))}
    </div>
  )
}
