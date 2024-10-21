import Value from '@/components/Value'
import { motion } from 'framer-motion'
import DPELabel from '../DPELabel'
import Input from '../Input'
import { Card } from '../UI'
import { encodeSituation } from '../publicodes/situationUtils'
import { Key } from '../explications/ExplicationUI'
import rules from '@/app/règles/rules'
import DPEQuickSwitch from '../DPEQuickSwitch'
import dpeValues from '@/components/DPE.yaml'

export default function CEEAmpleurScenario({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
}) {
  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

  const rule = rules["CEE . rénovation d'ampleur"]

  const possibilities = dpeValues.filter((el, index) => index <= oldIndex - 2)

  const doSetSearchParams = (question, value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [question]: value,
      },
      false,
      answeredQuestions,
    )
    console.log('girafe', newSituation)
    setSearchParams(newSituation, 'push')
  }

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
          prefixText={'En visant un '}
          dottedName="projet . DPE visé"
          possibilities={possibilities}
          oldIndex={
            situation['projet . DPE visé']
              ? situation['projet . DPE visé'] - 1
              : possibilities.length - 1
          }
          situation={situation}
        />
        , vous bénéficiez d'une prime estimée de{' '}
        <Value
          {...{
            engine,
            index: choice,
            situation,
            dottedName: "CEE . rénovation d'ampleur . montant",
            state: 'prime',
          }}
        />
      </Card>
    </motion.div>
  )
}
