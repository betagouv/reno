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
  const activeBarème =
    evaluation.explanation.valeur.explanation.alors.explanation.find(
      (el) => el.condition.nodeValue,
    )
  console.log('smart eval list', activeBarème.consequence.explanation)
  const list = activeBarème.consequence.explanation
    .map((el) => {
      if (el.condition.isDefault) return false
      console.log('smart eval condition', el.condition)
      const conditionRightValue = engine.evaluate(
        el.condition.explanation[1],
      ).nodeValue
      if (conditionRightValue != null) return conditionRightValue

      throw new Error(
        'Impossible de calculer les bornes de revenu intelligentes.',
      )
    })
    .filter(Boolean)

  console.log('smart eval list', list)

  console.log('smart revenu', revenu)
  const lastThreshold = list.slice(-1)[0]
  return [...list, Infinity].map((threshold, index) => {
    const valueToSet =
      threshold === Infinity ? lastThreshold + 1 : threshold - 1
    return (
      <label
        key={threshold}
        css={`
          cursor: pointer;
          width: 14rem;
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;
        `}
      >
        <input
          css={`
            width: 1.4rem;
            height: 1.4rem;
            cursor: pointer;
            margin-right: 0.6rem;
          `}
          type="radio"
          name={threshold}
          value={threshold}
          checked={revenu > (list[index - 1] || 0) && revenu <= threshold}
          onChange={(e) => onChange(valueToSet)}
        />{' '}
        {threshold === Infinity ? (
          <span>supérieur à {formatNumber(lastThreshold)} €</span>
        ) : (
          <span>inférieur à {formatNumber(threshold)} €</span>
        )}
      </label>
    )
  })
}

const numberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
})
const formatNumber = (n) => numberFormatter.format(n)
