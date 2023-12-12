'use client'

import styled from 'styled-components'

export const P = styled.p`
  line-height: 1.8rem;
`
export const Key = styled.em`
  background: #e9e9e9;
  border: 2px solid lightgray;
  padding: 0 0.1rem;
  white-space: nowrap;
  font-style: normal;
  ${(p) =>
    p.$state === 'inProgress'
      ? `
  border-color: lightblue;

  `
      : p.$state === 'final'
        ? `

  background: #c4e5ef;
  `
        : ''}
`
