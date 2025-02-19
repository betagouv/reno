import { CTA, CTAWrapper } from '@/components/UI'
import { formatValue } from 'publicodes'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'
import investissementIcon from '@/public/investissement.svg'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'
import calculatorIcon from '@/public/calculator-empty.svg'
import { Card } from '@/components/UI'
import Value from './Value'
import { push } from '@socialgouv/matomo-next'
import useSetSearchParams from './useSetSearchParams'
import { encodeDottedName } from './publicodes/situationUtils'
import { useEffect } from 'react'

export function EligibilityResult({ engine, dottedName, situation, text }) {
  const evaluation = engine
    .setSituation(situation)
    .evaluate(
      dottedName +
        ' . ' +
        (dottedName == 'taxe foncière' ? 'conditions' : 'montant'),
    )

  if (!evaluation) return null

  const isMobile = useMediaQuery('(max-width: 400px)')
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
    <>
      <div
        css={`
          background: var(--lightestColor);
          border-bottom: 4px solid var(--color);
          padding: 1rem !important;
          max-width: max-content !important;
        `}
      >
        <div
          css={`
            display: flex;
            gap: 1rem;
            align-items: center;
            justify-content: space-between;
            text-align: center;
            flex-wrap: wrap;
          `}
        >
          {!isMobile && (
            <Image src={investissementIcon} alt="icone montant en euro" />
          )}
          <p
            css={`
              flex: 1;
              margin: 0;
            `}
          >
            {isEligible ? (
              <>
                <strong>
                  Vous êtes éligible à{' '}
                  {dottedName === 'taxe foncière'
                    ? 'une exonération'
                    : dottedName === 'denormandie'
                      ? "une réduction d'impôt"
                      : 'un prêt'}{' '}
                  de{' '}
                </strong>
                {['denormandie', 'taxe foncière'].includes(dottedName) && (
                  <span
                    css={`
                      display: block;
                      margin: 0.5rem 0;
                    `}
                  >
                    <Key
                      $state="prime"
                      css={`
                        margin: 0.5rem auto;
                        width: fit-content;
                        font-size: 1.5rem;
                        padding: 0.5rem;
                      `}
                    >
                      {dottedName === 'denormandie' ? montantFormatte : taux}
                    </Key>{' '}
                    {dottedName === 'taxe foncière' ? (
                      <>
                        de Taxe Foncière pendant{' '}
                        <strong>{dureeFormattee}</strong>
                      </>
                    ) : (
                      <>
                        sur <Key $state="in-progress">{dureeFormattee}</Key>
                      </>
                    )}
                  </span>
                )}
                {dottedName === 'denormandie' && (
                  <>
                    <small
                      css={`
                        display: block;
                        margin: 0.5rem 0;
                      `}
                    >
                      Détail: <strong>{taux}</strong> du coût du bien{' '}
                      {engine.evaluate(dottedName + ' . assiette').nodeValue <
                      engine.evaluate(dottedName + ' . plafond').nodeValue ? (
                        <>
                          soit{' '}
                          <strong>
                            {formatValue(
                              engine.evaluate(dottedName + ' . assiette'),
                            )}
                          </strong>
                        </>
                      ) : (
                        <>
                          plafonné à{' '}
                          <strong>
                            {formatValue(
                              engine.evaluate(dottedName + ' . plafond'),
                            )}
                          </strong>
                        </>
                      )}
                    </small>
                  </>
                )}
                {['PAR', 'PTZ'].includes(dottedName) && (
                  <>
                    <span
                      css={`
                        display: block;
                        margin: 0.5rem 0;
                      `}
                    >
                      de{' '}
                      <Key
                        $state="prime"
                        css={`
                          font-size: 1.5rem;
                          padding: 0.4rem;
                        `}
                      >
                        {montantFormatte}
                      </Key>{' '}
                      maximum{' '}
                      <small>sans intérêt pendant {dureeFormattee}</small>
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <span
                  css={`
                    color: red;
                    display: block;
                  `}
                >
                  {situation['taxe foncière . commune . éligible'] === 'non' ||
                  situation['logement . commune . denormandie'] === 'non'
                    ? "Cette commune n'est"
                    : "Vous n'êtes"}{' '}
                  pas éligible {text}
                </span>
                <span
                  css={`
                    display: inline-block;
                    margin: 0.5rem 0;
                  `}
                >
                  ⚠️ Vous êtes peut-être éligible à d'autres aides!
                </span>
              </>
            )}
          </p>
        </div>
        {isEligible && ['PAR', 'PTZ'].includes(dottedName) && (
          <ComparatifPretConso {...{ engine, situation, montant, duree }} />
        )}
        <CTAWrapper $justify="left" $customCss="margin: 0 auto;">
          <CTA $importance="primary" css="font-size: 100%;">
            <AmpleurCTA situation={situation} />
          </CTA>
        </CTAWrapper>
      </div>
    </>
  )
}

export const ComparatifPretConso = ({ engine, situation, montant, duree }) => {
  const setSearchParams = useSetSearchParams()
  const evaluationintérêt = engine.setSituation(situation)
  situation['intérêt . montant emprunt'] = montant.nodeValue
  situation['intérêt . durée'] = duree.nodeValue
  const taux = evaluationintérêt.evaluate('intérêt . taux').nodeValue
  console.log('taux', taux)
  console.log('montant emprunt', montant.nodeValue)
  console.log('duree', duree.nodeValue)
  return (
    <Card
      css={`
        display: flex;
        gap: 0.5rem;
      `}
    >
      <Image
        src={calculatorIcon}
        alt="Icône calculette"
        css={`
          width: 6rem;
          height: 2rem;
          margin: 1rem auto;
        `}
      />
      <p>
        Par rapport à un prêt à la consommation au taux de{' '}
        <input
          css={`
            vertical-align: text-bottom;
            padding: 0;
            max-width: 4rem !important;
            border-bottom: 2px solid #d1d1fb !important;
          `}
          type="number"
          value={
            situation['intérêt . taux'] ? situation['intérêt . taux'] : taux
          }
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
        />
        % sur
        <Value
          {...{
            engine,
            situation,
            dottedName: 'intérêt . durée',
          }}
        />
        , cela vous fait donc économiser{' '}
        <Value
          {...{
            engine,
            situation,
            dottedName: 'intérêt . coût total',
            state: 'prime',
          }}
        />{' '}
        d'intérêts.
      </p>
    </Card>
  )
}
