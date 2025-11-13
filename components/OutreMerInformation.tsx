import { OutreMerImage } from './outre-mer/BonusOutreMer'

export default function OutreMerInformation({ situation, engine }) {
  const evaluation = engine.setSituation(situation).evaluate('outre-mer')
  const isOutreMer = evaluation.nodeValue,
    isDROM = engine.evaluate('outre-mer . DROM').nodeValue,
    isCOM = engine.evaluate('outre-mer . COM').nodeValue

  return (
    <section>
      <div>
        {isOutreMer ? (
          <div>
            <div>L'adresse est en France d'outre-mer.</div>
            {isCOM ? (
              <div>
                🔴 Désolé, le service Mes Aides Réno{' '}
                <strong>ne prend pas encore en compte</strong> les règles
                spécifiques aux <strong>collectivités d'outre-mer</strong>.
              </div>
            ) : (
              <div>
                <div
                  css={`
                    width: fit-content;
                    margin: 1rem 0;
                  `}
                >
                  <OutreMerImage
                    codeRégion={situation['logement . code région']?.replace(
                      /"/g,
                      '',
                    )}
                  />
                </div>

                <p>
                  ✅ Les règles spécifiques aux départements et régions
                  d'outre-mer sont prises en compte dans la suite de la
                  simulation.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
