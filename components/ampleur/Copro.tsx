import rules from '@/app/règles/rules'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { compute } from '../explications/Aide'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import DPELabel from '../DPELabel'
import MapBehindCTA from '../MapBehindCTA'

export default function Copro({ engine, situation }) {
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  const isTrèsModeste = evaluation.value === 'très modeste'

  return (
    <AideAmpleur dottedName={'copro'}>
      <div>
        <p>
          MaPrimeRénov' est aussi disponible pour les propriétaires
          d'appartements en copropriété.
        </p>

        <InformationBlock>
          <li>
            Elle se cumule avec la prime MaPrimeRénov' accompagnée individuelle,
            et offre droit à une prime par logement de{' '}
            {isTrèsModeste ? '3 000 €' : '1 500 €'} pour votre ménage{' '}
            {evaluation.value}.
          </li>
          <li>
            Pour votre copropriété :
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
        <MapBehindCTA
          {...{
            codeInsee: situation['ménage . commune']?.replace(/'/g, ''),

            what: 'trouver-conseiller-renov',
            text: 'Obtenir cette aide',
            link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
          }}
        />
      </div>
    </AideAmpleur>
  )
}
