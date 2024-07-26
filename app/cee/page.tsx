import { InternalLink, Main, MiseEnAvant, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'

export const metadata: Metadata = {
  title: "Certificats d'économie d'énergie (CEE)",
  description: "Les aides des fournisseurs d'énergie.",
}

export default function CEE() {
    const allRulesCEE = Object.keys(rules).filter((item) => item.startsWith('gestes') && item.endsWith("CEE"))
    const distinctRulesCEE = []
    allRulesCEE.forEach((item) => {
        const value = rules[item].code
        if (!distinctRulesCEE.find((item) => rules[item].code == value)) {
            distinctRulesCEE.push(item)
        }
    });

    return (
    <Main>
      <Section>
        <h2>Les Certificats d'économie d'énergie (CEE)</h2>
          <MiseEnAvant>
            <h3>Vous êtes éligiblie à l'aide CEE si:</h3>
            <ul>
              <li>vous êtes <strong>propriétaire ou locataire</strong></li>
              <li>le logement a été <strong>construit depuis plus de 2 ans.</strong></li>
              <li>il s'agit de votre <strong>résidence principale ou secondaire</strong>.</li>
            </ul>
            <p style={css`margin: 1rem 0;`}>Il n'y a <strong>pas de plafond de ressources à respecter</strong>, mais le montant de l'aide CEE peut varier en fonction de vos revenus.</p>
        </MiseEnAvant>

        <h3>Calculateurs d'aide CEE concernant la rénovation énergétique des logements</h3>
        <ul>
        { distinctRulesCEE
            .sort((a, b) => {
              const codeA = rules[a].code.toUpperCase(); // Ignore case for consistent sorting
              const codeB = rules[b].code.toUpperCase();
              if (codeA < codeB) return -1;
              if (codeA > codeB) return 1;
              return 0;
          })
            .map((rule, index) => {
              return (
                  <li style={css`margin: 1rem 0;`} key={index}><InternalLink href={`/cee/${rules[rule].code}/${rules[rule].titre}`}><strong>{rules[rule].code}</strong>: {rules[rule].titre}</InternalLink></li>
              )
        })}
        </ul>
      </Section>
    </Main>
  )
}
