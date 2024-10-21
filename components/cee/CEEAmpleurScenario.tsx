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

  console.log('possibilities', possibilities)

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
          margin: 0.25rem 0 0 0 !important; /* hack */
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
            width: 1.5rem;
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
        <p>
          <DPEQuickSwitch
            oldIndex={situation['DPE . actuel'] - 1}
            situation={situation}
          />
          ,{' '}
          <DPEQuickSwitch
            prefixText={'en visant un '}
            oldIndex={
              situation['DPE . visé'] - 1
                ? situation['DPE . visé'] - 1
                : possibilities.length
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
        </p>
      </Card>
    </motion.div>
  )
}
