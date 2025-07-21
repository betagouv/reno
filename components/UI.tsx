'use client'
import styled from 'styled-components'
import checkIcon from '@/public/check-square.png'

export const Section = styled.section`
  margin: 0 auto;
  width: 800px;
  max-width: 100%;
  .content-with-table {
    table {
      border-collapse: collapse;
      margin-bottom: 1rem;
      td,
      th {
        border: 1px solid black;
        text-align: center;
        padding: 0.5rem;
      }
      td {
        white-space: nowrap;
      }
    }
  }
`
export const cardBorder = `

  padding: calc(.3rem + .7vw) calc(.5rem + 1vw);
  border: 2px solid #dfdff1;
  border-radius: 0.3rem;
`
export const Card = styled.div`
  position: relative;
  background: white;
  margin: 0.6rem 0;
  padding: 1rem 1.5rem;
  ${(p) => (p.$background ? `background: ${p.$background};` : '')}
  ${cardBorder}
  ${(p) => p.$noBorder && `border: none;`}
`

export const PageBlock = ({children}) => {
  return <main id="content" role="main"><div className="fr-container">{children}</div></main>
}

export const BlocAide = styled.div`
  text-align: left;
  ${(p) => p.display == "geste" ? 
    'padding: 0.5rem 0.5rem 0.5rem 0;border-bottom: 1px solid #ddd;' : 
    'padding: 1.5rem 1.5rem 1.75rem;border: 1px solid #ddd;border-bottom: 3px solid var(--color);'}
  background: white;
  margin-bottom: 1rem;
  .aide-header {
    display: flex;
    align-items: flex-start;
    ${(p) => p.display == "geste" && "margin-bottom: 1rem;"}
    > img {
      margin-right: 1.4rem;
      width: 3.5rem;
      height: auto;
    }
  }
  .aide-details {
    margin-top: 1rem;
    font-size: 0.9rem;
    line-height: 1.25rem;
    color: #3a3a3a;
  }
`

export const ConditionEligibiliteUI = ({ children }) => {
  return children && (
    <>
      <h2 className='fr-mt-5v'>Les principales conditions d'éligibilité ?</h2>
      <div
        css={`
          list-style-image: url(${checkIcon.src});
          list-style-position: inside;
          ul {
            padding: 0;
          }
          li {
            margin: 1rem 0;
            ul {
              list-style-image: none;
            }
          }
        `}
        dangerouslySetInnerHTML={{
          __html: children,
        }}
      />
    </>,
  )
}

export const Loader = () => (
  <div
    css={`
      margin: auto;
      width: 30px;
      padding: 8px;
      aspect-ratio: 1;
      border-radius: 50%;
      background: #000091;
      --_m: conic-gradient(#0000 10%, #000),
        linear-gradient(#000 0 0) content-box;
      -webkit-mask: var(--_m);
      mask: var(--_m);
      -webkit-mask-composite: source-out;
      mask-composite: subtract;
      animation: l3 1s infinite linear;
      @keyframes l3 {
        to {
          transform: rotate(1turn);
        }
      }
    `}
  ></div>
)
