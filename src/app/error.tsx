'use client'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4" aria-hidden="true">
        ⚠️
      </span>
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-200 active:scale-[0.97]"
      >
        Try again
      </button>
    </div>
  )
}
