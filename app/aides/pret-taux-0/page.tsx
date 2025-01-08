import { Card, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import ptzImage from '@/public/eco-ptz.png'
import parImage from '@/public/par.png'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { CardMosaic } from '@/components/DevenirPartenaire'
import css from '@/components/css/convertToJs'
import rules from '@/app/règles/rules'

export const metadata: Metadata = {
  title:
    'Les prêts à taux 0 destinées à la rénovation énergétique en ' +
    new Date().getFullYear(),
  description:
    'Les prêts à taux 0 destinées à la rénovation énergétique en ' +
    new Date().getFullYear() +
    ": L'éco-prêt à taux 0 (éco-PTZ) et le Prêt avance mutation (PAR+)",
}

export default async function Aides() {
  return (
    <Main>
      <Section>
        <Breadcrumb
          links={[
            { 'Les aides': '/aides' },
            { 'Les prêts à taux 0': '/aides/pret-taux-0' },
          ]}
        />
        <h2>
          Aides pour financer vos travaux de rénovation: Les prêts à taux 0
        </h2>
        <p>
          Les prêts à taux zéro sont des moyens avantageux de réaliser vos
          travaux de rénovation. Ils peuvent être sollicités seuls ou en
          complément d'autres dispositifs tels que MaPrimeRénov'.
        </p>
        <p>
          Les deux principaux prêts à taux zéro existants en{' '}
          {new Date().getFullYear()} sont{' '}
          <strong>l'éco-prêt à taux zéro</strong> (éco-PTZ) et le{' '}
          <strong>prêt avance mutation</strong> (PAR+). Il est{' '}
          <strong>possible de les cumuler</strong> à condition de financer des
          postes de travaux différents.
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
              <Link href="/aides/pret-taux-0/eco-ptz">
                <Image
                  src={ptzImage}
                  alt="Logo Eco-PTZ"
                  style={css`
                    padding: 0rem;
                    max-width: 230px;
                    margin: auto;
                  `}
                />
                <div>
                  <h3>{rules['PTZ'].titre}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: rules['PTZ'].descriptionHtml,
                    }}
                  />
                </div>
              </Link>
            </Card>
            <Card>
              <Link href="/aides/pret-taux-0/pret-avance-renovation">
                <Image
                  src={parImage}
                  alt="Logo PAR"
                  style={css`
                    padding: 0rem;
                    max-width: 230px;
                    margin: auto;
                  `}
                />
                <div>
                  <h3>{rules['PAR'].titre}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: rules['PAR'].descriptionHtml,
                    }}
                  />
                </div>
              </Link>
            </Card>
          </CardMosaic>
        </div>
        <h3>Les autres dispositifs de prêts</h3>
        <p>
          Il existe d'autres dispositifs de prêt pour financer vos travaux avec
          des conditions d'obtentions différentes:
        </p>
        <ul>
          <li>
            <strong>Le prêt sur le livret Développement durable</strong> couvre
            les mêmes travaux que MaPrimeRénov' ainsi que les frais
            d'installation.
          </li>
          <li>
            <strong>Le prêt d'accession sociale</strong>: Son obtention dépend
            de vos ressources et de l'endroit où vous habitez.
          </li>
          <li>
            <strong>Le prêt à l'amélioration de l'habitat</strong> si vous
            recevez des allocations de la Caisse d'Allocations familiales.
          </li>
          <li>
            <strong>Les prêts des distributeurs d'énergie</strong>
          </li>
        </ul>
      </Section>
    </Main>
  )
}
