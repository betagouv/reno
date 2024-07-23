'use client'
import styled from 'styled-components'
import Link from 'next/link'

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
  &.fr-footer {
    box-shadow: inset 0 2px 0 0 #000091,inset 0 -1px 0 0 #ddd;
    padding-top: 2rem;
    width: 100%;
    font-size: .75rem;
  }
  .fr-footer__top {
    background-color: #f6f6f6;
    display: flex;
    margin: -1.875rem 0 0;
    padding: 2rem 0 1rem;
  }
  .fr-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .fr-grid-row--gutters {
    margin: -.5rem;
  }
  .fr-grid-row--gutters>[class^=fr-col-] {
    padding: 1rem;
  }
  .fr-grid-row {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .fr-footer__top-cat {
    color: #161616;
    display: block;
    font-size: .75rem;
    font-weight: 700;
    line-height: 1.25rem;
    margin: 0 0 .75rem;
    text-align: left;
  }
  .fr-footer__top-list {
    font-size: .75rem;
    line-height: 1.25rem;
    margin: 0;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  .fr-footer__top-list li {
    margin-bottom: .75rem;
  }
  .fr-footer__top-link {
    line-height: 1.25rem;
  }

  .fr-footer__bottom {
    font-size: 1rem;
    line-height: 1.5rem;
    align-items: center;
    box-shadow: inset 0 1px 0 0 #ddd;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 1.5rem 1rem 0 1rem;
    color: #666;
    .fr-footer_bottom-list {
      margin: 0;
      padding: .5rem 0;
      width: 100%;
      .fr-footer__bottom-item {
        display: inline;
        margin: .5rem 0 0 .25rem;
        position: relative;
        a {
          font-size: .75rem;
          line-height: 1.25rem;
        }
        &:first-child {
            margin: .5rem .25rem 0 0;
            &::before {
              box-shadow: none;
              width: 0px;
              margin: 0;
            }
        }
        &::before {
          box-shadow: inset 0 0 0 1px #ddd;
          content: "";
          display: inline-block;
          height: 1rem;
          margin-bottom: .625rem;
          margin-right: .75rem;
          margin-top: .625rem;
          position: relative;
          vertical-align: middle;
          width: 1px;
        }
      }
    }
    .fr-footer__bottom-copy {
      font-size: .75rem;
      line-height: 1.25rem;
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
export const ExternalLink = styled.a`
    color: inherit;
    text-decoration: none;
    -webkit-text-decoration: none;
    cursor: pointer;
    &[href] {
        background-image: linear-gradient(0deg,rgb(58, 58, 58),rgb(58, 58, 58)),linear-gradient(0deg,rgb(58, 58, 58),rgb(58, 58, 58));
        background-position: 0 100%,0 calc(100% - .0625em);
        background-repeat: no-repeat,no-repeat;
        background-size: 0 .125em,0 .0625em;
        transition: background-size 0s;
    }
    &::after {
      background-color: currentColor;
      content: "";
      display: inline-block;
      flex: 0 0 auto;
      height: 1rem;
      margin-left: .25rem;
      -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEwIDZ2Mkg1djExaDExdi01aDJ2NmExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY3YTEgMSAwIDAgMSAxLTFoNlptMTEtM3Y4aC0yVjYuNDEzbC03Ljc5MyA3Ljc5NC0xLjQxNC0xLjQxNEwxNy41ODUgNUgxM1YzaDhaIi8+PC9zdmc+);
      mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEwIDZ2Mkg1djExaDExdi01aDJ2NmExIDEgMCAwIDEtMSAxSDRhMSAxIDAgMCAxLTEtMVY3YTEgMSAwIDAgMSAxLTFoNlptMTEtM3Y4aC0yVjYuNDEzbC03Ljc5MyA3Ljc5NC0xLjQxNC0xLjQxNEwxNy41ODUgNUgxM1YzaDhaIi8+PC9zdmc+);
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      vertical-align: calc(.375em - .5rem);
      width: 1rem;
    }
    &:hover {
      background-color: transparent;
      background-size: 100% calc(0.0625em * 2), 100% 0.0625em;
    }
}
`
export const InternalLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  -webkit-text-decoration: none;
  cursor: pointer;
  &[href] {
      background-image: linear-gradient(0deg,rgb(58, 58, 58),rgb(58, 58, 58)),linear-gradient(0deg,rgb(58, 58, 58),rgb(58, 58, 58));
      background-position: 0 100%,0 calc(100% - .0625em);
      background-repeat: no-repeat,no-repeat;
      background-size: 0 .125em,0 .0625em;
      transition: background-size 0s;
  }
  &:hover {
    background-color: transparent;
    background-size: 100% calc(0.0625em * 2), 100% 0.0625em;
  }
`;