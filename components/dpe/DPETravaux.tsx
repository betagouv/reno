'use client'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import { formatNumberWithSpaces } from '../utils'
import { formatNumber } from '../RevenuInput'
import DPEQuickSwitch from './DPEQuickSwitch'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import Select from '../Select'
import editIcon from '@/public/crayon.svg'
import CalculatorWidget from '../CalculatorWidget'
import { encodeDottedName, getSituation } from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const DPETravaux = ({ dpe, setSearchParams, isMobile }) => {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  useEffect(() => {
    console.log('dpe', dpe)
  }, [dpe])

  return (
    <CalculatorWidget>
      <div
        css={`
          display: flex;
          > div {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 50%;
          }
          table {
            margin: auto;
            th {
              font-weight: normal;
            }
            td {
              text-align: center;
              padding: 0.2rem;
            }
            input {
              height: 2.8em !important;
              width: 4rem !important;
              padding-right: 1rem !important;
              display: inline-block;
              margin: auto;
            }
            .input-wrapper::after {
              content: '%';
              position: absolute;
              transform: translateY(55%) translateX(-150%);
              pointer-events: none;
            }
            select {
              height: 2.8rem;
              background: #f5f5fe;
              max-width: 90vw;
            }
          }
        `}
      >
        <div
          css={`
            border-right: 1px solid black;
            padding-right: 1rem; /* Ajoute un espace à droite pour éviter que le contenu ne touche la bordure */
          `}
        >
          <div></div>
        </div>
        <div>
          <div></div>
        </div>
      </div>
    </CalculatorWidget>
  )
}

export default DPETravaux
