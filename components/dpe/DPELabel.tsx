'use client'

import dpeData from '@/components/dpe/DPE.yaml'

export const conversionLettreIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

export default function DPELabel({
  index,
  label = null,
  small = true,
  border = false,
}) {
  if (label) {
    index = conversionLettreIndex.indexOf(label)
  }
  if (typeof index === 'undefined' || isNaN(index)) {
    return (
      <span
        css={`
          display: inline-block;
          background: lightgrey;
          text-align: center;
          padding: ${small ? '0.5rem 0.8rem' : '0.7rem 1rem'};
          font-weight: bold;
          color: black;
          border-radius: 0.3rem;
        `}
      >
        ?
      </span>
    )
  }

  if (+index > 6 || index < 0)
    return (
      <em
        title={`Le DPE d'index ${index} est invalide, il doit être entre 0 (A) et 6 (G)`}
        css={`
          cursor: help;
        `}
      >
        DPE invalide
      </em>
    )
  const { couleur, lettre, 'couleur du texte': textColor } = dpeData[+index]
  return (
    <span
      css={`
        display: inline-block;
        background: ${couleur};
        text-align: center;
        padding: ${small ? '0.2rem 0.6rem' : '0.7rem 1rem'};
        font-weight: bold;
        color: ${textColor || 'black'};
        border-radius: 0.3rem;
        border: ${border ? '2px solid var(--color)' : ''};
      `}
    >
      {lettre}
    </span>
  )
}
