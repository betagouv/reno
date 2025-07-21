import Article from '@/components/Article'
import { PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import Image from 'next/image'
import Link from 'next/link'
import ArticleContent from '../ArticleContent'
import Contribution from '../Contribution'
import OtherArticles from '../OtherArticles'
import { ArticleCta } from '../UI'
import { dateCool, getLastEdit } from '../utils'
import { getAllArticles } from '../articles'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export const generateMetadata = async (props) => {
  const params = await props.params

  const articles = await getAllArticles()
  const post = articles.find((post) => post.slug === params.slug)
  const lastEdit = await getLastEdit(params.slug)

  return {
    title: post.titre,
    description: post.description,
    openGraph: {
      images: [post.image],
      type: 'article',
      publishedTime: post.date + 'T00:00:00.000Z',
      modifiedTime: lastEdit + 'T00:00:00.000Z',
      url: post.url,
    },
  }
}

export default async function Post(props: Props) {
  const params = await props.params
  const articles = await getAllArticles()
  const post = articles.find((post) => post.slug === params.slug)

  const lastEdit = await getLastEdit(params.slug)

  const sameEditDate =
    !lastEdit || post.date.slice(0, 10) === lastEdit.slice(0, 10)
  const verticalImage = post['image verticale']
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel={post.titre}
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Blog',
              linkProps: {
                href: '/blog',
              },
            },
          ]}
        />
        <Article>
          <header>
            <div
              style={css`
                position: relative;
                width: 100%;
                height: ${verticalImage ? '30rem' : '20rem'};

                padding-bottom: 4vh;
              `}
            >
              {post.image && (
                <Image
                  src={post.image}
                  layout="fill"
                  objectFit="contain"
                  alt="Illustration de l'article"
                />
              )}
            </div>
            <h1 className="fr-my-5v">{post.titre}</h1>
            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
            <small>
              publié le <time dateTime={post.date}>{dateCool(post.date)}</time>
              {!sameEditDate && (
                <span>
                  , mis à jour{' '}
                  <time dateTime={lastEdit}>{dateCool(lastEdit)}</time>
                </span>
              )}
            </small>
          </header>
          <ArticleContent post={post} />
          {post.cta && (
            <div>
              <p>{post.cta} :</p>
              <Link
                className="fr-btn fr-icon-arrow-right-line fr-btn--icon-left"
                href="/simulation"
                prefetch={false}
              >
                Calculer mes aides
              </Link>
            </div>
          )}
          <Contribution slug={params.slug} />
          <OtherArticles excludeUrl={post.url} />
          <ArticleCta />
        </Article>
      </PageBlock>
    </>
  )
}

/* Without this function, getAllArticles would be run without the context of the directory to parse */
export async function generateStaticParams() {
  const articles = await getAllArticles()
  // This article has its own route, don't rewrite it here
  return articles.filter((a) => a.slug !== 'aides-renovation-2025')
}
