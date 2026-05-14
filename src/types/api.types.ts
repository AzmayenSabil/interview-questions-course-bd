export interface ApiResponse<T> {
  data: T
  error: null
}

export interface ApiErrorResponse {
  data: null
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError }
