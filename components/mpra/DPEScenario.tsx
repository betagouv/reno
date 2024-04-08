import { motion } from 'framer-motion'
import DPELabel from '../DPELabel'
import Input from '../Input'
import { Avance, Value } from '../ScenariosSelector'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'
import Image from 'next/image'

export default function DPEScenario({
  rules,
  choice,
  oldIndex,
  engine,
  situation,
}) {
  if (choice == null) return null

  return (
    <motion.div
      initial={{ x: -30, scale: 1 }}
      animate={{ x: 0, scale: 1 }}
      key={choice}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <Card
        css={`
          background: var(--lighterColor2);
          padding: 1rem;
          margin: 1rem auto;
          text-align: center;
          input {
            width: 8rem; /* width of "votre apport"*/
            height: 1.6rem !important;
            text-align: right;
            margin-left: 0.2rem;
          }
          max-width: 100%;
          img {
            width: 3.5rem;
            height: auto;
            margin-right: 1rem;
          }
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          flex-wrap: wrap;
        `}
      >
        <Image
          src="/investissement.svg"
          width="30"
          height="30"
          alt="Icône représentant votre apport personnel qui sera complété par les aides"
        />
        <div
          css={`
            text-align: left;
            max-width: 40rem;
            p {
              margin: 0.6rem 0;
            }
          `}
        >
          <h3>
            Vers un DPE <DPELabel index={choice} />
          </h3>

          <p>
            Vous engagez des travaux permettant de sauter{' '}
            <strong>{-choice + oldIndex} classes DPE</strong> : vous avez droit
            à une aide de{' '}
            <Value
              {...{
                engine,
                index: choice,
                situation: {
                  ...situation,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'MPR . accompagnée . pourcent dont bonus',
                state: 'emphasize',
              }}
            />{' '}
            qui s'appliquera à un montant maximum de travaux de{' '}
            <Value
              {...{
                engine,
                index: choice,
                situation: {
                  ...situation,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'projet . travaux . plafond',
                state: 'emphasize',
              }}
            />
            .
          </p>
          <div
            css={`
              margin-top: 2.5vh;
              border-left: 8px solid var(--lighterColor0);
              padding-left: 0.8rem;
              label {
                white-space: nowrap;
              }
            `}
          >
            <p>
              Par exemple : avec un apport personnel de{' '}
              <label>
                <Input
                  autoFocus={false}
                  value={situation['projet . investissement'] || undefined}
                  placeholder="votre apport"
                  onChange={(rawValue) => {
                    const value = +rawValue === 0 ? undefined : rawValue
                    setSearchParams(
                      encodeSituation({
                        'projet . investissement': value,
                      }),
                      'replace',
                      false,
                    )
                  }}
                  step="100"
                />
                &nbsp;€
              </label>
              <span>, vous pourrez obtenir une aide de </span>
              <Value
                {...{
                  engine,
                  choice,
                  situation: {
                    ...situation,
                    'projet . DPE visé': choice + 1,
                  },
                  dottedName: 'MPR . accompagnée . montant avant écrêtement',
                }}
              />
              .
            </p>
            <p>
              Votre budget total pour réaliser des travaux sera alors de{' '}
              <Value
                {...{
                  engine,
                  choice,
                  situation: {
                    ...situation,
                    'projet . DPE visé': choice + 1,
                  },
                  dottedName: 'projet . travaux',
                }}
              />{' '}
              HT .
            </p>
          </div>
          <section
            css={`
              margin-top: 4vh !important;
            `}
          >
            <h4>💡 À savoir :</h4>
            <ul>
              <li key="avance">
                <Avance {...{ engine, rules, situation, choice }} />
              </li>
              <li key="écrêtement">
                <p>
                  Le montant total de vos aides ne peut pas dépasser{' '}
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: {
                        ...situation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: "MPR . accompagnée . pourcent d'écrêtement",
                      state: 'none',
                    }}
                  />{' '}
                  de la dépense TTC (par exemple{' '}
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: {
                        ...situation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: 'projet . travaux . TTC',
                      state: 'none',
                    }}
                  />{' '}
                  pour une TVA à 5,5 %, soit une aide maximale de{' '}
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: {
                        ...situation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: 'MPR . accompagnée . montant',
                      state: 'none',
                    }}
                  />
                  ).
                </p>
              </li>
            </ul>
          </section>
        </div>
      </Card>

      <Card
        css={`
          display: flex;
          align-items: center;
          img {
            width: 4rem;
            height: auto;
            margin-right: 1rem;
          }
        `}
      >
        <Image
          src="/ptz.svg"
          alt="Icône représentant le prêt à taux zéro"
          width="10"
          height="10"
        />
        <div>
          <p>
            En cas de besoin, un éco-prêt à taux zéro vous permet d'emprunter 50
            000 €.
          </p>
          <p>
            Avec ce prêt, vous devrez avoir à disposition{' '}
            <Value
              {...{
                engine,
                choice,
                situation: {
                  ...situation,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'somme à engager',
              }}
            />{' '}
            € pour lancer les travaux, et rembourser une somme mensuelle sur une
            durée d'emprunt d'au maximum 20 ans.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
