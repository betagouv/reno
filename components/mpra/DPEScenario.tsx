import { motion } from 'framer-motion'
import DPELabel from '../DPELabel'
import Input from '../Input'
import { Value } from '../ScenariosSelector'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'
import Image from 'next/image'

import calculatorIcon from '@/public/calculator-empty.svg'

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
            margin: 0 1rem;
            p {
              margin: 0.6rem 0;
            }
            h3 {
              margin-top: 1rem;
            }
          `}
        >
          <h3>
            Vers un DPE <DPELabel index={choice} />
          </h3>

          <p>
            Une aide nationale de
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
            calculée sur un plafond de
            <Value
              {...{
                engine,
                index: choice,
                situation: {
                  ...situation,
                  'projet . DPE visé': choice + 1,
                },
                dottedName: 'projet . travaux . plafond',
              }}
            />
            , soit jusqu'à{' '}
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
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <Image
                src={calculatorIcon}
                alt="Icône calculette"
                css={`
                  width: 2.2rem !important;
                  height: auto !important;
                  margin-right: 0.8rem !important;
                `}
              />
              <p>
                À vos calculs : si j'apporte{' '}
                <label>
                  <Input
                    css={`
                      vertical-align: text-bottom;
                      padding: 0.2rem 0.3rem 0 0;
                      max-width: 6.5rem !important;
                    `}
                    autoFocus={false}
                    value={situation['projet . investissement'] || undefined}
                    placeholder="mon apport"
                    min="0"
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
                  €
                </label>
                <span>
                  , je pourrai entreprendre des travaux d'un montant total de{' '}
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
                <span title="Hors taxes, soit hors TVA. En général, les travaux qui améliorent la performance énergétique sont taxés à 5,5 % de TVA">
                  HT
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
