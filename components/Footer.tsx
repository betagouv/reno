'use client'

import useIsInIframe from '@/components/useIsInIframe'

export default function Footer({ children }) {
  const isInIframe = useIsInIframe()

  return !isInIframe ? children : null
}
