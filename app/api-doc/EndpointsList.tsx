'use client'
import React from 'react'
import Endpoint from './Endpoint'
import { fr } from '@codegouvfr/react-dsfr'
import Accordion from '@codegouvfr/react-dsfr/Accordion'

const accordionSections = [
  { id: 'eligibilite', title: 'Eligibilité', componentType: 'eligibilite' },
  {
    id: 'geste',
    title: 'Aides par geste',
    componentType: 'geste',
  },
  {
    id: 'mpr-accompagne',
    title: "MaPrimeRénov' - Parcours Accompagné",
    componentType: 'mpra',
  },
  {
    id: 'mpr-geste',
    title: "MaPrimeRénov' - Rénovation par geste",
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
  {
    id: 'taxe-fonciere',
    title: 'Taxe foncière',
    componentType: 'taxe fonciere',
  },
]

export default function EndpointsList() {
  return (
    <div className={fr.cx('fr-accordions-group')}>
      {accordionSections.map(({ id, title, componentType }) => (
        <Accordion key={id} label={title}>
          <Endpoint type={componentType} />
        </Accordion>
      ))}
    </div>
  )
}
