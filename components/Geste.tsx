'use client'
import { getInfoForPrime } from './AideGeste'
import rules from '@/app/règles/rules'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { AideDurée } from './ampleur/AideAmpleur'
import { createExampleSituation } from './ampleur/AmpleurSummary'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import { formatValue } from 'publicodes'

export const PrimeBadge = ({ engine, dottedName, situation, montantSeul }) => {
  if (['tva réduite', "crédit d'impôt", 'apa', 'aeeh'].includes(dottedName)) {
    return
  }
  const bestSituation = createExampleSituation(situation, 'best')
  const { montantTotal, isExactTotal, eligibleMPRG, hasCoupDePouce } =
    getInfoForPrime({
      engine,
      dottedName,
      situation,
    })
  let tauxDenormandie = null
  if (dottedName.includes('denormandie')) {
    tauxDenormandie = engine
      .setSituation(situation)
      .evaluate('denormandie . taux').nodeValue
  }

  const status =
    dottedName == 'aides locales'
      ? ''
      : montantTotal === 'Non applicable'
        ? 'error'
        : (isExactTotal &&
              montantTotal != 0 &&
              montantTotal != 'Pas encore défini') ||
            rules[dottedName.replace(' . montant', '')]?.type === 'prêt' ||
            dottedName == 'MPR . accompagnée'
          ? 'success'
          : 'new'

  return (
    <Badge
      severity={status}
      className={
        status === 'success'
          ? 'badge-success-custom'
          : status === ''
            ? 'fr-icon-checkbox-line fr-badge--icon-left badge-info-custom'
            : ''
      }
    >
      {status == 'error' ? (
        <>Non éligible</>
      ) : dottedName == 'MPR . accompagnée' ? (
        <>
          Jusqu'à{' '}
          {formatValue(
            engine
              .setSituation(bestSituation)
              .evaluate(dottedName + ' . montant'),
          )}
        </>
      ) : dottedName == 'aides locales' ? (
        <>A vérifier</>
      ) : dottedName.includes('taxe foncière') ? (
        <>
          {situation['taxe foncière . commune . taux']}
          <AideDurée
            engine={engine}
            situation={bestSituation}
            dottedName={dottedName + ' . montant'}
          />
        </>
      ) : dottedName.includes('denormandie') ? (
        <>
          {tauxDenormandie ? (
            <>
              Réduction d'impôt de {montantTotal}
              <AideDurée
                engine={engine}
                situation={bestSituation}
                dottedName={dottedName + ' . montant'}
              />
            </>
          ) : (
            'Potentiellement éligible'
          )}
        </>
      ) : rules[dottedName.replace(' . montant', '')]?.type === 'prêt' ? (
        <>
          Jusqu'à {montantTotal}
          <AideDurée
            engine={engine}
            situation={bestSituation}
            dottedName={dottedName + ' . montant'}
          />
        </>
      ) : status == 'new' ? ( // Cas MPR avec ou sans CEE/Coup de pouce
        <>A compléter</>
      ) : dottedName.includes('locavantage') ? (
        <>Réduction d'impôt de {montantTotal}</>
      ) : (!eligibleMPRG && !hasCoupDePouce && isExactTotal && montantTotal) ||
        dottedName.endsWith('CEE') ? (
        // On a le droit qu'au CEE, si l'aide est à 0, ça veut dire qu'elle n'existe pas
        <>
          {!montantSeul && 'Prime indicative de'} {montantTotal}&nbsp;{' '}
          <Tooltip
            className="fr-ms-1v"
            kind="hover"
            title="Ce montant correspond à la formule officielle de calcul. Cependant, les fournisseurs d'énergies sont libres d'adopter leur propre méthode de calcul."
          />
        </>
      ) : (
        <>
          {!montantSeul && 'Prime de'} {montantTotal}
        </>
      )}
    </Badge>
  )
}
