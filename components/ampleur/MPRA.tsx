import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import DPEScenario from '@/components/mpra/DPEScenario'
import TargetDPETabs from '@/components/mpra/TargetDPETabs'
import AideAmpleur, { InformationBlock } from './AideAmpleur'
import { Card, ExternalLink } from '../UI'
import PaymentTypeBlock from '../PaymentTypeBlock'
import Avance from '@/components/mpra/Avance'
import MapBehindCTA from '../MapBehindCTA'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Value from '../Value'
import DPELabel from '../DPELabel'
import { Key } from '../explications/ExplicationUI'

export default function MPRA({
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  exampleSituation,
  searchParams,
  expanded
}) {
  const dottedName = 'MPR . accompagnée'
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice
    
  const isModeste = engine.setSituation(situation)
                          .evaluate('ménage . revenu . classe')
                          .nodeValue
                          .includes("modeste")
  return (
    <AideAmpleur {...{
      dottedName, 
      setSearchParams,
      situation,
      answeredQuestions,
      expanded
    }}>
      <p>C'est la principale aide. Elle est versée après vos travaux de rénovation.</p>
      <p>Vous devez viser un saut d'au moins deux classes DPE.</p>
      <DPEQuickSwitch oldIndex={oldIndex} />
      <TargetDPETabs
        {...{
          oldIndex,
          setSearchParams,
          answeredQuestions,
          choice,
          engine,
          situation,
        }}
      />
      {oldIndex < 2 ? (
        <Card
          css={`
            margin: 0.6rem 0;
          `}
        >
          👌 Votre logement est trop performant (A&nbsp;ou&nbsp;B) pour
          bénéficier du parcours accompagné.
        </Card>
      ) : (
        <>
          <DPEScenario
            {...{
              rules,
              choice,
              oldIndex,
              engine,
              situation,
              setSearchParams,
              exampleSituation,
            }}
          />
          { isModeste &&
            <div css={`
                background: #FDF8DB;
                padding: 1rem;
                margin: 1rem 0;
              `}>
            🍀<strong>Bonus:</strong> En tant que <u>ménage modeste</u>, <strong>70 %</strong>{' '}
            de cette aide peut vous être versée en avance de vos travaux.
            </div>
          }
          { expanded && (
            <>
              <h3>Comment est calculée l'aide?</h3>
              <p>Vous êtes éligibles à une aide de <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'MPR . accompagnée . pourcent brut',
                      state: 'prime-black',
                    }}
                  /> du coût de vos travaux avec un plafond de <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'projet . travaux . plafond',
                    state: 'prime-black',
                  }}
                /> de travaux.
              </p>
              <p>Une bonification de <Key state="prime-black">10 %</Key> peut être appliquée à ce taux si votre logement est une passoire énergétique 
                (logements avec une étiquette <DPELabel index="5" /> ou <DPELabel index="6" />) et 
                que le programme de travaux vous permet d’atteindre une étiquette <DPELabel index="3" /> au minimum.</p>
              { isModeste && (
                  <p>En temps que ménage{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'ménage . revenu . classe',
                      state: 'prime-black',
                    }}
                  /> vous pouvez demander une avance de <strong>70 %</strong></p>
              )}
              <h3>Les principales conditions d'éligibilité ?</h3>
              <ul css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0;}`}>
                <li>Vous devrez faire appel à un Accompagnateur Rénov’, qui réalisera un audit énergétique de votre logement pour définir le projet de travaux vous permettant d’atteindre le DPE visé.</li>
                <li>Il est également demandé d’inclure deux gestes d’isolation (toiture, fenêtre/menuiserie, sols ou murs) dans le programme de travaux.</li>
                <li>Pour réaliser les travaux vous devez faire appel à des artisans labellisés RGE</li>
                <li>Vous devrez déposer votre dossier de demande d'aide et vous devez attendre l’accord de l’Anah avant de signer le devis et commencer vos travaux avec l’artisan sélectionné.</li>
              </ul>
              <h3>Comment toucher cette aide</h3>
              <p>
                Contactez votre conseiller France Rénov’. 
                Il vous fournira des conseils selon votre situation et vous orientera vers Mon Accompagnateur Rénov’.
              </p>
              <h3>Pour aller plus loin</h3>
              <p>
                Retrouvez plus d'info sur <ExternalLink 
                  href="https://www.economie.gouv.fr/particuliers/maprimerenov-parcours-accompagne-tout-savoir-sur-cette-aide"
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
        </>
      )}
    </AideAmpleur>
  )
}
