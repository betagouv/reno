import { DsfrCard, PageBlock } from '@/components/UI'
import Image from 'next/image'
import { HeaderWrapper } from '../LandingUI'
import rssIcon from '@/public/rss-simple.svg'
import { dateCool } from './utils'
import BlogImage from './BlogImage'
import { Suspense } from 'react'

const title = `Le blog des aides à la rénovation energétique`
const description =
  "Découvrez l'histoire, les nouveautés et le futur de Mes Aides Réno"

import { getAllArticles } from './articles'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Tile from '@codegouvfr/react-dsfr/Tile'
import Badge from '@codegouvfr/react-dsfr/Badge'

export const metadata: metadata = {
  title,
  description,
  openGraph: { images: ['/illustration-accueil.resized.webp'] },
}

const Page = async () => {
  const sortedArticles = await getAllArticles()
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <HeaderWrapper
          image={
            <Suspense>
              <BlogImage />
            </Suspense>
          }
        >
          <h1>Le blog des aides à la rénovation energétique</h1>
          <p>
            Mes Aides Réno est le calculateur de référence des aides à la
            rénovation energétique pour les particuliers en France.
          </p>
        </HeaderWrapper>
        <div className="fr-grid-row fr-grid-row--gutters">
          {sortedArticles.map(({ url, date, titre, tags, image }) => (
            <div key={url} className="fr-col">
              <DsfrCard
                titre={titre}
                url={url}
                description={
                  <>
                    {tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                    <p>{dateCool(date)}</p>
                  </>
                }
                noRatio
                imageUrl={
                  image.startsWith('/') ? image : `/blog-images/${image}`
                }
                imageAlt="Image d'illustration d'un article de blog"
                titleAs="h2"
              />
            </div>
          ))}
        </div>
        <p className="fr-mt-5v">
          <Image
            src={rssIcon}
            alt="Icône représentant un flux RSS"
            style={{ width: '1rem', height: 'auto' }}
          />
          &nbsp; Abonnez-vous à <a href="/feed.xml">notre flux RSS</a>.
        </p>
        <p>
          📨 Vous pourrez bientôt vous abonner à notre lettre
          d'information.{' '}
        </p>
      </PageBlock>
    </>
  )
}

export default Page
