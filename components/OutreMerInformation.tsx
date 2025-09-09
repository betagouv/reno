export default function OutreMerInformation({ situation, engine }) {
  const { 'logement . code région': codeRegion } = situation
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
                spécifiques aux collectivités d'outre-mer. <br />.
              </div>
            ) : (
              <div>
                ✅ Les règles spécifiques aux départements et régions
                d'outre-mer sont prises en compte dans la suite de la
                simulation.
                <br />
              </div>
            )}
            <div>
              <small style={{ color: 'lightgray' }}>
                Code région : {codeRegion.replace(/"/g, '')}
              </small>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
