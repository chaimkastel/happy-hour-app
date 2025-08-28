'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DealRedirectPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      // Redirect to the new view page
      router.replace(`/deal/${params.id}/view`)
    }
  }, [params.id, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-600 dark:text-blue-400 text-lg">Redirecting to deal view...</p>
      </div>
    </div>
  )
}
