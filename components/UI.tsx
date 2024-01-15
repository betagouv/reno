'use client'
import styled from 'styled-components'
import Link from 'next/link'

export const Section = styled.section`
  margin: 0 auto;
  width: 800px;
  max-width: 100%;
`
export const Card = styled.div`
  margin: 0.6rem 0;
  padding: 0.2rem 1vw;
  border: 2px solid #dfdff1;
  border-radius: 0.3rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 2px solid #253b71;
  ${(p) => (p.$background ? `background: ${p.$background}` : '')}
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
    left: 0;
    background: salmon;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(250, 128, 114, 1) 48%,
      rgba(255, 255, 255, 1) 100%
    );
    white-space: nowrap;
    padding: 0.1rem 1rem;
    width: 100vw;
    text-align: center;
  }
`

export const CTA = styled(Link)`
  background: #000091;
  color: white;
  padding: 0.4rem 1rem;
  font-size: 200%;
  text-decoration: none;
`
