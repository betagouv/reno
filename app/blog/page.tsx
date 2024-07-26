import { allArticles } from '@/.contentlayer/generated'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import illustrationAccueil from '@/public/illustration-accueil.resized.jpg'
import Logo from '@/public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderWrapper } from '../LandingUI'
import { List } from './UI'
import { dateCool } from './utils'

const title = `Le blog - Mes Aides Réno`
const description =
  "Découvrez l'histoire, les nouveautés et le futur de Mes Aides Réno"

export const metadata: metadata = {
  title,
  description,
  openGraph: { images: ['/jaquette.png'] },
}

const Page = () => {
  const articles = allArticles.sort((a, b) => a.date - b.date)
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
              Le blog de Mes Aides Réno
            </h1>
            <Intro>
              <p>
                Mes Aides Réno est le calculateur de référence des aides à la
                rénovation energétique pour les particuliers en France.
              </p>
              <p>
                On vous raconte ici les étapes de la construction de ce{' '}
                <strong>service public</strong>
                numérique.
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
                      <h2 dangerouslySetInnerHTML={{ __html: titre.html }} />
                    </Link>
                  </div>
                  <small>publié {dateCool(date)}</small>
                </li>
              ))}
            </List>
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>📨 Abonnez-vous à notre lettre d'information. </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}

export default Page
