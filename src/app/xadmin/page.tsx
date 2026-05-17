// SECRET ADMIN PAGE
// The URL is /xadmin — rename this folder to change it (e.g. rename to "my-secret-slug")
// Password and session token are in src/lib/adminAuth.ts
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE } from '@/lib/adminAuth'
import { getStats } from '@/lib/analyticsStore'
import { getCourseStats } from '@/lib/courseDb'
import { AdminLoginForm } from '@/features/admin/components/AdminLoginForm'
import { AdminDashboard } from '@/features/admin/components/AdminDashboard'
import { CourseEditor } from '@/features/admin/components/CourseEditor'

export const metadata: Metadata = { title: 'Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE)

  if (session?.value !== process.env.ADMIN_SESSION_TOKEN) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <AdminLoginForm />
      </div>
    )
  }

  const [stats, courseStats] = await Promise.all([getStats(), getCourseStats()])

  return (
    <div className="space-y-12">
      <AdminDashboard stats={stats} courseStats={courseStats} />
      <CourseEditor />
    </div>
  )
}
