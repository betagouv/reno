'use client'
import restoreIcon from '@/public/restore.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { CTA, CTAWrapper } from './UI'
import css from './css/convertToJs'

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
      className="fr-btn fr-btn--secondary"
      href={simulation}
      prefetch={false}
    >
      <Image
        src={restoreIcon}
        alt="Icône symbolisant la récupération"
        css={`
          width: 1rem !important;
          height: 1rem !important;
          margin-right: 0.6rem !important;
        `}
      />
      <span>Reprendre ma dernière simulation </span>
    </Link>
  )
}
