import { Card } from './UI'
import { omit } from './utils'
import BlocConseiller from './BlocConseiller'
import Share from '@/app/simulation/Share'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import Feedback from '@/app/contact/Feedback'
import { useAides } from './ampleur/useAides'
import { push } from '@socialgouv/matomo-next'
import Badge from '@codegouvfr/react-dsfr/Badge'

export default function AideEtapes({
  setSearchParams,
  situation,
  engine,
  answeredQuestions,
}) {
  push(['trackEvent', 'Simulateur Principal', 'Page', 'Frise'])

  const aides = useAides(engine, situation, situation["parcours d'aide"])
  const hasMPRA = aides.find(
    (aide) => aide.baseDottedName == 'MPR . accompagnée' && aide.status,
  )
  const hasMPA = aides.find(
    (aide) => aide.baseDottedName == 'mpa' && aide.status,
  )
  const hasPret = aides.find((aide) => aide.type == 'prêt' && aide.status)

  return (
    <>
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <h1 className="fr-stepper__title">
          Mes démarches
          <span className="fr-stepper__state">Étape 4 sur 4</span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step="4"
          data-fr-steps="4"
        ></div>
      </div>
      <div className="fr-mb-5v">
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation: omit(['objectif'], situation),
            answeredQuestions,
            text: 'Revoir mes aides éligibles',
          }}
        />
      </div>
      <h2>Les étapes pour obtenir vos aides</h2>
      <div
        css={`
          border-left: 3px solid var(--color);
          padding-left: 1rem;
          > div {
            &::before {
              background-color: var(--color);
              content: '';
              display: inline-block;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              position: absolute;
              left: 0;
              margin-left: -1.8rem;
            }
            > span {
              margin-bottom: 1rem;
            }
          }
        `}
      >
        <Card>
          <Badge noIcon>prochaine étape</Badge>
          <h3>
            <span
              className="fr-icon-user-line fr-mr-1v"
              aria-hidden="true"
            ></span>
            Un conseiller France Rénov' vous accompagne
          </h3>
          <p>
            Neutres et gratuits, il existe plus de 600 Espaces conseil France
            Rénov' en France pour vous aider à :
          </p>
          <ul>
            <li>👷 élaborer votre projet de rénovation,</li>
            <li>💰 trouver des aides financières pour votre projet,</li>
            <li>🥇 choisir les professionnels compétents.</li>
          </ul>
          <BlocConseiller situation={situation} />
        </Card>
        <Card>
          <h3>
            <span
              className="fr-icon-links-line fr-mr-1v"
              aria-hidden="true"
            ></span>
            Conservez votre simulation pour plus tard
          </h3>
          <Share
            text="Elle pourra vous être utile pour votre rendez-vous en Espace conseil
            France Rénov'."
            align="left"
            showWithAnswer={false}
          />
        </Card>
        {(hasMPRA || hasMPA || hasPret) && (
          <Card>
            <h3>
              <span
                className="fr-icon-draft-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Votre projet prend forme. Demandez des devis
            </h3>
            <p>
              Après votre rendez-vous avec un conseiller, contactez des artisans
              RGE pour obtenir leurs devis.
            </p>
            <p>
              {hasMPRA &&
                "Votre Accompagnateur Rénov' vous aidera à choisir les plus adaptés pour la suite de votre projet."}
            </p>
            {hasMPRA && (
              <p>
                <strong>Important</strong> : ne signez pas encore les devis.
              </p>
            )}
          </Card>
        )}
        {(hasMPRA || hasMPA) && (
          <>
            <Card>
              <h3>
                <span
                  className="fr-icon-send-plane-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                Déposez le dossier auprès de l'Anah
              </h3>
              <p>
                Vous pouvez le faire avec l'aide de votre Accompagnateur Rénov',
                votre mandataire ou directement depuis la plateforme que vous a
                communiqué le conseiller. Les dossiers les mieux préparés sont
                instruits plus rapidement.
              </p>
            </Card>
            <Card>
              <Badge noIcon>3 mois d'attente</Badge>
              <h3>
                <span
                  className="fr-icon-checkbox-circle-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                L'Anah instruit et valide votre dossier
              </h3>
              <p>
                La période d'instruction varie grandement en fonction de
                l'affluence et de la lutte contre la fraude. Une fois validé,
                vous savez de quelles aides vous allez bénéficier et quand vous
                les recevrez.
              </p>
            </Card>
          </>
        )}
        {!hasMPRA && hasPret && (
          <>
            <Card>
              <h3>
                <span
                  className="fr-icon-send-plane-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                Contactez votre banque pour faire la demande de prêts 0%
              </h3>
              <p>
                L'éco-PTZ et le prêt avance rénovation (PAR+) sont proposés par
                les établissements de crédit et les sociétés de financement qui
                ont signé une convention avec l’État.
              </p>
            </Card>
            <Card>
              <Badge noIcon>selon votre capacité d’endettement</Badge>
              <h3>
                <span
                  className="fr-icon-checkbox-circle-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                L’établissement de crédit examine et valide votre demande
              </h3>
              <p>
                L'établissement ou la société décidera, comme pour toute demande
                de prêt, de vous prêter la somme demandée en fonction de votre
                endettement préalable et de votre capacité à rembourser.
              </p>
            </Card>
          </>
        )}
        {hasMPRA && (
          <Card>
            <h3>
              <span
                className="fr-icon-pen-nib-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Signez les devis, et planifiez les travaux avec les artisans
            </h3>
            <p>C'est parti ! Les travaux vont bientôt commencer.</p>
          </Card>
        )}
        {hasPret && (
          <Card>
            {hasMPRA && <Badge noIcon>optionnel</Badge>}
            <h3>
              <span
                className="fr-icon-money-euro-circle-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Recevez le prêt et démarrez les travaux
            </h3>
            {hasMPRA ? (
              <>
                <p>
                  Si vous êtes éligible, la banque vous verse le montant de
                  votre Eco-PTZ.
                  <br />
                  L'Anah vous verse l'avance MaPrimeRénov'.
                  <br />
                  Vous pouvez payer l'acompte aux artisans. Les travaux débutent
                  !
                </p>
              </>
            ) : (
              <>
                <p>
                  Le versement de l'éco-PTZ peut s'effectuer en 1 seule fois sur
                  la base des devis ou en plusieurs fois sur la base des
                  factures de travaux transmises au fur et à mesure jusqu'à la
                  date de clôture du prêt.
                </p>
                <p>
                  Vous pouvez payer l'acompte aux artisans. Les travaux débutent
                  !
                </p>
              </>
            )}
          </Card>
        )}
        {!hasMPRA && (
          <Card>
            <Badge noIcon>optionnel</Badge>
            <h3>
              <span
                className="fr-icon-money-euro-circle-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Déposer vos demandes d’aides
            </h3>
            <p>Primes CEE, Exonération de taxe foncière, etc.</p>
          </Card>
        )}
        <Card>
          <h3>
            <span
              className="fr-icon-warning-line fr-mr-1v"
              aria-hidden="true"
            ></span>
            Fin des travaux ! Votre logement est rénové
          </h3>
          <p>Dès les premiers mois, profitez de nombreux bénéfices :</p>
          <ul>
            <li>🧘 Plus de confort, en hiver comme en été</li>
            <li>🍀 Un logement plus respectueux de l'environnement</li>
            <li>🥇 Une meilleure valorisation de votre bien</li>
          </ul>
        </Card>
        <Card>
          <Badge noIcon>1 mois d'attente</Badge>
          <h3>
            <span
              className="fr-icon-money-euro-circle-line fr-mr-1v"
              aria-hidden="true"
            ></span>
            Recevez vos aides
          </h3>
          <p>
            Subvention MaPrimeRénov', Primes CEE... Elles arriveront
            probablement une fois les travaux finis.
          </p>
        </Card>
        {hasPret && (
          <Card>
            {hasMPRA && <Badge noIcon>optionnel</Badge>}
            <h3>
              <span
                className="fr-icon-bank-card-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Remboursement du prêt
            </h3>
            <p>
              Vous continuez de rembourser votre prêt, tout en réalisant déjà
              des économies d'énergie&nbsp;⚡️.
            </p>
          </Card>
        )}
      </div>
      <Feedback />
    </>
  )
}
