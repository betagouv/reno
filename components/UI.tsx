'use client'
import styled from 'styled-components'

export const Main = styled.main`
  width: 98vw;
  padding: 0 1vw;
  padding-bottom: 6vh;
  margin: 0 auto;
`

export const Section = styled.section`
  margin: 0 auto;
  width: 800px;
  max-width: 100%;
`
export const cardBorder = `

  padding: 1.2vh calc(.4rem + 1vw);
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
  text-align: right;
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
`
export const CTA = styled.div`
  > button {
    border: none;
    background: none;
    font-size: inherit;
  }
  > a {
    text-decoration: none;
    color: inherit;
  }

  ${(p) =>
    p.$importance === 'secondary'
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
  margin: 3vh 0 1.6rem;
  width: 30rem;
  max-width: 90vw;
`

export const ConstraintedParagraphs = styled.div`
  p {
    max-width: 660px;
    margin: 0.6rem auto;
  }
`
