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
