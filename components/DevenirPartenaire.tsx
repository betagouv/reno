'use client'
import { InternalLink, PageBlock } from '@/components/UI'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAmpleur from '@/public/illustration-ampleur.png'
import iconChrono from '@/public/chrono.svg'
import iconEuro from '@/public/euro.svg'
import iconMarianne from '@/public/marianne-sans-texte-cropped.svg'
import iconCogs from '@/public/cogs.svg'
import checkIcon from '@/public/check-green.svg'
import Image from 'next/image'
import styled, { css } from 'styled-components'
import { BlueEm, HeaderWrapper, HomeList } from '@/app/LandingUI'


export default function DevenirPartenaire() {
    return (
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={illustrationAmpleur}
            alt="Simulateur de calcul des aides MaPrimeRénov Parcours Accompagné"
            css={`
              margin: 4rem 2rem !important;
              box-shadow: var(--shadow-elevation-medium);
              `}
          />
          <div>
            <h1
              css={`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              Offrez un <BlueEm>calcul personnalisé</BlueEm> et à jour des aides à la <BlueEm>rénovation énergétique</BlueEm> à vos utilisateurs.
            </h1>
          </div>
        </HeaderWrapper>
        <Wrapper $noMargin={true} >
          <Content>
            <h2 css={`text-align: center;margin: 3vh`}>
                Intégrez la solution <BlueEm>Mes Aides Réno</BlueEm><br />
                dans vos logiciels métier et sites web
            </h2>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} >
          <Content>
            <h2 css={"text-align: center; margin-bottom: 4rem;"}>
                Les <strong css={`
                  color: green; 
                  border: 3px solid green;
                  padding: 0 0.5rem 0.2rem 0.5rem;
                  border-radius: 50%;
                  `}>+</strong>  de <BlueEm>Mes Aides Réno</BlueEm> pour votre activité
            </h2>
            <OrderedList>
                <li>
                    <Image src={iconChrono} />
                    <h3>Gain de temps</h3>
                    <p>Vous nous déléguez les mises à jour et l’ajout de nouvelles aides.</p>
                </li>
                <li>
                    <Image src={iconEuro} />
                    <h3>Chiffrage exact</h3>
                    <p>Le calculateur intègre les données à la source</p>
                </li>
                <li>
                    <Image src={iconMarianne} css={`width: 80% !important;`} />
                    <h3>Réputation</h3>
                    <p>Vous intégrez un calculateur officiel</p>
                </li>
                <li>
                    <Image src={iconCogs} />
                    <h3>Intégration fluide</h3>
                    <p>Dans vos parcours utilisateurs avec notre API</p>
                </li>
            </OrderedList>
          </Content>
        </Wrapper>
        <Wrapper $noMargin={true} >
          <Content>
            <h2 css={"text-align: center; margin-bottom: 4rem;"}>
              Les caractéristiques du calculateur Mes Aides Réno
            </h2>
            <ul css={`
              list-style-type: none; 
              li { 
                display: flex; 
                align-items: center; 
                margin: 0.5rem 0;
                img {
                  margin-right: 0.5rem;
                }
              }`}>
              <li>
                <Image src={checkIcon} width="30" alt="Icône case cochée" />
                deux intégrations possibles : iframe ou API *
              </li>
              <li>
                <Image src={checkIcon} width="30" alt="Icône case cochée" />
                chiffrage des aides personnalisé
              </li>
              <li>
                <Image src={checkIcon} width="30" alt="Icône case cochée" />
                mis à jour en continu
              </li>
              <li>
                <Image src={checkIcon} width="30" alt="Icône case cochée" />
                des modules spécifiques pour les passoires thermiques, les pompes à chaleur, les copropriétés, les aides CEE…
              </li>
              <li>
                <Image src={checkIcon} width="30" alt="Icône case cochée" />
                neutre (garantie service public)
              </li>
              <li>
                <Image src={checkIcon} width="30" alt="Icône case cochée" />
                mis à disposition gracieusement
              </li>
            </ul>
            <p>* Consultez les détails techniques concernant l'intégration de <InternalLink href="/api-doc" css={`text-decoration: underline;`}>nos iframes</InternalLink> ou de nos <InternalLink href="/api-doc" css={`text-decoration: underline;`}>API</InternalLink>.</p>
          </Content>
        </Wrapper>
      </PageBlock>
    )
}

export const OrderedList = styled(HomeList)`
  align-items: flex-start;
  li {
      width: 25%;
      min-width: 200px;
      margin: 0;
      img {
        width: auto;
        height: 70px;
      }
  }
`