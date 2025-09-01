'use client'
import useIsInIframe from '@/components/useIsInIframe'
import DPELabel from '@/components/dpe/DPELabel'
import React from 'react'
import Badge from '@codegouvfr/react-dsfr/Badge'

export default function HomepageTestimonies() {
  const isInIFrame = useIsInIframe()

  const testimonials = [
    {
      title: 'Myriam, veut rénover sa résidence principale',
      shortText:
        "Myriam est propriétaire de la petite maison dans laquelle elle vit avec ses deux enfants, près d'une grande ville et ne connaît pas le DPE actuel de sa maison.",
      moreText: (
        <>
          Dans le simulateur Mes Aides Réno, elle renseigne un revenu fiscal de{' '}
          <strong>28 000 €</strong>. Elle découvre qu'elle pourrait prétendre à
          des aides et même{' '}
          <strong>une avance pour la rénovation énergétique</strong> de son
          logement. Pour commencer, elle pense installer un chauffe-eau solaire
          (
          <Badge noIcon severity="success">
            3 000 €
          </Badge>{' '}
          d'aides), et peut-être en profiter pour isoler les murs par
          l'extérieur (
          <Badge noIcon severity="success">
            60 €/m² isolé
          </Badge>{' '}
          d'aides). Pour aller plus loin, elle prend contact avec la conseillère
          France Rénov' proche de chez elle qui lui propose un{' '}
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
          Elle renseigne son revenu fiscal (<strong>30 000 €</strong>) dans le
          simulateur Mes Aides Réno. Elle constate qu'elle pourrait bénéficier
          de{' '}
          <Badge noIcon severity="success">
            42 000 €
          </Badge>{' '}
          d'aides (dont une avance) pour faire une rénovation d'ampleur, et
          ainsi louer un logement plus confortable et économe. Surtout, elle est
          rassurée de découvrir qu'elle pourra{' '}
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
          Avec leur revenu fiscal de <strong>71 000 €</strong>, ils pensaient
          n'être éligibles à aucune aide. Après avoir fait le test sur le
          simulateur Mes Aides Réno, ils constatent qu'ils peuvent prétendre à
          des aides de l'État importantes :{' '}
          <strong>30 % du coût des travaux</strong> en cas d'une rénovation
          d'ampleur avec un plafond de <strong>70 000 €</strong> de travaux.
          C'est donc{' '}
          <Badge noIcon severity="success">
            21 000 €
          </Badge>{' '}
          auxquels ils ont droit pour améliorer l'efficacité énergétique de leur
          future maison. Ils ont aussi droit à un accompagnement par un
          professionnel, en partie financé par les aides. Le DPE de leur maison
          passerait ainsi de la classe <DPELabel index="5" /> à la classe{' '}
          <DPELabel index="1" />.
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
          revenu fiscal de{' '}
          <Badge noIcon severity="success">
            37 000 €
          </Badge>{' '}
          l'année dernière, le simulateur Mes Aides Réno leur indique que{' '}
          <strong>60% du coût des travaux</strong> de rénovation énergétique
          d'ampleur peut être pris en charge par l'État, dans la limite de{' '}
          <strong>40 000 €</strong> de travaux. Cela signifie qu'ils pourront
          bénéficier de{' '}
          <Badge noIcon severity="success">
            24 000 €
          </Badge>{' '}
          d'aides. Ils décident de{' '}
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
        <h2 className="fr-mt-5v">Histoires d'usagers</h2>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--top fr-grid-row--center">
          {testimonials.map((testimonial, index) => (
            <div className="fr-col-12 fr-col-md-6" key={index}>
              <div className="fr-callout">
                <h3 className="fr-callout__title">{testimonial.title}</h3>
                <details className="fr-callout__body">
                  <summary>{testimonial.shortText}</summary>
                  {testimonial.moreText}
                </details>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  )
}
