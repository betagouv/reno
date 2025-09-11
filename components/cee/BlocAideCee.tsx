import React, { useEffect } from 'react'
import Image from 'next/image'
import GesteQuestion from '../GesteQuestion'
import ceeImage from '@/public/cee.svg'
import { Highlight } from '@codegouvfr/react-dsfr/Highlight'
import { BlocAide } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import Badge from '@codegouvfr/react-dsfr/Badge'

export const BlocAideCEE = ({
  infoCEE,
  rules,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
  displayPrime = 'top',
}) => {
  const isExactTotal = infoCEE.questions
    ?.filter((q) => rules[q].question)
    .every((e) => Object.keys(situation).includes(e))
  if (isExactTotal) {
    push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
  }
  // Par défaut, on propose les valeurs max (cela sert aussi à sélectionner des valeurs dans les <select>)
  infoCEE.questions?.map((q) => {
    if (!Object.keys(situation).includes(q) && rules[q].maximum) {
      situation[q] = rules[q].maximum
    }
  })

  const encodedSituation = encodeSituation(
    {
      ...situation,
    },
    false,
    answeredQuestions,
  )

  useEffect(() => {
    setSearchParams(encodedSituation, 'push', false)
  }, [encodedSituation, setSearchParams])

  return (
    <BlocAide>
      <div className="aide-header">
        <Image src={ceeImage} alt="logo Cee" width="60" />
        <div>
          {displayPrime === 'top' &&
            (infoCEE.montant === 'Non applicable' ? (
              <>
                <Badge noIcon>
                  <strong>Non applicable</strong>
                </Badge>
                <span className="aide-details">
                  {' '}
                  (non cumulable avec la prime "Coup de Pouce")
                </span>
              </>
            ) : (
              <Badge noIcon severity="success">
                Prime indicative de {infoCEE.montant}
              </Badge>
            ))}
          <h3>
            Prime CEE (Certificats d'Économie d'Énergie)
            <br />
            <span className="fr-hint-text">
              Plus d'infos:{' '}
              <a
                className="fr-link"
                title={`${infoCEE.code} - nouvelle fenêtre`}
                href={infoCEE.lien}
                target="_blank"
              >
                {infoCEE.code}
              </a>
            </span>
          </h3>
        </div>
      </div>
      <div className="aide-details">
        <Highlight>
          Ce montant vous est donné à titre indicatif, il vous appartient de
          mettre en concurrence les offres CEE des fournisseurs d'énergie.
        </Highlight>
        {infoCEE.questions?.map((question, idx) => (
          <GesteQuestion
            key={idx}
            {...{
              rules,
              question,
              engine,
              situation,
              answeredQuestions,
              setSearchParams,
            }}
          />
        ))}
        {displayPrime === 'bottom' && (
          <div
            css={`
              justify-content: end;
              display: flex;
            `}
          >
            <Badge noIcon severity="success" className="fr-text--lead">
              Prime indicative de {isExactTotal ? infoCEE.montant : '...'}
            </Badge>
          </div>
        )}
      </div>
    </BlocAide>
  )
}
