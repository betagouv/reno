import dpeValues from '@/components/DPE.yaml'
import Value from '@/components/Value'
import { motion } from 'framer-motion'
import DPEQuickSwitch from '../DPEQuickSwitch'
import { Card } from '../UI'

export default function CEEAmpleurScenario({ engine, situation }) {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  const possibilities = dpeValues.filter((el, index) => index <= oldIndex - 2)

  const targetSituation = { ...situation, 'projet . DPE visé': choice + 1 }

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
      <DPEQuickSwitch
        oldIndex={situation['DPE . actuel'] - 1}
        situation={situation}
      />
      <Card
        $background="#f7f8f8"
        css={`
          padding: 1rem;
          margin: 0;
          margin: 0.25rem 0 0 0 !important; /* hack */
          z-index: 42;
          position: relative;
          text-align: center;
          max-width: 100%;
          img {
            width: 1.5rem;
            height: auto;
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
        <DPEQuickSwitch
          dottedName="projet . DPE visé"
          possibilities={possibilities}
          oldIndex={
            situation['projet . DPE visé']
              ? situation['projet . DPE visé'] - 1
              : possibilities.length - 1
          }
          situation={situation}
          validateTargetKey={false}
        />
        , vous bénéficiez d'une prime estimée de{' '}
        <Value
          {...{
            engine,
            situation: targetSituation,
            dottedName: "CEE . rénovation d'ampleur . montant",
            state: 'prime',
          }}
        />
      </Card>
    </motion.div>
  )
}
