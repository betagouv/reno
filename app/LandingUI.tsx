'use client'
import styled from 'styled-components'
import Image from 'next/image'

export const HeaderWrapper = ({ children, image }) => {
  return (
    <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
      <div className="fr-py-0 fr-col-12 fr-col-md-6">{children}</div>
      <div className="fr-col-12 fr-col-md-3">
        <Image
          src={image.src}
          alt={image.alt}
          css={`
            width: 100%;
            height: auto;
          `}
        />
      </div>
    </div>
  )
}
export const LandingGreenBanner = styled.div`
  background: #f7f8f8;
  margin: 5vh 0;
  padding-bottom: 1vh;
  > div {
    color: black;
    padding: 1rem;
    width: 61rem;
    max-width: 90vw;
    margin: 0 auto;
    text-align: center;
    text-align: left;
    small {
      font-size: 90%;
    }
    p {
      line-height: 1.3rem;
    }
    img {
      margin: 0.4rem;
      margin-left: 0;
      width: 7rem;
      height: auto;
    }
    p {
      margin: 0;
    }
    @media (min-width: 800px) {
      display: flex;
      align-items: center;
      justify-content: start;
      > img {
        order: 0;
      }
      > p {
        margin-top: 1rem;
        margin-left: 1rem;
      }
    }
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
    color: ${(p) => p.$color || '#18753c'};
    background: ${(p) => p.$background || '#b8fec9'};
    font-weight: bold;
    font-size: 90%;
    border-radius: 0.6rem;
  }
`

export const BlueEm = styled.em`
  color: var(--lightColor);
  font-style: normal;
`
