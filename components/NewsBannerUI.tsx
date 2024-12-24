'use client'
import styled from 'styled-components'
import { Card } from './UI'

export const NewsBannerWrapper = styled.div`
  position: relative;
  margin: 1rem auto;
  width: 19rem;
  max-width: 95%;
  padding: 0.4rem;
  padding-right: 1.4rem;
  padding-left: 1rem;
  border-radius: 0.6rem;
  p {
    display: inline-block;
    margin: 0 auto;
    line-height: 1.2rem;
  }
  font-size: 90%;
  margin-top: -1vh;
  p {
    width: 100%;
    > small > a {
      text-align: right;
      display: block;
      text-decoration: none;
    }
  }
`

export const YellowCard = styled(Card)`
  margin-top: 0;
  margin-bottom: 0;
  background: white;
  border: 2px solid #fdd888;
  &:hover {
    background: #fdd88830;
  }
  > a  {
    > span {
      font-size: 200%;
      margin-right: 1rem;
    }
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }
`
