import { useState, useEffect } from 'react'

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState({})

  useEffect(() => {
    const updateSearchParams = () => {
      const params = new URLSearchParams(window.location.search)
      const paramObj = {}
      params.forEach((value, key) => {
        paramObj[key] = value
      })
      setSearchParams(paramObj)
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
