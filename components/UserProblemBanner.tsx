import Link from 'next/link'

export default function UserProblemBanner() {
  return (
    <section
      css={`
        margin: 1rem auto;
        width: 16rem;
        background: var(--lightestColor);
        text-align: center;
        padding: 0.4rem;
        border-radius: 0.6rem;
      `}
    >
      <Link href="/faq">Une question, un problème ?</Link>
    </section>
  )
}
