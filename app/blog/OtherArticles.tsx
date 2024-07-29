import { allArticles } from '@/.contentlayer/generated'
import css from '@/components/css/convertToJs'
import Link from 'next/link'
import { OtherArticlesList, OtherArticlesSection } from './UI'
import { dateCool } from './utils'
export default function ({ excludeUrl }) {
  return (
    <OtherArticlesSection>
      <h2>Nos autres articles</h2>
      <OtherArticlesList>
        <ol>
          {[...allArticles]
            .reverse()
            .filter(({ url }) => url !== excludeUrl)
            .map(({ url, titre, date }) => (
              <li key={url}>
                <div>
                  <Link href={url}>
                    <h3>{titre}</h3>
                  </Link>
                </div>
                <small
                  style={css`
                    color: var(--color);
                    font-size: 90%;
                  `}
                >
                  Publié le {dateCool(date)}
                </small>
              </li>
            ))}
        </ol>
      </OtherArticlesList>
    </OtherArticlesSection>
  )
}
