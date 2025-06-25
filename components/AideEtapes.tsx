import { Badge, Card, Section } from './UI'
import iconConseiller from '@/public/icon-conseiller.svg'
import iconLampe from '@/public/icon-lampe.svg'
import iconPaper from '@/public/icon-paper.svg'
import iconSend from '@/public/icon-send.svg'
import iconValider from '@/public/icon-valider.svg'
import iconSign from '@/public/icon-sign.svg'
import iconEuro from '@/public/icon-euro.svg'
import iconTravaux from '@/public/icon-travaux.svg'
import iconCard from '@/public/icon-card.svg'
import Image from 'next/image'
import { encodeSituation } from './publicodes/situationUtils'
import Breadcrumb from './Breadcrumb'
import CopyButton from './CopyButton'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { omit } from './utils'
import BlocConseiller from './BlocConseiller'
import Share from '@/app/simulation/Share'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import Feedback from '@/app/contact/Feedback'
import { useAides } from './ampleur/useAides'

export default function AideEtapes({
  searchParams,
  setSearchParams,
  situation,
  engine,
  answeredQuestions,
}) {
  const aides = useAides(engine, situation)
  const hasMPRA =
    aides.find((aide) => aide.baseDottedName == 'MPR . accompagnée').status ===
    true
  return (
    <Section
      css={`
        h1 {
          margin-top: 0.5rem;
        }
        h2 {
          margin: 0 0 1rem 0;
          font-size: 120%;
          display: flex;
          align-items: center;
          font-weight: bold;
          gap: 1rem;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
      `}
    >
      <CustomQuestionWrapper>
        <Breadcrumb
          links={[
            {
              Eligibilité: setSearchParams(
                {
                  ...encodeSituation(
                    omit(['objectif'], situation),
                    false,
                    answeredQuestions,
                  ),
                },
                'url',
                true,
              ),
            },
            {
              'Obtenir mes aides': setSearchParams(
                {
                  ...encodeSituation(situation, false, answeredQuestions),
                },
                'url',
                true,
              ),
            },
          ]}
        />
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          <BtnBackToParcoursChoice
            {...{
              setSearchParams,
              situation: omit(['objectif'], situation),
              answeredQuestions,
              text: 'Revoir mes aides éligibles',
            }}
          />
        </div>
        <h1>Les étapes pour obtenir vos aides</h1>
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
          <Card
            css={`
              background: #f5f5fe;
              padding: calc(0.5rem + 1vw);
            `}
          >
            <Badge color="purple">prochaine étape</Badge>
            <h2>
              <Image src={iconConseiller} alt="icone conseiller" />
              Un conseiller France Rénov' vous accompagne
            </h2>
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
            <h2>
              <Image src={iconLampe} alt="icone lampe" />
              Conservez votre simulation pour plus tard
            </h2>
            <Share
              text="Elle pourra vous être utile pour votre rendez-vous en Espace conseil
            France Rénov'."
              align="left"
            />
          </Card>
          <Card>
            <h2>
              <Image src={iconPaper} alt="icone papier" />
              Votre projet prend forme. Demandez des devis
            </h2>
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
          {hasMPRA && (
            <>
              <Card>
                <h2>
                  <Image src={iconSend} alt="icone envoyer" />
                  Déposez le dossier auprès de l'Anah
                </h2>
                <p>
                  Vous pouvez le faire avec l'aide de votre Accompagnateur
                  Rénov', votre mandataire ou directement depuis la plateforme
                  que vous a communiqué le conseiller. Les dossiers les mieux
                  préparés sont instruits plus rapidement.
                </p>
              </Card>
              <Card>
                <Badge color="purple">3 mois d'attente</Badge>
                <h2>
                  <Image src={iconValider} alt="icone valider" />
                  L'Anah instruit et valide votre dossier
                </h2>
                <p>
                  La période d'instruction varie grandement en fonction de
                  l'affluence et de la lutte contre la fraude. Une fois validé,
                  vous savez de quelles aides vous allez bénéficier et quand
                  vous les recevrez.
                </p>
              </Card>
            </>
          )}
          {!hasMPRA && (
            <>
              <Card>
                <h2>
                  <Image src={iconSend} alt="icone envoyer" />
                  Contactez votre banque pour faire la demande de prêts 0%
                </h2>
                <p>
                  L'éco-PTZ et le prêt avance rénovation (PAR+) sont proposés
                  par les établissements de crédit et les sociétés de
                  financement qui ont signé une convention avec l’État.
                </p>
              </Card>
              <Card>
                <Badge color="purple">selon votre capacité d’endettement</Badge>
                <h2>
                  <Image src={iconValider} alt="icone valider" />
                  L’établissement de crédit examine et valide votre demande
                </h2>
                <p>
                  L'établissement ou la société décidera, comme pour toute
                  demande de prêt, de vous prêter la somme demandée en fonction
                  de votre endettement préalable et de votre capacité à
                  rembourser.
                </p>
              </Card>
            </>
          )}
          <Card>
            <h2>
              <Image src={iconSign} alt="icone signer" />
              Signez les devis, et planifiez les travaux avec les artisans
            </h2>
            <p>C'est parti ! Les travaux vont bientôt commencer.</p>
          </Card>
          <Card>
            {hasMPRA && <Badge color="blue">optionnel</Badge>}
            <h2>
              <Image src={iconEuro} alt="icone euro" />
              Recevez le prêt et démarrez les travaux
            </h2>
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
          {!hasMPRA && (
            <Card>
              <Badge color="blue">optionnel</Badge>
              <h2>
                <Image src={iconEuro} alt="icone euro" />
                Faire la demande d’autres aides complémentaires
              </h2>
              <p>Primes CEE, Exonération de taxe foncière, etc.</p>
            </Card>
          )}
          <Card>
            <h2>
              <Image src={iconTravaux} alt="icone travaux" />
              Fin des travaux ! Votre logement est rénové
            </h2>
            <p>Dès les premiers mois, profitez de nombreux bénéfices :</p>
            <ul>
              <li>🧘 Plus de confort, en hiver comme en été</li>
              <li>🍀 Un logement plus respectueux de l'environnement</li>
              <li>🥇 Une meilleure valorisation de votre bien</li>
            </ul>
          </Card>
          <Card>
            <Badge color="purple">1 mois d'attente</Badge>
            <h2>
              <Image src={iconEuro} alt="icone euro" />
              Recevez vos autres aides
            </h2>
            <p>
              Subvention MaPrimeRénov', Primes CEE... Elles arriveront
              probablement une fois les travaux finis.
            </p>
          </Card>
          <Card>
            {hasMPRA && <Badge color="blue">optionnel</Badge>}
            <h2>
              <Image src={iconCard} alt="icone carte de crédit" />
              Remboursement du prêt
            </h2>
            <p>
              Vous continuez de rembourser votre prêt, tout en réalisant déjà
              des économies d'énergie ⚡️.
            </p>
          </Card>
        </div>
      </CustomQuestionWrapper>
      <Feedback />
    </Section>
  )
}
