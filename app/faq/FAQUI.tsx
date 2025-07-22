'use client'

import styled from 'styled-components'

export const Questions = styled.ul`
  list-style-type: none;
  li  {
    margin: 1rem 0 2.8rem 0;
    summary:before {
      content: '▶';
      margin-bottom: 0.2rem;
    }
    details[open] summary:before {
      content: '▼';
    }
    summary {
      display: flex;
      align-items: center;
      div {
        margin-left: 0.6rem;
        position: relative;
        h3 {
          margin: 0;
        }
      }
    }
  }
`
