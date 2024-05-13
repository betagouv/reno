'use client'
import styled from 'styled-components'

export const Calendrier = styled.ol`
  margin: 2rem 0;
  list-style-type: none;
  max-width: 45rem;
  li {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    small {
      color: var(--color);
      text-align: right;
      display: block;
    }
    > span > span {
      margin-left: 0.4rem;
      vertical-align: bottom;
    }
  }
`
