'use client'
import React, { useState } from 'react'
import { AccordionTitle } from '@/components/UI'
import APIDemo from './APIDemo'

const accordionSections = [
  { id: 'eligibilite', title: 'Eligibilité', componentType: 'eligibilite' },
  {
    id: 'mpr-accompagne',
    title: "MaPrimeRénov' - Parcours accompagné",
    componentType: 'mpra',
  },
  {
    id: 'geste',
    title: 'Aides par geste',
    componentType: 'geste',
  },
  {
    id: 'mpr-geste',
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
