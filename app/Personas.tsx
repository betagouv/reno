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
            <div>{persona.nom}</div>

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
