import rules from '@/app/règles/rules'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { compute } from '../explications/Aide'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import DPELabel from '../DPELabel'
import MapBehindCTA from '../MapBehindCTA'
import { BlueEm } from '@/app/LandingUI'
import { CTA, CTAWrapper } from '../UI'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'

export default function Copro({ engine, situation, searchParams }) {
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  const isTrèsModeste = evaluation.value === 'très modeste'

  return (
    <AideAmpleur dottedName={'ampleur . prime individuelle copropriété'}>
      <div>
        <p>
          MaPrimeRénov' est aussi disponible pour les propriétaires
          d'appartements en copropriété.
        </p>

        <InformationBlock>
          <li>
            Elle se cumule avec MaPrimeRénov' accompagnée, et offre droit à une
            prime supplémentaire par logement de{' '}
            {isTrèsModeste ? '3 000 €' : '1 500 €'} pour votre ménage{' '}
            {evaluation.value}.
          </li>
          <li>
            Votre copropriété peut elle aussi demander une prime collective :
            <ul>
              <li>
                30 % des travaux subventionnés si gain energétique de + de 35 %.
              </li>
              <li>
                45 % des travaux subventionnés si gain energétique de + de 50 %.
              </li>
            </ul>
          </li>
          <li>
            Un bonus de 10 % pour les copropriétés qui passent de{' '}
            <DPELabel index={6} /> ou <DPELabel index={5} /> ou G vers{' '}
            <DPELabel index={3} />. Un bonus de 20 % pour les copropriétés
            fragiles et en difficulté.
          </li>
        </InformationBlock>
        <PaymentTypeBlock>
          <p>Avance ? Remboursement ? À déterminer.</p>
        </PaymentTypeBlock>
        <AideCTA text="Tester l'éligibilité de ma copro">
          <p>
            Nous avons mis en place un parcours dédié pour les copropriétés. Il
            vous permettra de <BlueEm>vérifier en quelques minutes</BlueEm> si
            votre copro est éligible et le montant de votre prime individuelle
            additionnelle.
          </p>
          <CTAWrapper $justify="left">
            <CTA>
              <Link
                href={
                  '/copropriete/?' +
                  new URLSearchParams(encodeSituation(situation))
                }
              >
                Tester le parcours copro
              </Link>
            </CTA>
          </CTAWrapper>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
