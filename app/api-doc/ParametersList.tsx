'use client'
import rules from '@/app/règles/rules'
import React, { useState } from 'react'
import { AccordionTitle } from '@/components/UI'
import { parse } from 'marked'

export default function ParametersList() {
  const [activeParam, setActiveParam] = useState(1)
  const parametresData = [
    {
      title: 'denormandie . années de location',
      description: parse(rules['denormandie . années de location'].description),
      values: ['6', '9', '12'],
    },
    {
      title: 'denormandie . gestes minimum',
      description: parse(rules['denormandie . gestes minimum'].description),
      values: ['oui', 'non'],
    },
    {
      title: 'DPE . actuel',
      values: [
        '1 (pour un DPE A)',
        '2 (pour un DPE B)',
        '3 (pour un DPE C)',
        '4 (pour un DPE D)',
        '5 (pour un DPE E)',
        '6 (pour un DPE F)',
        '7 (pour un DPE G)',
      ],
    },
    {
      title: 'ménage . commune',
      description: 'Code INSEE de la commune de résidence',
      values: ['75056 (pour Paris)'],
    },
    {
      title: 'ménage . personnes',
      description: 'Le nombre de personne composant le ménage',
      values: ['entier numérique'],
    },
    {
      title: 'ménage . revenus',
      description:
        'Le revenu fiscal de référence des personnes composant le ménage',
      values: ['entier numérique'],
    },
    {
      title: 'ménage . revenu . classe',
      description:
        'La classe de revenu au sens "MaPrimeRénov\'", si vous ne la connaissez pas, elle sera calculée automatiquement \
       grâce aux variables <em>ménage . commune</em>, <em>ménage . revenus</em> et <em>ménage . personnes</em>',
      values: ['très modeste', 'modeste', 'intermédiaire', 'supérieure'],
    },
    {
      title: 'logement . commune',
      description:
        'Code INSEE du logement (à ne pas confondre avec la commune de résidence du ménage)',
      values: ['75056 (pour Paris)'],
    },
    {
      title: 'logement . location longue durée',
      description: parse(rules['logement . location longue durée'].description),
      values: ['oui', 'non'],
    },
    {
      title: 'logement . période de construction',
      values: [
        'moins de 2 ans',
        'de 2 à 15 ans',
        'de 15 à 25 ans',
        'au moins 25 ans',
      ],
    },
    {
      title: 'logement . propriétaire occupant',
      description: parse(rules['logement . propriétaire occupant'].description),
      values: ['oui', 'non'],
    },
    {
      title: 'logement . résidence principale locataire',
      description: parse(
        rules['logement . résidence principale locataire'].description,
      ),
      values: ['oui', 'non'],
    },
    {
      title: "logement . prix d'achat",
      values: ['entier numérique'],
    },
    {
      title: 'logement . surface',
      values: ['entier numérique'],
    },
    {
      title: 'logement . taxe foncière',
      values: ['entier numérique'],
      description:
        'Le montant de la taxe foncière.' +
        parse(rules['logement . taxe foncière'].description),
    },
    {
      title: 'logement . type',
      values: ['maison', 'appartement'],
    },
    {
      title: "parcours d'aide",
      values: ['ampleur', 'à la carte'],
    },
    {
      title: 'projet . DPE visé',
      values: [
        '1 (pour un DPE A)',
        '2 (pour un DPE B)',
        '3 (pour un DPE C)',
        '4 (pour un DPE D)',
        '5 (pour un DPE E)',
        '6 (pour un DPE F)',
        '7 (pour un DPE G)',
      ],
    },
    {
      title: 'projet . gain énergétique',
      description: parse(rules['projet . gain énergétique'].description),
      values: ['40 %'],
    },
    {
      title: 'projet . travaux',
      description:
        'Le montant des travaux (HT) envisagé pour le projet de rénovation',
      values: ['entier numérique'],
    },
    {
      title: 'taxe foncière . condition de dépenses',
      description: parse(
        rules['taxe foncière . condition de dépenses'].description,
      ),
      values: ['oui', 'non'],
    },
    {
      title: 'vous . propriétaire . statut',
      values: ['propriétaire', 'acquéreur', 'non propriétaire'],
    },
  ]

  return (
    <div
      css={`
        margin-bottom: 1rem;
      `}
    >
      {parametresData.map(({ title, description, values }, index) => (
        <div key={index}>
          <AccordionTitle
            aria-expanded={activeParam === index}
            aria-controls={`accordion-param-${index}`}
            onClick={() => setActiveParam(activeParam == index ? null : index)}
            css={`
              border: 0;
              border-bottom: 1px solid #ddd;
              color: black;
            `}
          >
            <strong>{title}</strong>
          </AccordionTitle>
          {activeParam === index && (
            <div
              id={`accordion-param-${index}`}
              css={`
                padding: 1rem;
                border: 1px solid #ddd;
              `}
            >
              {description && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: '<u>Description:</u> ' + description,
                  }}
                />
              )}
              <u>Valeurs possibles:</u>
              {values && (
                <ul>
                  {values.map((value, idx) => (
                    <li key={idx}>{value}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
