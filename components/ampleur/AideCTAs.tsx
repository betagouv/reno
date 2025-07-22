import rules from '@/app/règles/rules'
import { encodeDottedName, encodeSituation } from '../publicodes/situationUtils'
import iconCalculator from '@/public/calculator.svg'
import { omit } from '@/components/utils'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { push } from '@socialgouv/matomo-next'
import { useEffect, useState } from 'react'
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup'

export default function AideCTAs({
  dottedName,
  situation,
  answeredQuestions,
  setSearchParams,
  expanded,
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600)
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const rawSearchParams = useSearchParams()
  const searchParams = Object.fromEntries(rawSearchParams.entries())
  const { objectif, ...situationSearchParams } = searchParams

  const detailUrl = setSearchParams(
    encodeSituation({
      details: encodeDottedName(dottedName),
    }),
    'url',
    false,
  )

  const backUrl =
    situation &&
    setSearchParams(
      {
        ...encodeSituation(
          omit(['details'], situation),
          false,
          answeredQuestions,
        ),
        objectif: objectif,
      },
      'url',
      true,
    )

  return (
    <ButtonsGroup
      alignment="left"
      inlineLayoutWhen="always"
      buttons={
        expanded
          ? [
              {
                children: 'Trouver mon conseiller local',

                linkProps: {
                  href: '',
                  onClick: () => {
                    setIsOpenConseiller(!isOpenConseiller)
                    push([
                      'trackEvent',
                      'Simulateur Principal',
                      'Clic',
                      'trouver conseiller',
                    ])
                  },
                },
              },
              {
                priority: expanded && 'secondary',
                children: expanded ? (
                  'Revenir à la liste des aides'
                ) : [
                    'MPR . accompagnée',
                    'denormandie',
                    "CEE . rénovation d'ampleur",
                  ].includes(dottedName) ? (
                  <>
                    <Image
                      src={iconCalculator}
                      alt="icone calculatrice"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Calculer le montant d'aides
                  </>
                ) : (
                  `En savoir plus ${!isMobile && `sur ${rules[dottedName]?.marque}`}`
                ),
                linkProps: {
                  href: expanded ? backUrl : detailUrl,
                  onClick: () => {
                    !expanded &&
                      push([
                        'trackEvent',
                        'Simulateur Principal',
                        'Détails',
                        dottedName,
                      ])
                  },
                  iconId:
                    !expanded && 'fr-icon-arrow-right-line fr-btn--icon-right',
                },
              },
            ]
          : [
              {
                priority: expanded && 'secondary',
                children: expanded ? (
                  'Revenir à la liste des aides'
                ) : [
                    'MPR . accompagnée',
                    'denormandie',
                    "CEE . rénovation d'ampleur",
                  ].includes(dottedName) ? (
                  <>
                    <Image
                      src={iconCalculator}
                      alt="icone calculatrice"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Calculer le montant d'aides
                  </>
                ) : (
                  `En savoir plus ${!isMobile && `sur ${rules[dottedName]?.marque}`}`
                ),
                linkProps: {
                  href: expanded ? backUrl : detailUrl,
                  onClick: () => {
                    !expanded &&
                      push([
                        'trackEvent',
                        'Simulateur Principal',
                        'Détails',
                        dottedName,
                      ])
                  },
                  iconId:
                    !expanded && 'fr-icon-arrow-right-line fr-btn--icon-right',
                },
              },
            ]
      }
    />
  )
}
