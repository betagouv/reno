'use client'
import React, { useState } from 'react'
import { AccordionTitle } from '@/components/UI'
import APIDemo from './APIDemo'

export default function AccordionComponent() {
  const [activeSection, setActiveSection] = useState('accompagne')

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <div>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'accompagne'}
          aria-controls="accordion-accompagne"
          onClick={() => toggleSection('accompagne')}
        >
          MaPrimeRénov' - Parcours accompagné
        </AccordionTitle>
        {activeSection === 'accompagne' && (
          <div id="accordion-accompagne">
            <APIDemo type="mpra" />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'geste'}
          aria-controls="accordion-geste"
          onClick={() => toggleSection('geste')}
        >
          MaPrimeRénov' - Parcours par geste
        </AccordionTitle>
        {activeSection === 'geste' && (
          <div id="accordion-geste">
            <APIDemo type="mprg" />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'copro'}
          aria-controls="accordion-copro"
          onClick={() => toggleSection('copro')}
        >
          MaPrimeRénov' - Copropriété
        </AccordionTitle>
        {activeSection === 'copro' && (
          <div id="accordion-copro">
            <APIDemo type="copropriete" />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'category-mpr'}
          aria-controls="accordion-category-mpr"
          onClick={() => toggleSection('category-mpr')}
        >
          MaPrimeRénov' - Catégorie de revenus
        </AccordionTitle>
        {activeSection === 'category-mpr' && (
          <div id="accordion-category-mpr">
            <APIDemo type="category-mpr" />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'ptz'}
          aria-controls="accordion-ptz"
          onClick={() => toggleSection('ptz')}
        >
          Éco-prêt à taux zéro (Éco-PTZ)
        </AccordionTitle>
        {activeSection === 'ptz' && (
          <div id="accordion-ptz">
            <APIDemo type="ptz" />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'par'}
          aria-controls="accordion-par"
          onClick={() => toggleSection('par')}
        >
          Prêt avance rénovation - 0 %
        </AccordionTitle>
        {activeSection === 'par' && (
          <div id="accordion-par">
            <APIDemo type="par" />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'denormandie'}
          aria-controls="accordion-denormandie"
          onClick={() => toggleSection('denormandie')}
        >
          Denormandie - Réduction d'impôt location
        </AccordionTitle>
        {activeSection === 'denormandie' && (
          <div id="accordion-denormandie">
            <APIDemo type="denormandie" />
          </div>
        )}
      </section>

      <section>
        <AccordionTitle
          aria-expanded={activeSection === 'cee'}
          aria-controls="accordion-cee"
          onClick={() => toggleSection('cee')}
        >
          CEE
        </AccordionTitle>
        {activeSection === 'cee' && (
          <div id="accordion-cee">
            <APIDemo type="cee" />
          </div>
        )}
      </section>
    </div>
  )
}
