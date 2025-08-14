import { useEffect, useState } from 'react'
export default function useIsMobile(maxWidth = 600) {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const isMobile = window.innerWidth <= maxWidth
    setIsMobile(isMobile)
  }, [setIsMobile, maxWidth])
  return isMobile
}
