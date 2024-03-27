'use client'

import styled from 'styled-components'

export const Questions = styled.ul`
  list-style-type: none;
  padding-left: 1rem;
  margin-top: 3rem;
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
        small {
          position: absolute;
          top: -1.3rem;
          background: var(--lighterColor2);
          padding: 0.1rem 0.4rem;
          display: inline-block;
          width: fit-content;
          border-radius: 0.2rem;
        }
      }
    }
    section {
      margin: 1rem 0;
    }
  }
`
