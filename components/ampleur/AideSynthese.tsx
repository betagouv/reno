'use client'
import { AccordionTitle, Card, CTA, CTAWrapper, Section } from '@/components/UI'
import rules from '@/app/règles/rules'
import { push } from '@socialgouv/matomo-next'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import { CustomQuestionWrapper } from '../CustomQuestionUI'
import { omit, uncapitalise0, aideStyles } from '../utils'
import { useSearchParams } from 'next/navigation'
import { Key } from '../explications/ExplicationUI'
import { decodeDottedName } from '../publicodes/situationUtils'
import FatConseiller from '../FatConseiller'
import { createExampleSituation } from './AmpleurSummary'
import { PictoTypeAide } from './AideAmpleur'
import { formatValue } from 'publicodes'
import Feedback from '@/app/contact/Feedback'

export default function AideSynthese({
  setSearchParams,
  situation,
  answeredQuestions,
  engine,
  correspondance,
}) {
  const [activeSection, setActiveSection] = useState('accompagne')

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null) // Ferme la section si elle est déjà ouverte
    } else {
      setActiveSection(section) // Ouvre une nouvelle section
    }
  }

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const count = searchParams['ampleur.synthèse']?.split(',').length
  const exampleSituation = createExampleSituation(engine, situation, false)

  const groupedByType = searchParams['ampleur.synthèse']
    ?.split(',')
    .map((dottedNameUnparsed) => {
      let dottedName = decodeDottedName(dottedNameUnparsed).replace(/"/g, '')
      const rule = rules[dottedName]
      return { rule, dottedName }
    })
    .reduce((acc, { rule, dottedName }) => {
      const type = rule['type']
      if (!acc[type]) {
        acc[type] = 0
      }
      acc[type] += engine
        .setSituation(situation)
        .evaluate(dottedName + ' . montant').nodeValue
      return acc
    }, {})

  return (
    <Section>
      <CustomQuestionWrapper>
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation: omit(['details'], situation),
            answeredQuestions,
          }}
        />
        <header>
          <small>Financer une rénovation d’ampleur</small>
          <h2
            css={`
              font-size: 120%;
              margin: 0.5rem 0 !important;
            `}
          >
            Votre synthèse
          </h2>
        </header>
        <strong>Récapitulatif</strong>
        <p
          css={`
            margin: 1rem 0 0 0;
            em {
              min-width: 0;
            }
          `}
        >
          Vous avez sélectionné <Key $state={'final'}>{count}</Key> dispositifs
          cumulables entre eux :
        </p>
        <Card
          css={`
            display: flex;
            width: fit-content;
            gap: 0.5rem;
          `}
        >
          {Object.entries(groupedByType).map(([type, montant]) => (
            <div key={type}>
              <PictoTypeAide
                css={`
                  display: flex;
                  flex-direction: row;
                  gap: 0.5rem;
                  margin: 1rem 0;
                `}
                $style={aideStyles[type] || {}}
                $expanded={true}
              >
                <span className="icon"></span>
                <span>
                  <strong>{formatValue(montant)} €</strong>
                  <br />
                  <small>
                    {type == 'remboursement'
                      ? 'remboursés'
                      : type == 'prêt'
                        ? 'de prêt à taux zéro'
                        : type == 'exonération fiscale'
                          ? "d'exonération fiscale"
                          : type == 'avance'
                            ? 'versés avant travaux'
                            : ''}
                  </small>
                </span>
              </PictoTypeAide>
            </div>
          ))}
        </Card>
        <p>
          Pour ne pas perdre votre synthèse, sauvegardez-la en copiant le lien
          suivant :
        </p>
        <p
          css={`
            text-wrap: wrap;
            word-break: break-all;
          `}
        >
          {window.location.href}
        </p>
        <CTAWrapper $justify="center">
          <CTA
            css={`
              padding: 1rem 4rem;
            `}
            $importance="emptyBackground"
            $fontSize="normal"
          >
            🔗 <strong>Copier le lien</strong>
          </CTA>
        </CTAWrapper>
        <h3>Vos dispositifs en détails</h3>
        <div css={`margin-bottom 1rem;`}>
          {searchParams['ampleur.synthèse']
            ?.split(',')
            .map((dottedNameUnparsed) => {
              let dottedName = decodeDottedName(dottedNameUnparsed).replace(
                /"/g,
                '',
              )
              const rule = rules[dottedName]
              const marque2 = rule['complément de marque']
              const title =
                rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : '')
              const AideComponent = correspondance[dottedName]

              return (
                <section key={dottedName}>
                  <AccordionTitle
                    aria-expanded={activeSection === dottedName}
                    aria-controls={`accordion-${dottedName}`}
                    onClick={() => toggleSection(dottedName)}
                  >
                    {title}
                  </AccordionTitle>
                  {activeSection === dottedName && (
                    <div id={`accordion-${dottedName}`}>
                      <AideComponent
                        {...{
                          dottedName,
                          setSearchParams,
                          answeredQuestions,
                          engine,
                          situation,
                          exampleSituation,
                          searchParams,
                          expanded: false,
                          rules,
                        }}
                      />
                    </div>
                  )}
                </section>
              )
            })}
        </div>
        <FatConseiller
          {...{
            situation,
            margin: 'small',
            titre: '🚀 Et maintenant, que faire ?',
            texte:
              'Vous avez identifié les dispositifs d’aides auxquels vous êtes éligibles. Pour aller plus loin dans vos démarches et préparer votre projet, contactez un conseiller France Renov.',
          }}
        />
        <Feedback title={'Ce simulateur a-t-il été utile ?'} />
      </CustomQuestionWrapper>
    </Section>
  )
}
