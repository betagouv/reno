'use client'

import dpeData from '@/components/DPE.yaml'

export default function DPELabel({ index, small = true }) {
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
        padding: ${small ? '0.05rem 0.45rem' : '0.7rem 1rem'};
        font-weight: bold;
        color: ${textColor || 'black'};
        border-radius: 0.3rem;
      `}
    >
      {lettre}
    </span>
  )
}
