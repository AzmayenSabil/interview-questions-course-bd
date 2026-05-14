'use client'

import { create } from 'zustand'

interface CourseUiState {
  sidebarOpen: boolean
}

interface CourseUiActions {
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

export const useCourseUiStore = create<CourseUiState & CourseUiActions>((set) => ({
  sidebarOpen: false,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}))
