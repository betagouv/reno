import { useState, useEffect } from 'react'

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams())

  useEffect(() => {
    const updateSearchParams = () => {
      console.log('indigo caught popstate', window.location.search)
      const params = new URLSearchParams(window.location.search)
      setSearchParams(params)
    }

    // Initial update
    updateSearchParams()

    // Listen for popstate events to update search params when the URL changes
    window.addEventListener('popstate', updateSearchParams)

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('popstate', updateSearchParams)
    }
  }, [])

  return searchParams
}

export const usePathname = () => '' //TODO
export const useRouter = () => '' //TODO
