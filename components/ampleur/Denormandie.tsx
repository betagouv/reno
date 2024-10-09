import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, ExternalLink } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import Image from 'next/image'
import { No, Yes } from '../ResultUI'
import Input from '../Input'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import { BlueEm } from '@/app/LandingUI'
import { formatValue } from 'publicodes'
import { Key } from '../explications/ExplicationUI'
import checkIcon from '@/public/check.svg'

export default function Denormandie({
  engine,
  rules,
  exampleSituation,
  answeredQuestions,
  setSearchParams,
  expanded
}) {
  const situation = {
    ...exampleSituation,
    'logement . location longue durée': 'oui',
  }
  const dottedName = 'denormandie'
  const communeName = situation['logement . commune . nom'],
    communeEligible = situation['logement . commune . denormandie']
  const rule = rules[dottedName]

  return (
    <AideAmpleur {...{
      engine,
      dottedName: 'denormandie',
      setSearchParams,
      answeredQuestions,
      situation,
      expanded
    }}>
      { expanded && (
        <>
          <h3>Comment est calculée l'aide ?</h3>
          <Card $background="#f7f8f8">
            <div
              css={`
                display: flex;
                align-items: center;
                margin-top: 1rem;
              `}
            >
              <section>
                Par exemple : pour une enveloppe de travaux de rénovation
                énergétique de{' '}
                <label>
                  <Input
                    css={`
                      vertical-align: text-bottom;
                      padding: 0.2rem 0.3rem 0 0;
                      max-width: 6rem !important;
                    `}
                    autoFocus={false}
                    value={situation['projet . travaux']}
                    placeholder="mes travaux"
                    min="1000"
                    onChange={(rawValue) => {
                      const value = +rawValue === 0 ? undefined : rawValue
                      setSearchParams(
                        encodeSituation({
                          'projet . travaux': value,
                        }),
                        'replace',
                        false,
                      )
                    }}
                    step="1000"
                    css={`
                      border-bottom: 2px solid #d1d1fb !important;
                    `}
                  />
                  €{' '}
                  <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                    HT
                  </span>
                </label>{' '}
                pour un logement acheté aux prix de{' '}
                  <Input
                    css={`
                      vertical-align: text-bottom;
                      padding: 0.2rem 0.3rem 0 0;
                      max-width: 8rem !important;
                    `}
                    autoFocus={false}
                    value={situation["logement . prix d'achat"]}
                    placeholder="250000"
                    min="1000"
                    onChange={(rawValue) => {
                      const value = +rawValue === 0 ? undefined : rawValue
                      setSearchParams(
                        encodeSituation({
                          "logement . prix d'achat": value,
                        }),
                        'replace',
                        false,
                      )
                    }}
                    step="1000"
                    css={`
                      border-bottom: 2px solid #d1d1fb !important;
                    `}
                  />
                  €{' '}
                  <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                    HT
                  </span>
                <ol
                  css={`
                    list-style-type: none;
                    padding: 0;
                    margin-top: 1rem;
                    li {
                      cursor: pointer;
                      margin: 0.5rem 0;
                    }
                  `}
                >
                  {rules['denormandie . taux'].variations
                    .filter((v) => v.si)
                    .map(({ si, alors, sinon }) => {
                      const années = si.split(' = ')[1]
                      const dottedName = 'denormandie . années de location'
                      return (
                        <li
                          key={si || 'default'}
                          css={

                            années == situation[dottedName] &&
                            `background: var(--lighterColor); width: fit-content`
                          }
                          onClick={() =>
                            setSearchParams({
                              [encodeDottedName(dottedName)]: années,
                            })
                          }
                        >
                          Pour une période de location de <Key $state={"prime-black"}> {années} ans </Key> :{' '}
                          la réduction d'impôt s'élève à <Key $state={"prime-black"}>{alors || sinon}</Key> du prix du bien
                        </li>
                      )
                    })}
                </ol>
                <Result {...{ engine, situation }} />
              </section>
            </div>
          </Card>
          <p>L'avantage fiscal est étalé sur la durée de location.</p>
          <h3>Les principales conditions d'éligibilité ?</h3>
          <p>Trois types de conditions se cumulent :</p> 
          <ul css={`list-style-image: url(${checkIcon.src}); li { margin: 1rem 0;}`}>
            <li>Les conditions liées au logement à rénover (logement ancien, situé dans certaines communes uniquement,...)</li>
            <li>Les conditions liées aux travaux à réaliser (les travaux doivent représenter au moins 25 % du coût total de l'opération,...)</li>
            <li>Les conditions liées au(x) locataire(s) du logement</li>
          </ul>
          <h3>Comment toucher cette aide</h3>
          <p>Pour bénéficier de la réduction d'impôts, vous devez déclarer cet investissement locatif au moment de la déclaration annuelle de revenus.
          </p>
          {communeName && communeEligible && (
            <p>
              La commune {communeName} de votre logement{' '}
              {communeEligible === 'oui' ? (
                <Yes>est éligible Denormandie</Yes>
              ) : (
                <No>n'est pas éligible</No>
              )}
              .
            </p>
          )}
          <iframe
            css={`
              border-radius: 0.3rem;
            `}
            width="100%"
            height="340px"
            frameBorder="0"
            allowFullscreen
            allow="geolocation"
            src="//umap.openstreetmap.fr/fr/map/le-dispositif-denormandie-une-aide-fiscale-dans-vo_289689?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=false&onLoadPanel=none&captionBar=false&captionMenus=true"
          ></iframe>
    
          <p>{rule.description}</p>
          <InformationBlock>
            <div
              dangerouslySetInnerHTML={{ __html: rule.informationsUtilesHtml }}
            />
          </InformationBlock>
          <PaymentTypeBlock>
            <p>Une réduction sur vos impôts chaque année pendant 6 à 12 ans.</p>
          </PaymentTypeBlock>
        </>
      )}
    </AideAmpleur>
  )
}

const Result = ({ engine, situation }) => {
  const thresholdCondition = engine
    .setSituation(situation)
    .evaluate('denormandie . seuil travaux minimum')

  const value = engine.setSituation(situation).evaluate('denormandie . montant')
  const threshold = formatValue(
    engine.evaluate('denormandie . travaux minimum'),
    { precision: 0 },
  )

  console.log('lightgreen', { value, thresholdCondition })

  return (
    <section
      css={`
        margin-top: 1rem;
      `}
    >
      {value.nodeValue != null ? (
        <p>
          La réduction d'impôt Denormandie s'élève à un total de{' '}
          <Value
            {...{
              engine,
              situation,
              dottedName: 'denormandie . montant',
              state: 'final',
            }}
          />
          .
        </p>
      ) : !thresholdCondition.nodeValue ? (
        <p>
          Pour être éligible, les travaux doivent représenter{' '}
          <BlueEm>au minimum 25 % du prix de revient (achat + travaux)</BlueEm>.
          Il vous faut au moins {threshold} de travaux.
        </p>
      ) : (
        <p>Non applicable.</p>
      )}
    </section>
  )
}
