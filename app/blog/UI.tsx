'use client'

import { CTA, CTAWrapper } from '@/components/UI'
import Link from 'next/link'

import styled, { css } from 'styled-components'

export const List = styled.ol`
  margin-top: 2rem;
  padding-left: 0;
  list-style-type: none;
  margin-bottom: 10vh;
`

export const ArticleCard = styled.li`
  display: flex;
  margin: 2rem 0;
  background: white;
  border-radius: 0.8rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  a {
    display: flex;
    width: 100%;
    color: inherit;
    text-decoration: none;
  }
`

export const ArticleImageContainer = styled.div`
  flex: 0 0 200px;
  height: 150px;
  position: relative;
  
  @media (max-width: 768px) {
    flex: 0 0 120px;
    height: 120px;
  }
  
  @media (max-width: 480px) {
    flex: 0 0 100px;
    height: 100px;
  }
`

export const ArticleContent = styled.div`
  flex: 1;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.4rem;
    line-height: 1.3;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  small {
    color: var(--darkestColor);
    font-size: 90%;
  }
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
    overflow-x: scroll;
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
        height: 4.7rem;
        line-height: 1.4rem;
      }
      small {
        max-height: 6rem;
        display: block;
        overflow: hidden;
      }
    }
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
          <Link href="/simulation" prefetch={false}>
            ➞&nbsp;&nbsp;Calculer mes aides
          </Link>
        </CTA>
      </CTAWrapper>
    </section>
  </div>
)
