import { situationToCtaUrl } from '@/app/module/AmpleurCTA'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function useSyncAmpleurSituation(situation) {
  const [savedSimulation, setSavedSimulation] = useLocalStorage(
    'simulation',
    null,
  )

  const url = situationToCtaUrl(situation)

  useEffect(() => {
    setSavedSimulation(url)
  }, [url, setSavedSimulation])

  console.log('indigo', savedSimulation)
  return savedSimulation
}
