import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import MarSearch from './MarSearch'

export default async function MarPage(props) {
  const searchParams = await props.searchParams
  return (
    <>
      <StartDsfrOnHydration />
      <MarSearch searchParams={searchParams} />
    </>
  )
}
