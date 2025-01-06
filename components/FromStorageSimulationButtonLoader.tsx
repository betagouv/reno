'use client'
import dynamic from 'next/dynamic'

const FromStorageSimulationButton = dynamic(
  () => import('@/components/FromStorageSimulationButton'),
  { ssr: false },
)
export default function FromStorageSimulationButtonLoader() {
  return <FromStorageSimulationButton />
}
