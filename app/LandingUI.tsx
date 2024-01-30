'use client'
import { Content } from '@/components/explications/ExplicationUI'
import styled from 'styled-components'

export const HeaderWrapper = styled(Content)`
  display: flex;
  align-items: center;
  img {
    margin-top: 4rem;
    margin-left: 4rem;
    width: 13rem;
    height: auto;
  }
  @media (max-width: 800px) {
    > img {
      display: none;
    }
  }
`
export const LandingGreenBanner = styled.div`
  background: #dffee6;
  color: black;
  padding: 1rem;
  width: 100%;
  margin: 5vh 0 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  p {
    margin: 0;
  }
`
