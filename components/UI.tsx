'use client'
import styled from 'styled-components'

export const Main = styled.main`
  width: 98vw;
  padding: 0 1vw;
  padding-bottom: 6vh;
  margin: 0 auto;
  padding-top: calc(1.5vh + 1.5vw);
`

export const Section = styled.section`
  margin: 0 auto;
  width: 800px;
  max-width: 100%;
`
export const cardBorder = `

  padding: 1.2vh calc(.5rem + 1vw);
  border: 2px solid #dfdff1;
  border-radius: 0.3rem;
`
export const Card = styled.div`
  background: white;
  margin: 0.6rem 0;
  ${(p) => (p.$background ? `background: ${p.$background};` : '')}
  ${cardBorder}
  ${(p) => p.$noBorder && `border: none;`}
`

export const FooterWrapper = styled.footer`
  border-top: 2px solid #000091;
  background: #f5f5fe;
  text-align: center;
  padding: 2rem;
  ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style-type: none;
    li {
      margin: 0 0.6rem;
    }
  }
`

export const PageBlock = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
`

export const TopBanner = styled.p`
  strong {
    position: fixed;
    margin: 0 auto;
    top: 0;
    left: 0;
    background: salmon;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      #f0b50f 48%,
      rgba(255, 255, 255, 1) 100%
    );
    white-space: nowrap;
    padding: 0.1rem 1rem;
    width: 100vw;
    text-align: center;
  }
`

export const CTAWrapper = styled.div`
  margin: 3vh 0;
  display: flex;
  align-items: center;
  justify-content: ${(p) => p.$justify || 'right'};
  > div {
    margin-right: 1rem;
  }
  > div:last-child {
    margin-right: 0;
  }
  }
`
export const CTA = styled.div`
  > button {
    border: none;
    background: none;
    font-size: inherit;
  }
  > a,
  > button,
  span {
    text-decoration: none;
    color: inherit;
  }

  ${(p) =>
    p.$importance === 'emptyBackground'
      ? `
  background: none;
  border: 1px solid var(--color);
  color: var(--color) !important;

		  `
      : p.$importance === 'secondary'
        ? `
  background: var(--lightestColor);
  border: 1px solid var(--lighterColor);
  color: var(--color);
  line-height: 1.1rem;
  `
        : p.$importance === 'inactive'
          ? `
	background: lightgrey; color: white;

		  `
          : `

  background: var(--color);
  border: 1px solid var(--color);
  color: white;
  `}
  ${(p) =>
    p.$fontSize === 'normal'
      ? ''
      : `
  font-size: 130%;
  @media (max-width: 800px) {
    font-size: 120%;
  }
  `}
  text-decoration: none;
  white-space: nowrap;
  > button,
  > a,
  > span {
    display: inline-block;

    ${(p) =>
      p.$importance === 'secondary'
        ? `padding: 0.2rem 1rem;`
        : `
    padding: 0.8rem 1.2rem;
	`}
  }
`
// Could not make it a button cause it traps the click for the outside details summary
export const LinkStyleButton = styled.span`
  background: none;
  text-decoration: underline;
  color: var(--color);
  border: none;
  font-size: inherit;
`
export const Intro = styled.div`
  margin: 1vh 0 1rem;
  width: 30rem;
  max-width: 90vw;
`

export const ConstraintedParagraphs = styled.div`
  p {
    max-width: 660px;
    margin: 0.6rem auto;
  }
`

export const BlocAide = styled.div`
  text-align: left;
  padding: 1.5rem 1.5rem 1.75rem;
  border: 1px solid #ddd;
  border-bottom: 3px solid #000091;
  margin-bottom: 1rem;
  .aide-header {
    display: flex;
    align-items: center;
    color: #2a82dd;
    font-weight: 500;

    > img {
      margin-right: 1.4rem;
      width: 3.5rem;
      height: auto;
    }
  }
  h3 {
    color: #000091;
    margin: 1rem 0rem;
  }
  .aide-details {
    font-size: 0.9rem;
    line-height: 1.25rem;
    color: #3a3a3a;
  }
`

// Style repris du design système FR pour le lien externe
// https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/lien
export const InlineLink = styled.a`
  color: #666;
  text-decoration: none;
  background-image: linear-gradient(0deg, currentColor, currentColor),
    linear-gradient(0deg, currentColor, currentColor);
  background-position:
    0 100%,
    0 calc(100% - 0.0625em);
  background-repeat: no-repeat, no-repeat;
  background-size:
    0 0.125em,
    100% 0.0625em;
  &:after {
    content: '';
    display: inline-block;
    flex: 0 0 auto;
    height: 1rem;
    margin-left: 0.25rem;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEwIDZ2Mkg1djExaDExdi01aDJ2NmExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY3YTEgMSAwIDAgMSAxLTFoNlptMTEtM3Y4aC0yVjYuNDEzbC03Ljc5MyA3Ljc5NC0xLjQxNC0xLjQxNEwxNy41ODUgNUgxM1YzaDhaIi8+PC9zdmc+);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEwIDZ2Mkg1djExaDExdi01aDJ2NmExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY3YTEgMSAwIDAgMSAxLTFoNlptMTEtM3Y4aC0yVjYuNDEzbC03Ljc5MyA3Ljc5NC0xLjQxNC0xLjQxNEwxNy41ODUgNUgxM1YzaDhaIi8+PC9zdmc+);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    vertical-align: calc(0.375em - 0.5rem);
    width: 1rem;
    background: #666;
  }
  &:hover {
    text-decoration: underline;
  }
`

export const PrimeStyle = styled.span`
  color: #356e3e;
  background: #bef2c5;
  border: 1px solid #356e3e4d;
  padding: 0.1rem 0.4rem 0.05rem;
  border-radius: 0.2rem;
  white-space: nowrap;
  width: fit-content;
  text-align: center;
  ${(p) => p.$inactive && `background: #eee; color: #666`}
  ${(p) =>
    p.$dashed &&
    `border-style: dashed !important; background: #ecf6ee !important`}
  ${(p) =>
    p.$secondary &&
    `background: transparent; border: none; em {font-weight: 500;text-decoration: underline solid #49c75d}; border-radius: 0; padding: 0`}
`

