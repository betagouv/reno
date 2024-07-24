import { Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import Link from 'next/link';

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
        <h1>Les Certificats d'économie d'énergie (CEE)</h1>
        <p>Vous êtes éligiblie à l'aide CEE si:</p>
        <ul>
          <li>vous êtes <strong>propriétaire ou locataire</strong></li>
          <li>le logement a été <strong>construit depuis plus de 2 ans.</strong></li>
          <li>il s'agit de votre <strong>résidence principale ou secondaire</strong>.</li>
        </ul>
        <p>Il n'y a <strong>pas de plafond de ressources à respecter</strong>, mais le montant de l'aide CEE peut varier en fonction de vos revenus.</p>
        <h2>Liste des Certificats d'économie d'énergie du domaine de la rénovation énergétique</h2>
        <ul>
        { distinctRulesCEE.map((rule, index) => {
            return (
                <li key={index}><Link href={`/cee/${rules[rule].code}`}>{rules[rule].titre}</Link></li>
            )
        })}
        </ul>
      </Section>
    </Main>
  )
}
