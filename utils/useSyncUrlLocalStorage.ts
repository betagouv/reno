'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function useSyncUrlLocalStorage() {
  // For now we will only store the URL as a string since our
  // first usage is to inject it again as a URL when the user loses the page
  const [, setSimulation] = useLocalStorage('simulation', null)

  const searchParams = useSearchParams(),
    pathname = usePathname()

  const searchParamsString = searchParams.toString()

  useEffect(() => {
    if (!pathname) return

    if (!pathname.includes('/simulation') || searchParamsString === '') return

    console.log('indigo', pathname, searchParamsString)
    setSimulation(pathname + '?' + searchParamsString)
  }, [pathname, searchParamsString])

  return null
}
