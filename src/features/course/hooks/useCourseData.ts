'use client'

import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/features/course/services/courseService'
import { COURSE_QUERY_KEY } from '@/features/course/constants/course.constants'

export function useCourseData() {
  return useQuery({
    queryKey: COURSE_QUERY_KEY,
    queryFn: () => courseService.getCourseData(),
    staleTime: Infinity,
  })
}
