import {
  InternalLink,
  Main,
  MiseEnAvant,
  Section,
  Badge,
  Card,
} from '@/components/UI'
import { Metadata } from 'next/types'
import rules from '@/app/règles/rules'
import css from '@/components/css/convertToJs'
import Image from 'next/image'
import ceeImage from '@/public/cee.svg'
import { categories, getRulesByCategory } from '@/components/utils'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: "Certificats d'économie d'énergie (CEE)",
  description: "Les aides des fournisseurs d'énergie.",
}

export default function CEE() {
  const rulesByCategory = getRulesByCategory(rules, 'CEE')
  return (
    <Main>
      <Section>
        <Breadcrumb
          links={[
            { 'Les aides': '/aides' },
            { "Certificats d'économie d'énergie (CEE)": '/aides/cee' },
          ]}
        />
        <div
          style={css`
            display: flex;
            margin: 1rem 0;
          `}
        >
          <Image src={ceeImage} alt="Logo CEE" width="100" />
          <h1
            style={css`
              margin-left: 1rem;
            `}
          >
            Les Certificats d'économie d'énergie (CEE)
          </h1>
        </div>
        <MiseEnAvant>
          <h3
            style={css`
              color: #0063cb;
            `}
          >
            Informations
          </h3>
          <p>
            Vous êtes éligible aux aides des fournisseurs d’énergie (certificats
            d’économies d’énergie – CEE) si :
          </p>
          <ul>
            <li>
              vous êtes <strong>propriétaire ou locataire</strong>
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 2 ans.</strong>
            </li>
            <li>
              il s'agit de votre{' '}
              <strong>résidence principale ou secondaire</strong>.
            </li>
          </ul>
          <p
            style={css`
              margin: 1rem 0;
            `}
          >
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>,
            mais le montant des aides des fournisseurs d’énergie (certificats
            d’économies d’énergie – CEE) peut varier en fonction de vos revenus.
          </p>
        </MiseEnAvant>

        <h2
          style={css`
            font-size: 130%;
          `}
        >
          Calculateurs d'aide CEE concernant la rénovation énergétique des
          logements
        </h2>
        <div>
          {Object.keys(rulesByCategory).map((category, i) => (
            <Card key={i}>
              <div
                style={css`
                  display: flex;
                  align-items: flex-start;
                `}
              >
                <Image
                  src={categories.find((c) => c.titre == category).image}
                  alt={`icone ${category}`}
                  width="60"
                />
                <div>
                  <h3
                    style={css`
                      margin-top: 1rem;
                      padding-left: 1.6rem;
                    `}
                  >
                    {category}
                  </h3>
                  <ul
                    style={css`
                      list-style-position: inside;
                    `}
                  >
                    {rulesByCategory[category].map((rule, index) => (
                      <li
                        style={css`
                          margin: 1rem 0;
                        `}
                        key={index}
                      >
                        <InternalLink
                          href={`/aides/cee/${rules[rule].code}/${encodeURIComponent(rules[rule].titre)}`}
                        >
                          {rules[rule].titre}
                        </InternalLink>{' '}
                        <Badge>
                          <small>{rules[rule].code}</small>
                        </Badge>
                      </li>
                    ))}
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
