'use client'
import styled from 'styled-components'

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
  ${(p) => p.display != "geste" && 
    'padding: 1.5rem 1.5rem 1.75rem;border: 1px solid #ddd;border-bottom: 3px solid var(--color);'}
  .aide-header {
    display: flex;
    ${(p) => p.display == "geste" ? 'justify-content: space-between;' : 'align-items: center;gap: 1rem;'}
    width: 100%;
    padding-right: 0.5rem;
  }
  .aide-details {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
`

export const ConditionEligibiliteUI = ({ children }) => {
  return children && (
    <>
      <h2 className='fr-mt-5v'>Les principales conditions d'éligibilité ?</h2>
      <div
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

export const DsfrCard = ({ titre, url, description, imageUrl, imageAlt, titleAs, noRatio }) => (
  <div className="fr-card fr-enlarge-link">
    <div className="fr-card__body">
      <div className="fr-card__content">
        {titleAs == "h2" && (<h2 className="fr-card__title">
          <a href={url}>{titre}</a>
        </h2>)}
        {titleAs == "h3" && (<h3 className="fr-card__title">
          <a href={url}>{titre}</a>
        </h3>)}
        <div className="fr-card__desc">{description}</div>
      </div>
    </div>
    {imageUrl && (<div className="fr-card__header">
      <div className="fr-card__img">
        <img
          className={`fr-responsive-img ${!noRatio && "fr-ratio-1x1"} fr-p-5v`}
          style={noRatio && { aspectRatio: "auto"}}
          src={imageUrl}
          alt={imageAlt}
        />
      </div>
    </div>)}
  </div>
)