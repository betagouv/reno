import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import { reduceAST } from 'publicodes'
import { formatValue } from '@/node_modules/publicodes/dist/index'
export default function Input({ situation, onChange, value, rule, engine }) {
  /* First we went for Maxime's method on mesaidesvelo
   * consisting of doing a static analysis of candidate values,
   * then trying them all by evaluating them to see which
   * would change the final output.
   *
   * However, we've got lots of values here, it's an automated method but quite
   * inefficient. In our case, we know the format of our bounds. We'll do it by
   * hand for now.
   *
   * */
  const revenu = situation['ménage . revenu']
  const targets = ['ménage . revenu . barème IdF', 'ménage . revenu . barème']

  const idf = engine.evaluate('ménage . région . IdF')
  const evaluation = engine.evaluate(targets[idf.nodeValue ? 0 : 1])
  console.log('smart eval', evaluation)
  const activeBarème =
    evaluation.explanation.valeur.explanation.alors.explanation.find(
      (el) => el.condition.nodeValue,
    )
  const list = activeBarème.consequence.explanation
    .map((el) => el.condition[1]?.constant?.nodeValue)
    .filter(Boolean)
  console.log('smart eval list', list)

  return list.map((threshold) => (
    <label>
      inférieur à {formatNumber(threshold)} €
      <input
        type="radio"
        name={threshold}
        value={threshold}
        checked={revenu < threshold}
        onChange={() => null}
      />
    </label>
  ))
}

const numberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
})
const formatNumber = (n) => numberFormatter.format(n)
