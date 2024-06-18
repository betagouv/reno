import { Main, Section } from '@/components/UI'
import LocalePlace from './Place'
import Link from 'next/link'
import css from '@/components/css/convertToJs'

export default function ({ params: { place: encodedPlace } }) {
  const place = decodeURIComponent(encodedPlace)

  return (
    <Main>
      <Section>
        <Link href="/locales" style={css``}>
          ⬅️ Retour aux aides locales
        </Link>
      </Section>
      <LocalePlace place={place} />
    </Main>
  )
}
