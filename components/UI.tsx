'use client'
import styled from 'styled-components'

export const Card = styled.div`
  margin: 0.6rem 0;
  padding: 0.2rem 0.4rem;
  background: ${(p) => p.$background};
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    rgba(61, 59, 53, 0.16) 0px 0px 0px 1px,
    rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
`
