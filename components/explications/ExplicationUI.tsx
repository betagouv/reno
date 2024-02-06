'use client'

import styled from 'styled-components'

export const P = styled.p`
  line-height: 1.8rem;
`
export const Key = styled.em`
  ${(p) =>
    p.$state !== 'none' &&
    `background: #e9e9e9;
  border: 2px solid lightgray;
  `}

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
  border-color: lightblue;
  `
        : ''};
  line-height: 1.4rem;
  display: inline-block;
  min-width: 3rem;
  text-align: center;
`

export const Wrapper = styled.section`
  background: ${(p) => p.$background || '#f6f6f6'};
  width: 100%;
  padding: 1rem 0;
  margin-top: 3vh;
  ${(p) => p.$noMargin && `margin: 0; padding-top: 3vh`}
`
export const Content = styled.div`
  width: 800px;
  max-width: 90vw;
  margin: 0 auto;
  p {
    color: #333;
  }
`
