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
  }
`

export const Tables = styled.div`
  table {
    background: var(--lightestColor);
  }
`
