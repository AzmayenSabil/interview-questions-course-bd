'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_CONFIG } from '@/config/app'

interface ProgressState {
  version: number
  completed: Record<string, boolean>
}

interface ProgressActions {
  toggleQuestion: (id: string) => void
  isCompleted: (id: string) => boolean
  resetProgress: () => void
  getCompletedIds: () => string[]
}

const INITIAL_STATE: ProgressState = {
  version: 2,
  completed: {},
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

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
    }),
    {
      name: APP_CONFIG.storageKeys.progress,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        completed: state.completed,
      }),
    },
  ),
)
