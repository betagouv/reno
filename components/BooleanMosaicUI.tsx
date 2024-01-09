'use client'

import styled from 'styled-components'

export const Fieldset = styled.fieldset`
  ul {
    padding-left: 1vw;
  }
  li {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    label {
      margin: 0 0.4rem;
      whitespace: nowrap;
    }
  }
`
