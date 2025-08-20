import { encodeSituation } from '@/components/publicodes/situationUtils'
import { omit } from '@/components/utils'
import { userInputDottedNames } from './AmpleurInputs'
import { push } from '@socialgouv/matomo-next'

export default function UserData({ setSearchParams, situation }) {
  const baseSituation = omit(userInputDottedNames, situation)
  const url = setSearchParams(
    encodeSituation(baseSituation, true, []),
    'url',
    true,
  )

  return (
    <p
      css={`
        text-align: right;
      `}
    >
      <a
        className="fr-link"
        href={url}
        onClick={() => {
          push(['trackEvent', 'Module', 'Interaction', 'Recommencer'])
          try {
            localStorage.setItem('ampleurSituation', null)
          } catch (e) {
            console.log('Problème de localstorage', e)
          }
        }}
      >
        Recommencer
      </a>
    </p>
  )
}
