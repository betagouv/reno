'use client'
import { CardMosaic } from '@/components/DevenirPartenaire'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import { Card } from '@/components/UI'
import useIsInIframe from '@/components/useIsInIframe'
import Image from 'next/image'
import calculetteImage from '@/public/illuModule.png'
import ampleurImage from '@/public/illuAmpleur.png'
import plusValueImage from '@/public/illuPlusValue.png'
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
              <Image src={plusValueImage} alt="Logo Plus Value" />
              <h3>
                <Link href="/module/plus-value">Ma Plus-Value Réno</Link>
              </h3>
              <p>
                Estimez la plus-value de votre logement après sa rénovation.
              </p>
            </Card>
            <Card>
              <Image src={ampleurImage} alt="Logo Ampleur" />
              <h3>
                <Link href="/module">Rénovation d'ampleur</Link>
              </h3>
              <p>
                Calculez l'ensemble de vos aides pour une rénovation d'ampleur.
              </p>
            </Card>
            <Card>
              <Image src={calculetteImage} alt="Logo Calculatrice" />
              <h3>
                <Link href="/integration">Et bien plus encore...</Link>
              </h3>
              <p>
                Pompe à chaleur, éco-PTZ... Découvrez nos autres calculatrices
                spécialisées.
              </p>
            </Card>
          </CardMosaic>
        </Content>
      </Wrapper>
    )
  )
}
