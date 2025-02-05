'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function useIsInIframe() {
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    let observer
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsInIframe(true)

      // The code below communicate with the iframe.js script on a host site
      // to automatically resize the iframe when its inner content height
      // change.
      const minHeight = 700
      observer = new ResizeObserver(([entry]) => {
        const value = Math.max(minHeight, entry.contentRect.height + 10) // without this 6 padding, the scroll bar will still be present
        window.parent?.postMessage(
          { kind: 'mesaidesreno-resize-height', value },
          '*',
        )
      })
      observer.observe(window.document.body)
      // TODO return observer.disconnect this triggers an error, I don't know why
    } else {
      setIsInIframe(false)
    }
  }, [])

  return isInIframe
}

// Certains partenaires souhaitent une version plus compacte du simulateur pour l'afficher en iframe
// On propose cette version en rajoutant ?display=compact dans l'url
export function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false)
  let params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '/',
  )
  useEffect(() => {
    setIsCompact(params.has('display') && params.get('display') == 'compact')
    if (params.has('color')) {
      document.documentElement.style.setProperty(
        '--color',
        `#${params.get('color')}`,
      )
    }
  }, [])

  return isCompact
}
