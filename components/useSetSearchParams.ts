'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function useSetSearchParams() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hash, setHash] = useState('')

  useEffect(() => {
    setHash(window.location.hash)
  }, [searchParams])

  //TODO move to components
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryParams = useCallback(
    (newSearchParams: object, clear: boolean) =>
      updateSearchParams(searchParams, newSearchParams, clear),
    [searchParams],
  )

  return (
    newSearchParams: object,
    action: 'url' | 'push' | 'replace' = 'push',
    clear: boolean,
    newPathname: string = '',
  ) => {
    const oldUrl = pathname + '?' + new URLSearchParams(searchParams).toString()
    const iframeParam = searchParams.get('iframe')
    const updatedNewSearchParams = createQueryParams(newSearchParams, clear)
    if (iframeParam) {
      updatedNewSearchParams.set('iframe', iframeParam)
    }
    const newUrl =
      (newPathname || pathname) + '?' + updatedNewSearchParams.toString() + hash

    if (action === 'url') return newUrl
    if (oldUrl === newUrl) return
    console.log('OLD URL', decodeURIComponent(oldUrl))
    console.log('NEW URL', decodeURIComponent(newUrl))
    if (action === 'push') {
      window.history.pushState(null, '', newUrl)
      //router.push(newUrl, { scroll: false })
    }
    if (action === 'replace') {
      window.history.replaceState(null, '', newUrl)
      //      router.replace(newUrl, { scroll: false })
    }
  }
}

function updateSearchParams(
  searchParams: URLSearchParams,
  newSearchParams: object,
  clear: boolean,
) {
  const params = new URLSearchParams(clear ? {} : searchParams)

  for (const [key, value] of Object.entries(newSearchParams)) {
    value === undefined ? params.delete(key) : params.set(key, value)
  }

  return params
}
