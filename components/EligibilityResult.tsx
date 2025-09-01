import { formatValue } from 'publicodes'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'
import Value from './Value'
import { push } from '@socialgouv/matomo-next'
import useSetSearchParams from './useSetSearchParams'
import { useEffect } from 'react'
import Badge from '@codegouvfr/react-dsfr/Badge'
import React from 'react'

export function EligibilityResult({ engine, dottedName, situation, text }) {
  const evaluation = engine
    .setSituation(situation)
    .evaluate(
      dottedName +
        ' . ' +
        (dottedName == 'taxe foncière' ? 'conditions' : 'montant'),
    )

  if (!evaluation) return null

  const isEligible = evaluation.nodeValue
  const taux = formatValue(engine.evaluate(`${dottedName} . taux`))
  const montant = engine.evaluate(`${dottedName} . montant`)
  const montantFormatte = formatValue(montant)
  const duree = engine.evaluate(`${dottedName} . durée`)
  const dureeFormattee = formatValue(duree)

  useEffect(() => {
    if (
      !(
        !Object.keys(evaluation.missingVariables).length ||
        situation['taxe foncière . commune . éligible'] === 'non' ||
        situation['logement . commune . denormandie'] === 'non'
      )
    ) {
      push([
        'trackEvent',
        'Module',
        'Interaction',
        'Module ' + dottedName + ' Resultat',
      ])
    }
  }, [evaluation, dottedName, situation])
  if (
    !(
      !Object.keys(evaluation.missingVariables).length ||
      situation['taxe foncière . commune . éligible'] == 'non' ||
      situation['logement . commune . denormandie'] == 'non'
    )
  ) {
    return <></>
  }

  return (
    <div
      className={`fr-callout fr-icon-money-line fr-callout--${isEligible ? 'blue-cumulus' : 'orange-terre-battue'} fr-mt-5v`}
    >
      <p className="fr-callout__title">
        {isEligible ? (
          <>
            Vous êtes éligible à{' '}
            {dottedName === 'taxe foncière'
              ? 'une exonération de Taxe Foncière :'
              : dottedName === 'denormandie'
                ? "une réduction d'impôt de :"
                : 'un prêt de :'}{' '}
          </>
        ) : (
          <>
            {situation['taxe foncière . commune . éligible'] === 'non' ||
            situation['logement . commune . denormandie'] === 'non'
              ? "Cette commune n'est"
              : "Vous n'êtes"}{' '}
            pas éligible {text}
          </>
        )}
      </p>
      {isEligible && (
        <div style={{ textAlign: 'center' }}>
          <Badge noIcon severity="success" className="fr-display--xs fr-my-5v">
            {['PAR', 'PTZ', 'denormandie'].includes(dottedName)
              ? montantFormatte
              : taux}
          </Badge>
          {'denormandie' == dottedName && <> sur {dureeFormattee}</>}
          {!['PAR', 'PTZ', 'denormandie'].includes(dottedName) && (
            <> pendant {dureeFormattee}</>
          )}
          {['PAR', 'PTZ'].includes(dottedName) && (
            <>
              <br />
              <strong>sans intérêt</strong> pendant {dureeFormattee}.
            </>
          )}
        </div>
      )}
      {isEligible && dottedName === 'denormandie' && (
        <p className="fr-hint-text">
          Détail: <strong>{taux}</strong> du coût du bien{' '}
          {engine.evaluate(dottedName + ' . assiette').nodeValue <
          engine.evaluate(dottedName + ' . plafond').nodeValue ? (
            <>
              soit{' '}
              <strong>
                {formatValue(engine.evaluate(dottedName + ' . assiette'))}
              </strong>
            </>
          ) : (
            <>
              plafonné à{' '}
              <strong>
                {formatValue(engine.evaluate(dottedName + ' . plafond'))}
              </strong>
            </>
          )}
        </p>
      )}
      {!isEligible && (
        <p className="fr-callout__text">
          ⚠️ Vous êtes peut-être éligible à d'autres aides!
        </p>
      )}
      {isEligible && ['PAR', 'PTZ'].includes(dottedName) && (
        <ComparatifPretConso {...{ engine, situation, montant, duree }} />
      )}
      <AmpleurCTA situation={situation} />
    </div>
  )
}

export const ComparatifPretConso = ({ engine, situation, montant, duree }) => {
  const setSearchParams = useSetSearchParams()
  const evaluationintérêt = engine.setSituation(situation)
  situation['intérêt . montant emprunt'] = montant.nodeValue
  situation['intérêt . durée'] = duree.nodeValue
  const taux = evaluationintérêt.evaluate('intérêt . taux').nodeValue

  return (
    <p className="fr-hint-text fr-my-5v">
      Par rapport à un prêt à la consommation au taux de{' '}
      {situation['intérêt . taux'] ? situation['intérêt . taux'] : taux}
      {/* TODO: Tant qu'on ne sait pas si on peut faire du input inline avec le dsfr, on passe le taux d'intérêt en badge  
       <input
        className="fr-input"
        type="number"
        value={situation['intérêt . taux'] ? situation['intérêt . taux'] : taux}
        min="0"
        onChange={(e) => {
          const { value } = e.target
          const invalid = (isNaN(value) || value <= 0) && value != ''
          push(['trackEvent', 'Module', 'Interaction', 'taux ' + value])
          if (!invalid) {
            setSearchParams({
              [encodeDottedName('intérêt . taux')]: value ? value : 0 + '*',
            })
          }
        }}
        step="0.1"
      /> */}
      % sur{' '}
      {engine.setSituation(situation).evaluate('intérêt . durée').nodeValue}{' '}
      ans, cela vous fait donc économiser{' '}
      <Value
        {...{
          size: 'xl',
          engine,
          situation,
          dottedName: 'intérêt . coût total',
          state: 'success',
        }}
      />{' '}
      d'intérêts.
    </p>
  )
}
