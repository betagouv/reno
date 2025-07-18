'use client'
import { HeaderWrapper } from '@/app/LandingUI'
import Link from 'next/link'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import getAppUrl from './getAppUrl'
import { PageBlock, Intro } from './UI'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import IntegrationQuestions from './IntegrationQuestions'
import useResizeIframeFromHost from './useResizeIframeFromHost'
import Demonstration from '@/app/module/Demonstration'
import calculetteImage from '@/public/illuModule.png'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
import { Card } from '@codegouvfr/react-dsfr/Card'
import Select from '@codegouvfr/react-dsfr/Select'

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
      titre: 'Calculette parcours accompagné',
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
          "Calculette MaPrimeRénov' - " +
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
          'Calculette "Coup de Pouce" - ' +
          rules[item.replace(' . Coup de pouce', '')].titre,
        valeur:
          '/aides/coup-de-pouce/' +
          encodeURIComponent(rules[item.replace(' . Coup de pouce', '')].titre),
      }),
    )

  const iframeCode = `<iframe id="mesaidesreno" src="${getAppUrl() + module}" allow="clipboard-read; clipboard-write" style="width: 400px; height: 700px; margin: 3rem auto; display: block; border: 0.2rem solid black; border-radius: 1rem;"></iframe>`

  const iframeRef = useRef()

  const [noScroll, setNoScroll] = useResizeIframeFromHost(iframeRef)
  const [sendUserDataOption, setSendUserDataOption] = useState(false)

  return (
    <main>
      <PageBlock>
        <Content>
          <Breadcrumb
            currentPageLabel="Les iframes"
            homeLinkProps={{
              href: '/',
            }}
            segments={[
              {
                label: 'Devenir partenaire',
                linkProps: {
                  href: '/devenir-partenaire',
                },
              },
            ]}
          />
        </Content>
        <HeaderWrapper
          image={{
            src: calculetteImage,
            alt: 'Une personne utilise une calculatrice sur son bureau',
          }}
        >
          <h1>
            Intégrer les calculettes des aides à la rénovation sur votre site.
          </h1>
          <Intro>
            <p>
              Mes Aides Réno est un service public de calcul des aides à la
              rénovation énergétique. Le sujet est complexe, les aides sont
              multiples, les règles sont mouvantes.
            </p>
            <p>
              En intégrant directement nos calculatettes sous forme d'iframe
              chez vous, vous permettez à vos utilisateurs d'estimer leurs aides
              sans qu'ils quittent votre site.
            </p>
          </Intro>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <h2>Nos dernières calculettes:</h2>
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
                <Card
                  background
                  border
                  desc="Evaluez l'impact financier d'une rénovation sur votre facture d'énergie."
                  enlargeLink
                  imageAlt="Illustration Facture"
                  imageUrl="/illuFacture.png"
                  linkProps={{
                    href: '/module/facture/demonstration',
                  }}
                  size="medium"
                  title="Facture énergétique"
                  titleAs="h3"
                />
              </div>
              <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
                <Card
                  background
                  border
                  desc="Estimez la plus-value de votre logement après sa rénovation."
                  enlargeLink
                  imageAlt="Illustration Plus Value"
                  imageUrl="/illuPlusValue.png"
                  linkProps={{
                    href: '/module/plus-value/demonstration',
                  }}
                  size="medium"
                  title="Ma plus-value Réno"
                  titleAs="h3"
                />
              </div>
              <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
                <Card
                  background
                  border
                  desc="Calculez l'ensemble de vos aides pour une rénovation d'ampleur."
                  enlargeLink
                  imageAlt="Illustration Ampleur"
                  imageUrl="/illuAmpleur.png"
                  linkProps={{
                    href: '/module',
                  }}
                  size="medium"
                  title="Rénovation d'ampleur"
                  titleAs="h3"
                />
              </div>
              {/* <Card>
                <Image src={ampleurImage} alt="Logo Ampleur" />
                <h3>
                  <Link href="/module/facture/demonstration">
                    Facture d'énergie
                  </Link>
                </h3>
                <p>
                  Calculez les économies d'énergie découlant d'une rénovation
                  énergétique.
                </p>
              </Card> */}
            </div>
            <Select
              nativeSelectProps={{
                onChange: (e) => handleModuleChange(e.target.value),
                value: module,
              }}
              label="Sélectionnez la calculette à intégrer :"
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
                <p>
                  Voici <strong>le code à intégrer</strong> dans votre HTML ou
                  votre contenu Wordpress :
                </p>
                <Highlight>
                  <code
                    css={`
                      word-break: break-all;
                    `}
                  >
                    {iframeCode}
                  </code>
                </Highlight>
                <IntegrationQuestions
                  {...{
                    noScroll,
                    setNoScroll,
                    sendUserDataOption,
                    setSendUserDataOption,
                  }}
                />
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
                    src={
                      getAppUrl() +
                      module +
                      (sendUserDataOption
                        ? '?sendDataToHost=true&hostTitle=SuperRéno'
                        : '')
                    }
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
        dispositif principal MaPrimeRénov’ parcours accompagné (pour une
        rénovation d’ampleur).{' '}
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
        Il inclut non seulement MaPrimeRénov’ parcours accompagné mais aussi les
        autres aides principales dont l'éco-PTZ, le prêt avance rénovation, le
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
          <a
            rel="noopener external"
            className="fr-link"
            href="https://github.com/betagouv/reno/pull/281"
          >
            par ici
          </a>{' '}
          : tout notre développement est ouvert.
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
        Rénov', Mon Accompagnateur Rénov', ADIL, etc).
      </p>
      <p>
        Nouvelles fonctionnalités, personnalisation de l'intégration,
        partenariat spécifique : discutons de vos besoins.
      </p>
      <p>
        Découvrez aussi notre{' '}
        {type == 'iframe' && (
          <Link className="fr-link" href="/api-doc">
            API de calcul des aides à la rénovation
          </Link>
        )}
        {type == 'api' && (
          <Link className="fr-link" href="/npm">
            paquet NPM de calcul des aides à la rénovation
          </Link>
        )}
        {type == 'npm' && (
          <Link className="fr-link" href="/api-doc">
            API de calcul des aides à la rénovation
          </Link>
        )}
        .
      </p>
      <Link
        className="fr-btn fr-icon-mail-line fr-btn--icon-left"
        href="mailto:contact@mesaidesreno.fr"
      >
        Nous contacter
      </Link>
    </Content>
  </Wrapper>
)
