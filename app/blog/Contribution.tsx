import css from '@/components/css/convertToJs'
import { repo } from './utils'
import { ExternalLink } from '@/components/UI'

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
      <ExternalLink
        href={`https://github.com/${repo}/edit/master/articles/${slug}.mdx`}
      >
        ✏️ Signaler une erreur
      </ExternalLink>
    </div>
  )
}
