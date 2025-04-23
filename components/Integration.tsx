'use client'
import { HeaderWrapper, BlueEm } from '@/app/LandingUI'
import Link from 'next/link'
import Image from 'next/image'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import illustrationAccueil from '@/public/illustration-accueil.resized.webp'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import getAppUrl from './getAppUrl'
import { PageBlock, Intro, CTAWrapper, CTA, MiseEnAvant, Card } from './UI'
import { useEffect, useRef, useState } from 'react'
import { Select } from './InputUI'
import { useRouter, useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import IntegrationQuestions from './IntegrationQuestions'
import useResizeIframeFromHost from './useResizeIframeFromHost'
import Demonstration from '@/app/module/Demonstration'
import calculetteImage from '@/public/illuModule.png'
import Breadcrumb from '@/components/Breadcrumb'
import { CardMosaic } from './DevenirPartenaire'
import ampleurImage from '@/public/illuAmpleur.png'
import plusValueImage from '@/public/illuPlusValue.png'

export default function Integration() {
  const router = useRouter()
  const rawSearchParams = useSearchParams()
  const searchParams = Object.fromEntries(rawSearchParams.entries())
  const [module, setModule] = useState(searchParams.module || '/')

  const handleModuleChange = (selectedModule) => {
    setModule(selectedModule)
    router.push(`/integration?module=${encodeURIComponent(selectedModule)}`, {
      shallow: true,
      scroll: false,
    })
  }

  useEffect(() => {
    if (searchParams.module) {
      setModule(searchParams.module)
    }
  }, [searchParams])

  const listeModule = [
    {
      titre: 'Module Principal',
      valeur: '/',
    },
    {
      titre: 'Calculette Ampleur',
      valeur: '/module/integration?DPE.actuel=6',
    },
    {
      titre: 'Calculette Copropriété',
      valeur: '/copropriete',
    },
    {
      titre: 'Calculette Eco-PTZ',
      valeur: '/module/eco-ptz',
    },
    {
      titre: 'Calculette PAR+',
      valeur: '/module/par',
    },
    {
      titre: 'Calculette Taxe foncière',
      valeur: '/module/taxe-fonciere',
    },
    {
      titre: 'Calculette Denormandie',
      valeur: '/module/denormandie',
    },
  ]

  Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith('MPR'))
    .forEach((item) =>
      listeModule.push({
        titre:
          'Calculette MaPrimeRénov - ' +
          rules[item.replace(' . MPR', '')].titre,
        valeur:
          '/aides/ma-prime-renov/' +
          encodeURIComponent(rules[item.replace(' . MPR', '')].titre),
      }),
    )
  Object.keys(rules)
    .filter((item) => item.startsWith('gestes') && item.endsWith('CEE'))
    .forEach((item) =>
      listeModule.push({
        titre: 'Calculette CEE - ' + rules[item.replace(' . CEE', '')].titre,
        valeur:
          '/aides/cee/' +
          rules[item].code +
          '/' +
          encodeURIComponent(rules[item.replace(' . CEE', '')].titre),
      }),
    )
  Object.keys(rules)
    .filter(
      (item) => item.startsWith('gestes') && item.endsWith('Coup de pouce'),
    )
    .forEach((item) =>
      listeModule.push({
        titre:
          'Calculette Coup de Pouce - ' +
          rules[item.replace(' . Coup de pouce', '')].titre,
        valeur:
          '/aides/coup-de-pouce/' +
          encodeURIComponent(rules[item.replace(' . Coup de pouce', '')].titre),
      }),
    )

  const iframeCode = `<iframe id="mesaidesreno" src="${getAppUrl() + module}" allow="clipboard-read; clipboard-write" style="width: 400px; height: 700px; margin: 3rem auto; display: block; border: 0.2rem solid black; border-radius: 1rem;"></iframe>`

  const iframeRef = useRef()

  const [noScroll, setNoScroll] = useResizeIframeFromHost(iframeRef)

  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <Content>
          <Breadcrumb
            links={[
              { 'Devenir partenaire': '/devenir-partenaire' },
              { 'Les iframes': '/integration' },
            ]}
          />
        </Content>
        <HeaderWrapper>
          <Image
            src={calculetteImage}
            alt="Une personne utilise une calculatrice sur son bureau"
            style={css`
              margin: 1rem;
            `}
          />
          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
                font-size: 180%;
              `}
            >
              Intégrer <BlueEm>les calculettes</BlueEm> des aides à la
              rénovation sur votre site.
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est un service public de calcul des aides à la
                rénovation énergétique. Le sujet est complexe, les aides sont
                multiples, les règles sont mouvantes.
              </p>
              <p>
                En intégrant directement nos calculatettes sous forme d'iframe
                chez vous, vous permettez à vos utilisateurs d'estimer leurs
                aides sans qu'ils quittent votre site.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <h2
              css={`
                margin-bottom: 1rem;
              `}
            >
              Nos dernières calculettes:
            </h2>
            <CardMosaic $smallTitle $noPadding>
              <Card>
                <Image src={plusValueImage} alt="Logo Plus Value" />
                <h3>
                  <Link href="/module/plus-value/demonstration">
                    Ma Plus-Value Réno
                  </Link>
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
                  Calculez l'ensemble de vos aides pour une rénovation
                  d'ampleur.
                </p>
              </Card>
              {/* Petit hack en attendant un 3ème module */}
              <div
                css={`
                  opacity: 0;
                  cursor: auto;
                `}
              ></div>
            </CardMosaic>
            <h2
              css={`
                margin-bottom: 1rem;
              `}
            >
              Sélectionnez la calculette à intégrer:
            </h2>
            <Select
              onChange={(e) => handleModuleChange(e.target.value)}
              value={module}
            >
              {listeModule.map((item, index) => (
                <option key={index} value={item.valeur}>
                  {item.titre}
                </option>
              ))}
            </Select>
            {module.includes('module/integration') ? (
              <Demonstration moduleName="ampleur" />
            ) : (
              <>
                <p
                  css={`
                    margin-top: 1rem;
                  `}
                >
                  Voici{' '}
                  <BlueEm>
                    <strong>le code à intégrer</strong>
                  </BlueEm>{' '}
                  dans votre HTML ou votre contenu Wordpress :
                </p>
                <IframeCodeWrapper>
                  <code
                    css={`
                      word-break: break-all;
                    `}
                  >
                    {iframeCode}
                  </code>
                </IframeCodeWrapper>
                <IntegrationQuestions {...{ noScroll, setNoScroll }} />
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
                    ref={iframeRef}
                    src={getAppUrl() + module}
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
              </>
            )}
          </Content>
        </Wrapper>
        <ContactIntegration type="iframe" />
      </PageBlock>
    </main>
  )
}

export const HistoriqueVersion = () => (
  <Wrapper $background="white" $noMargin={true}>
    <Content>
      <h2>Toujours à jour</h2>
      <p>
        En intégrant dès maintenant le calculateur sur votre site, vous
        profiterez automatiquement des mises à jour qui auront lieu très
        prochainement en janvier 2025.
      </p>
      <h2>Historique des versions</h2>
      <h3>v1 (été 2024)</h3>
      <p>
        La première version "preuve de concept" du module. Elle n'intègre que le
        dispositif principal MaPrimeRénov' parcours ampleur.{' '}
      </p>
      <h3>v2 (septembre 2024)</h3>
      <p>
        Le module est redesigné suite aux premiers retours du premier
        intégrateur. Les saisies utilisateur sont améliorées avec un choix
        simple dans un menu déroulant pour décrire la situation de l'acheteur :
        résidence principale, résidence secondaire ou résidence principale d'un
        locataire.
      </p>
      <p>
        Il inclut non seulement MaPrimeRénov' ampleur mais aussi les autres
        aides principales dont l'éco-PTZ, le Prêt Avance Rénovation à zéro %, le
        dispositif Denormandie, etc.
      </p>
      <h3>v3 (fin novembre 2024)</h3>
      <p>
        Dans cette nouvelle version, nous réduisons la charge de l'utilisateur
        pour l'aider à remplir les questions :{' '}
        <strong>les 4 questions s'affichent désormais une par une</strong>, tout
        en gardant les 4 visibles dès le départ pour qu'il n'y ait aucune
        surprise.{' '}
      </p>
      <p>
        La saisie du revenu ne se fait plus à l'euro près de façon libre, mais
        via des <strong>seuils de revenu calculés</strong> en fonction des 3
        réponses précédentes, pour éviter ainsi à l'utilisateur de devoir aller
        chercher sa déclaration d'impôt et craindre cette saisie sensible quand
        elle est trop précise.
      </p>
      <p>
        Autre nouveauté : les 4 réponses utilisateur sont mises en mémoire, pour
        qu'il ou elle n'ait pas à répéter ces informations d'une annonce à
        l'autre.{' '}
      </p>
      <div>
        Enfin, au clic sur "Découvrir toutes les aides" :{' '}
        <ul>
          <li>
            les données injectées par l'annonce (m2, ville, maison/appart) et le
            module (motif d'achat, revenu, etc.) sont auto-remplies pour
            raccourcir la simulation et amener l'utilisateur au plus vite vers
            la page de bilan des aides
          </li>
          <li>
            un message l'avertit de ce procédé pour lui faire comprendre que ces
            données sont bien prises en compte dans la simulation
          </li>
        </ul>
      </div>
      <p>
        <small>
          Pour tous les détails, c'est{' '}
          <a href="https://github.com/betagouv/reno/pull/281">par ici</a> : tout
          notre développement est ouvert.
        </small>
      </p>
      <h4>v4 (à venir)</h4>
      <p>
        Pour la v4, à nouveau suite à des tests utilisateurs, nous allons
        travailler l'affichage des résultats chiffrés dans le module.
      </p>
    </Content>
  </Wrapper>
)

export const ContactIntegration = ({ type }) => (
  <Wrapper $noMargin={true} $last={true}>
    <Content>
      <h2>Un besoin particulier ? Un retour ? Contactez-nous</h2>
      <p>
        Nous sommes à l'écoute de vos besoins, que vous soyez une administration
        publique, une collectivité, une entreprise (banque, courtier, agence
        immobilière, etc.) ou un professionnel du secteur (conseiller France
        Rénov', Mon Accompagnateur Rénov, ADIL, etc).
      </p>
      <p>
        Nouvelles fonctionnalités, personnalisation de l'intégration,
        partenariat spécifique : discutons de vos besoins.
      </p>
      <p>
        Découvrez aussi notre{' '}
        {type == 'iframe' && (
          <Link href="/api-doc">API de calcul des aides à la rénovation</Link>
        )}
        {type == 'api' && (
          <Link href="/npm">
            paquet NPM de calcul des aides à la rénovation
          </Link>
        )}
        {type == 'npm' && (
          <Link href="/api-doc">API de calcul des aides à la rénovation</Link>
        )}
        .
      </p>
      <CTAWrapper $justify="center">
        <CTA $fontSize="normal">
          <Link href="mailto:contact@mesaidesreno.fr">✉️ Nous contacter</Link>
        </CTA>
      </CTAWrapper>
    </Content>
  </Wrapper>
)

export const IframeCodeWrapper = styled.div`
  background: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  border: 1px solid #eee;
`
