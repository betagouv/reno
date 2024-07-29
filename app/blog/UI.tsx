'use client'

import { CTA, CTAWrapper } from '@/components/UI'

import styled from 'styled-components'

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
