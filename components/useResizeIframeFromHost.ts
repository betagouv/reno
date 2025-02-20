import { useEffect, useState } from 'react'

export default function useResizeIframeFromHost(iframeRef) {
  const [noScroll, setNoScroll] = useState(false)
  useEffect(() => {
    if (!noScroll) return

    const handleHeightChange = function (evt) {
      if (evt.data.kind === 'mesaidesreno-resize-height') {
        iframeRef.current.style.height = evt.data.value + 'px'
      }
    }
    window.addEventListener('message', handleHeightChange)
    return () => window.removeEventListener('message', handleHeightChange)
  }, [iframeRef, noScroll])

  return [noScroll, setNoScroll]
}
