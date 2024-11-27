'use client'
import rules from '@/app/règles/rules'
import React, { useState } from 'react'
import { AccordionTitle } from '@/components/UI'
import APIDemo from './APIDemo'
import { parse } from 'marked'

const parametresData = [
  {
    title: 'vous . propriétaire . statut',
    values: ['propriétaire', 'acquéreur', 'non propriétaire'],
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
    title: 'logement . surface',
    values: ['entier numérique'],
  },
  {
    title: 'logement . type',
    values: ['maison', 'appartement'],
  },
  {
    title: 'logement . commune, ménage . commune',
    description:
      'Code INSEE de la commune de résidence (<em>ménage . commune</em>) ou du logement (<em>logement . commune</em>)',
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
    title: 'projet . travaux',
    description:
      'Le montant des travaux (HT) envisagé pour le projet de rénovation',
    values: ['entier numérique'],
  },
  {
    title: 'DPE . actuel, projet . DPE visé',
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
    title: "parcours d'aide",
    values: ['ampleur', 'à la carte'],
  },
  {
    title: 'taxe foncière . condition de dépenses',
    description: parse(
      rules['taxe foncière . condition de dépenses'].description,
    ),
    values: ['oui', 'non'],
  },
]

const accordionSections = [
  {
    id: 'parametres',
    title: 'Liste des paramètres',
    content: <ParametresSection data={parametresData} />,
  },
  { id: 'eligibilite', title: 'Eligibilité', componentType: 'eligibilite' },
  {
    id: 'accompagne',
    title: "MaPrimeRénov' - Parcours accompagné",
    componentType: 'mpra',
  },
  {
    id: 'geste',
    title: "MaPrimeRénov' - Parcours par geste",
    componentType: 'mprg',
  },
  {
    id: 'copro',
    title: "MaPrimeRénov' - Copropriété",
    componentType: 'copropriete',
  },
  {
    id: 'category-mpr',
    title: "MaPrimeRénov' - Catégorie de revenus",
    componentType: 'category-mpr',
  },
  { id: 'ptz', title: 'Éco-prêt à taux zéro (Éco-PTZ)', componentType: 'ptz' },
  { id: 'par', title: 'Prêt avance rénovation - 0 %', componentType: 'par' },
  {
    id: 'denormandie',
    title: "Denormandie - Réduction d'impôt location",
    componentType: 'denormandie',
  },
  { id: 'cee', title: 'CEE', componentType: 'cee' },
]

export default function AccordionComponent() {
  const [activeSection, setActiveSection] = useState('eligibilite')

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <>
      {accordionSections.map(({ id, title, content, componentType }) => (
        <section key={id}>
          <AccordionTitle
            aria-expanded={activeSection === id}
            aria-controls={`accordion-${id}`}
            onClick={() => toggleSection(id)}
          >
            {title}
          </AccordionTitle>
          {activeSection === id && (
            <div
              id={`accordion-${id}`}
              css={
                id === 'parametres'
                  ? 'border: 1px solid #ddd; padding: 2rem;'
                  : ''
              }
            >
              {content || <APIDemo type={componentType} />}
            </div>
          )}
        </section>
      ))}
    </>
  )
}

function ParametresSection({ data }) {
  return (
    <div>
      {data.map(({ title, description, values }, index) => (
        <div
          key={index}
          css={`
            border-bottom: 1px solid #ddd;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
          `}
        >
          <p>
            Paramètre: <strong>{title}</strong>
            <br />
            {description && (
              <div
                dangerouslySetInnerHTML={{
                  __html: 'Description: ' + description,
                }}
              />
            )}
            Valeurs possibles:
          </p>
          {values && (
            <ul>
              {values.map((value, idx) => (
                <li key={idx}>{value}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
