import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import { sortBy } from '@/components/utils'
import Image from 'next/image'
import Link from 'next/link'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import {
  ArticleCard,
  ArticleContent,
  ArticleImageContainer,
  Badge,
  List,
} from './UI'
import { dateCool } from './utils'
import { articles } from './[slug]/page'
import { article as article2025 } from './aides-renovation-2025/page'
import BlogImage from './BlogImage'
import { Suspense } from 'react'

const title = `Le blog des aides à la rénovation energétique`
const description =
  "Découvrez l'histoire, les nouveautés et le futur de Mes Aides Réno"

export const sortedArticles = [
  ...sortBy((article) => article.date)([...articles, article2025]).reverse(),
]
export const metadata: metadata = {
  title,
  description,
  openGraph: { images: ['/illustration-accueil.resized.webp'] },
}

const Page = () => {
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Suspense>
            <BlogImage />
          </Suspense>
          <div>
            {false && ( // Not sure this is useful since the header is big
              <nav
                style={css`
                  margin-top: 1rem;
                `}
              >
                <Link href="/">Revenir au site</Link>
              </nav>
            )}
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              Le <BlueEm>blog</BlueEm> des aides à la rénovation energétique
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est le calculateur de référence des aides à la
                rénovation energétique pour les particuliers en France.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <List>
              {sortedArticles.map(({ url, date, titre, tags, image }) => (
                <ArticleCard key={url}>
                  <Link href={url}>
                    <ArticleImageContainer>
                      {image && (
                        <Image
                          src={
                            image.startsWith('/')
                              ? image
                              : `/blog-images/${image}`
                          }
                          alt={titre}
                          fill
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                        />
                      )}
                      {!image && (
                        <div
                          style={css`
                            background: #f0f0f0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          `}
                        >
                          <span>📝</span>
                        </div>
                      )}
                    </ArticleImageContainer>
                    <ArticleContent>
                      <div>
                        <h2>{titre} </h2>
                        {tags?.map((tag) => (
                          <Badge key={tag}>
                            <small>{tag}</small>
                          </Badge>
                        ))}
                      </div>
                      <small>{dateCool(date)}</small>
                    </ArticleContent>
                  </Link>
                </ArticleCard>
              ))}
            </List>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            📨 Vous pourrez bientôt vous abonner à notre lettre
            d'information.{' '}
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}

export default Page
