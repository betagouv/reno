'use client'

import styled from 'styled-components'

export const Labels = styled.ul`
  display: flex;
  list-style-type: none;
  justify-content: start;
  padding: 0;
  li {
    margin-right: 0.6rem;
    padding: 0.1rem 0.3rem;

    color: #18753c;
    background: #b8fec9;
    font-weight: 500;
    font-size: 90%;
    text-transform: uppercase;
  }
`

export const HomeList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  list-style-type: none;
  padding-left: 0;
  text-align: center;
  li {
    margin: 1rem 0.6rem;
    width: 12rem;
    strong {
      font-family: Noto Serif;
      color: var(--lightColor);
      font-weight: 800;
      font-size: 300%;
      display: block;
    }
  }
`
