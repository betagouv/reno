import Link from 'next/link'

export default function UserProblemBanner() {
  return (
    <a
      href="/faq"
      className="fr-btn fr-btn--tertiary"
      css={`
        width: 100%;
        justify-content: center;
      `}
    >
      👋 J'ai besoin d'aide
    </a>
  )
}
