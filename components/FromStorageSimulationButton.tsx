'use client'

import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'

export default function FromStorageSimulationButton() {
  const [simulation] = useLocalStorage('simulation', null)
  if (!simulation) return null

  // With some work to recreate simulation objects from the URl, we could give the user her advancement

  /*
  const { categoryIndex, allCategories } = categoryData(
    nextQuestions,
    currentQuestion,
    answeredQuestions,
    rules,
  )
  Then render {categoryIndex} /{' '}
        {allCategories.length}

  */
  return (
    <Link
      className="fr-btn fr-btn--secondary fr-icon-upload-line fr-btn--icon-left"
      href={simulation}
      prefetch={false}
    >
      Reprendre ma dernière simulation
    </Link>
  )
}
