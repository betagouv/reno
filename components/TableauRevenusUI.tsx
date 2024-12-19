'use client'
import styled from 'styled-components'

export const Small = styled.small`
  font-color: #666;
`

export const Table = styled.table`
  background: white;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  width: 100%;
  td {
    width: 8rem;
    height: 3rem;
    padding: 0.4rem;
  }
  th  {
    max-width: 4rem;
    font-weight: normal;
    strong {
      display: block;
      white-space: nowrap;
    }
  }
`
