'use client'
import electriciteIcon from '@/public/chauffage.svg'
import Image from 'next/image'
import data from '@/components/dpe/DPE.yaml'
import { Key } from '@/components/explications/ExplicationUI'
import DPELabel from './DPELabel'
import { EvaluationValueWrapper } from '@/app/module/AmpleurEvaluation'
import { formatNumberWithSpaces } from '../utils'
import { formatNumber } from '../RevenuInput'

export default function DPEFacture({
  montantFactureActuelle,
  consoActuelle,
  etiquette,
}) {
  const classeRetenu = etiquette
  const currentDPE = data.indexOf(data.find((d) => d.lettre == classeRetenu))
  console.log('currentDPE', currentDPE)
  const targetDPE = Math.max(currentDPE - 2, 1)
  console.log('targetDPE', targetDPE)

  const moyenneConsoClasseDPE =
    (data[targetDPE]['énergie'] + data[targetDPE - 1]['énergie']) / 2
  console.log('moyenneConsoClasseDPE', moyenneConsoClasseDPE)
  console.log('consoActuelle', consoActuelle)
  console.log('montantFactureActuelle', montantFactureActuelle)

  const pourcentageEconomieVise = consoActuelle / moyenneConsoClasseDPE
  const montantFactureEstime = montantFactureActuelle / pourcentageEconomieVise

  return (
    <>
      {montantFactureActuelle && (
        <EvaluationValueWrapper>
          <div
            css={`
              display: flex;
              gap: 1rem;
            `}
          >
            <div>
              <Image src={electriciteIcon} alt="Icone électricité" />
            </div>
            <div
              css={`
                width: 100%;
                display: block !important;
              `}
            >
              La facture énergétique annuelle actuelle est estimée à{' '}
              <Key $state={'final'}>
                {formatNumber(montantFactureActuelle)}€
              </Key>
              <br />
              En visant un DPE <DPELabel index={targetDPE - 1} />, le montant
              estimé de votre facture d'énergie annuelle se situera{' '}
              <Key $state={'prime'}>
                entre {formatNumber(0.9 * montantFactureEstime)}€ et{' '}
                {formatNumber(1.1 * montantFactureEstime)}€
              </Key>
            </div>
          </div>
        </EvaluationValueWrapper>
      )}
    </>
  )
}
