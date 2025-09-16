export const ampleurQuestionsAnswered = (answeredQuestions) =>
  userInputDottedNames
    .filter(
      (dottedName) =>
        !['ménage . région . IdF', 'logement . région . IdF'].includes(
          dottedName,
        ),
    )
    .every((dottedName) => answeredQuestions.includes(dottedName)) &&
  (answeredQuestions.includes('ménage . région . IdF') ||
    answeredQuestions.includes('logement . région . IdF'))

export const userInputDottedNames = [
  'vous . propriétaire . statut',
  'logement . résidence principale locataire',
  'logement . résidence principale propriétaire',
  'logement . propriétaire occupant',
  'ménage . personnes',
  'ménage . région . IdF',
  'logement . région . IdF',
  'ménage . revenu',
]

export const usageLogementValues = [
  {
    valeur: 1,
    titre: 'Votre résidence principale',
    situation: {
      'vous . propriétaire . statut': '"acquéreur"',
      'logement . résidence principale locataire': 'non',
      'logement . résidence principale propriétaire': 'oui',
      'logement . propriétaire occupant': 'oui',
    },
  },
  {
    valeur: 2,
    titre: 'La résidence principale de votre locataire',
    situation: {
      'vous . propriétaire . statut': '"acquéreur"',
      'logement . résidence principale locataire': 'oui',
      'logement . résidence principale propriétaire': 'non',
      'logement . propriétaire occupant': 'non',
    },
  },
  {
    valeur: 3,
    titre: 'Votre résidence secondaire',
    situation: {
      'vous . propriétaire . statut': '"acquéreur"',
      'logement . résidence principale locataire': 'non',
      'logement . résidence principale propriétaire': 'non',
      'logement . propriétaire occupant': 'oui',
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
