import rules from '@/app/règles/rules'
import { BlocAide, InlineLink, PrimeStyle } from './UI'
import { formatValue } from 'publicodes'
import { useEffect, useRef, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import { PrimeDisplay } from './Geste'
import mprImage from '@/public/maprimerenov.svg'
import ceeImage from '@/public/cee.svg'
import Image from 'next/image'
import { BlocAideCoupDePouce } from './cee/BlocAideCoupDePouce'
import GesteQuestion from './GesteQuestion'
import { AvanceTMO } from './mprg/BlocAideMPR'
import { encodeSituation } from './publicodes/situationUtils'

export default function AideGeste({
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : '0px'
    }
  }, [isOpen])

  let infoCEE, infoMPR, infoCoupDePouce, montantTotal, isExactTotal

  const engineSituation = engine.setSituation(situation)
  const relevant = rules[dottedName + ' . MPR . barème']
    ? dottedName + ' . MPR . barème'
    : dottedName + ' . montant'
  const eligibleMPRG = engineSituation.evaluate(
    'MPR . non accompagnée . éligible',
  ).nodeValue

  const dottedNameCee = dottedName + ' . CEE'
  if (typeof rules[dottedNameCee] !== 'undefined') {
    infoCEE = {
      montant: formatValue(
        engineSituation.evaluate(dottedNameCee + ' . montant'),
        { precision: 0 },
      ),
      code: rules[dottedNameCee].code,
      titre: rules[dottedNameCee].titre,
      lien: rules[dottedNameCee].lien,
      questions: rules[dottedNameCee + ' . question']?.valeurs.map((q) =>
        rules[dottedNameCee + ' . ' + q]
          ? dottedNameCee + ' . ' + q
          : rules[dottedName + ' . ' + q]
            ? dottedName + ' . ' + q
            : q,
      ),
    }
  }

  const dottedNameMpr = dottedName + ' . MPR'
  if (eligibleMPRG && typeof rules[dottedNameMpr] !== 'undefined') {
    infoMPR = {
      dottedName: dottedNameMpr,
      montant: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . montant'),
      ),
      plafond: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . plafond'),
      ),
      questions: [dottedNameMpr + ' . ' + rules[dottedNameMpr + ' . question']],
    }
  }

  const dottedNameCP = dottedName + ' . Coup de pouce'
  if (typeof rules[dottedNameCP] !== 'undefined') {
    infoCoupDePouce = {
      montant: formatValue(
        engineSituation.evaluate(dottedNameCP + ' . montant'),
      ),
      questions: [rules[dottedNameCP + ' . question']],
    }
  }

  const evaluationTotal = engineSituation.evaluate(dottedName + ' . montant')
  isExactTotal = Object.keys(evaluationTotal.missingVariables).length === 0
  let calculatedMontantTotal = formatValue(evaluationTotal, { precision: 0 })

  if (!isExactTotal) {
    const maximizeAideVariables = Object.keys(evaluationTotal.missingVariables)
      .map((dn) =>
        rules[dn].maximum ? { [dn]: rules[dn].maximum } : rules[dn].maximum,
      )
      .reduce((acc, obj) => ({ ...acc, ...obj }), {})
    calculatedMontantTotal = formatValue(
      engine
        .setSituation({ ...situation, ...maximizeAideVariables })
        .evaluate(engineSituation.evaluate(relevant)),
      { precision: 0 },
    )
  }

  montantTotal = calculatedMontantTotal

  return (
    <div
      css={`
        border-bottom: 1px solid var(--lighterColor2);
        margin-bottom: 1rem;
        padding-left: 1.5rem;
      `}
    >
      <header
        css={`
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            cursor: pointer;
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <PrimeDisplay
            {...{
              montantTotal,
              isExactTotal,
              rules,
              dottedName,
              eligibleMPRG,
              infoCoupDePouce,
            }}
          />
        </div>
        <div
          css={`
            &::after {
              content: '';
              display: inline-block;
              width: 10px;
              height: 10px;
              border-bottom: 2px solid var(--color);
              border-right: 2px solid var(--color);
              transform: rotate(${isOpen ? '225deg' : '45deg'});
              transition: transform 0.3s ease-in-out;
            }
          `}
        />
      </header>
      <div
        ref={contentRef}
        css={`
          max-height: 0;
          opacity: ${isOpen ? '1' : '0'};
          ${isOpen && 'margin-bottom: 1rem;'};
          overflow: hidden;
          transition:
            max-height 0.4s ease-out,
            opacity 0.3s ease-out;
        `}
      >
        {infoMPR && (
          <BlocAideMPR
            {...{
              infoMPR,
              rules,
              engine,
              situation,
              answeredQuestions,
              setSearchParams,
            }}
          />
        )}
        {infoCoupDePouce && (
          <BlocAideCoupDePouce
            {...{
              infoCoupDePouce,
              rules,
              engine,
              situation,
              answeredQuestions,
              setSearchParams,
            }}
          />
        )}
        {infoCEE && (
          <BlocAideCEE
            {...{
              infoCEE,
              rules,
              engine,
              situation,
              answeredQuestions,
              setSearchParams,
            }}
          />
        )}
      </div>
    </div>
  )
}

const BlocAideMPR = ({
  infoMPR,
  rules,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
}) => {
  const currentQuestion = infoMPR.questions.slice(-1)
  const isExactTotal =
    Array.isArray(infoMPR.questions) &&
    infoMPR.questions.every((question) => question in situation)
  const isEligible = infoMPR.montant !== 'Non applicable'
  if (isEligible && isExactTotal) {
    push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
  }

  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <Image src={mprImage} alt="logo ma prime renov" width="100" />
        <div>
          <h2>MaPrimeRénov'</h2>
        </div>
      </div>
      <PrimeStyle>
        {'Prime de '}
        <strong>{infoMPR.montant}</strong>
      </PrimeStyle>
      <div className="aide-details">
        {currentQuestion && (
          <GesteQuestion
            {...{
              rules,
              question: currentQuestion,
              engine,
              situation,
              setSearchParams,
              answeredQuestions,
            }}
          />
        )}
        <div className="details">
          <AvanceTMO {...{ engine, situation }} />
          Précisions:
          <ul>
            <li>
              La prestation doit être inférieure à{' '}
              <strong>{infoMPR.plafond}</strong>
            </li>
            <li>
              Sous condition de recours à un professionnel <strong>RGE</strong>
            </li>
            {rules[infoMPR.dottedName]?.description && (
              <li>{rules[infoMPR.dottedName].description}</li>
            )}
          </ul>
        </div>
      </div>
    </BlocAide>
  )
}

const BlocAideCEE = ({
  infoCEE,
  rules,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
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
    <BlocAide display="geste">
      <div className="aide-header">
        <Image src={ceeImage} alt="logo Cee" width="60" />
        <h2>Prime CEE (Certificats d'Économie d'Énergie)</h2>
      </div>
      {infoCEE.montant === 'Non applicable' ? (
        <>
          <PrimeStyle $inactive={true}>
            <strong>Non applicable</strong>
          </PrimeStyle>
          <span className="aide-details">
            {' '}
            (non cumulable avec la Prime Coup de pouce)
          </span>
        </>
      ) : (
        <PrimeStyle>
          {'Prime indicative de '}
          <strong>{infoCEE.montant}</strong>
        </PrimeStyle>
      )}
      <div className="aide-details">
        <p>
          Ce montant vous est donné à titre indicatif, il vous appartient de
          mettre en concurrence les offres CEE des fournisseurs d'énergie.
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
        <p
          css={`
            color: #666;
            font-weight: 500;
          `}
        >
          Plus d'infos:{' '}
          <InlineLink
            title={`formulaire ${infoCEE.code}`}
            href={infoCEE.lien}
            target="_blank"
          >
            {infoCEE.code}
          </InlineLink>
        </p>
      </div>
    </BlocAide>
  )
}
