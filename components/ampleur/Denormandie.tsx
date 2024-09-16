import calculatorIcon from '@/public/calculator-empty.svg'
import PaymentTypeBlock from '../PaymentTypeBlock'
import { Card, PrimeStyle } from '../UI'
import AideAmpleur, { AideCTA, InformationBlock } from './AideAmpleur'
import Image from 'next/image'
import { No, Yes } from '../ResultUI'
import Input from '../Input'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import Value from '../Value'
import { BlueEm } from '@/app/LandingUI'
import { formatValue } from 'publicodes'

export default function Denormandie({
  engine,
  rules,
  exampleSituation,
  setSearchParams,
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
    <AideAmpleur dottedName={'denormandie'}>
      <div>
        <p>{rule.description}</p>
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
          frameborder="0"
          allowFullscreen
          allow="geolocation"
          src="//umap.openstreetmap.fr/fr/map/le-dispositif-denormandie-une-aide-fiscale-dans-vo_289689?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=false&onLoadPanel=none&captionBar=false&captionMenus=true"
        ></iframe>

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
                  min="0"
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
              <label>
                <Input
                  css={`
                    vertical-align: text-bottom;
                    padding: 0.2rem 0.3rem 0 0;
                    max-width: 6rem !important;
                  `}
                  autoFocus={false}
                  value={situation["logement . prix d'achat"]}
                  placeholder="prix du logement"
                  min="0"
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
                  step="100"
                  css={`
                    border-bottom: 2px solid #d1d1fb !important;
                  `}
                />
                €{' '}
                <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                  HT
                </span>
              </label>{' '}
              <ol
                css={`
                  list-style-type: disc;
                  margin-top: 1rem;
                  li {
                    cursor: pointer;
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
                        Engagement de {années} années de location :{' '}
                        {alors || sinon}
                      </li>
                    )
                  })}
              </ol>
              <Result {...{ engine, situation }} />
            </section>
          </div>
        </Card>
        <InformationBlock>
          {rule['informations utiles'].map((element) => (
            <li key={element}>{element}</li>
          ))}
        </InformationBlock>
        <PaymentTypeBlock>
          <p>Une réduction sur vos impôts chaque année pendant 6 à 12 ans.</p>
        </PaymentTypeBlock>
        <AideCTA text="Demander la réduction d'impôt">
          <p>
            Pour en bénéficier, vous devez déclarer cet investissement locatif
            au moment de la déclaration annuelle de revenus : cochez la case «
            Investissements locatifs » dans la rubrique « Charges ».
          </p>
          <p>
            Vous devrez joindre une copie de votre bail, l’avis d’imposition du
            locataire du logement et une note récapitulant les travaux réalisés
            et leur montant.
          </p>
          <a href="https://www.impots.gouv.fr/www2/fichiers/documentation/brochure/ir_2024/pdf_som/14-RICI_2042C_251a290.pdf#Page=9">
            PDF officiel d'information
          </a>
        </AideCTA>
      </div>
    </AideAmpleur>
  )
}

const Result = ({ engine, situation }) => {
  const thresholdCondition = engine
    .setSituation(situation)
    .evaluate('denormandie . seuil travaux minimum')
  const value = engine.evaluate('denormandie . montant')
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
