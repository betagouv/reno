'use client'

import Link from 'next/link'
import styled from 'styled-components'

export const Badge = styled.span`
  align-items: center;
  background-color: #eee;
  border-radius: 0.25rem;
  color: #3a3a3a;
  display: inline-flex;
  flex-direction: row;
  font-size: 0.8rem;
  font-weight: 700;
  max-height: none;
  max-width: 100%;
  min-height: 1.5rem;
  overflow: initial;
  padding: 0 0.5rem;
  margin-bottom: 0.8rem;
  margin-left: -0.1rem;

  text-transform: uppercase;
  width: -moz-fit-content;
  width: fit-content;
`

export const ArticleCta = () => (
  <>
    <h2 className="fr-mt-5v">Calculer mes aides rénovation</h2>
    <p>
      L'État propose de nombreuses aides et exonérations fiscales pour rénover
      votre maison ou appartement.
    </p>
    <p
      css={`
        margin: 0;
        color: #555;
        line-height: 1.3rem;
      `}
    >
      <strong
        css={`
          color: #da504b;
        `}
      >
        5 minutes chrono
      </strong>{' '}
      et sans inscription.
    </p>
    <Link
      className="fr-btn fr-icon-arrow-right-line fr-btn--icon-left"
      href="/simulation"
      prefetch={false}
    >
      Calculer mes aides
    </Link>
  </>
)
