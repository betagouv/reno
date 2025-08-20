'use client'

import Image from 'next/image'
import { decodeDottedName, encodeDottedName } from './publicodes/situationUtils'
import { categories } from './utils'
import { getTravauxEnvisages } from './ChoixTravaux'

export default function ChoixCategorieTravaux({ situation, setSearchParams }) {
  const rule = 'projet . définition . catégories travaux envisagées'
  const categoriesCochees =
    situation[rule]?.replaceAll('"', '').split(',') || []
  const handleCheckCategorie = (categorie) => {
    // Si l'on décoche une catégorie, on enlève également ses travaux associées (cas où l'user fait "retour")
    let params = {}
    if (
      categoriesCochees.includes(categorie) &&
      getTravauxEnvisages(situation)
    ) {
      const travauxEnvisages = getTravauxEnvisages(situation)
      const newTravauxEnvisages = travauxEnvisages.filter((t) => {
        return !Object.keys(
          categories.find((c) => c.code == categorie).gestes,
        ).find((geste) => geste.includes(decodeDottedName(t)))
      })

      params[encodeDottedName('projet . définition . travaux envisagés')] =
        newTravauxEnvisages.length
          ? '"' + newTravauxEnvisages.join(',') + '"'
          : undefined
    }

    const newCategories = categoriesCochees.includes(categorie)
      ? categoriesCochees.filter((c) => c !== categorie)
      : [...categoriesCochees, categorie]
    params[encodeDottedName(rule)] = newCategories.length
      ? '"' + newCategories.join(',') + '"'
      : undefined
    setSearchParams(params, 'push', false)
  }

  return categories
    .filter((c) => c.code != 'autres')
    .map((c) => (
      <div className="fr-fieldset__element" key={c.code}>
        <div className="fr-custom-checkbox-group fr-checkbox-rich">
          <input
            type="checkbox"
            name="checkbox"
            id={`checkbox-${c.code}`}
            aria-describedby={`checkbox-${c.code}-messages`}
            checked={categoriesCochees.includes(c.code)}
            onChange={() => {
              handleCheckCategorie(c.code)
            }}
          />
          <label className="fr-label" htmlFor={`checkbox-${c.code}`}>
            {c.titre}
            {c.sousTitre && <span className="fr-hint-text">{c.sousTitre}</span>}
          </label>
          <div className="fr-checkbox-rich__pictogram">
            <Image src={c.image} alt={`Icone ${c.titre} d'une maison`} />
          </div>
        </div>
      </div>
    ))
}
