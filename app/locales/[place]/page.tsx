import { Main } from '@/components/UI'
import LocalePlace from './Place'

export default function ({ params: { place: encodedPlace } }) {
  const place = decodeURIComponent(encodedPlace)

  return (
    <Main>
      <LocalePlace place={place} />
    </Main>
  )
}
