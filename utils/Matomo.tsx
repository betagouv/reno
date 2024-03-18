'use client'
import Script from 'next/script'
import { init, push } from '@socialgouv/matomo-next'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const MATOMO_URL = 'https://stats.beta.gouv.fr'
const MATOMO_SITE_ID = '101'

export default function Matomo() {
  const [initialised, setInitialised] = useState(false)
  useEffect(() => {
    if (MATOMO_URL && MATOMO_SITE_ID && initialised) {
      init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID })
    }
    return () => {
      setInitialised(true)
    }
  }, [initialised, setInitialised])

  const searchParams = useSearchParams(),
    pathname = usePathname()

  const searchParamsString = searchParams.toString()
  useEffect(() => {
    if (!pathname) return
    push(['trackPageView'])
  }, [pathname, searchParamsString])
  return null
}
