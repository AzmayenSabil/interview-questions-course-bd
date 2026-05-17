'use client'

import { create } from 'zustand'

interface ProgressState {
  completed: Record<string, boolean>
}

interface ProgressActions {
  toggleQuestion: (id: string) => void
  isCompleted: (id: string) => boolean
  resetProgress: () => void
  getCompletedIds: () => string[]
  setCompleted: (ids: string[]) => void
}

export const useProgressStore = create<ProgressState & ProgressActions>()((set, get) => ({
  completed: {},

  toggleQuestion: (id) =>
    set((state) => {
      const next = { ...state.completed }
      if (next[id]) {
        delete next[id]
      } else {
        next[id] = true
      }
      return { completed: next }
    }),

  isCompleted: (id) => Boolean(get().completed[id]),

  resetProgress: () => set({ completed: {} }),

  getCompletedIds: () => Object.keys(get().completed),

  setCompleted: (ids) => {
    const completed: Record<string, boolean> = {}
    for (const id of ids) completed[id] = true
    set({ completed })
  },
}))
