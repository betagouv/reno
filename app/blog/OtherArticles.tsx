import { sortBy } from '@/components/utils'
import { getAllArticles } from './articles'
import { dateCool } from './utils'
import Tile from '@codegouvfr/react-dsfr/Tile'

export default async function OtherArticles({ excludeUrl }) {
  const articles = await getAllArticles()
  return (
    <>
      <h2>Nos derniers articles</h2>
      <div className="fr-grid-row fr-grid-row--gutters">
        {sortBy((article) => article.date)(articles)
          .reverse()
          .filter(({ url }) => url !== excludeUrl)
          .slice(0, 4)
          .map(({ url, titre, date }) => (
            <div className="fr-col">
              <Tile
                key={url}
                linkProps={{
                  href: url,
                }}
                detail={<>Publié le {dateCool(date)}</>}
                enlargeLinkOrButton
                orientation="vertical"
                title={titre}
                titleAs="h3"
              />
            </div>
          ))}
      </div>
    </>
  )
}
