export default function enrichPersonaSituationWithTemplate(persona, personas) {
  const template =
    persona.injection != null
      ? personas.find((p) => p.gabarit === 'oui' && p.id === persona.injection)
          .situation
      : {}
  const situationWithTemplate = { ...template, ...persona.situation }
  return situationWithTemplate
}
