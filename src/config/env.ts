export const env = {
  app: {
    name: process.env['NEXT_PUBLIC_APP_NAME'] ?? 'Interview BD Course',
    url: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env['NEXT_PUBLIC_API_BASE_URL'] ?? '',
  },
  features: {
    analytics: process.env['NEXT_PUBLIC_ENABLE_ANALYTICS'] === '1',
    cloudSync: process.env['NEXT_PUBLIC_ENABLE_CLOUD_SYNC'] === '1',
  },
} as const
