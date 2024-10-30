export const usageLogementValues = [
  {
    valeur: 1,
    titre: 'Votre résidence principale',
    situation: {
      'vous . propriétaire . statut': '"acquéreur"',
      'logement . résidence principale propriétaire': 'oui',
      'vous . propriétaire occupant': 'oui',
    },
  },
  {
    valeur: 2,
    titre: 'La résidence principale de votre locataire',
    situation: {
      'vous . propriétaire . statut': '"acquéreur"',
      'logement . résidence principale locataire': 'oui',
      'logement . résidence principale propriétaire': 'non',
      'vous . propriétaire occupant': 'non',
    },
  },
  {
    valeur: 3,
    titre: 'Votre résidence secondaire',
    situation: {
      'vous . propriétaire . statut': '"acquéreur"',
      'logement . résidence principale locataire': 'non',
      'logement . résidence principale propriétaire': 'non',
      'vous . propriétaire occupant': 'oui',
    },
  },
]

export const usageLogement = (userSituation) => {
  const found = usageLogementValues.find(({ situation }) =>
    Object.entries(situation).every(([k, v]) => userSituation[k] === v),
  )
  if (found) return found.valeur
  else return 1
}
