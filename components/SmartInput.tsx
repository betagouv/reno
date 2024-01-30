import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { reduceAST } from 'publicodes'
export default function Input({ onChange, value, rule, evaluation, engine }) {
  const name = 'ménage . revenu . classe'
  const rulesUsingThisInput = [engine.getParsedRules()[name]]
  console.log(rulesUsingThisInput, engine.evaluate(name))
  const comparaisonOperators = ['<', '<=', '>', '>=']
  const convertValue = (value) => value
  const searchedName = 'revenu'
  const accumulate = reduceAST(
    (acc, node) => {
      console.log('smart kind', node.nodeKind, node.operationKind)
      if (
        node.nodeKind === 'operation' &&
        comparaisonOperators.includes(node.operationKind)
      ) {
        if (node.explanation[0]?.dottedName === searchedName) {
          return [...acc, convertValue(node.explanation[1])]
        } else if (node.explanation[1]?.dottedName === searchedName) {
          return [...acc, convertValue(node.explanation[0])]
        }
        return acc
      }
      return acc
    },
    [],
    engine.getRule(name),
  )
  console.log('smart final', accumulate, engine.getRule(name))
  return 'salut'
}
