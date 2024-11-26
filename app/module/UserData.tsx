import Link from 'next/link'
import { userInputDottedNames } from './AmpleurInputs'
import { omit } from '@/components/utils'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import { useLocalStorage } from 'usehooks-ts'

export default function UserData({ setSearchParams, situation }) {
  const baseSituation = omit(userInputDottedNames, situation)
  const url = setSearchParams(encodeSituation(baseSituation, true, []), 'url')

  return (
    <p
      css={`
        text-align: right;
        margin: 0;
        a {
          color: var(--lightColor);
        }
      `}
    >
      <small>
        <Link
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
        </Link>
      </small>
    </p>
  )
}
