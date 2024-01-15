'use client'

import styled from 'styled-components'

const blue = '#2a82dd'

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
    margin-top: 0.6rem;
    border-left: 2px solid ${blue};
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
    background: ${blue};
    color: white;
    display: inline-block;
    padding: 0 0.4rem;
    margin: 0;
    margin-bottom: 0.3rem;
  }
`

export const Details = styled.details`
  summary {
    padding-left: 0.3rem;
  }
  summary::-webkit-details-marker {
    color: ${blue};
  }
  summary::marker {
    color: ${blue};
  }
`
