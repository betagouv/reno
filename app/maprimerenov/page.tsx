import { InternalLink, Main, MiseEnAvant, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'

export const metadata: Metadata = {
  title: "MaPrimeRénov'",
  description: "Les aides MaPrimeRénov' par geste.",
}

export default function MaPrimeRenov() {
    const distinctRulesMPR = Object.keys(rules)
                                   .filter((item) => item.startsWith('gestes') && item.endsWith("MPR"))
                                   .map((item) => rules[item.replace(" . MPR", '')])
    return (
    <Main>
      <Section>
        <h2>MaPrimeRénov' Parcours par geste</h2>
          <MiseEnAvant>
            <h3>Vous êtes éligiblie à l'aide MaPrimeRénov' Parcours par geste si:</h3>
            <ul>
              <li>vous êtes <strong>propriétaire (occupant ou bailleur)</strong></li>
              <li>le logement a été <strong>construit depuis plus de 15 ans.</strong></li>
              <li>le logement est <strong>occupé à titre de résidence principale</strong></li>
              <li>votre revenu fiscal de référence est inférieur à un certains montant</li>
            </ul>
            <p style={css`margin: 1rem 0;`}>Il existe un dispositif nommé <strong>MaPrimeRénov' Parcours accompagné</strong> pour les travaux d'ampleurs.</p>
        </MiseEnAvant>

        <h3>Calculateurs d'aide MaPrimeRénov' par geste</h3>
        <ul>
        { distinctRulesMPR
            .map((rule, index) => {
              return (
                  <li style={css`margin: 1rem 0;`} key={index}><InternalLink href={`/maprimerenov/${rule.titre}`}>{rule.titre}</InternalLink></li>
              )
        })}
        </ul>
      </Section>
    </Main>
  )
}
