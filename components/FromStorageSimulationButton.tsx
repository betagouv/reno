'use client'
import Link from 'next/link'
import { CTA } from './UI'
import { useLocalStorage } from 'usehooks-ts'
import Image from 'next/image'
import restoreIcon from '@/public/restore.svg'

export default function FromStorageSimulationButton() {
  const [simulation] = useLocalStorage('simulation', null)
  if (!simulation) return null
  return (
    <CTA
      $fontSize="normal"
      $importance="secondary"
      css={`
        margin: 1rem 0;
        width: fit-content;
        a {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.8rem;
        }
      `}
    >
      <Link href={simulation}>
        <Image
          src={restoreIcon}
          alt="Icône symbolisant la récupération"
          css={`
            width: 1rem !important;
            height: auto !important;
            margin: 0 !important;
            margin-right: 0.6rem !important;
          `}
        />
        Reprendre ma dernière simulation
      </Link>
    </CTA>
  )
}
