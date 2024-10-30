import crossIcon from '@/public/remix-close-empty.svg'
import Image from 'next/image'
import questionIcon from '@/public/remix-question-empty.svg'
export default function StatusIcon({ status }) {
  return status ? (
    <Image
      src={'/check-green-hybrid.svg'}
      alt={"Icône d'une coche"}
      width="10"
      height="10"
    />
  ) : status === null ? (
    <Image src={questionIcon} alt="Icône d'un point d'interrogation" css={``} />
  ) : (
    <Image
      src={crossIcon}
      alt="Icône d'une croix"
      css={`
        filter: grayscale(1);
        width: 1.4rem;
        height: auto;
        margin-right: 0.4rem;
      `}
    />
  )
}
