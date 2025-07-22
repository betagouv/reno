'use client'
import { Key } from '@/components/explications/ExplicationUI'
import useIsInIframe from '@/components/useIsInIframe'
import { useState } from 'react'
import DPELabel from '@/components/dpe/DPELabel'
import { Tile } from '@codegouvfr/react-dsfr/Tile'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { push } from '@socialgouv/matomo-next'
import React from 'react'

export default function HomepageTestimonies() {
  const isInIFrame = useIsInIframe()
  const [expanded, setExpanded] = useState({})
  const toggleExpand = (index) => {
    setExpanded((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  const testimonials = [
    {
      title: 'Myriam, veut rénover sa résidence principale',
      shortText:
        "Myriam est propriétaire de la petite maison dans laquelle elle vit avec ses deux enfants, près d'une grande ville et ne connaît pas le DPE actuel de sa maison.",
      moreText: (
        <>
          Dans le simulateur Mes Aides Réno, elle renseigne un revenu fiscal de{' '}
          <Key $state={'final'}>28 000 €</Key>. Elle découvre qu'elle pourrait
          prétendre à des aides et même{' '}
          <strong>une avance pour la rénovation énergétique</strong> de son
          logement. Pour commencer, elle pense installer un chauffe-eau solaire
          (<Key $state={'prime'}>3 000 €</Key> d'aides), et peut-être en
          profiter pour isoler les murs par l'extérieur (
          <Key $state={'prime'}>60 €/m² isolé</Key> d'aides). Pour aller plus
          loin, elle prend contact avec la conseillère France Rénov' proche de
          chez elle qui lui propose un{' '}
          <strong>rendez-vous d'une heure gratuit</strong> et indépendant.
        </>
      ),
      matomoAnchor: 'renover RP sans dpe',
    },
    {
      title: 'Véronique, cherche à acheter un appartement pour de la location',
      shortText: (
        <>
          Véronique voudrait réaliser un investissement locatif dans une grande
          ville. Elle regarde du côté des appartements classés en passoire
          énergétique (DPE <DPELabel index="5" /> ou <DPELabel index="6" />
          ).
        </>
      ),
      moreText: (
        <>
          Ces appartements sont proposés à des prix bien inférieurs au marché.
          Elle renseigne son revenu fiscal (<Key $state={'final'}>30 000 €</Key>
          ) dans le simulateur Mes Aides Réno. Elle constate qu'elle pourrait
          bénéficier de <Key $state={'prime'}>42 000 €</Key> d'aides (dont une
          avance) pour faire une rénovation d'ampleur, et ainsi louer un
          logement plus confortable et économe. Surtout, elle est rassurée de
          découvrir qu'elle pourra{' '}
          <strong>bénéficier d'un accompagnement par un professionnel</strong>,
          en partie financé par les aides.
        </>
      ),
      matomoAnchor: 'renover investissement',
    },
    {
      title: 'Linda et Jérémy, veulent rénover leur future longère',
      shortText: (
        <>
          Ce jeune couple souhaite quitter la ville pour s'installer à la
          campagne. Ils ont repéré une maison qui a un charme fou. Problème :
          elle a un DPE classé <DPELabel index="5" />, c'est une passoire
          thermique.
        </>
      ),
      moreText: (
        <>
          Avec leur revenu fiscal de <Key $state={'final'}>71 000 €</Key>, ils
          pensaient n'être éligibles à aucune aide. Après avoir fait le test sur
          le simulateur Mes Aides Réno, ils constatent qu'ils peuvent prétendre
          à des aides de l'État importantes :{' '}
          <Key $state={`prime`}>30 % du coût des travaux</Key> en cas d'une
          rénovation d'ampleur avec un plafond de{' '}
          <Key $state={`final`}>70 000 €</Key> de travaux. C'est donc{' '}
          <Key $state={`prime`}>21 000 €</Key> auxquels ils ont droit pour
          améliorer l'efficacité énergétique de leur future maison. Ils ont
          aussi droit à un accompagnement par un professionnel, en partie
          financé par les aides. Le DPE de leur maison passerait ainsi de la
          classe <DPELabel index="5" /> à la classe <DPELabel index="1" />.
        </>
      ),
      matomoAnchor: 'renover passoire',
    },
    {
      title:
        "Mylène, Mehdi et leur jeune enfant, viennent d'acheter l'appartement qu'ils louent actuellement",
      shortText:
        "Mylène, Mehdi et leur fille louent un bel appartement ancien dans le centre d'une grande ville, qu'ils ont pu acheter.",
      moreText: (
        <>
          Leur logement a un DPE classe <DPELabel index="4" />, et ils
          aimeraient profiter de leur achat pour en améliorer le confort d'été
          et <strong>diminuer leurs factures d'électricité</strong>. Avec leur
          revenu fiscal de <Key $state={`final`}>37 000 €</Key> l'année
          dernière, le simulateur Mes Aides Réno leur indique que{' '}
          <Key $state={`prime`}>60% du coût des travaux</Key> de rénovation
          énergétique d'ampleur peut être pris en charge par l'État, dans la
          limite de <Key $state={`final`}>40 000 €</Key> de travaux. Cela
          signifie qu'ils pourront bénéficier de{' '}
          <Key $state={`prime`}>24 000 €</Key> d'aides. Ils décident de{' '}
          <strong>
            prendre contact avec l'espace France Rénov' le plus proche
          </strong>{' '}
          de chez eux, dont les coordonnées sont indiquées à la fin de la
          simulation.
        </>
      ),
      matomoAnchor: 'renover appartement ville',
    },
  ]

  return (
    !isInIFrame && (
      <>
        <h2>Histoires d'usagers</h2>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--top fr-grid-row--center">
          {testimonials.map((testimonial, index) => (
            <div
              className="fr-col-12 fr-col-md-6"
              key={index}
              css={`
                .fr-tile__detail {
                  display: block;
                  text-align: start;
                }
              `}
            >
              <Tile
                desc={
                  <>
                    {testimonial.shortText}
                    <div
                      css={`
                        text-align: end;
                        margin-top: 1em;
                      `}
                    >
                      <Button
                        iconId="fr-icon-money-euro-circle-line"
                        onClick={() => {
                          toggleExpand(index)
                          push([
                            'trackEvent',
                            'Home',
                            'Clic',
                            testimonial.matomoAnchor,
                          ])
                        }}
                        priority="tertiary"
                      >
                        Voir ses aides
                      </Button>
                    </div>
                  </>
                }
                detail={expanded[index] && testimonial.moreText}
                enlargeLinkOrButton
                orientation="vertical"
                title={testimonial.title}
                titleAs="h3"
              />
            </div>
          ))}
        </div>
      </>
    )
  )
}
