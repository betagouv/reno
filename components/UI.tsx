'use client'
import styled from 'styled-components'

export const Card = styled.div`
  margin: 0.6rem 0;
  padding: 0.2rem 1vw;
  border: 2px solid #dfdff1;
  border-radius: 0.3rem;
`

export const FooterWrapper = styled.footer`
  border-top: 2px solid #000091;
  background: #f5f5fe;
  text-align: center;
  margin-top: 3vh;
  padding: 2rem;
  ul {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    list-style-type: none;
    li {
      margin: 0 0.6rem;
    }
  }
`

export const PageBlock = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
`

export const TopBanner = styled.p`
  strong {
    position: fixed;
    margin: 0 auto;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: salmon;
    padding: 0 0.2rem;
    white-space: nowrap;
    padding: 0 1rem;
  }
`
