'use client'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import { HeaderWrapper, Labels } from '../LandingUI'
import { Title } from '../LayoutUI'

export default function Page() {
  return (
    <main
      style={css`
        background: white;
        padding: 5rem 0;
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Image
            css={`
              margin: 0 !important;
            `}
            src={illustrationAccueil}
            alt="Des ouvriers peignent et réparent la facade d'une maison"
          />
          <div
            css={`
              width: 20rem !important;
            `}
          >
            <div
              css={`
                width: 20rem;
                display: flex;
                align-items: center;
                > img {
                  margin-right: 1rem;
                }
                margin-bottom: 0.6rem;
              `}
            >
              <Image
                src={logo}
                alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge"
              />
              <Title>
                Mes <strong>Aides Réno</strong>
              </Title>
              <strong
                title="Les résultats présentés sur ce site sont une simulation, en version beta : elle est à but d'information mais peut contenir des erreurs. Elle ne remplace ni la loi, ni les informations présentées sur https://france-renov.gouv.fr, ni les conseillers France Rénov'"
                style={css`
                  background: #e8edff;
                  color: #0063cb;
                  padding: 0.1rem 0.3rem;
                  border-radius: 0.1rem;
                  margin-left: 0.6rem;
                  font-size: 110%;
                `}
              >
                BETA
              </strong>
            </div>
            <Labels>
              {['⚡️ En 2024, les aides évoluent'].map((text) => (
                <li key={text}>{text}</li>
              ))}
            </Labels>
            <h1
              style={css`
                margin-top: 0.6rem;
              `}
            >
              Estimez vos aides pour rénover votre logement
            </h1>
            <Intro css={``}>
              <p>
                Des factures moins élevées dans un logement plus confortable et
                plus écologique.
              </p>
            </Intro>
            <p
              style={css`
                margin: 0;
                margin-top: -1rem;
                color: #555;
                line-height: 1.3rem;
              `}
            >
              <strong>5 minutes chrono</strong> et sans inscription.
            </p>
          </div>
        </HeaderWrapper>
      </PageBlock>
    </main>
  )
}
