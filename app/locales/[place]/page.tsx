import { Main, Section } from '@/components/UI'
import { capitalise0 } from '@/components/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import { description } from '../description'
import LocalePlace from './Place'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'

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
    <>
      <StartDsfrOnHydration />
      <Main>
        <Section>
          <Breadcrumb
            currentPageLabel={[capitalise0(place)]}
            homeLinkProps={{
              href: '/',
            }}
            segments={[
              {
                label: 'Les aides',
                linkProps: {
                  href: '/aides',
                },
              },
              {
                label: 'Les aides locales à la rénovation en France',
                linkProps: {
                  href: '/locales',
                },
              },
            ]}
          />
          <Link href="/locales">⬅️ Retour aux aides locales</Link>
        </Section>
        <LocalePlace place={place} />
      </Main>
    </>
  )
}
