'use client'
import { useState } from 'react'
import DPELabel from './DPELabel'
import useSetSearchParams from './useSetSearchParams'
import Link from 'next/link'
import Image from 'next/image'
import { encodeSituation } from './publicodes/situationUtils'
import editIcon from '@/public/crayon.svg'

export const originKey = 'DPE . actuel',
  targetKey = 'projet . DPE visé'
export const getAmpleurDPEChoice = (situation) => {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice
  return choice
}
export default function DPEQuickSwitch({
  oldIndex,
  possibilities = [0, 1, 2, 3, 4, 5, 6],
  dottedName = originKey,
  situation = {},
  validateTargetKey = true, // not sure about the necessity of this param, it could be used as "false" for all instances of DPEQuickSwitch. But what I know is that for CEEAmpleurScenario we need it to false else Form.tsx has no "nextQuestions"
  isMobile,
}) {
  const [editing, setEditing] = useState(false)
  const setSearchParams = useSetSearchParams()
  const newSituation = (index) => {
    const simpleChange = { [dottedName]: index + 1 }
    const targetDPE = situation[targetKey]
    if (!targetDPE) return simpleChange

    const newTargetDPE =
      getAmpleurDPEChoice({
        ...situation,
        ...simpleChange,
      }) + 1
    return { ...simpleChange, [targetKey]: newTargetDPE }
  }

  return (
    <div
      css={`
        display: flex;
        ${!isMobile && 'flex-direction: column;'}
        align-items: center;
        gap: 0.5rem;
      `}
    >
      <div>Votre DPE actuel :</div>
      {editing ? (
        <span
          css={`
            display: flex;
            gap: 0.1rem;
            flex-wrap: wrap;
          `}
        >
          {possibilities.map((it, index) => (
            <Link
              key={index}
              onClick={() => setEditing(false)}
              scroll={false}
              href={setSearchParams(
                encodeSituation(
                  newSituation(index),
                  false,
                  [originKey, validateTargetKey && targetKey].filter(Boolean),
                ),
                'url',
              )}
            >
              <DPELabel index={index} small={false} />
            </Link>
          ))}
        </span>
      ) : (
        <div
          css={`
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 1rem;
          `}
          onClick={() => setEditing(true)}
          title="Cliquez pour choisir un autre DPE actuel de votre logement, dans le cas où vous n'êtes pas certain de votre DPE."
        >
          <DPELabel index={oldIndex} small={false} />
          <Image src={editIcon} alt="Icône crayon" />
        </div>
      )}
    </div>
  )
}
