'use client'

import rules from '@/app/règles/rules'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Publicodes, { formatValue } from 'publicodes'
import { useMemo } from 'react'
import { roundToThousands } from '../utils'
import MprCategory from '../MprCategory'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import CopyButton from '../CopyButton'
import CalculatorWidget from '../CalculatorWidget'
import Value from '../Value'
import ExplicationsCoproIneligible from './ExplicationIneligible'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Select from '@codegouvfr/react-dsfr/Select'
import Input from '@codegouvfr/react-dsfr/Input'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Tag from '@codegouvfr/react-dsfr/Tag'

export default function ExplicationCopropriete() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = getSituation(searchParams, rules)

  const engineSituation = engine.setSituation(situation)
  const setSearchParams = useSetSearchParams()

  const isEligibile = engineSituation.evaluate(
    'copropriété . condition éligibilité',
  ).nodeValue

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

  const getValue = (dottedName) =>
    formatValue(engineSituation.evaluate(dottedName), { precision: 0 })

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
            <CalculatorWidget titleAs="h2">
              <form id="storybook-form">
                <fieldset
                  className="fr-fieldset fr-grid-row--between"
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
            <div className="fr-callout">
              <h3>Explications</h3>
              <div className="fr-callout__text">
                L'aide de l'état financera{' '}
                <Value
                  {...{
                    size: 'xl',
                    state: 'success',
                    engine,
                    situation,
                    dottedName: "copropriété . pourcentage d'aide",
                  }}
                />{' '}
                du montant total de vos travaux. Ce pourcentage se décompose de
                la manière suivante:
                <ul>
                  <li>
                    <Value
                      {...{
                        state: 'success',
                        engine,
                        situation,
                        dottedName:
                          'copropriété . pourcentage gain énergétique',
                      }}
                    />{' '}
                    car votre gain énergétique est estimé à{' '}
                    <strong>
                      {getValue('copropriété . gain énergétique')}
                    </strong>
                  </li>
                  <li>
                    <Value
                      {...{
                        state: bonusSortiePassoire ? 'success' : 'error',
                        engine,
                        situation,
                        dottedName: 'copropriété . pourcentage sortie passoire',
                      }}
                    />{' '}
                    car{' '}
                    {!bonusSortiePassoire
                      ? 'vous ne bénéficieriez pas'
                      : 'vous bénéficieriez'}{' '}
                    du bonus <strong>"Sortie de passoire"</strong>
                  </li>
                  <li>
                    <Value
                      {...{
                        state: bonusFragile ? 'success' : 'error',
                        engine,
                        situation,
                        dottedName:
                          'copropriété . pourcentage copropriété fragile',
                      }}
                    />{' '}
                    car{' '}
                    {!bonusFragile
                      ? 'vous ne bénéficieriez pas'
                      : 'vous bénéficieriez'}{' '}
                    du bonus{' '}
                    <strong>"Copropriété fragile ou en difficulté"</strong>
                  </li>
                </ul>
                <p>
                  Elle est plafonnée à{' '}
                  <strong>
                    {getValue(
                      'copropriété . montant travaux . plafond par logement',
                    )}
                  </strong>{' '}
                  par logement. Pour votre copropriété de{' '}
                  <strong>
                    {getValue('copropriété . nombre de logements')}
                  </strong>{' '}
                  , cela représente un plafond de{' '}
                  <strong>
                    {getValue('copropriété . montant travaux . plafond')}
                  </strong>
                  .
                </p>
              </div>
            </div>
            <div className="fr-callout fr-callout--blue-cumulus fr-icon-info-line">
              <span className="fr-callout__title">Ce n'est pas tout!</span>
              <p className="fr-callout__text">
                Les copropriétaires sont potentiellement éligibles à{' '}
                <Value
                  {...{
                    size: 'xl',
                    state: 'success',
                    engine,
                    situation,
                    dottedName: 'copropriété . prime individuelle totale',
                  }}
                />{' '}
                d'aide supplémentaire.
              </p>
              <p className="fr-callout__text">
                En effet, chaque copropriétaire peut bénéficier individuellement
                d'une prime pouvant s'élever à{' '}
                <Badge noIcon severity="success" className="fr-h3">
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
