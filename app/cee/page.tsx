import { InternalLink, Main, MiseEnAvant, Section, Badge, BlocAide } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import iconIsolation from '@/public/isolation.svg'
import iconChauffage from '@/public/chauffage.svg'
import iconVentilation from '@/public/ventilation.svg'
import iconSolaire from '@/public/solaire.svg'
import css from '@/components/css/convertToJs'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Certificats d'économie d'énergie (CEE)",
  description: "Les aides des fournisseurs d'énergie.",
}

export default function CEE() {
    const allRulesCEE = Object.keys(rules).filter((item) => item.startsWith('gestes') && item.endsWith("CEE"))
    const distinctRulesCEE = []
    const categories = [
      {
        'code': 'isolation',
        'titre': 'Isolation',
        'icone': iconIsolation
      },
      {
        'code': 'solaire',
        'titre': 'Solaire',
        'icone': iconSolaire
      },
      {
        'code': 'chauffage',
        'titre': 'Chauffage',
        'icone': iconChauffage
      },
      {
        'code': 'ventilation',
        'titre': 'Ventilation',
        'icone': iconVentilation,
      }
    ];
    allRulesCEE.forEach((item) => {
        const value = rules[item].code
        if (!distinctRulesCEE.find((item) => rules[item].code == value)) {
          distinctRulesCEE.push(item)
        }
    });

    const rulesByCategory = Object.fromEntries(categories.map(category => [category.titre, []]));
    distinctRulesCEE.forEach((rule) => {
      let categorized = false;
      for (const category of categories) {
        if (rule.includes(category.code)) {
          rulesByCategory[category.titre].push(rule);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        rulesByCategory['Autres'].push(rule);
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
        <div>
          { Object.keys(rulesByCategory).map((category) => (
            <BlocAide>
              <div style={css`display: flex;align-items: flex-start;`}>
                <Image src={categories.find((c) => c.titre == category).icone} alt={`icone $(category)}`} width="60" />
                <div>
                  <h3 style={css`padding-left: 1.6rem;`}>{category}</h3>
                  <ul style={css`list-style-position: inside;`}>
                    { rulesByCategory[category].map((rule, index) => (
                        <li style={css`margin: 1rem 0;`} key={index}><InternalLink href={`/cee/${rules[rule].code}/${rules[rule].titre}`}>{rules[rule].titre} <Badge><small>{rules[rule].code}</small></Badge></InternalLink></li>
                      ))
                    }
                  </ul>
                </div>
              </div>
              
            </BlocAide>
        ))}
        </div>
      </Section>
    </Main>
  )
}
