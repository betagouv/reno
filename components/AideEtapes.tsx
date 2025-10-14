import { Card } from './UI'
import { getCurDate, omit } from './utils'
import BlocConseiller from './BlocConseiller'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import Feedback from '@/app/contact/Feedback'
import { useAides } from './ampleur/useAides'
import { push } from '@socialgouv/matomo-next'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@codegouvfr/react-dsfr/Button'
import { SharePage } from './Eligibility'
import Image from 'next/image'
import Link from 'next/link'
import iconEnvelope from '@/public/icon-envelope.svg'

export default function AideEtapes({
  nbStep,
  setSearchParams,
  situation,
  engine,
  answeredQuestions,
}) {
  useEffect(() => {
    document.body.style.backgroundColor = '#F9FAFF'
    push(['trackEvent', 'Simulateur Principal', 'Page', 'Frise'])
  }, [])
  const [displayAll, setDisplayAll] = useState(false)
  const [copied, setCopied] = useState(false)

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const curDate = searchParams.date?.replaceAll('-', '/') || getCurDate()
  const aides = useAides(engine, situation)
  const hasMPRA = aides.find(
    (aide) => aide.baseDottedName == 'MPR . accompagnée' && aide.status,
  )
  const hasMPA = aides.find(
    (aide) => aide.baseDottedName == 'mpa' && aide.status,
  )
  const hasPret = aides.find((aide) => aide.type == 'prêt' && aide.status)
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        'https://mesaidesreno.beta.gouv.fr/simulation?' +
          searchParams.toString(),
      )
      setCopied(true)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <>
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <h1 className="fr-stepper__title">
          Mes démarches
          <span className="fr-stepper__state">
            Étape {nbStep} sur {nbStep}
          </span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step={nbStep}
          data-fr-steps={nbStep}
        ></div>
      </div>
      <h2>Les étapes clés de la rénovation énergétique</h2>
      <div
        className="fr-mb-5v"
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
        <div
          className="fr-mb-3v"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div>
            <span
              className="fr-icon-success-line fr-mr-1v"
              aria-hidden="true"
            ></span>{' '}
            Simulation réalisée le {curDate}
          </div>
          <button
            aria-controls="modal-0"
            data-fr-opened="false"
            type="button"
            className="fr-btn fr-btn--tertiary fr-icon-share-line fr-btn--icon-right"
          >
            Partager
          </button>
          <dialog
            id="modal-0"
            className="fr-modal"
            aria-labelledby="modal-0-title"
            data-fr-concealing-backdrop="true"
          >
            <div className="fr-container fr-container--fluid fr-container-md">
              <div className="fr-grid-row fr-grid-row--center">
                <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">
                  <div className="fr-modal__body">
                    <div className="fr-modal__header">
                      <button
                        aria-controls="modal-0"
                        title="Fermer"
                        type="button"
                        id="button-5"
                        class="fr-btn--close fr-btn"
                      >
                        Fermer
                      </button>
                    </div>
                    <div className="fr-modal__content">
                      <h2 id="modal-0-title" className="fr-modal__title">
                        Partager le lien de votre simulation
                      </h2>
                      <p>
                        Conservez les résultats de votre simulation en la
                        partageant par mail ou en copiant le lien.
                      </p>
                      <div className="fr-col-12">
                        <Button
                          priority="secondary"
                          title="Cliquez pour partager le lien"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={(e) => {
                            e.preventDefault()
                            push([
                              'trackEvent',
                              'Simulateur Principal',
                              'Partage',
                              'Clic',
                            ])
                            copyToClipboard()
                          }}
                        >
                          <span aria-hidden="true">🔗</span> Copier le lien de
                          ma simulation
                        </Button>
                      </div>
                      {copied && (
                        <div className="fr-alert fr-alert--success fr-mt-3v">
                          <p>
                            Le lien de la simulation a bien été copié dans le
                            presse-papier.
                          </p>
                          <button
                            title="Masquer le message"
                            onClick={() => setCopied(false)}
                            type="button"
                            className="fr-btn--close fr-btn fr-mt-0"
                          >
                            Masquer le message
                          </button>
                        </div>
                      )}
                      <div className="fr-col-12 fr-mt-3v">
                        <Link
                          className="fr-btn fr-btn--secondary"
                          title="Cliquez pour partager le lien"
                          style={{ width: '100%', justifyContent: 'center' }}
                          href={`mailto:?subject=${encodeURIComponent('[MesAidesRéno] Lien de ma simulation')}&body=${encodeURIComponent(
                            `Bonjour,

Veuillez retrouver votre simulation à cette adresse : 

${window.location.href}

Cordialement,
L'équipe MesAidesRéno`,
                          )}`}
                        >
                          <span aria-hidden="true" className="fr-mr-1v">
                            <Image src={iconEnvelope} alt="icone envoyer" />
                          </span>{' '}
                          Envoyer le lien par email
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dialog>
        </div>
        <Card>
          <Badge severity="success">Terminé</Badge>
          <h3 className="fr-h5 fr-mt-3v">
            <span className="fr-icon-lightbulb-line" aria-hidden="true"></span>
            Vous êtes éligibles à plusieurs aides pour vos travaux
          </h3>
          <p className="fr-my-1v">
            Vous avez réalisé votre simulation et découvert vos aides éligibles.
          </p>
          <p
            className="fr-badge fr-badge--new fr-py-3v fr-my-3v"
            style={{ width: '100%', textTransform: 'none' }}
          >
            Certaines aides sont encore à compléter pour connaître vos montants
            exacts.
          </p>
          <p>
            <BtnBackToParcoursChoice
              {...{
                setSearchParams,
                situation: omit(['objectif'], situation),
                answeredQuestions,
                text: 'Revoir mes aides',
              }}
            />
          </p>
        </Card>
        <Card>
          <Badge noIcon>prochaine étape</Badge>
          <h3 className="fr-h5 fr-mt-3v">
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
        {hasMPA && situation['mpa . situation demandeur'] == '"occupant"' && (
          <Card>
            <h3 className="fr-h5">
              <span
                className="fr-icon-user-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Je réalise avec l’AMO le diagnostic autonomie de mon logement
            </h3>
            <p>
              L'assistant à maîtrise d'ouvrage (AMO) est habilité par l'Anah.
              C'est un interlocuteur que vous choisissez lors de votre
              rendez-vous avec le conseiller France Rénov'. Son rôle est de vous
              accompagner tout au long de votre projet : diagnostic logement
              autonomie à domicile, définition des travaux, plan de financement,
              mise en relation avec des artisans, suivi administratif et
              jusqu'au versement de la subvention.
            </p>
            <p>Il est obligatoire pour bénéficier de MaPrimeAdapt’.</p>
            <p>Il est obligatoire pour bénéficier de MaPrimeAdapt’.</p>
          </Card>
        )}
        {hasMPA ? (
          <Card>
            <h3 className="fr-h5">
              <span
                className="fr-icon-draft-line fr-mr-1v"
                aria-hidden="true"
              ></span>
              Je choisis mon artisan et demande des devis
            </h3>
            <p>
              Après votre rendez-vous avec un conseiller, contactez des artisans
              pour obtenir leurs devis. Bien qu'ils ne soient pas obligatoires,
              certains labels permettent d'identifier des professionnels
              spécialisés dans les travaux d'adaptation. En voici quelques-uns :
              Silverbat, Handibat ou Proadapt.
            </p>
            <p>
              Votre AMO pourra vous accompagner dans l'analyse et la comparaison
              de vos devis afin de sécuriser votre choix.
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
        ) : (
          (hasMPRA || hasPret) && (
            <Card>
              <h3 className="fr-h5">
                <span
                  className="fr-icon-draft-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                Votre projet prend forme. Demandez des devis
              </h3>
              <p>
                Après votre rendez-vous avec un conseiller, contactez des
                artisans RGE pour obtenir leurs devis.
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
          )
        )}
        {!displayAll && (
          <Button
            priority="tertiary"
            onClick={() => setDisplayAll(!displayAll)}
          >
            Afficher les étapes suivantes{' '}
            <span
              className="fr-icon-arrow-down-s-line"
              aria-hidden="true"
            ></span>
          </Button>
        )}
        {displayAll && (
          <>
            {(hasMPRA || hasMPA) && (
              <>
                <Card>
                  <h3 className="fr-h5">
                    <span
                      className="fr-icon-send-plane-line fr-mr-1v"
                      aria-hidden="true"
                    ></span>
                    Je dépose le dossier auprès de l'Anah
                  </h3>
                  {hasMPA && (
                    <p>
                      Vous pouvez déposer votre dossier auprès de l'Anah avec
                      l'appui de votre AMO. Plus votre dossier est complet et
                      bien préparé, plus son instruction sera rapide.
                    </p>
                  )}
                  {hasMPRA && (
                    <p>
                      Vous pouvez le faire avec l'aide de votre Accompagnateur
                      Rénov', votre mandataire ou directement depuis la
                      plateforme que vous a communiqué le conseiller. Les
                      dossiers les mieux préparés sont instruits plus
                      rapidement.
                    </p>
                  )}
                </Card>
                <Card>
                  <Badge noIcon>3 mois d'attente</Badge>
                  <h3 className="fr-h5 fr-mt-3v">
                    <span
                      className="fr-icon-checkbox-circle-line fr-mr-1v"
                      aria-hidden="true"
                    ></span>
                    L'Anah instruit et valide votre dossier
                  </h3>
                  <p>
                    {hasMPRA ? (
                      <>
                        MaPrimeRénov’ parcours accompagné : les dossiers déposés
                        à partir du 30/09/2025 seront traités au premier
                        trimestre 2026.
                      </>
                    ) : (
                      <>
                        La période d'instruction varie grandement en fonction de
                        l'affluence et de la lutte contre la fraude. Une fois
                        validé, vous savez de quelles aides vous allez
                        bénéficier et quand vous les recevrez.
                      </>
                    )}
                  </p>
                </Card>
              </>
            )}
            {!hasMPRA && hasPret && (
              <>
                <Card>
                  <h3 className="fr-h5 fr-mt-3v">
                    <span
                      className="fr-icon-send-plane-line fr-mr-1v"
                      aria-hidden="true"
                    ></span>
                    Je contacte ma banque pour faire la demande de prêts 0%
                  </h3>
                  <p>
                    L'éco-PTZ et le prêt avance rénovation (PAR+) sont proposés
                    par les établissements de crédit et les sociétés de
                    financement qui ont signé une convention avec l’État.
                  </p>
                </Card>
                <Card>
                  <Badge noIcon>selon votre capacité d’endettement</Badge>
                  <h3 className="fr-h5 fr-mt-3v">
                    <span
                      className="fr-icon-checkbox-circle-line fr-mr-1v"
                      aria-hidden="true"
                    ></span>
                    L’établissement de crédit examine et valide votre demande
                  </h3>
                  <p>
                    L'établissement ou la société décidera, comme pour toute
                    demande de prêt, de vous prêter la somme demandée en
                    fonction de votre endettement préalable et de votre capacité
                    à rembourser.
                  </p>
                </Card>
              </>
            )}
            {hasMPRA && (
              <Card>
                <h3 className="fr-h5">
                  <span
                    className="fr-icon-pen-nib-line fr-mr-1v"
                    aria-hidden="true"
                  ></span>
                  Je signe les devis, et planifie les travaux avec les artisans
                </h3>
                <p>C'est parti ! Les travaux vont bientôt commencer.</p>
              </Card>
            )}
            {hasPret && (
              <Card>
                {hasMPRA && <Badge noIcon>optionnel</Badge>}
                <h3 className={`fr-h5 ${hasMPRA && 'fr-mt-3v'}`}>
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
                      Vous pouvez payer l'acompte aux artisans. Les travaux
                      débutent !
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Le versement de l'éco-PTZ peut s'effectuer en 1 seule fois
                      sur la base des devis ou en plusieurs fois sur la base des
                      factures de travaux transmises au fur et à mesure jusqu'à
                      la date de clôture du prêt.
                    </p>
                    <p>
                      Vous pouvez payer l'acompte aux artisans. Les travaux
                      débutent !
                    </p>
                  </>
                )}
              </Card>
            )}
            {!hasMPRA && !hasMPA && (
              <Card>
                <Badge noIcon>optionnel</Badge>
                <h3 className="fr-h5 fr-mt-3v">
                  <span
                    className="fr-icon-money-euro-circle-line fr-mr-1v"
                    aria-hidden="true"
                  ></span>
                  Je dépose mes demandes d’aides
                </h3>
                <p>Primes CEE, Exonération de taxe foncière, etc.</p>
              </Card>
            )}
            <Card>
              <h3 className="fr-h5">
                <span
                  className="fr-icon-warning-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                Fin des travaux ! Votre logement est{' '}
                {hasMPA ? 'adapté' : 'rénové'}
              </h3>
              <p>Dès les premiers mois, profitez de nombreux bénéfices :</p>
              {hasMPA ? (
                <ul>
                  <li>
                    🧘 Un logement plus sûr et mieux adapté à vos besoins
                    quotidiens
                  </li>
                  <li>🍀 Plus d'autonomie et de confort</li>
                  <li>🥇 Une meilleure valorisation de votre bien</li>
                </ul>
              ) : (
                <ul>
                  <li>🧘 Plus de confort, en hiver comme en été</li>
                  <li>🍀 Un logement plus respectueux de l'environnement</li>
                  <li>🥇 Une meilleure valorisation de votre bien</li>
                </ul>
              )}
            </Card>
            <Card>
              <Badge noIcon>1 mois d'attente</Badge>
              <h3 className="fr-h5 fr-mt-3v">
                <span
                  className="fr-icon-money-euro-circle-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                Recevez vos aides
              </h3>
              {hasMPA ? (
                <p>
                  Subvention MaPrimeAdapt' : elle sera versée une fois les
                  travaux terminés.
                </p>
              ) : (
                <p>
                  Subvention MaPrimeRénov', Primes CEE... Elles arriveront
                  probablement une fois les travaux finis.
                </p>
              )}
            </Card>
            {hasPret && (
              <Card>
                {hasMPRA && <Badge noIcon>optionnel</Badge>}
                <h3 className={`fr-h5 ${hasMPRA && 'fr-my-3v'}`}>
                  <span
                    className="fr-icon-bank-card-line fr-mr-1v"
                    aria-hidden="true"
                  ></span>
                  Remboursement du prêt
                </h3>
                <p>
                  Vous continuez de rembourser votre prêt, tout en réalisant
                  déjà des économies d'énergie&nbsp;⚡️.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
      <SharePage title="Partager la simulation" />
      <div className="fr-my-10v">
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation: omit(['objectif'], situation),
            answeredQuestions,
            text: 'Retour',
          }}
        />
      </div>
      <Feedback />
    </>
  )
}
