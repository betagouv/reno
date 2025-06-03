import Link from 'next/link'
import { CTA, CTAWrapper, Card } from './UI'
import checkIcon from '@/public/check.svg'
import GestesPreview from './mprg/GestesPreview'
import { Labels } from '@/app/LandingUI'
import DPELabel from './dpe/DPELabel'
import { push } from '@socialgouv/matomo-next'

export default function ÀlaCarteSummary({ engine, rules, url, situation }) {
  const eligibleMPRG = engine.evaluate('conditions communes').nodeValue
  const revenuNonEligibleMPRG = engine.evaluate(
    'MPR . non accompagnée . conditions excluantes',
  ).nodeValue
  const eligibleCEE = engine.evaluate('CEE . conditions').nodeValue
  const hasAide = (eligibleMPRG && !revenuNonEligibleMPRG) || eligibleCEE
  return (
    <Card
      css={`
        min-height: 10rem;
        margin: 0;
      `}
    >
      <GesteLabel />
      <h3
        css={`
          font-size: 120%;
        `}
      >
        Rénovation par gestes
      </h3>
      <p>
        La liberté de rénover votre logement à votre rythme en choississant
        parmi les travaux subventionnés.
      </p>

      <CTAWrapper $justify="center">
        <CTA
          $fontSize="normal"
          $importance={!hasAide ? 'inactive' : ''}
          css={`
            width: 100%;
            text-align: center;
          `}
        >
          <Link
            href={hasAide ? url : ''}
            onClick={() =>
              push([
                'trackEvent',
                'Simulateur Principal',
                'Clic',
                'parcours par geste',
              ])
            }
          >
            Voir les 20 travaux disponibles
          </Link>
        </CTA>
      </CTAWrapper>

      <p
        css={`
          margin-top: 1rem;
          font-weight: bold;
        `}
      >
        Pourquoi choisir ce parcours ?
      </p>
      <ul
        css={`
          li {
            list-style-image: url(${checkIcon.src});
            margin: 0.5rem 0;
          }
        `}
      >
        <li>Vous souhaitez choisir librement les travaux à réaliser</li>
        <li>Votre logement n'est pas une passoire thermique</li>
      </ul>
      {hasAide && (
        <>
          <p
            css={`
              margin: 1rem 0 0 0;
              font-weight: bold;
            `}
          >
            Des exemples de gestes :
          </p>
          <GestesPreview
            {...{
              rules,
              dottedNames: [
                'gestes . chauffage . PAC . air-eau',
                'gestes . isolation . murs extérieurs',
              ],
              engine,
              situation,
            }}
          />
        </>
      )}
      {/* {revenuNonEligibleMPRG && (
        <ExplicationMPRG {...{ engine, situation }} />
      )}
      {!eligibleMPRG && (
        <InapplicableBlock>
          <Image src={crossIcon} alt="Icône d'une croix" />
          <div>
            <p>Vous n'êtes pas éligible à MaPrimeRénov' par geste.</p>
            <small>
              Il faut être propriétaire du logement, construit il y a au moins
              15 ans et occupé ou loué comme résidence principale.
            </small>
          </div>
        </InapplicableBlock>
      )}
      {!eligibleCEE && (
        <InapplicableBlock>
          <Image src={crossIcon} alt="Icône d'une croix" />
          <div>
            <p>Vous n'êtes pas éligible aux aides CEE.</p>
            <small>
              Il faut que le logement ait été construit il y a plus de 2 ans.
            </small>
          </div>
        </InapplicableBlock>
      )}
      {eligibleMPRG && (
        <GestesPreview
          {...{
            rules,
            dottedNames: [
              'gestes . recommandés . audit',
              'gestes . chauffage . PAC . air-eau',
              'gestes . isolation . murs extérieurs',
            ],
            engine,
            situation,
          }}
        />
      )}
      {!eligibleMPRG && eligibleCEE && (
        <>
          <InapplicableBlock>
            <Image src={checkIcon} alt="Icône d'un check" />
            <div>
              <p
                css={`
                  text-decoration-color: green !important;
                `}
              >
                En revanche, vous êtes éligibles aux aides CEE.
              </p>
              <small>
                Il faut que le logement ait été construit il y a plus de 2
                ans.
              </small>
            </div>
          </InapplicableBlock>
          <GestesPreview
            {...{
              rules,
              dottedNames: [
                'gestes . chauffage . PAC . air-eau',
                'gestes . chauffage . bois . chaudière . automatique',
                'gestes . isolation . murs extérieurs',
              ],
              engine,
              situation,
            }}
          />
        </>
      )}
      {(eligibleMPRG || eligibleCEE) && (
        <>
          <div
            css={`
              display: 'visible' > div {
                margin-bottom: 0.3rem;
                margin-top: 1.6rem;
              }
            `}
          >
            <CTAWrapper $justify="end">
              <CTA $fontSize="normal">
                <Link
                  href={url}
                  onClick={() =>
                    push([
                      'trackEvent',
                      'Simulateur Principal',
                      'Clic',
                      'parcours par geste',
                    ])
                  }
                >
                  <span>Choisir ce parcours</span>
                </Link>
              </CTA>
            </CTAWrapper>
            <p
              css={`
                display: flex;
                justify-content: end;
                color: #666;
                font-size: 90%;
              `}
            >
              {eligibleMPRG
                ? "MaPrimeRénov' par gestes + CEE"
                : eligibleCEE
                  ? 'CEE'
                  : ''}
            </p>
            <span>
              <a
                target="_blank"
                href="https://www.service-public.fr/particuliers/vosdroits/F35083"
              >
                En savoir plus sur ce parcours
              </a>
              .
            </span>
          </div>
        </>
      )} */}
    </Card>
  )
}

export const GesteLabel = () => (
  <Labels
    $color={'#6E4444'}
    $background={'#fdf8db'}
    css={`
      margin-top: 0.3rem;
    `}
  >
    <li key="carte">
      <span aria-hidden="true">🧩️</span> Parcours à la carte
    </li>
  </Labels>
)
