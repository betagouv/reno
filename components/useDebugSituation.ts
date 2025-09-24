import { useEffect } from 'react'

export default function useDebugSituation(situation) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === 's') {
        console.log('Situation:', situation)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [situation])
}
