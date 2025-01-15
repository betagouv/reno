'use client'
import checkIcon from '@/public/check.svg'

import styled from 'styled-components'

export const FatConseillerWrapper = styled.section`
  details {
    margin: 3rem auto;
    ${(p) => p.$margin && p.$margin == 'small' && `margin: 1rem auto;`}
    background: var(--lightestColor);
    padding: 1rem;
    border: 1px solid #d0d0ed;
    summary {
      margin: 0 auto;
      border-radius: 0.4rem;
      width: fit-content;
      max-width: 100%;
      list-style-type: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    > section {
      margin: 0;
      > div {
        margin-top: 0;
      }
    }
    summary {
      > div {
        display: flex;
        justify-content: space-around;
        align-items: center;
        > div {
          > img {
            margin: auto;
            display: block;
            padding: 1rem;
          }
          h3 {
            text-align: left;
            font-size: 140%;
            margin: 0 0 0.6rem 0;
          }
          p {
            margin: 0;
            font-size: 100%;
          }
          ul {
            list-style-type: none;
            padding: 0;
            li {
              list-style-image: url(${checkIcon.src});
              margin: 1rem 0;
            }
            img {
              width: 1.2rem;
              height: auto;
              vertical-align: sub;
            }
          }
        }
      }
      img {
        max-width: 9rem;
        height: auto;
        margin: 1.6rem 3rem 1.6rem 0rem;

        @media (max-width: 600px) {
          display: none;
        }
      }
    }
  }
`
