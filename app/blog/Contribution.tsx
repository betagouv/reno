import css from '@/components/css/convertToJs'
import { repo } from './utils'

export default function Contribution({ slug }) {
  return (
    <div
      style={css`
        display: block;
        margin: 0 0 0 auto;
        width: fit-content;
        margin-top: 2rem;
      `}
    >
      <a
        rel="noopener external"
        className="fr-link"
        href={`https://github.com/${repo}/edit/master/articles/${slug}.mdx`}
      >
        ✏️ Signaler une erreur
      </a>
    </div>
  )
}
