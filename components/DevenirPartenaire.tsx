'use client'
import { PageBlock } from '@/components/UI'
import illustrationIntegration from '@/public/illustration-integration.png'
import iconChrono from '@/public/chrono.svg'
import iconChiffrage from '@/public/chiffrage.svg'
import iconMarianne from '@/public/marianne-sans-texte-cropped.svg'
import iconIntegration from '@/public/integration.svg'
import iconPaper from '@/public/paper.svg'

import logoOFI from '@/public/logo-partenaire/logo-ouestfrance-immo.png'
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote-rect.png'
import logoAdeme from '@/public/logo-partenaire/logo-ademe.svg'
import logoProReno from '@/public/logo-partenaire/logo-pro-reno.webp'

import Image from 'next/image'
import Link from 'next/link'
import { HeaderWrapper } from '@/app/LandingUI'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Tile from '@codegouvfr/react-dsfr/Tile'

export default function DevenirPartenaire() {
  return (
    <PageBlock>
      <HeaderWrapper
        image={{
          src: illustrationIntegration,
          alt: 'Simulateur de calcul des aides MaPrimeRénov parcours accompagné',
        }}
      >
        <Badge noIcon>
          <span aria-hidden="true">⭐️</span> Aides à la rénovation énergétique
        </Badge>
        <h1>
          Proposez à vos utilisateurs un calcul personnalisé et actualisé des
          aides à la rénovation énergétique.
        </h1>
        <Link
          className="fr-btn fr-icon-arrow-right-line fr-btn--icon-left"
          href="/contact"
        >
          Demandez une démo
        </Link>
      </HeaderWrapper>

      <h2>Intégrez la solution Mes Aides Réno au bon format</h2>
      <p>
        Dans un article, sur votre site web ou dans vos logiciels métiers, via
        une iframe ou une API.
      </p>
      <div className="fr-grid-row fr-grid-row--gutters fr-my-5v">
        <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <Tile
            enlargeLinkOrButton
            imageAlt="icone d'une iframe"
            imageUrl="/icon-iframe.svg"
            linkProps={{
              href: '/integration',
            }}
            orientation="vertical"
            title="Iframe"
            desc="pour s'intégrer sur votre site web."
            titleAs="h3"
          />
        </div>
        <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <Tile
            enlargeLinkOrButton
            imageAlt="icone d'une API"
            imageUrl="/icon-api.png"
            linkProps={{
              href: '/api-doc',
            }}
            orientation="vertical"
            title="API"
            desc="pour communiquer avec notre logiciel."
            titleAs="h3"
          />
        </div>
      </div>
      <h2 className="fr-mt-5v">L’accompagnement sur-mesure</h2>
      <p>
        <strong>
          L’équipe vous aide à intégrer les outils adaptés à vos besoins,
          gratuitement.
        </strong>{' '}
        Écrivez-nous, nous vous répondrons sous 3 jours ouvrés.
      </p>
      <Link
        className="fr-link fr-icon-mail-line fr-btn--icon-left fr-mb-5v"
        href="/contact"
      >
        Prendre contact
      </Link>

      <h2 className="fr-mt-5v">Nos avantages</h2>
      <div
        className="fr-grid-row fr-grid-row--gutters fr-my-5v"
        css={`
          .fr-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            > div {
              height: 80px;
              align-items: center;
              display: flex;
            }
            strong {
              margin: 1rem 0;
              display: block;
              text-align: center;
            }
          }
        `}
      >
        <div className="fr-col">
          <div>
            <Image
              className="fr-img-responsive"
              src={iconChrono}
              alt="icone chrono"
            />
          </div>
          <p>
            <strong>Gain de temps</strong>
            Vous nous déléguez les mises à jour et l'ajout de nouvelles aides.
          </p>
        </div>
        <div className="fr-col">
          <div>
            <Image
              className="fr-img-responsive"
              src={iconChiffrage}
              alt="icone euro"
            />
          </div>
          <p>
            <strong>Chiffrage exact</strong>
            Nous mettons à jour en continu les dispositifs d'aides.
          </p>
        </div>
        <div className="fr-col">
          <div>
            <Image
              className="fr-img-responsive"
              src={iconMarianne}
              alt="icone marianne"
            />
          </div>
          <p>
            <strong>Réputation</strong>
            Vous intégrez un calculateur officiel de l'État.
          </p>
        </div>
        <div className="fr-col">
          <div>
            <Image
              className="fr-img-responsive"
              src={iconIntegration}
              alt="icone toggle"
            />
          </div>
          <p>
            <strong>Intégration fluide</strong>
            Notre solution s’intègre facilement dans votre parcours utilisateur.
          </p>
        </div>
        <div className="fr-col">
          <div>
            <Image
              className="fr-img-responsive"
              src={iconPaper}
              alt="icone feuille"
            />
          </div>
          <p>
            <strong>Neutre et Gratuit</strong>
            Notre solution est garantie service public et mise à disposition
            gracieusement.
          </p>
        </div>
      </div>
      <h2 className="fr-mt-5v">Ils nous font déjà confiance</h2>
      <div
        css={`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
          img {
            max-width: 200px;
            height: auto;
          }
          a {
            color: transparent;
            &:hover {
              background-size: 0;
            }
            &::after {
              width: 0;
            }
          }
        `}
      >
        <a
          title="Ouest France Immo - nouvelle fenêtre"
          className="fr-link"
          rel="noopener external"
          href="https://ouest-france-immo.com/"
          target="_blank"
        >
          <Image src={logoOFI} alt="Logo Ouest France Immo" />
        </a>
        <a
          title="Ademe - nouvelle fenêtre"
          className="fr-link"
          rel="noopener external"
          href="https://agirpourlatransition.ademe.fr/"
          target="_blank"
        >
          <Image src={logoAdeme} alt="Logo Ademe" />
        </a>
        <a
          title="Bon Pote - nouvelle fenêtre"
          className="fr-link"
          rel="noopener external"
          href="https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/"
          target="_blank"
        >
          <Image src={logoBonPote} alt="Logo Bon Pote" />
        </a>
        <a
          title="Pro Réno - nouvelle fenêtre"
          className="fr-link"
          rel="noopener external"
          href="https://www.proreno.fr/services/mes-aides-reno"
          target="_blank"
        >
          <Image src={logoProReno} alt="Logo Pro Réno" />
        </a>
      </div>
    </PageBlock>
  )
}
