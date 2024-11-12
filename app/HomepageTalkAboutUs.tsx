'use client'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import useIsInIframe from '@/components/useIsInIframe'
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote-rect.png'
import logoFranceInfo from '@/public/logo-partenaire/logo-france-info.jpg'
import logoTf1Info from '@/public/logo-partenaire/logo-tf1-info.svg'
import logoActualImmo from '@/public/logo-partenaire/logo-actual-immo.png'
import Image from 'next/image'
import Link from 'next/link'

export default function HomepageTalkAboutUs() {
  const isInIFrame = useIsInIframe()

  return (
    !isInIFrame && (
      <Wrapper $background="white" $noMargin={true} $last={true}>
        <Content>
          <h2
            css={`
              text-align: center;
              margin-top: 0;
            `}
          >
            Ils parlent de nous
          </h2>
          <div
            css={`
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 1rem;
              a {
                width: 23%;
                min-width: 150px;
                img {
                  width: 100%;
                  height: auto;
                }
              }
            `}
          >
            <Link
              href="https://www.francetvinfo.fr/economie/immobilier/logements-bouilloires-ces-obstacles-qui-freinent-l-adaptation-aux-fortes-chaleurs_6737814.html"
              target="_blank"
              css={``}
            >
              <Image src={logoFranceInfo} alt="Logo France Info" />
            </Link>
            <Link
              href="https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/"
              target="_blank"
            >
              <Image src={logoBonPote} alt="Logo Bon Pote" />
            </Link>
            <Link
              href="https://www.tf1info.fr/immobilier/bouilloires-thermiques-comment-adapter-son-logement-aux-vagues-de-chaleur-2315763.html"
              target="_blank"
            >
              <Image src={logoTf1Info} alt="Logo TF1 Info" />
            </Link>
            <Link
              href="https://www.actual-immo.fr/investissement-passoires-energetiques/"
              target="_blank"
            >
              <Image src={logoActualImmo} alt="Logo Actual Immo" />
            </Link>
          </div>
        </Content>
      </Wrapper>
    )
  )
}
