import { Main, Section } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { capitalise0 } from '@/components/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import { description } from '../description'
import LocalePlace from './Place'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata(props): Promise<Metadata> {
  const { place: encodedPlace } = await props.params
  // read route params
  const place = decodeURIComponent(encodedPlace)

  return {
    title: `Aides rénovation energétique locales ${capitalise0(place)}`,
    description,
  }
}

export default async function PlacePage(props) {
  const { place: encodedPlace } = await props.params
  const place = decodeURIComponent(encodedPlace)

  return (
    <Main>
      <Section>
        <Breadcrumb
          links={[
            { 'Les aides': '/aides' },
            { 'Les aides locales à la rénovation en France': '/locales' },
            { [capitalise0(place)]: '' },
          ]}
        />
        <Link href="/locales" style={css``}>
          ⬅️ Retour aux aides locales
        </Link>
      </Section>
      <LocalePlace place={place} />
    </Main>
  )
}
