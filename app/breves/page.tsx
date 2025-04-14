import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import Link from 'next/link'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import rssIcon from '@/public/rss-simple.svg'
import {
  ArticleCard,
  ArticleContent,
  ArticleImageContainer,
  Badge,
  List,
} from '@/app/blog/UI'
import { dateCool } from '@/app/blog/utils'
import breveIcon from '@/public/brève.svg'
import { Suspense } from 'react'

const title = `Les dernières nouveautés de Mes Aides Réno`
const description =
  "Découvrez ici toutes les notes de version de Mes Aides Réno, un calculateur constamment mis à jour pour suivre les évolutions règlementaires des aides de l'État et les expliquer au mieux."

import { getAllArticles } from '@/app/blog/articles'

export const metadata: metadata = {
  title,
  description,
  openGraph: { images: ['/illustration-accueil.resized.webp'] },
}

const Page = async () => {
  const sortedArticles = await getAllArticles('news')
  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <PageBlock>
        <HeaderWrapper>
          <Image
            src={breveIcon}
            alt="Icône illustrant une nouveauté avec des étoiles scintillantes"
          />
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
              Les <BlueEm>nouveautés</BlueEm> de Mes&nbsp;Aides&nbsp;Réno
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
  )
}

export default Page
