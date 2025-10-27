import { push } from '@socialgouv/matomo-next'
import { formatNumberWithSpaces } from '../utils'
import TargetDPETabs from '../mpra/TargetDPETabs'
import rules from '@/app/règles/rules'
import CommuneSearch from '../CommuneSearch'
import CalculatorWidget from '../CalculatorWidget'
import { encodeDottedName } from '../publicodes/situationUtils'
import { DPEAppreciationInfo, hasResult } from '../module/PlusValueModule'
import Input from '@codegouvfr/react-dsfr/Input'
import Select from '@codegouvfr/react-dsfr/Select'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'

const PlusValueWidget = ({
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
        <CommuneSearch
          label="Ville :"
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
        <Select
          label="Type de bien :"
          nativeSelectProps={{
            onChange: (e) => {
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
            },
            value: situation['logement . type']?.replaceAll('"', "'"),
          }}
          state={situation['logement . type'] !== '' ? 'success' : 'default'}
        >
          <option value="">Sélectionnez une option</option>
          {rules['logement . type']['une possibilité parmi'][
            'possibilités'
          ].map((i) => (
            <option key={i} value={rules['logement . type . ' + i].valeur}>
              {rules['logement . type . ' + i].titre}
            </option>
          ))}
        </Select>
        <Input
          label="Valeur du bien :"
          nativeInputProps={{
            type: 'number',
            name: 'prix-achat',
            min: 1000,
            step: 1000,
            onChange: (e) => {
              const price = e.target.value
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
            },
            pattern: '\d+',
            value: answeredQuestions.includes("logement . prix d'achat")
              ? situation["logement . prix d'achat"]
              : undefined,
          }}
        />
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
        />
        <TargetDPETabs
          {...{
            setSearchParams,
            situation,
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

export default PlusValueWidget
