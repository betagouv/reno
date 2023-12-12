import css from '@/components/css/convertToJs'
import { PersonasList } from '@/components/InputUI'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import Link from '@/node_modules/next/link'
import personas from './personas.yaml'

export default function Personas({ setSearchParams }) {
  return (
    <PersonasList>
      <ul>
        {personas.map((persona) => (
          <li key={persona.nom}>
            <details>
              <summary
                style={css`
                  cursor: pointer;
                `}
              >
                {persona.nom}
              </summary>
              <small
                style={css`
                  white-space: normal;
                  width: 16rem;
                  display: inline-block;
                `}
              >
                {persona.description}
              </small>
            </details>

            <Link
              href={setSearchParams(
                encodeSituation(
                  persona.situation,
                  false,
                  Object.keys(persona.situation),
                ),
                true,
                true,
              )}
            >
              Injecter
            </Link>
          </li>
        ))}
      </ul>
    </PersonasList>
  )
}
