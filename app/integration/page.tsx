import { CTA, CTAWrapper, Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Image from 'next/image'
import Link from 'next/link'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import getAppUrl from '@/components/getAppUrl'

export const description = `Vous pouvez intégrer le simulateur Mes Aides Réno sur votre site Web en trois clics.`

export const metadata: Metadata = {
  title: 'Intégrer le simulateur Mes Aides Réno',
  description,
  openGraph: { images: ['/iframe.png'] },
}

const iframeCode = `
<iframe src="https://mesaidesreno.beta.gouv.fr" style="width: 400px; height: 700px; margin: 3rem auto; display: block; border: .2rem solid black; border-radius: 1rem; "></iframe>
`

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
              <BlueEm>Intégrer</BlueEm> le calculateur des aides à la rénovation
              sur <BlueEm>votre site</BlueEm>.
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est un service public de calcul des aides à la
                rénovation energétique. Le sujet est complexe, les aides sont
                multiples, les règles sont mouvantes.
              </p>
              <p>
                En intégrant directement notre calculateur sous forme d'iframe
                chez vous, vous permettez à vos utilisateurs de calculer leurs
                aides sans qu'ils quittent votre site.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <h2>Le module à intégrer</h2>
            <p>
              Voici{' '}
              <BlueEm>
                <strong>le code à intégrer</strong>
              </BlueEm>{' '}
              dans votre HTML ou votre contenu Wordpress :
            </p>
            <code>{iframeCode}</code>
            <h2>Le résultat</h2>

            <div
              style={css`
                text-align: center;
                background: radial-gradient(
                  circle,
                  rgba(0, 0, 145, 0.2) 0%,
                  rgba(0, 212, 255, 0) 60%,
                  rgba(0, 212, 255, 0) 100%
                );
              `}
            >
              <p>[votre contenu]</p>
              <iframe
                src={getAppUrl()}
                style={css`
                  width: 400px;
                  height: 700px;
                  margin: 3rem auto;
                  display: block;
                  border: 0.2rem solid black;
                  border-radius: 1rem;
                  box-shadow:
                    rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
                    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
                `}
              ></iframe>
              <p>[la suite de votre contenu]</p>
            </div>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Calcul de MaPrimeRénov'</h2>
            <p>
              MaPrimeRénov', parcours par geste et parcours accompagné, CEE, CEE
              coup de pouce, aides locales, prêt à taux zéro, dispositif
              Denormandie, exonérations fiscales, aides à la coproriété, etc :
              le monde des aides à la rénovation est complexe.
            </p>
            <p>
              Depuis début 2024, l'État propose <BlueEm>Mes Aides Réno</BlueEm>,
              un calculateur ouvert et en développement actif qui integrera
              toutes ces aides dans une interface de simulation simple destinée
              au grand public.
            </p>
            <h2>Toujours à jour</h2>
            <p>
              Pour l'instant, l'accent est mis sur le dispositif principal,
              MaPrimeRénov'.
            </p>
            <p>
              En intégrant dès maintenant le calculateur sur votre site, vous
              profiterez automatiquement des mises à jour qui auront lieu très
              prochainement pendant l'été et à la rentrée 2024 et ajouteront
              progressivement toutes les aides à la rénovation energétique.
            </p>
          </Content>
        </Wrapper>
        <Wrapper $noMargin={true} $last={true}>
          <Content>
            <h2>Un besoin particulier ? Un retour ? Contactez-nous</h2>
            <p>
              Nous sommes à l'écoute de vos besoins, que vous soyez une
              administration publique, une collectivité, une entreprise (banque,
              courtier, agence immobilière, etc.) ou un professionnel du secteur
              (conseiller France Rénov', Mon Accompagnateur Rénov, ADIL, etc).
            </p>
            <p>
              Nouvelles fonctionnalités, personnalisation de l'intégration,
              partenariat spécifique : discutons de vos besoins.
            </p>
            <p>
              Découvrez aussi{' '}
              <Link href="/api-doc">
                notre API de calcul des aides à la rénovation
              </Link>
              .
            </p>
            <CTAWrapper $justify="center">
              <CTA $fontSize="normal">
                <Link href="mailto:contact@mesaidesreno.fr">
                  ✉️ Nous contacter
                </Link>
              </CTA>
            </CTAWrapper>
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}

const timeIsRunningOut = (to) => {
  const toDate = new Date(Date.parse(to))
  const now = new Date()
  const months = monthDiff(now, toDate)

  if (months < 12) return months + ' mois'
  if (months < 12 + 3) return '1 an'
  if (months < 12 + 8) return '1 an et demi'
  if (months < 12 + 12) return 'moins de 2 ans'

  const years = Math.floor(months / 12),
    reminder = months % 12
  if (years > 8) return years + ' ans'
  if (reminder > 6) return `moins de ${years + 1} ans`
  return `${years} ans`
}

function monthDiff(dateFrom, dateTo) {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  )
}
