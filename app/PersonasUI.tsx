'use client'
import styled from 'styled-components'

export const PersonasList = styled.div`
  margin-top: 0.8rem;
  > ul {
    display: flex;
    align-items: center;
    flex-direction: column;
    list-style-type: none;
  }
  ul > li > ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    padding: 0;
    display: flex;
    list-style-type: none;
    margin: 0.2rem 0;
    align-items: center;
    li {
      > div {
        width: 14rem;
        height: 20rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 0.4rem 0.6rem;
        h3 {
          margin: 0;
        }
      }
      margin: 0 0.6rem;
    }
  }
`
export const ResultLabel = styled.span`
      margin-right: 0.2rem;
      margin-left: 0.4rem;
      padding: 0 0.4rem;
      ${(p) =>
        p.$binary
          ? `background: var(--lighterColor2); border: 1px solid var(--color); color: var(--darkColor);`
          : `background: transparent; border: 1px solid gray; color: gray`}
    }`

export const PersonaTests = styled.ul`
  li {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    line-height: 1.3rem;
    margin: 0 !important;
    width: 100%;
    margin-top: 0.6rem !important;

    small p {
      margin: 0;
      line-height: 1rem;
    }
  }
`

import Image from 'next/image'

export const TestIcon = styled(Image)`
  width: 1.2rem;
  height: auto;
  vertical-align: bottom;
  background: #c4fad5;
  border-radius: 2rem;
`

export const PersonaStory = styled.small`
  line-height: 1rem;
  margin-bottom: 0.4rem;
  img {
    width: 1.1rem;
    height: auto;
    opacity: 0.8;
    vertical-align: bottom;
    margin-right: 0.4rem;
    transform: scale(-1, -1);
    filter: grayscale(1);
  }
`
