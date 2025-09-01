'use client'

import styled from 'styled-components'

export const FatConseillerWrapper = styled.section`
  display: flex;
  align-items: flex-start;
  margin: 3rem auto;
  padding: 1rem;
  border: 1px solid #d0d0ed;
  img {
    max-width: 9rem;
    height: auto;
    margin: 1.6rem 3rem 1.6rem 0rem;

    @media (max-width: 600px) {
      display: none;
    }
  }
`
