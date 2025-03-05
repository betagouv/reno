'use client'

import styled from 'styled-components'

const blue = 'var(--lightColor)'

export const Fieldset = styled.fieldset`
  width: 100%;
  > ul {
    padding-left: 1.5vw;
    list-style-type: none;
  }
  label {
    margin: 0 0.4rem;
    whitespace: nowrap;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  > ul > li {
    margin-top: 1rem;
    ul {
      padding-left: 0.6vw;
    }
  }
  li li {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
  h4,
  h5 {
    margin: 1.3rem 0 0.4rem 0.6rem;
  }
  h4 {
    color: var(--color);
    display: inline-block;
    padding: 0 0.4rem;
    margin: 0;
    margin-bottom: 0.3rem;
    font-size: 100%;
  }
`

export const Details = styled.details`
  > summary {
    padding-left: 0.6rem;
    background: #e3e3fd;
    padding-right: 0.6rem;
    padding-bottom: 0.1rem;
    margin-bottom: 0.1rem;
    h4 {
      margin: 0;
      padding: 0.8rem 0 0.6rem 0;
      font-weight: 400;
    }
  }
  > summary::-webkit-details-marker {
    color: var(--color);
  }
  > summary::marker {
    color: var(--color);
  }
  > ul {
    margin-top: 0.6rem;
  }
`
