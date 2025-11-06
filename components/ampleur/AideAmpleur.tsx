import rules from '@/app/règles/rules'
import { ConditionEligibiliteUI } from '../UI'
import { uncapitalise0 } from '../utils'
import AideCTAs from './AideCTAs'
import { push } from '@socialgouv/matomo-next'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import { PrimeBadge } from '../Geste'
import useIsMobile from '../useIsMobile'

export default function AideAmpleur({
  isEligible,
  engine,
  dottedName,
  setSearchParams,
  situation,
  children,
  expanded,
  addedText = null,
  noCondition = false,
  noDescription = false,
  calculette,
}) {
  const isMobile = useIsMobile()
  return (
    <>
      {expanded ? (
        <>
          <div
            css={`
              display: flex;
              flex-direction: column;
            `}
            className="fr-my-5v"
          >
            <h1>
              {aideTitle(dottedName)}
              <br />
              <PrimeBadge
                {...{
                  situation,
                  engine,
                  dottedName,
                }}
              />
            </h1>
          </div>
          {calculette && calculette}
          <h2 className="fr-mt-5">
            <span
              aria-hidden="true"
              css={`
                display: inline-block;
                margin-right: 0.5rem;
              `}
            >
              🤓
            </span>
            De quoi s’agit-il ?
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].descriptionHtml,
            }}
          />
          {children}
          {!noCondition && (
            <ConditionEligibiliteUI>
              {rules[dottedName].conditionsEligibilitesHTML}
            </ConditionEligibiliteUI>
          )}
          {rules[dottedName]['lien'] && (
            <p>
              <a
                title="Plus d'infos sur cette aide - nouvelle fenêtre"
                rel="noopener external"
                className="fr-link"
                href={rules[dottedName]['lien']}
                target="_blank"
              >
                Plus d'infos sur cette aide
              </a>
            </p>
          )}
        </>
      ) : (
        <Accordion
          label={
            <span
              css={`
                display: flex;
                flex-direction: ${isMobile ? 'column' : 'row'};
                ${isMobile && 'gap:0.5rem;'}
                justify-content: space-between;
                width: 100%;
                padding-right: 0.5rem;
              `}
            >
              {aideTitle(dottedName)}
              <PrimeBadge
                {...{
                  situation,
                  engine,
                  dottedName,
                }}
              />
            </span>
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
          {!noDescription && (
            <div
              dangerouslySetInnerHTML={{
                __html: rules[dottedName].descriptionHtml,
              }}
            />
          )}
          {typeof addedText === 'object' ? (
            addedText
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: addedText,
              }}
            />
          )}
          <AideCTAs
            {...{
              dottedName,
              setSearchParams,
              isEligible,
            }}
          />
        </Accordion>
      )}
    </>
  )
}
export const aideTitle = (dottedName) => {
  const rule = rules[dottedName]
  const marque2 = rule['complément de marque']
  return rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : '')
}

export function AideDurée({ engine, situation, dottedName }) {
  const duréeName =
    dottedName.replace(/\s.\smontant$/, '') +
    (dottedName.includes('denormandie') ? ' . années de location' : ' . durée')
  const duréeRule = rules[duréeName]
  if (!duréeRule) return null
  const evaluation = engine.setSituation(situation).evaluate(duréeName)
  return (
    <>
      {rules[dottedName.replace(' . montant', '')].type == 'prêt' && (
        <> de prêt</>
      )}{' '}
      sur {evaluation.nodeValue} ans
    </>
  )
}
