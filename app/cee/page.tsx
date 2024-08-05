import { InternalLink, Main, MiseEnAvant, Section, Badge, BlocAide, Card } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import Image from 'next/image'
import ceeImage from '@/public/cee.svg'
import { categoriesGeste } from '@/components/utils'


export const metadata: Metadata = {
  title: "Certificats d'économie d'énergie (CEE)",
  description: "Les aides des fournisseurs d'énergie.",
}

export default function CEE() {
    const allRulesCEE = Object.keys(rules).filter((item) => item.startsWith('gestes') && item.endsWith("CEE"))
    const distinctRulesCEE: string[] = []

    allRulesCEE.forEach((item) => {
        const value = rules[item].code
        if (!distinctRulesCEE.find((item) => rules[item].code == value)) {
          distinctRulesCEE.push(item)
        }
    });

    const rulesByCategory = Object.fromEntries(categoriesGeste.map(category => [category.titre, []]));
    distinctRulesCEE.forEach((rule) => {
      for (const category of categoriesGeste) {
        if (rule.includes(category.code)) {
          rulesByCategory[category.titre].push(rule);
          break;
        }
      }
    });

    return (
    <Main>
      <Section>
        <div style={css`display: flex;margin-bottom: 1rem;`}>
          <Image src={ceeImage} alt="Logo CEE" width="100" />
          <h2 style={css`margin-left: 1rem;`}>Les Certificats d'économie d'énergie (CEE)</h2>
        </div>
        <MiseEnAvant>
            <h3 style={css`color: #0063cb`}>Informations</h3>
            <p>Vous êtes éligible à l'aide CEE si:</p>
            <ul>
              <li>vous êtes <strong>propriétaire ou locataire</strong></li>
              <li>le logement a été <strong>construit depuis plus de 2 ans.</strong></li>
              <li>il s'agit de votre <strong>résidence principale ou secondaire</strong>.</li>
            </ul>
            <p style={css`margin: 1rem 0;`}>Il n'y a <strong>pas de plafond de ressources à respecter</strong>, mais le montant de l'aide CEE peut varier en fonction de vos revenus.</p>
        </MiseEnAvant>

        <h3>Calculateurs d'aide CEE concernant la rénovation énergétique des logements</h3>
        <div>
          { Object.keys(rulesByCategory).map((category) => (
            <Card>
              <div style={css`display: flex;align-items: flex-start;`}>
                <Image src={categoriesGeste.find((c) => c.titre == category).icone} alt={`icone ${category}`} width="60" />
                <div>
                  <h3 style={css`margin-top:1rem;padding-left: 1.6rem;`}>{category}</h3>
                  <ul style={css`list-style-position: inside;`}>
                    { rulesByCategory[category].map((rule, index) => (
                        <li style={css`margin: 1rem 0;`} key={index}>
                          <InternalLink href={`/cee/${rules[rule].code}/${encodeURIComponent(rules[rule].titre)}`}>{rules[rule].titre}</InternalLink>
                          {" "}
                          <Badge><small>{rules[rule].code}</small></Badge>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
              
            </Card>
        ))}
        </div>
      </Section>
    </Main>
  )
}
