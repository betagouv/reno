'use client'
import styled from 'styled-components'
import Link from 'next/link'

export const Main = styled.main`
  width: 98vw;
  max-width: 100%; // pour éviter la barre de défilement horizontal dans les iframe
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

  padding: calc(.3rem + .7vw) calc(.5rem + 1vw);
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
    border-top: 3px solid var(--color);
    padding: 2rem 0.4rem 0;
    width: 100%;
  }
  > div {
    max-width: 1200px;
    margin: 0 auto;
  }
  .fr-footer__top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0;
    padding: 0;
  }
  .footer-col {
    padding: 0 0.5rem;
    width: 25%;
  }

  @media (max-width: 600px) {
    .fr-footer__top {
      justify-content: none;
    }
    .footer-col {
      width: 50%;
    }
  }
  @media (max-width: 400px) {
    .fr-footer__top {
      justify-content: none;
    }
    .footer-col {
      width: 100%;
    }
  }
  .fr-footer__top-cat {
    color: #161616;
    display: block;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.25rem;
    margin: 0 0 1rem;
    text-align: left;
  }
  .fr-footer__top-list {
    font-size: 0.85rem;
    line-height: 1.25rem;
    margin: 0;
  }
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  .fr-footer__top-list li {
    margin-bottom: 0.75rem;
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
      padding: 0.5rem 0;
      width: 100%;
      .fr-footer__bottom-item {
        display: inline;
        margin: 0.5rem 0 0 0.25rem;
        position: relative;
        a {
          font-size: 0.85rem;
          line-height: 1.25rem;
        }
        &:first-child {
          margin: 0.5rem 0.25rem 0 0;
          &::before {
            box-shadow: none;
            width: 0px;
            margin: 0;
          }
        }
        &::before {
          box-shadow: inset 0 0 0 1px #ddd;
          content: '';
          display: inline-block;
          height: 1rem;
          margin-bottom: 0.625rem;
          margin-right: 0.75rem;
          margin-top: 0.625rem;
          position: relative;
          vertical-align: middle;
          width: 1px;
        }
      }
    }
    .fr-footer__bottom-copy {
      font-size: 0.85rem;
      line-height: 1.25rem;
    }
  }
`

export const PageBlock = styled.div`
  min-height: 100%;
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

  ${(p) => p.$customCss}
`
export const CTA = styled.div`
  width: fit-content;

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
  cursor: pointer;
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
              border: 1px solid lightgrey;
              color: #929292;
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
  border-bottom: 3px solid var(--color);
  background: white;
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
    color: var(--color);
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
  ${(p) => p.$red && `background: #ffe9e9; color: #ce0500`}
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
    background-image: linear-gradient(0deg, rgb(58, 58, 58), rgb(58, 58, 58)),
      linear-gradient(0deg, rgb(58, 58, 58), rgb(58, 58, 58));
    background-position:
      0 100%,
      0 calc(100% - 0.0625em);
    background-repeat: no-repeat, no-repeat;
    background-size:
      0 0.125em,
      0 0.0625em;
    transition: background-size 0s;
  }
  &:hover {
    background-color: transparent;
    background-size:
      100% calc(0.0625em * 2),
      100% 0.0625em;
  }
`
export const MiseEnAvant = styled.div`
  background-image: linear-gradient(0deg, #0063cb, #0063cb),
    linear-gradient(0deg, #0063cb, #0063cb),
    linear-gradient(0deg, #0063cb, #0063cb),
    linear-gradient(0deg, #0063cb, #0063cb),
    linear-gradient(0deg, #0063cb, #0063cb);
  background-position:
    0 0,
    100% 0,
    0 100%,
    0 0,
    100% 100%;
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-size:
    0,
    0,
    0,
    2.5rem 100%;
  padding: 1rem 2.25rem 0.75rem 3.5rem;
  position: relative;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #0063cb;
  background-color: white;
  h3 {
    margin: 0 0 1rem 0;
  }
  &::before {
    content: '';
    background: #fff;
    display: inline-block;
    flex: 0 0 auto;
    height: 1.5rem;
    left: 0;
    margin: 1rem 0.5rem;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    position: absolute;
    top: 0;
    vertical-align: calc(0.375em - 0.75rem);
    width: 1.5rem;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE5LjUgMi41aC0xNWMtMS4xIDAtMiAuOS0yIDJ2MTVjMCAxLjEuOSAyIDIgMmgxNWMxLjEgMCAyLS45IDItMnYtMTVjMC0xLjEtLjktMi0yLTJ6TTEzIDE3aC0ydi02aDJ2NnptMC04aC0yVjdoMnYyeiIvPjwvc3ZnPg==);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE5LjUgMi41aC0xNWMtMS4xIDAtMiAuOS0yIDJ2MTVjMCAxLjEuOSAyIDIgMmgxNWMxLjEgMCAyLS45IDItMnYtMTVjMC0xLjEtLjktMi0yLTJ6TTEzIDE3aC0ydi02aDJ2NnptMC04aC0yVjdoMnYyeiIvPjwvc3ZnPg==);
  }
`
export const Badge = styled.span`
  align-items: center;
  background-color: #eee;
  border-radius: 0.25rem;
  color: #3a3a3a;
  display: inline-flex;
  flex-direction: row;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5rem;
  max-height: none;
  max-width: 100%;
  min-height: 1.5rem;
  overflow: initial;
  padding: 0 0.5rem;
  text-transform: uppercase;
  width: -moz-fit-content;
  width: fit-content;
`
export const CardLink = styled(Card)`
  &:hover {
    background: #e8edff;
  }
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  img {
    margin-right: 1rem;
  }
  h3 {
    margin-top: 1rem;
    color: var(--color);
  }
  p {
    color: black;
  }
`

export const Tabs = styled.div`
  align-items: flex-start;
  box-shadow: inset 0 -1px 0 0 #ddd;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: auto;
  margin-left: 0;
  margin-right: 0;
  margin-top: -4px;
  overflow: hidden;
  padding-top: 4px;
  position: relative;
  transition: height 0.3s;
  &:before {
    box-shadow:
      inset 0 1px 0 0 #ddd,
      inset 1px 0 0 0 #ddd,
      inset -1px 0 0 0 #ddd;
    content: '';
    display: block;
    height: 100%;
    margin-top: -1px;
    order: 2;
    width: 100%;
  }
`

export const TabHeaders = styled.ul`
  align-items: stretch;
  display: flex;
  margin: -4px 0;
  min-height: 3rem;
  order: 1;
  overflow-x: auto;
  padding: 4px 0.75rem 0px 0.75rem;
  width: 100%;
  z-index: 1;
  list-style-type: none;
`

export const TabHeader = styled.li`
  &::marker {
    display: none;
  }
  button {
    background-color: #fff;
    color: var(--color);
    appearance: none;
    border: none;
    &[aria-selected='true'] {
      background-size:
        100% 2px,
        1px calc(100% - 1px),
        1px calc(100% - 1px),
        0 1px;
      background-image: linear-gradient(0deg, var(--color), var(--color)),
        linear-gradient(0deg, #ddd, #ddd), linear-gradient(0deg, #ddd, #ddd),
        linear-gradient(0deg, #ddd, #ddd);
      &:before {
        background-color: var(--color);
      }
    }
    &:not([aria-selected='true']) {
      background-color: #e3e3fd;
      &:hover {
        background-color: #adadf9;
      }
      color: #161616;
      &:before {
        background-color: #161616;
      }
    }
    max-height: none;
    max-width: 100%;
    overflow: initial;
    align-items: center;
    background-position:
      0 0,
      0 calc(100% - 1px),
      100% calc(100% - 1px),
      100% 100%;
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    box-shadow: 0 2px 0 0 #fff;
    display: inline-flex;
    flex-direction: row;
    font-size: 1rem;
    font-weight: 700;
    height: 100%;
    line-height: 1.5rem;
    margin: 0 0.25rem;
    min-height: 2.5rem;
    overflow: visible;
    padding: 0.5rem 1rem;
    position: relative;
    white-space: nowrap;
    width: -moz-fit-content;
    width: fit-content;
    z-index: 1;
    &:before {
      content: '';
      -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwWm0wLTJhOCA4IDAgMSAwIDAtMTYgOCA4IDAgMCAwIDAgMTZabS0uOTk3LTRMNi43NiAxMS43NTdsMS40MTQtMS40MTQgMi44MjkgMi44MjkgNS42NTYtNS42NTcgMS40MTUgMS40MTRMMTEuMDAzIDE2WiIvPjwvc3ZnPg==);
      mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTEyIDIyQzYuNDc3IDIyIDIgMTcuNTIzIDIgMTJTNi40NzcgMiAxMiAyczEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEwWm0wLTJhOCA4IDAgMSAwIDAtMTYgOCA4IDAgMCAwIDAgMTZabS0uOTk3LTRMNi43NiAxMS43NTdsMS40MTQtMS40MTQgMi44MjkgMi44MjkgNS42NTYtNS42NTcgMS40MTUgMS40MTRMMTEuMDAzIDE2WiIvPjwvc3ZnPg==);
      flex: 0 0 auto;
      height: 1rem;
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      vertical-align: calc(0.375em - 0.75rem);
      width: 1rem;
      margin-left: -0.125rem;
      margin-right: 0.5rem;
    }
  }
`
export const TabPanel = styled.div`
  display: block;
  flex: 0 0 100%;
  height: auto;
  left: -100%;
  margin-right: -100%;
  order: 3;
  padding: 1rem;
  position: relative;
  transition:
    visibility 0.3s,
    transform 0.3s;
  width: 100%;
  border: 1px solid #ddd;
  background: white;
`

export const AccordionTitle = styled.button`
  background-color: white;
  align-items: center;
  color: var(--color);
  display: inline-flex;
  flex-direction: row;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  margin: 0;
  max-height: none;
  max-width: 100%;
  min-height: 3rem;
  overflow: initial;
  padding: 0.75rem 1rem;
  text-align: left;
  width: -moz-fit-content;
  width: fit-content;
  width: 100%;
  border: 1px solid #ddd;
  &:hover {
    background-color: #f6f6f6;
  }
  &::after {
    background-color: currentColor;
    content: '';
    display: inline-block;
    flex: 0 0 auto;
    height: 1rem;
    margin-left: auto;
    margin-right: 0;
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTEyIDEzLjE3MiA0Ljk1LTQuOTUgMS40MTQgMS40MTRMMTIgMTYgNS42MzYgOS42MzYgNy4wNSA4LjIyMmw0Ljk1IDQuOTVaIi8+PC9zdmc+);
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0ibTEyIDEzLjE3MiA0Ljk1LTQuOTUgMS40MTQgMS40MTRMMTIgMTYgNS42MzYgOS42MzYgNy4wNSA4LjIyMmw0Ljk1IDQuOTVaIi8+PC9zdmc+);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    transition: transform 0.3s;
    vertical-align: calc(0.375em - 0.5rem);
    width: 1rem;
  }
`
