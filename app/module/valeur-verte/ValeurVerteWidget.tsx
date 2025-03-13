'use client'
import rules from '@/app/règles/rules'
import CalculatorWidget from '../../../components/CalculatorWidget'
import Publicodes from 'publicodes'
import dataValeurVerte from '@/data/valeur-verte.csv'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { useEffect, useState } from 'react'
import dpeData from '@/components/DPE.yaml'
import editIcon from '@/public/crayon.svg'
import Select from '../../../components/Select'
import Image from 'next/image'
import DPELabel from '../../../components/DPELabel'
import TargetDPETabs from '../../../components/mpra/TargetDPETabs'
import useSetSearchParams from '../../../components/useSetSearchParams'
import { getAnsweredQuestions } from '../../../components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import useEnrichSituation from '../../../components/personas/useEnrichSituation'

export default function ValeurVerteWidget({ lettre }) {
  const engine = new Publicodes(rules)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = useEnrichSituation(rawSearchParams.toString())
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const isMobile = window.innerWidth <= 600
  const [pourcentageAppreciation, setPourcentageAppreciation] = useState()
  const [plusValue, setPlusValue] = useState()
  const [region, setRegion] = useState('Auvergne-Rhône-Alpes')
  const [typeBien, setTypeBien] = useState('maison')
  const [prixBien, setPrixBien] = useState(200000)
  const [dpeActuel, setDPEActuel] = useState(lettre)
  const index = dpeData.findIndex((c) => c.lettre == lettre)
  const indexDpeVise = Math.max(index - 2, 1)
  const [dpeVise, setDPEVise] = useState(dpeData[Math.max(index - 2, 1)].lettre)
  const regionList = dataMaison.map((el) => ({
    valeur: el.Région,
    titre: el.Région,
  }))
  const value = indexDpeVise,
    oldIndex = +index - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  useEffect(() => {
    const row = dataValeurVerte.find((r) => r.Région == region)

    const pourcentageDpeActuel =
      row[Object.keys(row).find((c) => c.includes(dpeActuel))]
        .replaceAll('%', '')
        .split(' à ')
        .reduce((p, c) => p + parseFloat(c), 0) / 2 || 0

    const pourcentageDpeVise =
      Object.keys(row).find((c) => c.includes(dpeVise)) in row
        ? row[Object.keys(row).find((c) => c.includes(dpeVise))]
            .replaceAll('%', '')
            .split(' à ')
            .reduce((p, c) => p + parseFloat(c), 0) / 2 || 0
        : 0
    const pourcentageAppreciation =
      ((100 + pourcentageDpeVise - (100 + pourcentageDpeActuel)) /
        (100 + pourcentageDpeActuel)) *
      100
    setPourcentageAppreciation(pourcentageAppreciation)
    setPlusValue(Math.round(1 + (pourcentageAppreciation / 100) * prixBien))
  }, [region, typeBien, prixBien, dpeActuel, dpeVise])
  return (
    <CalculatorWidget>
      <div>
        <div>
          <div>Région:</div>
          <Select
            value={region}
            values={regionList}
            onChange={(e) => setRegion(e)}
          />
        </div>
        <div>
          <div>Type de bien:</div>
          <Select
            value={typeBien}
            values={[
              { valeur: 'maison', titre: 'Une maison' },
              { valeur: 'appartement', titre: 'Un appartement' },
            ]}
            onChange={(e) => setTypeBien(e)}
          />
        </div>
        <DPEQuickSwitch oldIndex={index} onChange={(e) => setDPEActuel(e)} />
      </div>
      <div
        css={`
          display: flex;
          ${isMobile && 'flex-direction: column;'}
          justify-content: space-between;
          gap: 1rem;
        `}
      >
        <div>
          <div>Valeur du bien:</div>
          <div
            css={`
              margin: auto;
              border: 2px solid var(--color);
              width: 100%;
              color: var(--color);
              text-align: center;
              border-radius: 0.3rem;
              padding: 0.7rem;
              box-shadow: var(--shadow-elevation-medium);
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <div
              css={`
                flex-grow: 1;
              `}
            >
              <input
                id="prix-bien"
                css={`
                  border: none;
                  background: transparent;
                  -webkit-appearance: none;
                  outline: none;
                  color: var(--color);
                  font-size: 110%;
                  max-width: 4rem;
                `}
                autoFocus={false}
                value={prixBien}
                placeholder="Prix du bien"
                min="0"
                max="9999999"
                onChange={(e) => {
                  const rawValue = e.target.value
                  const startPos = e.target.selectionStart
                  const value = +rawValue === 0 ? 0 : rawValue
                  setPrixBien(value)
                  requestAnimationFrame(() => {
                    const inputBudget = document.querySelector('#prix-bien')
                    inputBudget.selectionStart = startPos
                    inputBudget.selectionEnd = startPos
                  })
                }}
                step="100"
              />
            </div>
            <Image
              css={`
                cursor: pointer;
                margin-left: auto;
              `}
              src={editIcon}
              alt="Icône crayon pour éditer"
              onClick={() => document.querySelector('#prix-bien').focus()}
            />
          </div>
        </div>
        <TargetDPETabs
          {...{
            oldIndex: indexDpeVise,
            setSearchParams,
            answeredQuestions,
            choice,
            engine,
            situation,
          }}
        />
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        `}
      >
        <div>
          En passant d'un DPE <DPELabel label={dpeActuel} small={false} /> à un
          DPE <DPELabel label={dpeVise} small={false} />, la valeur du bien
          s'appréciera de:
        </div>
        <div
          css={`
            margin-top: 0.5rem;
            text-align: center;
            background: var(--validColor1);
            color: var(--validColor);
            padding: 0.5rem;
            font-weight: bold;
          `}
        >
          {plusValue} €
        </div>
      </div>
    </CalculatorWidget>
  )
}
