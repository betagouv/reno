'use client'

import styled from 'styled-components'

export const Title = styled.span`
  margin: 1vh 0;
  margin-left: 0.6rem;
  font-weight: normal;
  font-size: 120%;
  line-height: 1.3rem;
  width: 4rem;
  @media (max-width: 400px) {
  }
`

export const HeaderWrapper = styled.header`
  border-bottom: 1px solid #dddddd;
  padding: 0 1vh;
  width: 100%;
  background: white;
  > nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
`
