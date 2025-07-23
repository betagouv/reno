'use client'

import rules from '@/app/règles/rules'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { Card } from '@/components/UI'
import useSetSearchParams from '@/components/useSetSearchParams'
import informationIcon from '@/public/information.svg'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import { roundToThousands } from '../utils'
import MprCategory from '../MprCategory'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import CopyButton from '../CopyButton'
import CalculatorWidget from '../CalculatorWidget'
import Value from '../Value'
import ExplicationsCoproIneligible from './ExplicationsCoproIneligible'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'
import Input from '@codegouvfr/react-dsfr/Input'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Tag from '@codegouvfr/react-dsfr/Tag'

export default function ExplicationCopropriete() {
  useSyncUrlLocalStorage()
  const isMobile = window.innerWidth <= 600
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = {
    ...getSituation(searchParams, rules),
  }
  const setSearchParams = useSetSearchParams()

  const isEligibile = engine
    .setSituation(situation)
    .evaluate('copropriété . condition éligibilité').nodeValue

  let bonusFragile = null
  let bonusSortiePassoire = null
  if (isEligibile) {
    // Si le montant des travaux n'est pas précisé, on l'estime
    if (!situation['copropriété . montant travaux']) {
      situation['copropriété . montant travaux'] = roundToThousands(
        engine.evaluate('copropriété . montant travaux').nodeValue,
      )
    }
    const evaluation = engine.setSituation(situation)
    bonusFragile = evaluation.evaluate(
      'copropriété . pourcentage copropriété fragile',
    ).nodeValue
    bonusSortiePassoire = evaluation.evaluate(
      'copropriété . pourcentage sortie passoire',
    ).nodeValue
  }
  const nom = situation['copropriété . nom'],
    nomContent = nom ? nom + ' ' : null

  return (
    <>
      <Breadcrumb
        currentPageLabel="L'éligibilité de la copropriété"
        homeLinkProps={{
          href: '/',
        }}
        segments={[
          {
            label: 'Simulateur copropriété',
            linkProps: {
              href: '/copropriete',
            },
          },
        ]}
      />
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation,
            answeredQuestions: answeredQuestions.slice(0, -1),
          }}
        />
        <CopyButton searchParams={searchParams} />
      </div>
      <header className="fr-mt-5v">
        <Tag>MaPrimeRénov’ Copropriété</Tag>
        <h1>Financer une rénovation d’ampleur de votre copropriété</h1>
      </header>
      {isEligibile ? (
        <>
          <p>
            Votre copropriété {nomContent}est{' '}
            <Badge noIcon severity="success">
              éligible
            </Badge>{' '}
            au dispositif <strong>MaPrimeRénov' Copropriété</strong>.
          </p>
        </>
      ) : (
        <>
          <p>
            Votre copropriété{' '}
            <Badge noIcon severity="error">
              n'est pas éligible
            </Badge>{' '}
            au dispositif <strong>MaPrimeRénov' Copropriété</strong>
          </p>
          <ExplicationsCoproIneligible {...{ situation, engine }} />
        </>
      )}
      <>
        {isEligibile ? (
          <>
            <CalculatorWidget isMobile={isMobile}>
              <form id="storybook-form">
                <fieldset
                  className="fr-fieldset"
                  style={{
                    alignItems: 'baseline',
                  }}
                  id="storybook-form-fieldset"
                  aria-labelledby="storybook-form-fieldset-legend storybook-form-fieldset-messages"
                >
                  <div className="fr-fieldset__element fr-fieldset__element--inline">
                    <Input
                      nativeInputProps={{
                        type: 'number',
                        name: 'prix-achat',
                        min: 1,
                        step: 1,
                        onChange: (value) => {
                          value = value === undefined ? 0 : value
                          if (!Number.isInteger(parseInt(value))) return
                          setSearchParams(
                            encodeSituation({
                              'copropriété . nombre de logements': value + '*',
                            }),
                            'replace',
                            false,
                          )
                        },
                        value: situation['copropriété . nombre de logements'],
                      }}
                      label="Nombre de logements :"
                    />
                  </div>
                  <div className="fr-fieldset__element fr-fieldset__element--inline">
                    <Select
                      nativeSelectProps={{
                        onChange: (e) =>
                          setSearchParams(
                            encodeSituation({
                              'copropriété . gain énergétique': e + '*',
                            }),
                            'replace',
                            false,
                          ),
                        value: situation[
                          'copropriété . gain énergétique'
                        ].replaceAll('"', "'"),
                      }}
                      label="Gain énergétique :"
                    >
                      {rules['copropriété . gain énergétique'][
                        'une possibilité parmi'
                      ]['possibilités']
                        .slice(1, 3)
                        .map((i) => (
                          <option
                            key={i}
                            value={
                              rules['copropriété . gain énergétique . ' + i]
                                .valeur
                            }
                          >
                            {
                              rules['copropriété . gain énergétique . ' + i]
                                .titre
                            }
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div className="fr-fieldset__element fr-fieldset__element--inline">
                    <Input
                      label="Votre budget travaux (HT) :"
                      nativeInputProps={{
                        type: 'number',
                        value: situation['copropriété . montant travaux'],
                        min: '0',
                        max: '999999',
                        step: '100',
                        onChange: (e) => {
                          const value =
                            e.target.value === undefined || e.target.value == ''
                              ? 0
                              : e.target.value
                          if (!Number.isInteger(parseInt(value))) return

                          setSearchParams(
                            encodeSituation({
                              'copropriété . montant travaux': value + '*',
                            }),
                            'replace',
                            false,
                          )
                        },
                      }}
                      addon={
                        <>
                          €
                          <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                            HT
                          </span>
                        </>
                      }
                    />
                  </div>
                </fieldset>
              </form>
              <div
                css={`
                  margin: 1rem 0;
                `}
              >
                🥳 <strong>Bonne nouvelle</strong> : Vous êtes éligible à une
                aide de
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: "copropriété . pourcentage d'aide",
                  }}
                />
                du coût de vos travaux avec un plafond de
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName:
                      'copropriété . montant travaux . plafond par logement',
                  }}
                />
                par logement.
                {(bonusSortiePassoire !== 0 || bonusFragile !== 0) &&
                  ' Ce pourcentage inclut '}
                {bonusSortiePassoire !== 0 && (
                  <>
                    <strong>{bonusSortiePassoire}%</strong> de bonus{' '}
                    <em>"Sortie de passoire"</em>
                  </>
                )}
                {bonusFragile !== 0 && (
                  <>
                    {bonusSortiePassoire ? ' et ' : ''}
                    <strong>{bonusFragile}%</strong> de bonus{' '}
                    <em>"Copropriété fragile ou en difficulté"</em>
                  </>
                )}
                {(bonusSortiePassoire !== 0 || bonusFragile !== 0) && '.'}
              </div>
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  gap: 0.5rem;
                  margin-top: 1rem;
                `}
              >
                <div>
                  Vous toucherez un total d'aides de :{' '}
                  <Value
                    {...{
                      size: 'xl',
                      state: 'success',
                      engine,
                      situation: situation,
                      dottedName: 'copropriété . montant',
                    }}
                  />
                </div>
              </div>
            </CalculatorWidget>
            <Card
              css={`
                background: transparent;
                border: none;
                border-left: 3px solid #dfdff1;
                border-radius: 0;
                padding: 0rem 0 0rem 0.8rem;
                margin: 2vh 0 3vh;
              `}
            >
              <h4
                css={`
                  text-align: left;
                  margin: 0rem 0 0.8rem 0;
                  color: gray;
                  font-weight: 400;
                `}
              >
                Explications
              </h4>
              L'aide de l'état financera{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: "copropriété . pourcentage d'aide",
                }}
              />
              du montant total de vos travaux. Ce pourcentage se décompose de la
              manière suivante:
              <ul
                css={`
                  margin: 1.1rem 0;
                  li {
                    margin: 5px 0;
                  }
                `}
              >
                <li>
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'copropriété . pourcentage gain énergétique',
                    }}
                  />{' '}
                  car votre gain énergétique est estimé à{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'copropriété . gain énergétique',
                    }}
                  />
                </li>
                <li>
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'copropriété . pourcentage sortie passoire',
                    }}
                  />{' '}
                  car{' '}
                  <Badge
                    noIcon
                    severity={bonusSortiePassoire ? 'success' : 'error'}
                  >
                    {!bonusSortiePassoire
                      ? 'vous ne bénéficieriez pas'
                      : 'vous bénéficieriez'}
                  </Badge>{' '}
                  du bonus <strong>"Sortie de passoire"</strong>
                </li>
                <li>
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName:
                        'copropriété . pourcentage copropriété fragile',
                    }}
                  />{' '}
                  car{' '}
                  <Badge noIcon severity={bonusFragile ? 'success' : 'error'}>
                    {!bonusFragile
                      ? 'vous ne bénéficieriez pas'
                      : 'vous bénéficieriez'}
                  </Badge>{' '}
                  du bonus{' '}
                  <strong>"Copropriété fragile ou en difficulté"</strong>
                </li>
              </ul>
              <p>
                Elle est plafonnée à
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName:
                      'copropriété . montant travaux . plafond par logement',
                  }}
                />
                par logement. Pour votre copropriété de
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'copropriété . nombre de logements',
                  }}
                />
                , cela représente un plafond de
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'copropriété . montant travaux . plafond',
                  }}
                />
              </p>
            </Card>
            <div
              css={`
                background-image: linear-gradient(0deg, #2a82dd, #2a82dd);
                background-position: 0 0;
                background-repeat: no-repeat;
                background-size: 0.25rem 100%;
                font-size: 1rem;
                line-height: 1.5rem;
                padding-left: 1.25rem;
                margin-bottom: 0.8rem;
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.4rem;
                  color: #2a82dd;
                  font-weight: 500;
                  img {
                    margin-right: 0.4rem;
                  }
                `}
              >
                <Image src={informationIcon} alt="infobulle" width="25" />
                <span>Ce n'est pas tout!</span>
              </div>
              <p>
                Les copropriétaires sont potentiellement éligibles à{' '}
                <Value
                  {...{
                    engine,
                    situation,
                    dottedName: 'copropriété . prime individuelle totale',
                  }}
                />
                d'aide supplémentaire.
              </p>
              <p>
                En effet, chaque copropriétaire peut bénéficier individuellement
                d'une prime pouvant s'élever à{' '}
                <Badge noIcon severity="success">
                  {rules['copropriété . prime individuelle']['par défaut']}
                </Badge>{' '}
                par logement en fonction de ses revenus.
              </p>
            </div>
            <MprCategory
              {...{
                engine,
                situation,
                setSearchParams,
                answeredQuestions,
              }}
            />
          </>
        ) : (
          <>
            <div className="fr-callout fr-icon-info-line fr-callout--blue-cumulus">
              <h3>Ce n'est pas fini!</h3>
              <p>
                Les copropriétaires{' '}
                <strong>peuvent être éligibles individuellement</strong> à
                d'autres aides à la rénovation.
                <br />
                C'est pourquoi, nous vous invitons à refaire une simulation pour
                avoir un aperçu de l'ensemble de vos aides.
              </p>
            </div>
            <Link
              className="fr-btn fr-icon-arrow-right-line fr-btn--icon-left"
              href="/simulation"
            >
              Simulez l'ensemble de vos aides
            </Link>
          </>
        )}
      </>
    </>
  )
}
