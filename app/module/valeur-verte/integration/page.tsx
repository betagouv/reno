import { Suspense } from 'react'
import ValeurVerteModule from '@/components/module/ValeurVerteModule'

export default function Integration() {
  return (
    <Suspense>
      <ValeurVerteModule type={'module'} />
    </Suspense>
  )
}
