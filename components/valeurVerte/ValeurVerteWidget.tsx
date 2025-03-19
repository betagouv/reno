import { push } from '@socialgouv/matomo-next'
import { formatNumberWithSpaces } from '../utils'
import DPEQuickSwitch from '../DPEQuickSwitch'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import AddressSearch from '../AddressSearch'
import Select from '../Select'
import Image from 'next/image'
import editIcon from '@/public/crayon.svg'
import CalculatorWidget from '../CalculatorWidget'
import { encodeDottedName } from '../publicodes/situationUtils'
import { DPEAppreciationInfo, hasResult } from '../module/ValeurVerte'

const ValeurVerteWidget = ({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  isMobile,
  plusValue,
  pourcentageAppreciation,
  region,
}) => {
  return (
    <CalculatorWidget>
      <div
        css={`
          margin-bottom: 1rem;
          > div {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        `}
      >
        <div>
          <div>Ville:</div>
          <AddressSearch
            {...{
              type: 'logement . commune',
              setChoice: (result) => {
                setSearchParams({
                  [encodeDottedName('logement . commune')]: `"${result.code}"*`,
                  [encodeDottedName('logement . commune . nom')]:
                    `"${result.nom}"*`,
                })
              },
              setSearchParams,
              situation,
              answeredQuestions,
            }}
          />
        </div>
        <div>
          <div>Type de bien:</div>
          <Select
            css={`
              height: 2.8rem;
              background: #f5f5fe;
              max-width: 90vw;
            `}
            disableInstruction={false}
            onChange={(e) => {
              push([
                'trackEvent',
                'Module',
                'Interaction',
                'type logement ' + e,
              ])
              setSearchParams({
                [encodeDottedName('logement . type')]:
                  '"' + e.replaceAll("'", '') + '"*',
              })
            }}
            value={situation['logement . type']?.replaceAll('"', "'")}
            values={rules['logement . type']['une possibilité parmi'][
              'possibilités'
            ].map((i) => rules['logement . type . ' + i])}
          />
        </div>
        <div>
          <div>Valeur du bien:</div>
          <div
            css={`
              height: 2.8rem;
              margin: auto;
              border: 2px solid var(--color);
              width: 10rem;
              color: var(--color);
              text-align: center;
              border-radius: 0.3rem;
              padding: 0.7rem;
              box-shadow: var(--shadow-elevation-medium);
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <div
              css={`
                flex-grow: 1;
              `}
            >
              <input
                id="prix-bien"
                css={`
                  border: none !important;
                  background: transparent !important;
                  -webkit-appearance: none !important;
                  outline: none !important;
                  color: var(--color);
                  font-size: 110% !important;
                  max-width: 6rem !important;
                  box-shadow: none !important;
                `}
                autoFocus={false}
                placeholder="Prix du bien"
                type="text"
                inputMode="numeric"
                pattern="\d+"
                defaultValue={
                  answeredQuestions.includes("logement . prix d'achat")
                    ? formatNumberWithSpaces(
                        situation["logement . prix d'achat"],
                      )
                    : undefined
                }
                onChange={(e) => {
                  const price = e.target.value.replace(/\s/g, '')
                  const startPos = e.target.selectionStart
                  const invalid = isNaN(price) || price <= 0
                  if (invalid) return
                  push([
                    'trackEvent',
                    'Module',
                    'Interaction',
                    'prix achat ' + price,
                  ])
                  setSearchParams({
                    [encodeDottedName("logement . prix d'achat")]: price + '*',
                  })
                  e.target.value = formatNumberWithSpaces(price)
                  requestAnimationFrame(() => {
                    const inputBudget = document.querySelector('#prix-bien')
                    inputBudget.selectionStart = startPos
                    inputBudget.selectionEnd = startPos
                  })
                }}
              />
            </div>
            <Image
              css={`
                cursor: pointer;
                margin-left: auto;
              `}
              src={editIcon}
              alt="Icône crayon pour éditer"
              onClick={() => document.querySelector('#prix-bien').focus()}
            />
          </div>
        </div>
      </div>
      <div
        css={`
          display: flex;
          ${isMobile && 'flex-direction: column;'}
          justify-content: space-between;
          gap: 1rem;
        `}
      >
        <DPEQuickSwitch
          oldIndex={situation['DPE . actuel'] - 1}
          situation={situation}
          columnDisplay={true}
          editMode={true}
        />
        <TargetDPETabs
          {...{
            oldIndex: situation['DPE . actuel'] - 1,
            setSearchParams,
            answeredQuestions,
            choice: situation['projet . DPE visé'] - 1,
            engine,
            situation,
            columnDisplay: true,
          }}
        />
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        `}
      >
        {hasResult(situation) && (
          <div>
            🥳 <strong>Bonne nouvelle</strong> :{' '}
            <DPEAppreciationInfo
              {...{ situation, pourcentageAppreciation, region }}
            />
          </div>
        )}

        <div
          css={`
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            ${isMobile && 'flex-direction: column;'}
            > div {
              display: flex;
              flex-direction: column;
              width: 100%;
            }
          `}
        >
          <div>
            <div
              css={`
                margin: auto;
              `}
            >
              <span aria-hidden="true">💶</span> Après rénovation, le bien
              vaudra:
            </div>
            <div
              css={`
                margin-top: 0.5rem;
                text-align: center;
                background: var(
                  ${plusValue > 0 ? '--validColor1' : '--warningColor'}
                );
                color: var(${plusValue > 0 ? '--validColor' : '--darkColor'});
                padding: 0.5rem;
              `}
            >
              {plusValue > 0 ? (
                <strong>{formatNumberWithSpaces(plusValue)} €</strong>
              ) : (
                <small>
                  Veuillez renseigner les valeurs de la calculatrice pour
                  connaître le montant
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </CalculatorWidget>
  )
}

export default ValeurVerteWidget
