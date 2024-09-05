"use client"
import React, { useState } from 'react';
import { AccordionTitle } from '@/components/UI';
import APIDemo from './APIDemo';

export default function AccordionComponent() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null); // Ferme la section si elle est déjà ouverte
    } else {
      setActiveSection(section); // Ouvre une nouvelle section
    }
  };

  return (
    <div>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === "accompagne"}
          aria-controls="accordion-accompagne"
          onClick={() => toggleSection("accompagne")}
        >
          Parcours accompagné
        </AccordionTitle>
        {activeSection === "accompagne" && (
          <div id="accordion-accompagne">
            <APIDemo 
              type="mpra"
              titre="MaPrimeRénov' - Parcours accompagnée"
            />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === "geste"}
          aria-controls="accordion-geste"
          onClick={() => toggleSection("geste")}
        >
          Parcours par geste
        </AccordionTitle>
        {activeSection === "geste" && (
          <div id="accordion-geste">
            <APIDemo
              type="mprg"
              titre="MaPrimeRénov' - Parcours geste" 
            />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === "copro"}
          aria-controls="accordion-copro"
          onClick={() => toggleSection("copro")}
        >
          Copropriété
        </AccordionTitle>
        {activeSection === "copro" && (
          <div id="accordion-copro">
            <APIDemo
              type="copropriete"
              titre="MaPrimeRénov' - Parcours Copropriété"
            />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === "category-mpr"}
          aria-controls="accordion-category-mpr"
          onClick={() => toggleSection("category-mpr")}
        >
          Catégorie MaPrimeRénov'
        </AccordionTitle>
        {activeSection === "category-mpr" && (
          <div id="accordion-category-mpr">
            <APIDemo
              type="category-mpr"
              titre="Catégorie MaPrimeRénov'"
            />
          </div>
        )}
      </section>
      <section>
        <AccordionTitle
          aria-expanded={activeSection === "cee"}
          aria-controls="accordion-cee"
          onClick={() => toggleSection("cee")}
        >
          Catégorie CEE
        </AccordionTitle>
        {activeSection === "cee" && (
          <div id="accordion-cee">
            <APIDemo
              type="cee"
              titre="CEE"
            />
          </div>
        )}
      </section>
    </div>
  );
}
