'use client'
import { CardMosaic } from '@/components/DevenirPartenaire'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import { Card } from '@/components/UI'
import useIsInIframe from '@/components/useIsInIframe'
import Image from 'next/image'
import calculetteImage from '@/public/calculette.png'
import ampleurImage from '@/public/illustration-ampleur.png'
import plusValueImage from '@/public/illustration-plus-value.png'
import Link from 'next/link'

export default function HomepageModules() {
  const isInIFrame = useIsInIframe()
  return (
    !isInIFrame && (
      <Wrapper $noMargin={true}>
        <Content>
          <h2
            css={`
              text-align: center;
              margin-top: 0;
            `}
          >
            Nos calculettes prêtes à l'emploi
          </h2>
          <CardMosaic $smallTitle $noPadding>
            <Card>
              <Image src={plusValueImage} alt="Logo MaPrimeRénov" />
              <h3>
                <Link href="/module/valeur-verte">Ma Plus-Value Réno</Link>
              </h3>
              <p>
                Notre calculatrice spécialement dédiée à l'estimation de la
                plus-value d'un bien suite à des travaux de rénovation.
              </p>
            </Card>
            <Card>
              <Image src={ampleurImage} alt="Logo MaPrimeRénov" />
              <h3>
                <Link href="/module">Rénovation d'ampleur</Link>
              </h3>
              <p>
                Notre calculatrice conçue et optimisée pour proposer simplement
                les aides à la rénovation énergétique d'ampleur.
              </p>
            </Card>
            <Card>
              <Image
                src={calculetteImage}
                alt="Logo Calculatrice"
                css={`
                  margin: 2rem 0;
                `}
              />
              <h3>
                <Link href="/integration">Et bien plus encore...</Link>
              </h3>
              <p>
                Retrouver l'ensemble de nos calculatrices spécifiques (Pompe à
                Chaleur, éco-PTZ, ...) prêtes à utilisation.
              </p>
            </Card>
          </CardMosaic>
        </Content>
      </Wrapper>
    )
  )
}
