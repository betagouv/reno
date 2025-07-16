import css from '@/components/css/convertToJs'
import { sortBy } from '@/components/utils'
import { OtherArticlesList, OtherArticlesSection } from './UI'
import { getAllArticles } from './articles'
import { dateCool } from './utils'

export default async function OtherArticles({ excludeUrl }) {
  const articles = await getAllArticles()
  return (
    <OtherArticlesSection>
      <h2>Nos derniers articles</h2>
      <OtherArticlesList>
        <ol>
          {sortBy((article) => article.date)(articles)
            .reverse()
            .filter(({ url }) => url !== excludeUrl)
            .map(({ url, titre, date }) => (
              <li key={url}>
                <h3>
                  <a href={url} className="fr-link">
                    {titre}
                  </a>
                </h3>
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
