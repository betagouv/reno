import { Suspense } from 'react'
import PlusValueModule from '@/components/module/PlusValueModule'

export default function Integration() {
  return (
    <Suspense>
      <PlusValueModule type={'module'} />
    </Suspense>
  )
}
