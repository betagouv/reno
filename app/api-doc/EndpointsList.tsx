'use client'
import React, { useState } from 'react'
import { AccordionTitle } from '@/components/UI'
import Endpoint from './Endpoint'

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
    componentType: 'MPR',
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
  { id: 'cee', title: 'CEE', componentType: 'CEE' },
]

export default function EndpointsList() {
  const [activeSection, setActiveSection] = useState('eligibilite')

  return (
    <>
      {accordionSections.map(({ id, title, content, componentType }) => (
        <section key={id}>
          <AccordionTitle
            aria-expanded={activeSection === id}
            aria-controls={`accordion-${id}`}
            onClick={() => setActiveSection(activeSection === id ? null : id)}
          >
            {title}
          </AccordionTitle>
          <div
            id={`accordion-${id}`}
            css={`
              display: ${activeSection === id ? 'block' : 'none'};
              border: 1px solid #ddd;
              padding: 1rem;
              border-top: 0px;
              background: white;
            `}
          >
            <Endpoint type={componentType} />
          </div>
        </section>
      ))}
    </>
  )
}
