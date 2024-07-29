'use client'

import { CTA, CTAWrapper } from '@/components/UI'
import Link from 'next/link'

import styled, { css } from 'styled-components'

export const List = styled.ol`
  margin-top: 2rem;
  padding-left: 1rem;
  list-style-type: circle;
  li {
    margin: 2rem 0;
    a {
    }
    h2 {
      margin: 0;
    }
    small {
      color: var(--darkestColor);
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  }
  margin-bottom: 10vh;
`
export const BlogBackButton = ({ children }) => (
  <CTAWrapper
    $justify="start"
    css={`
      margin-top: 0 !important;
      padding-top: 2vh !important;
    `}
  >
    <CTA $fontSize="normal" $importance="secondary">
      {children}
    </CTA>
  </CTAWrapper>
)

export const OtherArticlesSection = styled.section`
  margin-top: 2vh;
  padding: 0 0.8rem;
  h2 {
    width: 700px;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
`
export const OtherArticlesList = styled.div`
  overflow: hidden;
  width: 1100px;
  max-width: 90vw;
  margin: 0 auto;
  > ol {
    white-space: nowrap;
    height: 12rem;
    display: flex;
    align-items: center;
    overflow: scroll;
    list-style-type: none;
    padding-left: 0;
    li {
      background: white;
      height: 10rem;
      width: 18rem;
      min-width: 18rem;
      margin: 0 0.6rem;
      padding: 0.8rem 1.4rem;
      border: 1px solid var(--lighterColor);
      border-radius: 0.4rem;
      white-space: wrap;
      h3 {
        margin-top: 0.6rem;
        height: 3rem;
      }
      small {
        max-height: 6rem;
        display: block;
        overflow: hidden;
      }
    }
  }
`

export const ArticleCta = () => (
  <div
    css={`
      margin-top: 4vh;
      padding: 6vh 0;
      background: white;
      section {
        width: 800px;
        max-width: 90vw;
        margin: 0 auto;
        p {
          color: #333;
        }
      }
    `}
  >
    {' '}
    <section>
      <h2>Calculer mes aides rénovation</h2>
      <p>
        L'État propose de nombreuses aides et exonérations fiscales pour rénover
        votre maison ou appartement.
      </p>
      <p
        css={`
          margin: 0;
          color: #555;
          line-height: 1.3rem;
        `}
      >
        <strong
          css={`
            color: #da504b;
          `}
        >
          5 minutes chrono
        </strong>{' '}
        et sans inscription.
      </p>
      <CTAWrapper $justify="center">
        <CTA $fontSize="normal">
          <Link href="/simulation">➞&nbsp;&nbsp;Calculer mes aides</Link>
        </CTA>
      </CTAWrapper>
    </section>
  </div>
)
