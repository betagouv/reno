import rules from '@/app/règles/rules'
import { BlocAide } from './UI'
import { formatValue } from 'publicodes'
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

export const getInfoForPrime = ({ engine, dottedName, situation }) => {
  let infoCEE, infoMPR, montantTotal, isExactTotal
  // Tant que MPA/MPLD ne sont pas intégré au simulateur principal, il faut forcer le parcours d'aide pour MPR
  if (!situation["parcours d'aide"]) {
    situation["parcours d'aide"] = '"rénovation énergétique"'
  }
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
      plafond: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . plafond'),
      ),
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
    Object.keys(evaluationTotal?.missingVariables).length <= 1
  let calculatedMontantTotal = formatValue(evaluationTotal, { precision: 0 })
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
            justify-content: space-between;
            width: 100%;
            padding-right: 0.5rem;
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
          'Déplie geste ' + dottedName,
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
      {montantCoupDePouce && (
        <BlocAideCoupDePouce
          {...{
            montantCoupDePouce,
            engine,
            situation,
            dottedName,
          }}
        />
      )}
      {infoCEE && (
        <BlocAideCEE
          {...{
            infoCEE,
            engine,
            situation,
            dottedName,
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
      <h4 className="fr-m-0">MaPrimeRénov'</h4>
      <PrimeBadge
        {...{
          situation,
          engine,
          dottedName: infoMPR.dottedName,
        }}
      />
    </div>
    <div className="aide-details">
      <div className="details">
        Précisions: Sous condition de recours à un professionnel{' '}
        <strong>RGE</strong>. {rules[infoMPR.dottedName]?.description}
      </div>
    </div>
  </BlocAide>
)

const BlocAideCoupDePouce = ({
  montantCoupDePouce,
  engine,
  situation,
  dottedName,
}) => {
  const remplacementChaudiere =
    rules['CEE . projet . remplacement chaudière thermique'].titre

  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <h4 className="fr-m-0">Prime Coup de pouce</h4>
        <PrimeBadge
          {...{
            engine,
            situation,
            dottedName: dottedName + ' . Coup de pouce',
          }}
        />
      </div>
      <div className="aide-details">
        <div className="details">
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
  dottedName,
}) => {
  const isApplicable = infoCEE.montant !== 'Non applicable'
  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <h4 className="fr-m-0">Prime CEE *</h4>
        <PrimeBadge
          {...{ engine, situation, dottedName: dottedName + ' . CEE' }}
        />
      </div>
      {isApplicable && (
        <div className="aide-details">
          <p>
            Certificats d'Économie d'Énergie : ce montant vous est donné à titre
            indicatif, il vous appartient de mettre en concurrence les offres
            CEE des fournisseurs d'énergie. Plus d'infos:{' '}
            <a
              className="fr-link"
              title={`${infoCEE.code} - nouvelle fenêtre`}
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
