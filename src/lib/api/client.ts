import { ApiError } from '@/types/api.types'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string>
  body?: unknown
}

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.baseUrl || 'http://localhost')
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
    }
    return this.baseUrl ? url.toString() : url.pathname + url.search
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body })
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body })
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  private async request<T>(path: string, options: RequestOptions): Promise<T> {
    const { params, body, ...fetchOptions } = options
    const url = this.buildUrl(path, params)

    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const message = await res.text().catch(() => res.statusText)
      throw new ApiError(res.status, `HTTP_${res.status}`, message)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }
}

export const apiClient = new ApiClient(typeof window !== 'undefined' ? window.location.origin : '')
