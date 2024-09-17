import Link from 'next/link'
import PaymentTypeBlock from '../PaymentTypeBlock'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'

export default function TaxeFoncière({
  oldIndex,
  choice,
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
}) {
  const commune = situation['ménage . commune . nom']

  const caseSituation = {
    ...exampleSituation,
    'taxe foncière . condition de dépenses': 'oui',
  }
  engine.setSituation(caseSituation)
  console.log(
    'lightyellow montant',
    engine.setSituation(caseSituation).evaluate('taxe foncière . montant'),
  )
  console.log(
    'lightyellow test',
    engine.setSituation(caseSituation).evaluate('taxe foncière . taux'),
  )
  console.log('lightyellow s', caseSituation)

  return (
    <AideAmpleur dottedName={'taxe foncière'}>
      <div>
        <p>
          Vore commune peut proposer une exonération de la taxe foncière de 50 %
          ou 100 % pendant 3 ans pour certains logements rénovés.
        </p>

        <InformationBlock>
          <li>
            Il n'existe pas de liste officielle nous permettant de savoir si{' '}
            {commune} propose cette exonération, c'est à vous de le demander à
            votre{' '}
            <a href="https://www.impots.gouv.fr/contacts">centre des impôts</a>.
            Voici{' '}
            <Link href="/taxe-fonciere/communes-eligibles">une sélection</Link>{' '}
            de quelques communes éligibles.
          </li>
          <li>Votre logement a été construit avant le 1er janvier 1989</li>
          <li>
            Un montant minimum de travaux de rénovation thermique a été engagé :
            <ul>
              <li>soit 10 000 € l'année précédente</li>
              <li>soit 15 000 € les trois années précédentes</li>
            </ul>
          </li>
        </InformationBlock>
        <PaymentTypeBlock>
          <p>
            Cette aide est une exonération de taxe locale, une fois par an
            pendant 3 ans.
          </p>
        </PaymentTypeBlock>
        <AideCTA text="Obtenir l'exonération">
          <p>
            Vous devez adresser au service des impôts correspondant au lieu de
            situation du bien, avant le 1 er janvier de la première année au
            titre de laquelle l’exonération est applicable, une déclaration
            comportant tous les éléments d’identification du bien, dont la date
            d’achèvement du logement.
          </p>
          <a href="https://www.impots.gouv.fr/particulier/questions/ai-je-droit-pour-ma-taxe-fonciere-lexoneration-en-faveur-des-economies">
            Plus d'infos sur impots.gouv.fr
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}
