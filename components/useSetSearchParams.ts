import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function useSetSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hash, setHash] = useState('')

  useEffect(() => {
    setHash(window.location.hash)
  }, [searchParams])

  //TODO move to components
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (newSearchParams: object, clear: boolean) => {
      const params = new URLSearchParams(clear ? {} : searchParams)

      Object.entries(newSearchParams).map(([k, v]) => {
        v === undefined ? params.delete(k) : params.set(k, v)
      })

      return params.toString()
    },
    [searchParams],
  )
  return (
    newSearchParams: object,
    action: 'url' | 'push' | 'replace' = 'push',
    clear: boolean,
    newPathname,
  ) => {
    const newUrl =
      (newPathname || pathname) +
      '?' +
      createQueryString(newSearchParams, clear) +
      hash

    if (action === 'url') return newUrl
    const oldUrl = pathname + '?' + new URLSearchParams(searchParams).toString()
    if (oldUrl === newUrl) return
    console.log('OLD URL', decodeURIComponent(oldUrl))
    console.log('NEW URL', decodeURIComponent(newUrl))
    if (action === 'push') {
      router.push(newUrl, { scroll: false })
    }
    if (action === 'replace') {
      router.replace(newUrl, { scroll: false })
    }
  }
}
