'use client'

import styled from 'styled-components'

export const Key = styled.em`
  background: #e9e9e9;
  border: 1px solid lightgray;
  padding: 0 0.1rem;
  font-style: normal;
  ${(p) =>
    p.$ok &&
    `
  background: #c4e5ef;
  border-color: lightblue;

  `}
`
