export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
}

export type ThemeMode = 'light' | 'dark' | 'system'
