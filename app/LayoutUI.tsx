'use client'

import styled from 'styled-components'

export const Title = styled.h1`
  margin: 1vh 0;
  margin-left: 0.6rem;
  font-weight: normal;
  font-size: 120%;
  line-height: 1.3rem;
  width: 4rem;
  @media (max-width: 400px) {
  }
`

export const Header = styled.header`
  border-bottom: 1px solid #dddddd;
  padding: 0 1vh;
  width: 100%;
  background: white;
  > div {
    max-width: 1200px;
    margin: 0 auto;
    @media (min-width: 800px) {
    }
  }
`
