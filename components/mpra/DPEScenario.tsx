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
  setSearchParams,
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
          padding: 1rem;
          margin: 0;
          margin-top: -0.25rem; /* hack */
          z-index: 42;
          position: relative;
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
            Vous touchez une aide de{' '}
            <Value
              {...{
                engine,
                index: choice,
                situation: {
                  ...situation,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'MPR . accompagnée . pourcent dont bonus',
              }}
            />{' '}
            du coût de vos travaux, jusqu'à{' '}
            <Value
              {...{
                engine,
                index: choice,
                situation: {
                  ...situation,

                  'projet . investissement': 999999,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'MPR . accompagnée . montant',
              }}
            />
            .
          </p>
          <div
            css={`
              label {
                white-space: nowrap;
              }
            `}
          >
            <p>
              Par exemple : si vous apportez{' '}
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
              <span>
                , vous pourrez entreprendre des travaux d'un montant total de{' '}
              </span>
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
              HT.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
