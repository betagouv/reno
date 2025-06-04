import { useCallback, useEffect, useState } from 'react'

console.log('BLABLA')

// TODO this was extracted to a window function from a useCallback, is it ok ?
const createQueryString = (newSearchParams: object, clear: boolean) => {
  const oldSearchParams = Object.fromEntries(
    new URLSearchParams(location.search),
  )

  const params = new URLSearchParams(clear ? {} : oldSearchParams)

  Object.entries(newSearchParams).map(([k, v]) => {
    v === undefined ? params.delete(k) : params.set(k, v)
  })

  return params.toString()
}

export default function useSetSearchParams() {
  //TODO move to components
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  return (
    newSearchParams: object,
    action: 'url' | 'push' | 'replace' = 'push',
    clear: boolean,
    newPathname,
  ) => {
    const pathname = window.location.pathname
    const newUrl =
      (newPathname || pathname) +
      '?' +
      createQueryString(newSearchParams, clear)

    if (action === 'url') return newUrl
    //TODO was this necessary, is it now with webco without next ?
    /*
    const oldUrl = pathname + '?' + new URLSearchParams(searchParams).toString()
    if (oldUrl === newUrl) return
    console.log('OLD URL', decodeURIComponent(oldUrl))

*/
    console.log('NEW URL', decodeURIComponent(newUrl))

    if (action === 'push') {
      window.history.pushState(null, '', newUrl)
    }
    if (action === 'replace') {
      window.history.replaceState(null, '', newUrl)
    }
  }
}
