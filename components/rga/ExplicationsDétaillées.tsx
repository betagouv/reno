import rules from '@/app/règles/rules'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { capitalise0 } from 'publicodes'
const rule = rules['rga . conditions']
const conditions = Object.entries(rule['toutes ces conditions'])

export default function ExplicationsDétaillées({
  engine,
  situation,
  answeredQuestions,
}) {
  const evaluate = (dottedName) =>
    engine.setSituation(situation).evaluate(dottedName).nodeValue

  return (
    <>
      <p>Voici les conditions de l'aide déclinées pour votre situation :</p>

      <ol>
        {conditions
          .map(([k, v]) => (typeof v === 'string' ? v : null))
          .filter(Boolean)
          .map((dottedName) => {
            const condition = rules[dottedName]
            if (condition == null) throw Error(`Règle ${dottedName} inconnue !`)
            const value = evaluate(dottedName)

            const label = capitalise0(
              condition.titre || dottedName.split(' . ').slice(-1)[0],
            )

            console.log({ condition })

            const conditionEvaluation = engine.evaluate(dottedName)

            console.log('concon', conditionEvaluation.nodeValue, dottedName)
            const inactive =
              Object.keys(conditionEvaluation.missingVariables).length > 0

            return (
              <li key={dottedName}>
                <div>
                  {label}{' '}
                  {inactive ? (
                    <Badge noIcon severity="information">
                      Non calculé
                    </Badge>
                  ) : (
                    <Badge noIcon severity={value ? 'success' : 'error'}>
                      {value ? '✔ oui' : '✗ non'}
                    </Badge>
                  )}
                </div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: condition.descriptionHtml,
                  }}
                />
                {dottedName === 'rga . département éligible' && (
                  <div>
                    <p>Voici la liste des départements éligibles : </p>
                    <ul
                      css={`
                        display: flex;
                        gap: 1rem;
                        list-style-type: none;
                        padding-left: 0;
                      `}
                    >
                      {condition['une de ces conditions'].map((el) => (
                        <li key={el}>{el.match(/\d\d/)[0]}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
      </ol>
    </>
  )
}
