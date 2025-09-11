export default function OutreMerInformation({ situation, engine }) {
  const { 'logement . code région': codeRegion } = situation
  const evaluation = engine.setSituation(situation).evaluate('outre-mer')
  const isOutreMer = evaluation.nodeValue

  console.log({ evaluation, isOutreMer })

  return (
    <section>
      <div>
        {isOutreMer ? (
          <div>
            <div>L'adresse est en France d'outre-mer.</div>
            <div>
              🔴 Le service Mes Aides Réno{' '}
              <strong>ne prend pas encore en compte</strong> les règles
              spécifiques à l'outre-mer. <br />
              En attendant, vous pouvez utiliser{' '}
              <a href="https://france-renov.gouv.fr/aides/simulation">
                le simulateur France Rénov'
              </a>
              .
            </div>
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
