import { apiClient } from '@/lib/api/client'
import { CourseDataSchema } from '@/lib/schemas/course.schema'
import type { CourseData } from '@/features/course/types/course.types'

export const courseService = {
  async getCourseData(): Promise<CourseData> {
    const raw = await apiClient.get<unknown>('/api/course')
    return CourseDataSchema.parse(raw) as CourseData
  },
}
