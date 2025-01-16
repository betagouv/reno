'use client'
import { formatValue } from 'publicodes'
import { PrimeStyle } from '../UI'
import AideDurée from './AideDurée'
import { useEffect, useRef } from 'react'

export default function PrimeWithLabel({
  montant,
  engine,
  dottedName,
  situation,
}) {
  const trackedValueRef = useRef()
  useEffect(() => {
    trackedValueRef.current = montant.nodeValue
  }, [montant.nodeValue])

  return montant.nodeValue ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
        ${trackedValueRef.current !== montant.nodeValue
          ? 'background: red !important'
          : ''}
      `}
    >
      {['ampleur . prime individuelle copropriété'].includes(dottedName)
        ? 'Prime de '
        : ['taxe foncière'].includes(dottedName)
          ? ''
          : "Jusqu'à "}
      <strong>
        {dottedName.includes('taxe foncière')
          ? situation['taxe foncière . commune . taux']
          : formatValue(montant)}
      </strong>
      <AideDurée engine={engine} dottedName={dottedName} />
    </PrimeStyle>
  ) : (
    ''
  )
}
