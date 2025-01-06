import { CTA, CTAWrapper } from '@/components/UI'
import { formatValue } from 'publicodes'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'
import investissementIcon from '@/public/investissement.svg'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'

export function EligibilityResult({ engine, dottedName, situation, text }) {
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . montant')
  if (!evaluation) return null

  const isMobile = useMediaQuery('(max-width: 400px)')
  const isEligible = evaluation.nodeValue
  const montant = formatValue(engine.evaluate(`${dottedName} . montant`))
  const taux = formatValue(engine.evaluate(`${dottedName} . taux`))
  const duree = formatValue(engine.evaluate(`${dottedName} . durée`))

  return (
    (!Object.keys(evaluation.missingVariables).length ||
      situation['taxe foncière . commune . éligible'] == 'non' ||
      situation['logement . commune . denormandie'] == 'non') && (
      <div
        css={`
          background: var(--lightestColor);
          border-bottom: 4px solid var(--color);
          padding: 1rem;
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
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
                <>
                  <Key
                    $state="prime"
                    css={`
                      margin: 0.5rem auto;
                      width: fit-content;
                      font-size: 1.5rem;
                      padding: 0.5rem;
                    `}
                  >
                    {dottedName === 'denormandie' ? montant : taux}
                  </Key>{' '}
                  {dottedName === 'taxe foncière' ? (
                    <>
                      de Taxe Foncière pendant{' '}
                      <Key $state="in-progress">{duree}</Key>
                    </>
                  ) : (
                    <>
                      sur <Key $state="in-progress">{duree}</Key>
                    </>
                  )}
                </>
              )}
              {dottedName === 'denormandie' && (
                <>
                  <small
                    css={`
                      display: block;
                    `}
                  >
                    Détail: <Key $state="in-progress">{taux}</Key> du coût du
                    bien{' '}
                    {engine.evaluate(dottedName + ' . assiette').nodeValue <
                    engine.evaluate(dottedName + ' . plafond').nodeValue ? (
                      <>
                        soit{' '}
                        <Key $state="in-progress">
                          {formatValue(
                            engine.evaluate(dottedName + ' . assiette'),
                          )}
                        </Key>
                      </>
                    ) : (
                      <>
                        plafonné à{' '}
                        <Key $state="in-progress">
                          {formatValue(
                            engine.evaluate(dottedName + ' . plafond'),
                          )}
                        </Key>
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
                      {montant}
                    </Key>{' '}
                    maximum
                  </span>
                  <small>
                    sans intérêt pendant <Key $state="in-progress">{duree}</Key>
                  </small>
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
              <span>⚠️ Vous êtes peut-être éligible à d'autres aides!</span>
            </>
          )}
        </p>
        <CTAWrapper $justify="left" $customCss="margin: 0;">
          <CTA $importance="primary" css="font-size: 100%;">
            <AmpleurCTA situation={situation} />
          </CTA>
        </CTAWrapper>
      </div>
    )
  )
}
