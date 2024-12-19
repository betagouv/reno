'use client'
import styled from 'styled-components'
export const Parcours = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  list-style-type: none;
  margin-top: 2rem;
  gap: 1rem;
  padding-left: 0;
  li > div {
    max-width: 16rem;
    height: 10rem;
    p {
      line-height: 1.3rem;
      color: #444;
    }
  }
  h3 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 120%;
  }
`
