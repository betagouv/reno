import { encodeSituation } from '@/components/publicodes/situationUtils'
import { omit } from '@/components/utils'
import Link from 'next/link'
import { userInputDottedNames } from './AmpleurInputs'

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

        margin: 0;
        margin-top: -1.8rem;
        a {
          color: var(--lightColor);
        }
      `}
    >
      <small>
        <a
          href={url}
          onClick={() => {
            try {
              localStorage.setItem('ampleurSituation', null)
            } catch (e) {
              console.log('Problème de localstorage', e)
            }
          }}
        >
          Recommencer
        </a>
      </small>
    </p>
  )
}
