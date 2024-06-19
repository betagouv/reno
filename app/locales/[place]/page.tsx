import { Main, Section } from '@/components/UI'
import LocalePlace from './Place'
import Link from 'next/link'
import css from '@/components/css/convertToJs'
import { capitalise0 } from '@/components/utils'
import { Metadata, Metadata } from 'next'
import { description } from '../description'

export async function generateMetadata(
  { params: { place: encodedPlace } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const place = decodeURIComponent(encodedPlace)

  return {
    title: `Aides locales ${capitalise0(place)} - Mes aides réno`,
    description,
  }
}

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
