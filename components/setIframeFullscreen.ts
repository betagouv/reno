import { useEffect, useState } from 'react'

export default function setIframeFullscreen() {
  const isFullscreen = isInFullscreen()
  const isMobile = window.matchMedia('(max-width: 800px)').matches
  console.log({ isFullscreen, isMobile })

  if (!isMobile) return
  const doc = window.document
  const docEl = doc.documentElement

  if (isFullscreen) {
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) {
      /* Safari */
      doc.webkitExitFullscreen()
    }
    return
  }

  console.log('requestFullscreen')
  if (docEl.requestFullscreen) {
    docEl.requestFullscreen()
  } else if (docEl.webkitRequestFullscreen) {
    /* Safari */
    docEl.webkitRequestFullscreen()
  }
}

export function isInFullscreen() {
  const doc = window.document
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement)
}

export function useIsFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const listener = (event) => {
      setIsFullscreen(isInFullscreen())
    }
    addEventListener('fullscreenchange', listener)
    return () => {
      removeEventListener('fullscreenchange', listener)
    }
  }, [setIsFullscreen])

  return isFullscreen
}
