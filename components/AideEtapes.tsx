import rules from '@/app/règles/rules'
import {
  BlocAide,
  Card,
  CTA,
  CTAWrapper,
  InlineLink,
  PrimeStyle,
  Section,
} from './UI'
import { formatValue } from 'publicodes'
import { useEffect, useRef, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import { PrimeDisplay } from './Geste'
import mprImage from '@/public/maprimerenov.svg'
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
import BackToLastQuestion from './BackToLastQuestion'
import Breadcrumb from './Breadcrumb'
import CopyButton from './CopyButton'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import { omit } from './utils'
import BlocConseiller from './BlocConseiller'
import Share from '@/app/simulation/Share'
import BtnBackToParcoursChoice from './BtnBackToParcoursChoice'
import Feedback from '@/app/contact/Feedback'
const Badge = ({ children, color }) => (
  <div
    css={`
      display: inline-block;
      text-transform: uppercase;
      background: ${color == 'blue' ? '#e8edff' : '#fee7fc'};
      color: ${color == 'blue' ? '#0063cb' : '#6e445a'};
      padding: 5px 10px;
      font-weight: bold;
      margin-bottom: 1rem;
      font-size: 85%;
    `}
  >
    {children}
  </div>
)
export default function AideGeste({
  searchParams,
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
}) {
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
            }}
          />
          <CopyButton searchParams={searchParams} />
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
            }
          `}
        >
          <Card
            css={`
              background: #f5f5fe;
              padding: calc(0.5rem + 1vw);
            `}
          >
            <Badge>prochaine étape</Badge>
            <h2>
              <Image src={iconConseiller} alt="icone conseiller" />
              Un conseiller France Rénov' vous accompagne
            </h2>
            <p>
              Neutres et gratuits, il existe plus de 600 Espaces conseil France
              Rénov' en France pour vous aider à :
            </p>
            <ul
              css={`
                list-style-type: none;
                padding: 0;
              `}
            >
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
              RGE pour obtenir leurs devis. Votre Accompagnateur Rénov' vous
              aidera à choisir les plus adaptés pour la suite de votre projet.
            </p>
            <p>
              <strong>Important</strong> : ne signez pas encore les devis
            </p>
          </Card>
          <Card>
            <h2>
              <Image src={iconSend} alt="icone envoyer" />
              Déposez le dossier auprès de l'Anah
            </h2>
            <p>
              Vous pouvez le faire avec l'aide de votre Accompagnateur Rénov',
              votre mandataire ou directement depuis la plateforme que vous a
              communiqué le conseiller.Les dossiers les mieux préparés sont
              instruits plus rapidement.
            </p>
          </Card>
          <Card>
            <Badge>3 mois d'attente</Badge>
            <h2>
              <Image src={iconValider} alt="icone valider" />
              L'Anah instruit et valide votre dossier
            </h2>
            <p>
              La période d'instruction varie grandement en fonction de
              l'affluence et de la lutte contre la fraude.Une fois validé, vous
              savez de quelles aides vous allez bénéficier et quand vous les
              recevrez.
            </p>
          </Card>
          <Card>
            <h2>
              <Image src={iconSign} alt="icone signer" />
              Signez les devis, et planifiez les travaux avec les artisans
            </h2>
            <p>C'est parti ! Les travaux vont bientôt commencer.</p>
          </Card>
          <Card>
            <Badge color="blue">optionnel</Badge>
            <h2>
              <Image src={iconEuro} alt="icone euro" />
              Recevez le prêt et démarrez les travaux
            </h2>
            <p>
              Si vous êtes éligible, la banque vous verse le montant de votre
              Eco-PTZ.
            </p>
            <p>L'Anah vous verse l'avance MaPrimeRénov'.</p>
            <p>
              Vous pouvez payer l'acompte aux artisans. Les travaux débutent !
            </p>
          </Card>
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
            <div
              css={`
                display: inline-block;
                text-transform: uppercase;
                background: #fee7fc;
                color: #6e445a;
                padding: 5px 10px;
                font-weight: bold;
                margin-bottom: 1rem;
                font-size: 85%;
              `}
            >
              1 mois d'attente
            </div>
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
            <div
              css={`
                display: inline-block;
                text-transform: uppercase;
                background: #e8edff;
                color: #0063cb;
                padding: 5px 10px;
                font-weight: bold;
                margin-bottom: 1rem;
                font-size: 85%;
              `}
            >
              optionnel
            </div>
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
