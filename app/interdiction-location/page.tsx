import DPELabel from '@/components/DPELabel'
import {
  CTA,
  CTAWrapper,
  ExternalLink,
  Intro,
  PageBlock,
} from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderWrapper } from '../LandingUI'
import { Calendrier } from './UI'
import { timeIsRunningOut, timeIsRunningOut } from '@/components/timeUtils'

export const description = `Les passoires thermiques seront progressivement interdites à la location. Propriétaire bailleur, découvrez vos aides à la rénovation énergétique.`

export const metadata: Metadata = {
  title: 'Puis-je continuer de louer mon logement passoire thermique ?',
  description,
  openGraph: { images: ['/jaquette.png'] },
}

export default function Page() {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={illustrationAccueil}
            alt="Des ouvriers peignent et réparent la facade d'une maison"
          />
          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              Interdiction de location d'une passoire thermique
            </h1>
            <Intro>
              <p>
                En France métropolitaine, un propriétaire doit fournir à son
                locataire un logement décent. Pour ce faire, la loi prévoit
                qu’il respecte{' '}
                <strong>
                  des niveaux de performance énergétique minimums de plus en
                  plus exigeants
                </strong>
                .
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <h2>En 2024</h2>
            <p>
              Depuis le 1er janvier 2023, en France métropolitaine, un logement
              est dit « énergétiquement décent » si sa consommation d'énergie
              estimée par le diagnostic de performance énergétique (DPE) et
              exprimée en énergie finale est inférieure à 450 kWh/m²/an.
            </p>
            <h2>Par la suite</h2>
            <p>
              Le critère de décence énergétique évolue au fil du temps, selon le
              calendrier suivant :{' '}
            </p>
            <Calendrier>
              <li>
                <span>
                  <div>
                    Au 1er janvier <strong>2025</strong>
                  </div>
                  <small>(dans {timeIsRunningOut('2025-01-01')})</small>
                </span>
                <span>
                  Interdiction de louer un DPE
                  <DPELabel index="6" />
                </span>
              </li>
              <li>
                <span>
                  <div>
                    Au 1er janvier <strong>2028</strong>
                  </div>
                  <small> (dans {timeIsRunningOut('2028-01-01')})</small>
                </span>
                <span>
                  Interdiction de louer un DPE
                  <DPELabel index="5" />
                </span>
              </li>
              <li>
                <span>
                  <div>
                    Au 1er janvier <strong>2034</strong>
                  </div>
                  <small> (dans {timeIsRunningOut('2034-01-01')})</small>
                </span>
                <span>
                  Interdiction de louer un DPE
                  <DPELabel index="4" />
                </span>
              </li>
            </Calendrier>
            <p>
              Ces mesures s'appliqueront aux nouveaux contrats de location et
              aux renouvellements ou reconductions tacites de contrats.
            </p>
            <p>
              <small>
                En ne respectant pas ce critère de dédence du logement, le
                propriétaire bailleur s’expose à être contraint par le juge, à
                la réalisation de travaux de rénovation, à une diminution du
                montant du loyer ou la suspension de sa perception, et à une
                suspension de la durée du bail.{' '}
              </small>
            </p>
            <p>
              <ExternalLink href="https://www.ecologie.gouv.fr/interdiction-location-et-gel-des-loyers-des-passoires-energetiques">
                En savoir plus
              </ExternalLink>
              .
            </p>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Isoler mon logement</h2>
            <p>
              L'État vous aide pour sortir votre logement de son état de
              passoire énergétique.
            </p>
            <p
              style={css`
                margin: 0;
                color: #555;
                line-height: 1.3rem;
              `}
            >
              <strong
                style={css`
                  color: #da504b;
                `}
              >
                5 minutes chrono
              </strong>{' '}
              et sans inscription.
            </p>
            <CTAWrapper $justify="center">
              <CTA $fontSize="normal">
                <Link href="/simulation" prefetch={false}>
                  ➞&nbsp;&nbsp;Calculer mes aides
                </Link>
              </CTA>
            </CTAWrapper>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
