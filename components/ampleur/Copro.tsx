import rules from '@/app/règles/rules'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { compute } from '../explications/Aide'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import DPELabel from '../DPELabel'
import MapBehindCTA from '../MapBehindCTA'
import { BlueEm } from '@/app/LandingUI'
import { Card, CTA, CTAWrapper, ExternalLink } from '../UI'
import Link from 'next/link'
import { encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import checkIcon from '@/public/check.svg'

export default function Copro({ 
  engine, 
  situation, 
  setSearchParams,
  answeredQuestions,
  expanded
 }) {
  const dottedName = 'ampleur . prime individuelle copropriété';
  const evaluation = compute('ménage . revenu . classe', engine, rules)
  const isTrèsModeste = evaluation.value === 'très modeste'

  return (
    <AideAmpleur {...{
      engine,
      dottedName,
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      <p dangerouslySetInnerHTML={{ __html: rules[dottedName].descriptionHtml }}></p>
      <Card $background="#f7f8f8">
        <p
        >
          En tant que ménage{' '}<Value
            {...{
              engine,
              situation,
              dottedName: 'ménage . revenu . classe',
              state: 'prime-black',
            }}
          />, vous êtes éligible à une prime individuelle de{' '}<Value
            {...{
              engine,
              situation,
              dottedName: 'ampleur . prime individuelle copropriété . montant',
              state: 'prime-black',
            }}
          />.
        </p>
      </Card>
      { expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <p>L'aide MaPrimeRénov' Copropriété finance 30 % ou 45 % du montant des travaux selon l'ambition de la rénovation énergétique, 
            dans un plafond de 25 000 € par logement :</p>
          <ul>
            <li>30 % pour une rénovation permettant un gain énergétique d'au moins 35 %</li>
            <li>45 % pour une rénovation énergétique permettant un gain énergétique d'au moins 50 %.</li>
          </ul>
          <p css={`margin-top: 1rem;`}>En complément, il existe un bonus de 10 % en cas de sortie du statut de passoire énergétique (les immeubles classés <DPELabel index="5" /> ou <DPELabel index="6" /> qui atteignent au moins la classe <DPELabel index="3" /> après travaux) et des primes individuelles pour les copropriétaires aux ressources modestes (1 500 €) et très modestes (3 000 €).</p>
          <p>Les copropriétés dites « fragiles » peuvent bénéficier d'un bonus de 20 % du montant des travaux (sous condition de l'obtention des CEE par l'Anah). Il s'agit des copropriétés qui ont un taux d'impayés de charges de copropriété d'au moins 8 % du budget voté de l'année N-2.</p>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <div
            css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0; ul {list-style-image: none;}}`}
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].conditionsEligibilitesHTML,
            }}
          />
          <p>
            Nous avons mis en place un parcours dédié pour les copropriétés. Il
            vous permettra de <BlueEm>vérifier en quelques minutes</BlueEm> si
            votre copro est éligible et le montant de votre prime individuelle
            additionnelle.
          </p>
          <p>
            Le lien s'ouvrira dans un nouvel onglet.{' '}
            <BlueEm>Vous ne perdrez pas votre simulation actuelle</BlueEm>.
          </p>
          <CTAWrapper $justify="left">
            <CTA>
              <Link
                target="_blank"
                href={
                  '/copropriete/?' +
                  new URLSearchParams(encodeSituation(situation))
                }
              >
                Tester le parcours copro
              </Link>
            </CTA>
          </CTAWrapper>
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
            </>
          )}
        </>
      )}
      { false && (
        <>
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
            <p>
              Le lien s'ouvrira dans un nouvel onglet.{' '}
              <BlueEm>Vous ne perdrez pas votre simulation actuelle</BlueEm>.
            </p>
            <CTAWrapper $justify="left">
              <CTA>
                <Link
                  target="_blank"
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
        </>
      )}
    </AideAmpleur>
  )
}
