import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderWrapper } from '../LandingUI'
import rssIcon from '@/public/rss-simple.svg'
import {
  ArticleCard,
  ArticleContent,
  ArticleImageContainer,
  Badge,
  List,
} from './UI'
import { dateCool } from './utils'
import BlogImage from './BlogImage'
import { Suspense } from 'react'

const title = `Le blog des aides à la rénovation energétique`
const description =
  "Découvrez l'histoire, les nouveautés et le futur de Mes Aides Réno"

import { getAllArticles } from './articles'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import { useMediaQuery } from 'usehooks-ts'

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
      <main>
        <PageBlock>
          <HeaderWrapper
            image={
              <Suspense>
                <BlogImage />
              </Suspense>
            }
          >
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
              <h1>Le blog des aides à la rénovation energétique</h1>
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
              <p>
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
            </Content>
          </Wrapper>
        </PageBlock>
      </main>
    </>
  )
}

export default Page
