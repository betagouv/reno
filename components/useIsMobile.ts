import { useEffect, useState } from 'react'
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const isMobile = window.innerWidth <= 600
    setIsMobile(isMobile)
  }, [setIsMobile])
  return isMobile
}
