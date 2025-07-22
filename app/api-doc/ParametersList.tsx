'use client'
import rules from '@/app/règles/rules'
import React from 'react'
import { Accordion } from '@codegouvfr/react-dsfr/Accordion'
import { parse } from 'marked'

export default function ParametersList() {
  const parametresData = [
    {
      title: 'denormandie . années de location',
      description: parse(rules['denormandie . années de location'].description),
      values: ['entier numérique'],
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
      title: 'logement . période de construction',
      values: [
        'moins de 2 ans',
        'de 2 à 10 ans',
        'de 10 à 15 ans',
        'au moins 15 ans',
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
      description: parse(rules["parcours d'aide"].description),
      values: [
        'rénovation énergétique',
        'autonomie de la personne',
        'sécurité salubrité',
      ],
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

  return parametresData.map(({ title, description, values }, index) => (
    <Accordion key={index} label={title}>
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
    </Accordion>
  ))
}
