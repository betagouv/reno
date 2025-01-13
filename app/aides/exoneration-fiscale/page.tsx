import { Card, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { CardMosaic } from '@/components/DevenirPartenaire'
import css from '@/components/css/convertToJs'
import rules from '@/app/règles/rules'

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
          links={[
            { 'Les aides': '/aides' },
            { 'Les exonérations fiscales': '/aides/exoneration-fiscale' },
          ]}
        />
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
        <div
          style={css`
            width: 80%;
            margin: auto;
          `}
        >
          <CardMosaic>
            <Card>
              <h2>
                <Link href="/aides/exoneration-fiscale/taxe-fonciere">
                  {rules['taxe foncière'].marque}
                </Link>
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: rules['taxe foncière'].descriptionHtml,
                }}
              />
            </Card>
            <Card>
              <h2>
                <Link href="/aides/exoneration-fiscale/denormandie">
                  {rules['denormandie'].marque}
                </Link>
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: rules['denormandie'].descriptionHtml,
                }}
              />
            </Card>
          </CardMosaic>
        </div>
      </Section>
    </Main>
  )
}
