import { InternalLink, Main, MiseEnAvant, Section, Card } from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import Image from 'next/image'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'

export const metadata: Metadata = {
  title: "Coup de Pouce Chauffage",
  description: "Les aides des fournisseurs d'énergie pour le Coup de Pouce Chauffage.",
}

export default function CoupDePouce() {
    const distinctRulesCoupDePouce = Object
                                        .keys(rules)
                                        .filter((item) => item.startsWith('gestes') && item.endsWith("Coup de pouce"))
                                        .map((item) => item.replace(" . Coup de pouce", ""))

    return (
    <Main>
      <Section>
        <div style={css`display: flex;margin-bottom: 1rem;`}>
          <Image src={coupDePouceImage} alt="Logo Coup de Pouce" width="100" />
          <h2 style={css`margin-left: 1rem;`}>Coup de Pouce chauffage</h2>
        </div>
        <MiseEnAvant>
          <h3 style={css`color: #0063cb`}>Informations</h3>
          <p style={css`margin: 1rem 0;`}>Vous êtes éligible à cette aide si:</p>
          <ul>
            <li>vous êtes <strong>propriétaire ou locataire</strong> d'une <strong>résidence principale ou secondaire</strong>.</li>
            <li>le logement a été <strong>construit depuis plus de 2 ans.</strong></li>
            <li>vous remplacez une chaudière individuelle <strong>au charbon, au fioul ou au gaz</strong></li>
          </ul>
          <p style={css`margin: 1rem 0;`}>Il n'y a <strong>pas de plafond de ressources à respecter</strong>, mais le montant de l'aide Coup de Pouce varie en fonction de vos revenus.</p>
          <p>Ce dispositif est cumulable avec <InternalLink href="/aides/ma-prime-renov" title="Liste des aides MaPrimeRénov'"><strong>MaPrimeRénov (parcours par geste)</strong></InternalLink> et <strong>l’éco-prêt à taux zéro</strong>. En revanche, il n'est pas cumulable avec <InternalLink href="/aides/cee" title="Liste des aides CEE"><strong>les aides CEE "classiques"</strong></InternalLink></p>
        </MiseEnAvant>
        <h3>Calculateurs des aides "Coup de pouce Chauffage"</h3>
        <div>
          <Card>
            <ul style={css`list-style-position: inside;`}>
              { distinctRulesCoupDePouce.map((rule, index) => (
                  <li style={css`margin: 1rem 0;`} key={index}>
                    <InternalLink href={`/aides/coup-de-pouce/${encodeURIComponent(rules[rule].titre)}`}>
                      Remplacement d'une chaudière par <strong>{rules[rule].titre}</strong>
                    </InternalLink>
                  </li>
                ))
              }
            </ul>
          </Card>
        </div>
      </Section>
    </Main>
  )
}
