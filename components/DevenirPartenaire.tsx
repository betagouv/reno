'use client'
import { Card, CTA, CTAWrapper, ExternalLink, PageBlock } from '@/components/UI'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationIntegration from '@/public/illustration-integration.png'
import iconChrono from '@/public/chrono.svg'
import iconChiffrage from '@/public/chiffrage.svg'
import iconMarianne from '@/public/marianne-sans-texte-cropped.svg'
import iconIntegration from '@/public/integration.svg'
import iconPaper from '@/public/paper.svg'

import iframeIcon from '@/public/icon-iframe.svg'
import apiIcon from '@/public/icon-api.png'
import npmIcon from '@/public/icon-npm.png'

import logoOFI from '@/public/logo-partenaire/logo-ouestfrance-immo.png'
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote-rect.png'
import logoAdeme from '@/public/logo-partenaire/logo-ademe.svg'
import logoProReno from '@/public/logo-partenaire/logo-pro-reno.webp'

import Image from 'next/image'
import styled from 'styled-components'
import Link from 'next/link'
import { HeaderWrapper } from '@/app/LandingUI'

export default function DevenirPartenaire() {
  return (
    <PageBlock>
      <HeaderWrapper
        css={`
          margin: 3rem auto;
          gap: 1rem;
        `}
      >
        <Image
          css={`
            @media (min-width: 800px) {
              width: 100% !important;
              height: auto;
              margin: 0 !important;
            }
          `}
          src={illustrationIntegration}
          alt="Simulateur de calcul des aides MaPrimeRénov Parcours Accompagné"
        />
        <div>
          <p
            css={`
              margin: 0;
              background: #fdf8db;
              color: #6e4444 !important;
              border-radius: 1rem;
              font-weight: bold;
              width: fit-content;
              padding: 0 1rem;
            `}
          >
            <span aria-hidden="true">⭐️</span> Aides à la rénovation
            énergétique
          </p>
          <h1
            css={`
              margin-top: 0.6rem;
              margin-bottom: 1rem;
              font-size: 180%;
            `}
          >
            Proposez à vos utilisateurs un calcul personnalisé et actualisé des
            aides à la rénovation énergétique.
          </h1>
          <CTAWrapper $justify="left">
            <CTA $fontSize="normal">
              <Link href="/contact">
                <span aria-hidden="true">➔</span>&nbsp;&nbsp;Demandez une démo
              </Link>
            </CTA>
          </CTAWrapper>
        </div>
      </HeaderWrapper>
      <Wrapper $noMargin={true}>
        <Content>
          <h2
            css={`
              text-align: center;
              margin: 3vh 0 0 0;
            `}
          >
            Intégrez la solution Mes Aides Réno au bon format
          </h2>
          <p
            css={`
              font-size: 0.95rem;
            `}
          >
            Dans un article, sur votre site web ou dans vos logiciels métiers,
            via une iframe, un paquet NPM ou une API.
          </p>
          <CardMosaic>
            <Card>
              <Link href="/integration">
                <Image src={iframeIcon} alt="icone iframe" />
                <h3>Iframe</h3>
                <p>pour s'intégrer sur votre site web.</p>
              </Link>
            </Card>
            <Card>
              <Link href="/api-doc">
                <Image src={apiIcon} alt="icone API" />
                <h3>API</h3>
                <p>pour communiquer avec notre logiciel.</p>
              </Link>
            </Card>
            <Card>
              <Link href="/npm">
                <Image src={npmIcon} alt="icone NPM" />
                <h3>Paquet NPM</h3>
                <p>pour utiliser le modèle au sein de votre logiciel.</p>
              </Link>
            </Card>
          </CardMosaic>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true}>
        <Content
          css={`
            text-align: center;
            margin: 4vh auto;
          `}
        >
          <h2>L’accompagnement sur-mesure</h2>
          <p>
            <strong
              css={`
                display: block;
                margin: auto;
              `}
            >
              L’équipe vous aide à intégrer les outils adaptés à vos besoins,
              gratuitement.
            </strong>
            Écrivez-nous, nous vous répondrons sous 3 jours ouvrés.
          </p>
          <CTAWrapper $justify="center">
            <CTA $fontSize="normal">
              <Link href="/contact">
                <span aria-hidden="true">✉</span> Prendre contact
              </Link>
            </CTA>
          </CTAWrapper>
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
        <Content
          css={`
            text-align: center;
            margin: 4vh auto;
          `}
        >
          <h2
            css={`
              text-align: center;
              margin: 2rem;
            `}
          >
            Ils nous font déjà confiance
          </h2>
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
  position: relative;
  z-index: 1;
  > div {
    max-width: 18rem;
    min-width: 250px;
    position: relative;
    flex: 1;
    &:hover {
      background: #e8edff;
      cursor: pointer;
    }
    &:after {
      right: 2rem;
      background-color: var(--color);
      content: '';
      display: block;
      float: right;
      flex: 0 0 auto;
      -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTE2LjE3MiAxMS01LjM2NC01LjM2NCAxLjQxNC0xLjQxNEwyMCAxMmwtNy43NzggNy43NzgtMS40MTQtMS40MTRMMTYuMTcyIDEzSDR2LTJoMTIuMTcyWiIvPjwvc3ZnPg==);
      mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTE2LjE3MiAxMS01LjM2NC01LjM2NCAxLjQxNC0xLjQxNEwyMCAxMmwtNy43NzggNy43NzgtMS40MTQtMS40MTRMMTYuMTcyIDEzSDR2LTJoMTIuMTcyWiIvPjwvc3ZnPg==);
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      height: 1.5rem;
      width: 1.5rem;
    }
    img {
      display: block;
      object-fit: cover;
      width: 100%;
      height: auto;
      padding: ${(p) => (p.$noPadding ? '0rem' : '2rem')};
    }
    h2 {
      margin: 0 0 1rem 0;
      color: var(--color);
      font-size: ${(p) => (p.$smallTitle ? '1.2rem' : '130%')};
    }
    h3 {
      margin: 1rem 0;
      color: var(--color);
      font-size: ${(p) => (p.$smallTitle ? '1.2rem' : '130%')};
    }
    p {
      color: black;
    }
    a {
      text-decoration: none;
      color: var(--color);
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        content: '';
      }
    }
  }
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
