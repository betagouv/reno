'use client'
import CalculatorWidget from './CalculatorWidget'
import dataMaison from '@/data/valeur-verte-maison.csv'
import dataAppartement from '@/data/valeur-verte-appartement.csv'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { useEffect, useState } from 'react'
import dpeData from '@/components/DPE.yaml'
import Select from './Select'
import DPELabel from './DPELabel'

export default function ValeurVerteWidget({ lettre }) {
  const [pourcentageAppreciation, setPourcentageAppreciation] = useState()
  const [region, setRegion] = useState('Auvergne-Rhône-Alpes')
  const [typeBien, setTypeBien] = useState('maison')
  const [dpeActuel, setDPEActuel] = useState(lettre)
  const index = dpeData.findIndex((c) => c.lettre == lettre)
  const dpeVise = 'D'
  const regionList = dataMaison.map((el) => ({
    valeur: el.Région,
    titre: el.Région,
  }))

  useEffect(() => {
    const file = typeBien == 'maison' ? dataMaison : dataAppartement
    const row = file.find((r) => r.Région == region)

    const col = Object.keys(row).find((c) => c.includes(dpeActuel))
    setPourcentageAppreciation(row[col])
  }, [region, typeBien, dpeActuel, dpeVise])
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
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        `}
      >
        <div>
          Par rapport à un bien comparable ayant un DPE{' '}
          <DPELabel label={dpeVise} small={false} />, la valeur du bien
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
          {pourcentageAppreciation}
        </div>
      </div>
    </CalculatorWidget>
  )
}
