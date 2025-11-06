import Value from '@/components/Value'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import TargetDPETabs from './TargetDPETabs'
import CalculatorWidget from '../CalculatorWidget'
import Input from '@codegouvfr/react-dsfr/Input'
import { formatNumberWithSpaces } from '../utils'
import { encodeDottedName } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'
import { formatValue } from 'publicodes'

export default function DPEScenario({
  engine,
  situation,
  setSearchParams,
  isMobile,
}) {
  const choice = situation['projet . DPE visé'] || situation['DPE . actuel'] - 2

  const engineSituation = engine.setSituation(situation)
  const revenuClasseValue = engineSituation.evaluate(
    'ménage . revenu . classe',
  ).nodeValue

  const isModeste = revenuClasseValue.includes('modeste')

  const futureSituation = {
    ...situation,
    'projet . DPE visé': choice,
  }
  const evaluation = engine
    .setSituation(situation)
    .evaluate('MPR . accompagnée . montant')
  const hasResult = evaluation.nodeValue

  return (
    <CalculatorWidget>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6" style={{ order: 1 }}>
          <DPEQuickSwitch
            situation={situation}
            noSuccess
            ecartClasse={2}
            possibilities={[4, 5, 6]}
          />
        </div>
        <div className="fr-col-12" style={{ order: isMobile ? 2 : 3 }}>
          <TargetDPETabs
            {...{
              ecartClasse: 2,
              setSearchParams,
              noSuccess: true,
              situation: futureSituation,
            }}
          />
        </div>
        <div
          className="fr-col-12 fr-col-md-6"
          style={{ order: isMobile ? 3 : 2 }}
        >
          <Input
            label="Montant estimé des travaux : "
            nativeInputProps={{
              pattern: '\d+',
              type: 'text',
              inputMode: 'numeric',
              onChange: (e) => {
                const price = e.target.value.replace(/\s/g, '')
                const invalid = price != '' && (isNaN(price) || price <= 0)
                if (invalid) return

                push([
                  'trackEvent',
                  'projet . travaux',
                  'Interaction',
                  'montant travaux ' + price,
                ])
                setSearchParams({
                  [encodeDottedName('projet . travaux')]:
                    price == '' ? undefined : price + '*',
                })
              },
              value: futureSituation['projet . travaux']
                ? formatNumberWithSpaces(futureSituation['projet . travaux'])
                : '',
            }}
            addon={
              <>
                <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                  € HT
                </span>
              </>
            }
          />
        </div>
      </div>
      {hasResult ? (
        <div className="fr-mt-5v">
          <p className="fr-h3">🥳 Résultats</p>
          <div>
            <p className="fr-mb-3v">
              Vous êtes éligible à une aide de :{' '}
              <Value
                {...{
                  size: 'xl',
                  state: 'success',
                  engine,
                  situation: futureSituation,
                  dottedName: 'MPR . accompagnée . montant',
                }}
              />
              ,
            </p>
            <p>
              soit{' '}
              <Value
                {...{
                  size: 'xl',
                  state: 'success',
                  engine,
                  situation: futureSituation,
                  dottedName: 'MPR . accompagnée . pourcent',
                }}
              />{' '}
              du coût de vos travaux avec un plafond de{' '}
              <Value
                {...{
                  state: 'empty',
                  engine,
                  situation: futureSituation,
                  dottedName: 'projet . travaux . plafond',
                }}
              />{' '}
              de travaux.
            </p>
            {isModeste && (
              <p className="fr-my-5v">
                🍀 <strong>Bonus :</strong> En tant que ménage{' '}
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'ménage . revenu . classe',
                    state: 'prime-black',
                  }}
                />{' '}
                ,{' '}
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'MPR . accompagnée . pourcentage avance',
                    state: 'prime-black',
                  }}
                />{' '}
                de cette aide peut vous être versée en avance de vos travaux.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="fr-callout fr-callout--yellow-moutarde">
          <div className="fr-h4">⏳️ En attente de résultats</div>
          <div>
            <p>
              Répondez aux questions ci-dessus pour obtenir un montant
              💶&nbsp;&nbsp;💶
            </p>
          </div>
        </div>
      )}
    </CalculatorWidget>
  )
}
