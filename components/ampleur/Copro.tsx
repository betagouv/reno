import AideAmpleur from './AideAmpleur'
import { Card } from '../UI'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'

export default function Copro({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName = 'ampleur . prime individuelle copropriété'

  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded,
      }}
    >
      {expanded && (
        <>
          <Card>
            <p>
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                }}
              />
              , vous êtes éligible à une prime individuelle de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName:
                    'ampleur . prime individuelle copropriété . montant',
                }}
              />
              .
            </p>
          </Card>
          <p>
            L’aide MaPrimeRénov’ Copropriété finance 30 % ou 45 % du montant des
            travaux selon l’ambition de la rénovation énergétique, dans un
            plafond de 25 000 € par logement.
          </p>
          <p>
            Une prime supplémentaire est destinée aux copropriétaires aux
            ressources modestes et très modestes. Le montant de cette prime est
            respectivement de 1 500 € et de 3 000 €.
          </p>
          <h2
            css={`
              margin: 1rem 0;
            `}
          >
            Notre parcours dédié aux copropriétés
          </h2>
          <p>
            Simulez l'éligibilité de votre copropriété à MaPrimeRénov'
            Coproprieté grâce à ce simulateur.
          </p>
          <Link
            className="fr-btn fr-btn--secondary fr-icon-arrow-right-line fr-btn--icon-left"
            href={
              '/copropriete/?' + new URLSearchParams(encodeSituation(situation))
            }
          >
            Simuler MaPrimeRénov' Copropriété
          </Link>
        </>
      )}
    </AideAmpleur>
  )
}
