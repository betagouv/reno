import rules from '@/app/règles/rules'
import { BlocAide } from './UI'
import { formatValue } from 'publicodes'
import { useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import { PrimeBadge } from './Geste'
import mprImage from '@/public/maprimerenov.svg'
import ceeImage from '@/public/cee.svg'
import Image from 'next/image'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import GesteQuestion from './GesteQuestion'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'
import { getRuleName } from './publicodes/utils'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Tooltip from '@codegouvfr/react-dsfr/Tooltip'
import getNextQuestions from './publicodes/getNextQuestions'
import BonusOutreMer from './outre-mer/BonusOutreMer'

export const getInfoForPrime = ({ engine, dottedName, situation }) => {
  let infoCEE, infoMPR, montantTotal, isExactTotal

  const engineSituation = engine.setSituation({
    ...situation,
    [dottedName]: 'oui',
  })
  const possibleKeys = [
    dottedName + ' . barème',
    dottedName + ' . MPR . barème',
    dottedName + ' . montant',
    dottedName,
  ]

  const relevant = possibleKeys.find((key) => rules[key])

  const eligibleMPRG = engineSituation.evaluate(
    'MPR . non accompagnée . éligible',
  ).nodeValue

  const dottedNameCee = dottedName + ' . CEE'
  const dottedNameMpr = dottedName + ' . MPR'
  const dottedNameCP = dottedName + ' . Coup de pouce'

  if (typeof rules[dottedNameCee] !== 'undefined') {
    const evaluationCEE = engineSituation.evaluate(dottedNameCee + ' . montant')
    infoCEE = {
      isEligible: engineSituation.evaluate('CEE . conditions').nodeValue,
      montant: formatValue(evaluationCEE, { precision: 0 }),
      montantRaw: evaluationCEE.nodeValue,
      code: rules[dottedNameCee].code,
      titre: rules[dottedNameCee].titre,
      lien: rules[dottedNameCee].lien,
      isExactTotal: Object.keys(evaluationCEE.missingVariables).length === 0,
      questions: rules[dottedNameCee + ' . question']?.valeurs
        .map((q) =>
          rules[dottedNameCee + ' . ' + q]
            ? dottedNameCee + ' . ' + q
            : rules[dottedName + ' . ' + q]
              ? dottedName + ' . ' + q
              : q,
        )
        .filter(
          (q) =>
            !q.includes('MPR') &&
            q !== 'CEE . projet . remplacement chaudière thermique',
        ),
    }
  }

  const hasCoupDePouce = typeof rules[dottedNameCP] !== 'undefined'
  const questionRule =
    dottedNameMpr + ' . ' + rules[dottedNameMpr + ' . question']
  const question = hasCoupDePouce
    ? rules[dottedNameCP + ' . question']
    : rules[questionRule]
      ? questionRule
      : undefined

  if (typeof rules[dottedNameMpr] !== 'undefined') {
    const questions = getNextQuestions(
      engine.setSituation(situation).evaluate(dottedNameMpr + ' . montant'),
      [],
      [],
    )
    // On ajoute les questions déja répondues qui ne sont pas renvoyées par le getNextQuestions
    questions.unshift(...Object.keys(situation))
    const filteredQuestion = new Set(questions)
    const evaluationMpr = engineSituation.evaluate(dottedNameMpr + ' . montant')
    infoMPR = {
      dottedName: dottedNameMpr,
      montant: formatValue(evaluationMpr),
      montantRaw: evaluationMpr.nodeValue,
      isExactTotal: Object.keys(evaluationMpr.missingVariables).length === 1,
      plafond:
        rules[dottedNameMpr + ' . plafond'] != null &&
        formatValue(engineSituation.evaluate(dottedNameMpr + ' . plafond')),
      questions: [...filteredQuestion].filter((q) => rules[q].question),
    }
  }

  const montantCoupDePouce = hasCoupDePouce
    ? formatValue(engineSituation.evaluate(dottedNameCP + ' . montant'))
    : null

  const evaluationTotal =
    rules[dottedName + ' . montant'] &&
    engineSituation.evaluate(
      dottedName.includes('montant') ? dottedName : dottedName + ' . montant',
    )
  isExactTotal =
    evaluationTotal?.missingVariables &&
    Object.keys(evaluationTotal?.missingVariables).filter(
      (questionKey) =>
        rules[questionKey] != null && rules[questionKey].question,
    ).length === 0
  let calculatedMontantTotal = formatValue(evaluationTotal, { precision: 0 })

  console.log(
    'PrimeBadge',
    dottedName,
    'relevant',
    relevant,
    evaluationTotal?.missingVariables,
    isExactTotal,
  )

  if (!isExactTotal) {
    calculatedMontantTotal = formatValue(
      engine.setSituation(situation).evaluate(relevant),
      { precision: 0 },
    )
  }

  montantTotal = calculatedMontantTotal
  return {
    montantTotal,
    isExactTotal,
    montantCoupDePouce,
    infoCEE,
    infoMPR,
    eligibleMPRG,
    question,
    hasCoupDePouce,
  }
}

export default function AideGeste({
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { question, infoMPR, infoCEE, montantCoupDePouce } = getInfoForPrime({
    engine,
    dottedName,
    situation,
  })

  return (
    <Accordion
      label={
        <div
          css={`
            display: flex;
            flex-direction: column;
          `}
        >
          {rules[dottedName].titre || getRuleName(dottedName)}
          <PrimeBadge
            {...{
              situation,
              engine,
              dottedName,
            }}
          />
        </div>
      }
      onExpandedChange={() => {
        push([
          'trackEvent',
          'Simulateur Principal',
          'Page',
          (!isOpen ? 'Déplie geste' : 'Replie geste') + ' ' + dottedName,
        ])
      }}
    >
      {question && (
        <GesteQuestion
          {...{
            rules,
            question,
            engine,
            situation,
            setSearchParams,
            answeredQuestions,
          }}
        />
      )}
      {infoMPR && (
        <BlocAideMPR
          {...{
            infoMPR,
            engine,
            situation,
          }}
        />
      )}
      <BonusOutreMer
        {...{
          engine,
          situation,
          dottedName,
          rules,

          answeredQuestions,
          setSearchParams,
        }}
      />
      {montantCoupDePouce && (
        <BlocAideCoupDePouce
          {...{
            montantCoupDePouce,
          }}
        />
      )}

      {infoCEE && (
        <BlocAideCEE
          {...{
            infoCEE,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
          }}
        />
      )}
    </Accordion>
  )
}

const BlocAideMPR = ({ infoMPR, engine, situation }) => (
  <BlocAide display="geste">
    <div className="aide-header">
      <Image src={mprImage} alt="logo ma prime renov" width="100" />
      <div>
        <h4 className="fr-m-0">MaPrimeRénov'</h4>
        <PrimeBadge
          {...{
            situation,
            engine,
            dottedName: infoMPR.dottedName,
          }}
        />
      </div>
    </div>
    <div className="aide-details">
      <div className="details">
        Précisions: Sous condition de recours à un professionnel{' '}
        <strong>RGE</strong>. La prestation doit être inférieure à{' '}
        <strong>{infoMPR.plafond}</strong>.
        {rules[infoMPR.dottedName]?.description}
      </div>
    </div>
  </BlocAide>
)

const BlocAideCoupDePouce = ({ montantCoupDePouce }) => {
  const remplacementChaudiere =
    rules['CEE . projet . remplacement chaudière thermique'].titre

  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <Image src={coupDePouceImage} alt="logo Coup de Pouce" width="100" />
        <div>
          <h4 className="fr-m-0">Prime Coup de pouce</h4>
          <Badge
            noIcon
            severity={montantCoupDePouce !== 'Non applicable' ? 'success' : ''}
          >
            {montantCoupDePouce === 'Non applicable' ? (
              <>Non applicable</>
            ) : (
              <>Prime de {montantCoupDePouce}</>
            )}
          </Badge>
          <span className="aide-details">
            {' '}
            {montantCoupDePouce === 'Non applicable' ? 'sans' : 'si'}{' '}
            {remplacementChaudiere}
          </span>
        </div>
      </div>
    </BlocAide>
  )
}

const BlocAideCEE = ({
  infoCEE,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
}) => {
  const isApplicable = infoCEE.montant !== 'Non applicable'
  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <Image src={ceeImage} alt="logo Cee" width="60" />
        <div>
          <h4 className="fr-m-0">
            Prime CEE (Certificats d'Économie d'Énergie)
          </h4>
          <Badge noIcon severity={isApplicable ? 'success' : ''}>
            {!infoCEE.isExactTotal ? (
              <>
                Prime existante&nbsp;
                <Tooltip
                  className="fr-ms-1v"
                  kind="hover"
                  title="Veuillez répondre aux questions pour préciser son montant."
                />
              </>
            ) : isApplicable ? (
              'Prime indicative de ' + infoCEE.montant
            ) : (
              'non cumulable avec la Prime Coup de pouce'
            )}
          </Badge>
        </div>
      </div>
      {isApplicable && (
        <div className="aide-details">
          <p>
            Ce montant vous est donné à titre indicatif, il vous appartient de
            mettre en concurrence les offres CEE des fournisseurs d'énergie.
            Plus d'infos:{' '}
            <a
              className="fr-link"
              title={`formulaire ${infoCEE.code}`}
              href={infoCEE.lien}
              target="_blank"
            >
              {infoCEE.code}
            </a>
          </p>
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
        </div>
      )}
    </BlocAide>
  )
}
