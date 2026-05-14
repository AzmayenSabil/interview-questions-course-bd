export const APP_CONFIG = {
  name: 'Interview BD Course',
  description: 'Topic-wise preparation for Bangladeshi tech company interviews',
  storageKeys: {
    progress: 'interviewbd_progress_v2',
    theme: 'interviewbd_theme',
  },
  query: {
    staletime: {
      courseData: Infinity,
    },
    retry: 2,
  },
  course: {
    topicUnlockThreshold: 0.5,
  },
} as const
