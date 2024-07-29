import { allArticles } from '@/.contentlayer/generated'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import { sortBy } from '@/components/utils'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import Image from 'next/image'
import Link from 'next/link'
import { BlueEm, HeaderWrapper } from '../LandingUI'
import { List } from './UI'
import { dateCool } from './utils'

const title = `Le blog des aides à la rénovation energétique`
const description =
  "Découvrez l'histoire, les nouveautés et le futur de Mes Aides Réno"

export const metadata: metadata = {
  title,
  description,
  openGraph: { images: ['/illustration-accueil.resized.jpg'] },
}

const Page = () => {
  console.log(allArticles.map((el) => el.date))
  const articles = [...sortBy((article) => article.date)(allArticles).reverse()]
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
            src={illustrationAccueil}
            alt="Des ouvriers peignent et réparent la facade d'une maison"
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
              Le <BlueEm>blog</BlueEm> des aides à la rénovation energétique
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est le calculateur de référence des aides à la
                rénovation energétique pour les particuliers en France.
              </p>
              <p>
                On vous raconte ici les étapes de la construction de ce{' '}
                <strong>service public</strong> numérique.
              </p>
            </Intro>
          </div>
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <List>
              {articles.map(({ url, date, titre }) => (
                <li key={url}>
                  <div>
                    <Link href={url}>
                      <h2>{titre}</h2>
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
            </List>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            📨 Vous pourrez bientôt vous abonner à notre lettre d'information.{' '}
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}

export default Page
