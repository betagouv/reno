import { Key } from '../explications/ExplicationUI'
import MapBehindCTA from '../MapBehindCTA'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Avance } from '../ScenariosSelector'
import { ExternalLink } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Image from 'next/image'

export default function EcoPTZ({ 
  situation,
  setSearchParams,
  answeredQuestions, 
  expanded
}) {
  const dottedName = 'PTZ'
  return (
    <AideAmpleur {...{
        dottedName,
        setSearchParams,
        answeredQuestions,
        situation,
        expanded
      }}
    >
      <p>L'éco-prêt à taux zéro est un prêt à 0% qui permet de financer des travaux d'amélioration de la performance énergétique d'un logement.</p>
      <p>Il est cumulable avec d'autres aides financières, et il est accessible à tous sans condition de ressources.</p>
      { expanded && (
        <>
          <h3>Comment est calculée l'aide?</h3>
          <p>L'éco-prêt à taux zéro est accessible à tous, sans condition de ressources.</p>
          <p>Le montant maximum du prêt dépend du nombre de travaux engagés, pour un montant maximal de <Key $state="prime-black">50 000 €</Key>.</p>
          <p>La durée du remboursement est de 20 ans maximum.</p>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <ul css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0;}`}>
            <li>Votre logement doit avoir été construit il y a au moins de 2 ans (à la date du début des travaux)</li>
            <li>Le logement doit être déclaré comme résidence principale ou destiné à l’être</li>
            <li>Un seul éco-prêt à taux zéro peut être accordé par logement (sauf exception)</li>
            <li>Vous devez réaliser des travaux par un professionnel RGE qui remplissent l’une des conditions suivantes :
              <ul>
                <li>correspondent à au moins une action efficace d’amélioration de la performance énergétique</li>
                <li>ouvrent droit à l’aide MaPrimeRénov’ Parcours accompagné ou à MaPrimeRénov’ mobilisée en parallèle</li>
                <li>permettent d’améliorer d’au moins 35 % la performance énergétique globale du logement, par rapport à la consommation conventionnelle avant travaux</li>
                <li>constituent des travaux de réhabilitation de systèmes d’assainissement non collectifs par des dispositifs ne consommant pas d’énergie et respectant certains critères techniques</li>
              </ul>
            </li>
          </ul>
          <h3>Comment toucher cette aide</h3>
          <p>Contactez votre conseiller France Rénov’. Il vous fournira des conseils selon votre situation.</p>
          <h3>Pour aller plus loin</h3>
          <p>
            Retrouvez plus d'info sur{' '}
            <ExternalLink 
              href="https://www.economie.gouv.fr/cedef/eco-pret-a-taux-zero"
              target="_blank"
            >
              ce lien
            </ExternalLink>
          </p>
          { false && (
            <>
              <InformationBlock>
                <div
                  dangerouslySetInnerHTML={{
                    __html: rules[dottedName].informationsUtilesHtml,
                  }}
                />
              </InformationBlock>
              <PaymentTypeBlock>
                <Avance
                  {...{
                    engine,
                    rules,
                    situation,
                    choice,
                    exampleSituation,
                  }}
                />
              </PaymentTypeBlock> 
              <section>
                <MapBehindCTA
                  {...{
                    situation,
                    searchParams,
                    what: 'trouver-conseiller-renov',
                    text: 'Obtenir cette aide',
                    importance: 'secondary',
                  }}
                />
              </section>
            </>
          )}
        </>
      )}
      {false && (
        <>
          <p>
            Vous pouvez emprunter jusqu'à 50 000 € sur 20 ans sans devoir
            rembourser d'intérêts pour financer vos travaux de rénovation
            energétique.
          </p>
          <Card $background="#f7f8f8">
            <div
              css={`
                display: flex;
                align-items: center;
                margin-top: 1rem;
              `}
            >
              <Image
                src={calculatorIcon}
                alt="Icône calculette"
                css={`
                  width: 3rem !important;
                  height: auto !important;
                  margin-right: 0.8rem !important;
                `}
              />
              <p>
                Par rapport à un prêt à la consommation de 50 000 € affecté aux
                travaux à un taux de 5 % sur 20 ans,
                <br /> l'éco-PTZ peut vous faire économiser{' '}
                <a href="https://www.lafinancepourtous.com/outils/calculateurs/calculateur-de-credit-immobilier/">
                  <PrimeStyle>30 000 € d'intérêts</PrimeStyle>
                </a>
                .
              </p>
            </div>
          </Card>
          <InformationBlock>
            <div
              dangerouslySetInnerHTML={{
                __html: rules[dottedName].informationsUtilesHtml,
              }}
            />
          </InformationBlock>
          <PaymentTypeBlock>
            <p>Le prêt sera à rembourser mensuellement.</p>
          </PaymentTypeBlock>
          <AideCTA text="Demander le prêt à taux zéro">
            <p>
              L'éco-PTZ est disponible auprès de{' '}
              <a href="https://www2.sgfgas.fr/web/site-public/etablissements-affilies">
                ces établissements de crédits
              </a>
              . Découvrir{' '}
              <a href="https://www.service-public.fr/particuliers/vosdroits/F19905">
                la démarche étape par étape
              </a>
              .
            </p>
          </AideCTA> 
        </>
      )}
    </AideAmpleur>
  )
}
