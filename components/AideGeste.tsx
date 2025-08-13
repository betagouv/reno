import rules from '@/app/règles/rules'
import { BlocAide, InlineLink, PrimeStyle } from './UI'
import { formatValue } from 'publicodes'
import { useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import { PrimeDisplay } from './Geste'
import mprImage from '@/public/maprimerenov.svg'
import ceeImage from '@/public/cee.svg'
import Image from 'next/image'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import GesteQuestion from './GesteQuestion'

export default function AideGeste({
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  const [isOpen, setIsOpen] = useState(false)

  let infoCEE, infoMPR, montantTotal, isExactTotal

  const engineSituation = engine.setSituation(situation)
  const relevant = rules[dottedName + ' . MPR . barème']
    ? dottedName + ' . MPR . barème'
    : dottedName + ' . montant'
  const eligibleMPRG = engineSituation.evaluate(
    'MPR . non accompagnée . éligible',
  ).nodeValue

  const dottedNameCee = dottedName + ' . CEE'
  const dottedNameMpr = dottedName + ' . MPR'
  const dottedNameCP = dottedName + ' . Coup de pouce'
  if (typeof rules[dottedNameCee] !== 'undefined') {
    const evaluationCEE = engineSituation.evaluate(dottedNameCee + ' . montant')
    infoCEE = {
      montant: formatValue(evaluationCEE, { precision: 0 }),
      code: rules[dottedNameCee].code,
      titre: rules[dottedNameCee].titre,
      lien: rules[dottedNameCee].lien,
      isExactTotal: Object.keys(evaluationCEE.missingVariables).length == 1,
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
            q != 'CEE . projet . remplacement chaudière thermique',
        ), // On filtre les questions en doublon avec MPR et le remplacement de chaudière
    }
  }

  const hasCoupDePouce = typeof rules[dottedNameCP] !== 'undefined'
  const questionRule =
    dottedNameMpr + ' . ' + rules[dottedNameMpr + ' . question']
  const question = hasCoupDePouce
    ? // Pour bénéficier du coup de pouce, il faut forcément Remplacer la chaudière et donc poser la question
      rules[dottedNameCP + ' . question']
    : rules[questionRule]
      ? questionRule
      : undefined
  if (eligibleMPRG && typeof rules[dottedNameMpr] !== 'undefined') {
    infoMPR = {
      dottedName: dottedNameMpr,
      montant: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . montant'),
      ),
      plafond: formatValue(
        engineSituation.evaluate(dottedNameMpr + ' . plafond'),
      ),
    }
  }

  const montantCoupDePouce = hasCoupDePouce
    ? formatValue(engineSituation.evaluate(dottedNameCP + ' . montant'))
    : null

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

  const mv = evaluationTotal.missingVariables
  console.log({ mv })

  return (
    <div
      css={`
        border-bottom: 1px solid var(--lighterColor2);
        margin-bottom: 1rem;
        padding-left: 1.5rem;
        header {
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            cursor: pointer;
          }
        }
      `}
    >
      <header
        onClick={() => {
          push([
            'trackEvent',
            'Simulateur Principal',
            'Page',
            (!isOpen ? 'Déplie geste' : 'Replie geste') + ' ' + dottedName,
          ])
          setIsOpen(!isOpen)
        }}
      >
        <div>
          <PrimeDisplay
            {...{
              montantTotal,
              isExactTotal,
              rules,
              dottedName,
              eligibleMPRG,
              hasCoupDePouce,
              description: false,
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
        css={`
          display: none;
          ${isOpen && 'display: block;margin-bottom: 1rem;'};
        `}
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
      </div>
    </div>
  )
}

const BlocAideMPR = ({ infoMPR, engine, situation }) => (
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
      <div className="details">
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

const BlocAideCoupDePouce = ({ montantCoupDePouce }) => {
  const remplacementChaudiere =
    rules['CEE . projet . remplacement chaudière thermique'].titre

  return (
    <BlocAide display="geste">
      <div className="aide-header">
        <Image src={coupDePouceImage} alt="logo Coup de Pouce" width="100" />
        <div>
          <h2>Prime Coup de pouce</h2>
        </div>
      </div>
      <PrimeStyle $inactive={montantCoupDePouce === 'Non applicable'}>
        <strong>{montantCoupDePouce}</strong>
      </PrimeStyle>
      <span className="aide-details">
        {' '}
        {montantCoupDePouce === 'Non applicable' ? 'sans' : 'si'}{' '}
        {remplacementChaudiere}
      </span>
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
        <h2>Prime CEE (Certificats d'Économie d'Énergie)</h2>
      </div>
      <PrimeStyle $inactive={!isApplicable}>
        {!infoCEE.isExactTotal ? (
          'Prime existante'
        ) : (
          <>
            {isApplicable && 'Prime indicative de '}
            <strong>{infoCEE.montant}</strong>
          </>
        )}
      </PrimeStyle>
      {!isApplicable && (
        <span className="aide-details">
          {' '}
          (non cumulable avec la Prime Coup de pouce)
        </span>
      )}
      {isApplicable && (
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
      )}
    </BlocAide>
  )
}
