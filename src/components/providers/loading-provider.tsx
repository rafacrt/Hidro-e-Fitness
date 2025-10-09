'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { LoadingOverlay } from '@/components/ui/spinner'

function LoadingProviderContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {children}
    </>
  )
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  )
}
