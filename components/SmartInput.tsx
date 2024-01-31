import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { reduceAST } from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'
export default function Input({ onChange, value, rule, evaluation, engine }) {
  const name = 'ménage . revenu . classe'
  const rulesUsingThisInput = [engine.getParsedRules()[name]]
  console.log(rulesUsingThisInput, engine.evaluate(name))
  const comparaisonOperators = ['<', '<=', '>', '>=']
  const unit = '€'
  const convertValue = (node) => {
    const valeur = formatValue(engine.evaluate(node)).replace(/\s/g, '')
    if (valeur === '∞') {
      return Infinity
    }
    return engine.evaluate({ valeur, unité: unit }).nodeValue
  }
  const searchedName = 'ménage . revenu'

  function findAllComparaisonsValue(dottedName, { searchedName, unit }) {
    const accumulateThresholds = (acc, node) => {
      if (
        node.nodeKind === 'operation' &&
        comparaisonOperators.includes(node.operationKind)
      ) {
        console.log('smart kind', node)
        if (node.explanation[0]?.dottedName === searchedName) {
          return [...acc, convertValue(node.explanation[1])]
        } else if (node.explanation[1]?.dottedName === searchedName) {
          return [...acc, convertValue(node.explanation[0])]
        }
      } else if (
        (node.nodeKind === 'reference' && console.log('smart name', node)) ||
        node.name?.split(' . ').slice(-1).includes('barème')
      ) {
        console.log('smart found', acc)
        return [
          ...acc,
          ...findAllComparaisonsValue(node.dottedName, { searchedName, unit }),
        ]
      }
    }

    return reduceAST(accumulateThresholds, [], engine.getRule(dottedName))
  }
  const result = findAllComparaisonsValue(name, {
    searchedName,
    unit,
  })
  console.log('yoyo getrule', engine.getRule(name))
  console.log('yoyo eval', engine.evaluate(name))
  return 'salut'
}
