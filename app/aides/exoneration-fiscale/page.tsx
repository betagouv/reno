import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Link from 'next/link'
import rules from '@/app/règles/rules'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Card from '@codegouvfr/react-dsfr/Card'

export const metadata: Metadata = {
  title:
    'Les exonérations fiscales et réu destinées à la rénovation énergétique en ' +
    new Date().getFullYear(),
  description:
    "Les exonérations fiscales et réductions d'impôts destinées à financer votre rénovation énergétique en " +
    new Date().getFullYear() +
    ": L'exonération de taxe foncière et le dispositif Denormandie",
}

export default function ExonerationFiscale() {
  return (
    <Main>
      <Section>
        <Breadcrumb
          currentPageLabel="Les exonérations fiscales"
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
          ]}
        />
        <Link
          className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
          href="/aides"
        >
          Retour à la liste des aides
        </Link>
        <h1>
          Aides pour financer vos travaux de rénovation: Les exonérations
          fiscales
        </h1>
        <p>
          Les exonérations fiscales sont des incitations à destination des
          propriétaires occupants ou bailleurs mises en oeuvre par l'état afin
          de réaliser vos travaux de rénovation énergétiques. Ils peuvent être
          sollicités seuls ou en complément d'autres dispositifs tels que
          MaPrimeRénov'.
        </p>
        <p>
          Les deux principales exonérations existantes en{' '}
          {new Date().getFullYear()} sont{' '}
          <strong>l'exonération de taxe foncière</strong> et le{' '}
          <strong>dispositif Denormandie</strong>.
        </p>
        <p>
          Vous pouvez consulter les fiches correspondantes afin de{' '}
          <strong>tester votre éligibilité</strong> et d'en savoir plus.
        </p>
        <div className="fr-grid-row fr-grid-row--gutters fr-mb-5v">
          <div className="fr-col-12 fr-col-md-4">
            <Card
              background
              border
              desc={
                <div
                  dangerouslySetInnerHTML={{
                    __html: rules['taxe foncière'].descriptionHtml,
                  }}
                />
              }
              enlargeLink
              linkProps={{
                href: '/aides/exoneration-fiscale/taxe-fonciere',
              }}
              size="medium"
              title={rules['taxe foncière'].marque}
              titleAs="h2"
            />
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <Card
              background
              border
              desc={
                <div
                  dangerouslySetInnerHTML={{
                    __html: rules['denormandie'].descriptionHtml,
                  }}
                />
              }
              enlargeLink
              linkProps={{
                href: '/aides/exoneration-fiscale/denormandie',
              }}
              size="medium"
              title={rules['denormandie'].marque}
              titleAs="h2"
            />
          </div>
        </div>
      </Section>
    </Main>
  )
}
