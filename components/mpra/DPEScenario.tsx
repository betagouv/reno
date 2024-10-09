import { motion } from 'framer-motion'
import Image from 'next/image'
import DPELabel from '../DPELabel'
import Input from '../Input'
import Value from '@/components/Value'
import { Card, PrimeStyle } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'

import calculatorIcon from '@/public/calculator-empty.svg'
import ExplicationsMPRA from './ExplicationsMPRA'
import { formatValue } from 'publicodes'

export default function DPEScenario({
  rules,
  choice,
  oldIndex,
  engine,
  situation,
  setSearchParams,
  exampleSituation,
}) {
  if (choice == null) return null

  return (
    <>
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
            background: #f7f8f8;
            padding: 1rem;
            margin: 0;
            margin: -0.25rem 0 0 0 !important; /* hack */
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

            text-align: left;
            margin: 0 1rem;
            p {
              margin: 0.6rem 0;
            }
            h3 {
              margin-top: 0.6rem;
            }
          `}
        >
          <div>
            <h3>Vers un DPE <DPELabel index={choice} /></h3>
            <p>
              Vous touchez une aide de{' '}
              <strong> {formatValue(engine.setSituation(situation).evaluate("MPR . accompagnée . pourcent dont bonus"))}</strong>
              {' '}du coût de vos travaux, jusqu'à{' '}
              <Value
                {...{
                  engine,
                  index: choice,
                  situation: {
                    ...situation,
                    'projet . travaux': 999999,
                    'projet . DPE visé': choice + 1,
                  },
                  dottedName: 'projet . travaux . plafond',
                  state: 'prime-black',
                }}
              />.
            </p>
            <div
              css={`
                label {
                  white-space: nowrap;
                }
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-top: 1rem;
                `}
              >
                <p
                  css={`
                    line-height: 1.9rem;
                  `}
                >
                  Par exemple : pour une enveloppe de travaux de rénovation
                  énergétique de{' '}
                  <label>
                    <Input
                      css={`
                        vertical-align: text-bottom;
                        padding: 0.2rem 0.3rem 0 0;
                        max-width: 6rem !important;
                      `}
                      autoFocus={false}
                      value={exampleSituation['projet . travaux']}
                      placeholder="mes travaux"
                      min="1000"
                      onChange={(rawValue) => {
                        const value = +rawValue === 0 ? undefined : rawValue
                        setSearchParams(
                          encodeSituation({
                            'projet . travaux': value,
                          }),
                          'replace',
                          false,
                        )
                      }}
                      step="1000"
                      css={`
                        border-bottom: 2px solid #d1d1fb !important;
                      `}
                    />
                    €{' '}
                    <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                      HT
                    </span>
                  </label>
                  <span>, soit </span>
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: {
                        ...exampleSituation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: 'projet . travaux . TTC',
                      state: 'prime-black',
                    }}
                  />
                  <span title="En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                    {' '}
                    TTC
                  </span>
                  <span>, je toucherai un total d'aides de </span>
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: {
                        ...exampleSituation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: 'ampleur . montant',
                      state: 'prime-black',
                    }}
                  />
                  , ce qui me laissera un reste à charge de{' '}
                  <Value
                    {...{
                      engine,
                      choice,
                      situation: {
                        ...exampleSituation,
                        'projet . DPE visé': choice + 1,
                      },
                      dottedName: 'projet . investissement',
                      state: 'prime-black',
                    }}
                  />
                  .
                </p>
              </div>
            </div>
          </div>
          {/* <ExplicationsMPRA
            {...{ engine, situation, choice, setSearchParams }}
          /> */}
        </Card>
      </motion.div>
    </>
  )
}
