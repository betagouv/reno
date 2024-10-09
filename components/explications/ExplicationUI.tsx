'use client'

import styled from 'styled-components'

export const P = styled.p`
  line-height: 1.8rem;
`
export const Key = styled.em`
  border-radius: 0.2rem;
  white-space: nowrap;
  font-weight: bold;
  padding: 0.1rem 0.4rem 0.05rem;

  ${(p) =>
    p.$state !== 'none' &&
    `background: #e9e9e9;
     border: 2px solid lightgray;
    `}

  white-space: nowrap;
  font-style: normal;

  ${(p) =>
    p.$state === 'inProgress'
      ? `border-color: lightblue;`
      : p.$state === 'final'
        ? `
          background: var(--lighterColor);
          border-color: var(--lighterColor0);
          `
        : p.$state === 'prime'
          ? `
              color: #356e3e;
              background: #bef2c5;
              border-color: #356e3e4d;
            `
          : p.$state === 'prime-secondary'
            ? `
                background: transparent; border: none; font-weight: 500;text-decoration: underline solid #356e3e; color: #356e3e;
                padding: 0.1rem 0.1rem 0.05rem;
		          `
            : p.$state == 'prime-black'
            ? `
                border: 1px dashed black;
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
  ${(p) => p.$noMargin && `margin: 0; padding-top: 3vh;`}
  ${(p) => p.$last && `padding-bottom: 6vh;`}
`
export const Content = styled.div`
  width: 800px;
  max-width: 90vw;
  margin: 0 auto;
  p {
    color: #333;
  }
`
