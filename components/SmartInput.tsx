import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { reduceAST } from 'publicodes'
export default function Input({ onChange, value, rule, evaluation, engine }) {
  console.log('smart', evaluation)
  const name = 'ménage . revenu . classe'
  const rulesUsingThisInput = [engine.getParsedRules()[name]]
  console.log(rulesUsingThisInput, engine.evaluate(name))
  const accumulate = reduceAST(
    (acc, next) => {
      console.log('smart', next)
    },
    {},
    engine.getRule(name),
  )
  console.log('smart final', accumulate)
  return 'salut'
}
