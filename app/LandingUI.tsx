'use client'
import { Content } from '@/components/explications/ExplicationUI'
import styled from 'styled-components'

export const HeaderWrapper = styled(Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 16rem;
    height: auto;
  }
  @media (min-width: 800px) {
    flex-direction: row;
    > img {
      margin-top: 4rem;
      margin-left: 4rem;
      order: 1;
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
export const Labels = styled.ul`
  display: flex;
  list-style-type: none;
  justify-content: start;
  padding: 0;
  li {
    margin-right: 0.6rem;
    padding: 0.1rem 0.3rem;
    color: #18753c;
    background: #b8fec9;
    font-weight: bold;
    font-size: 90%;
    border-radius: 0.6rem;
  }
`

export const HomeList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  list-style-type: none;
  padding-left: 0;
  text-align: center;
  li {
    margin: 1rem 0.6rem;
    width: 12rem;
    strong {
      font-family: Noto Serif;
      color: var(--lightColor);
      font-weight: 800;
      font-size: 300%;
      display: block;
    }
  }
`
