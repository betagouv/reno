'use client'
import { ExternalLink, PageBlock } from '@/components/UI'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
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
import styled from 'styled-components'
import Link from 'next/link'
import { HeaderWrapper } from '@/app/LandingUI'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Card from '@codegouvfr/react-dsfr/Card'

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
      <Wrapper $noMargin={true}>
        <Content>
          <h2>Intégrez la solution Mes Aides Réno au bon format</h2>
          <p>
            Dans un article, sur votre site web ou dans vos logiciels métiers,
            via une iframe, un paquet NPM ou une API.
          </p>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
              <Card
                background
                border
                desc="pour s'intégrer sur votre site web."
                enlargeLink
                imageAlt="icone iframe"
                imageUrl="/icon-iframe.svg"
                linkProps={{
                  href: '/integration',
                }}
                size="medium"
                title="Iframe"
                titleAs="h3"
              />
            </div>
            <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
              <Card
                background
                border
                desc="pour communiquer avec notre logiciel."
                enlargeLink
                imageAlt="icone API"
                imageUrl="/icon-api.png"
                linkProps={{
                  href: '/api-doc',
                }}
                size="medium"
                title="API"
                titleAs="h3"
              />
            </div>
            <div className="fr-col-12 fr-col-sm-6 fr-col-md-4">
              <Card
                background
                border
                desc="pour utiliser le modèle au sein de votre logiciel."
                enlargeLink
                imageAlt="icone NPM"
                imageUrl="/icon-npm.png"
                linkProps={{
                  href: '/npm',
                }}
                size="medium"
                title="Paquet NPM"
                titleAs="h3"
              />
            </div>
          </div>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <h2>L’accompagnement sur-mesure</h2>
          <p>
            <strong>
              L’équipe vous aide à intégrer les outils adaptés à vos besoins,
              gratuitement.
            </strong>
            Écrivez-nous, nous vous répondrons sous 3 jours ouvrés.
          </p>
          <Link
            className="fr-btn fr-icon-mail-line fr-btn--icon-left"
            href="/contact"
          >
            Prendre contact
          </Link>
        </Content>
      </Wrapper>
      <Wrapper $noMargin={true}>
        <Content>
          <List>
            <div>
              <div className="img-container">
                <Image src={iconChrono} alt="icone chrono" />
              </div>
              <p>
                <strong>Gain de temps</strong>
                Vous nous déléguez les mises à jour et l'ajout de nouvelles
                aides.
              </p>
            </div>
            <div>
              <div className="img-container">
                <Image src={iconChiffrage} alt="icone euro" />
              </div>
              <p>
                <strong>Chiffrage exact</strong>
                Nous mettons à jour en continu les dispositifs d'aides.
              </p>
            </div>
            <div>
              <div className="img-container">
                <Image
                  src={iconMarianne}
                  css={`
                    width: 80% !important;
                  `}
                  alt="icone marianne"
                />
              </div>
              <p>
                <strong>Réputation</strong>
                Vous intégrez un calculateur officiel de l'État.
              </p>
            </div>
            <div>
              <div className="img-container">
                <Image src={iconIntegration} alt="icone toggle" />
              </div>
              <p>
                <strong>Intégration fluide</strong>
                Notre solution s’intègre facilement dans votre parcours
                utilisateur.
              </p>
            </div>
            <div>
              <div className="img-container">
                <Image src={iconPaper} alt="icone feuille" />
              </div>
              <p>
                <strong>Neutre et Gratuit</strong>
                Notre solution est garantie service public et mise à disposition
                gracieusement.
              </p>
            </div>
          </List>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true} $last={true}>
        <Content>
          <h2>Ils nous font déjà confiance</h2>
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
                &:hover {
                  background-size: 0;
                }
                &::after {
                  width: 0;
                }
              }
            `}
          >
            <ExternalLink href="https://ouest-france-immo.com/" target="_blank">
              <Image src={logoOFI} alt="Logo Ouest France Immo" />
            </ExternalLink>
            <ExternalLink
              href="https://agirpourlatransition.ademe.fr/"
              target="_blank"
            >
              <Image src={logoAdeme} alt="Logo Ademe" />
            </ExternalLink>
            <ExternalLink
              href="https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/"
              target="_blank"
            >
              <Image src={logoBonPote} alt="Logo Bon Pote" />
            </ExternalLink>
            <ExternalLink
              href="https://www.proreno.fr/services/mes-aides-reno"
              target="_blank"
            >
              <Image
                src={logoProReno}
                alt="Logo Pro Réno"
                css={`
                  background: lightgrey;
                  padding: 8px;
                `}
              />
            </ExternalLink>
          </div>
        </Content>
      </Wrapper>
    </PageBlock>
  )
}

export const CardMosaic = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`

export const List = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  list-style-type: none;
  padding-left: 0;
  text-align: center;
  > div {
    width: 19%;
    @media (max-width: 600px) {
      width: 100%;
    }
    margin: 0;
    img {
      width: auto;
      height: 70px;
    }
    p {
      strong {
        display: block;
        font-size: 1.1rem;
        margin: 0.5rem 0;
      }
      color: black;
      line-height: 1.2rem;
    }
  }
`
