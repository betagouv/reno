'use client'

import { useState, useEffect } from 'react'
import * as iframe from '@/utils/iframe'

export default function useIsInIframe() {
  const [isInIframe, setIsInIframe] = useState(false)
  const [sendDataToHost, setSendDataToHost] = useState(false)

  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : '/',
  )

  useEffect(() => {
    let observer

    if (iframe.isInIframe(params)) {
      setIsInIframe(true)

      // NOTE: should we really want a minimum height for the iframe? Why?
      // Yes : without a minimum height, the lower border of the iframe would jump on every "short" question
      // see https://github.com/betagouv/reno/pull/362#issuecomment-2853544949
      const minHeight = 700

      // The code below communicates with a script on a host site
      // to automatically resize the iframe when its inner content height
      // change.
      observer = new ResizeObserver(([entry]) => {
        const value = Math.max(minHeight, entry.contentRect.height + 10) // without this 6 padding, the scroll bar will still be present

        iframe.postMessageResizeHeight(value)
      })
      observer.observe(window.document.body)
      // TODO return observer.disconnect this triggers an error, I don't know why

      if (params.has('sendDataToHost')) {
        setSendDataToHost(true)
      }
    } else {
      setIsInIframe(false)
    }
  }, [sendDataToHost])

  return isInIframe
}

// Certains partenaires souhaitent une version plus compacte du simulateur pour l'afficher en iframe
// On propose cette version en rajoutant ?display=compact dans l'url
export function useIsCompact() {
  const [isCompact, setIsCompact] = useState(false)
  const params = new URLSearchParams(
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
