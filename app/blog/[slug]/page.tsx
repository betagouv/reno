import { allArticles } from '@/.contentlayer/generated'
import Article from '@/components/Article'
import { CTA, CTAWrapper } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'
import Link from 'next/link'
import Contribution from '../Contribution'
import OtherArticles from '../OtherArticles'
import { ArticleCta, BlogBackButton } from '../UI'
import { mdxComponents } from '../mdxComponents'
import { dateCool, getLastEdit } from '../utils'

export const articles = allArticles.filter((article) => !article.brouillon)
console.log('YO', articles)

export const generateMetadata = async (props) => {
  const params = await props.params

  const post = allArticles.find(
    (post) => post._raw.flattenedPath === params.slug,
  )
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
  const post = articles.find((post) => post._raw.flattenedPath === params.slug)

  const MDXContent = useMDXComponent(post.body.code)
  const lastEdit = await getLastEdit(params.slug)

  const sameEditDate =
    !lastEdit || post.date.slice(0, 10) === lastEdit.slice(0, 10)
  const verticalImage = post['image verticale']
  return (
    <Article>
      <header>
        <section>
          <BlogBackButton>
            <Link
              href="/blog"
              style={css`
                margin-top: 0.6rem;
                display: inline-block;
                padding: 0rem 0.8rem 0.5rem;
              `}
            >
              ← Retour au blog
            </Link>
          </BlogBackButton>
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
          <h1>{post.titre}</h1>
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
        </section>
      </header>
      <section>
        <MDXContent components={mdxComponents} />
        {post.cta && (
          <div
            style={css`
              margin-top: 1rem;
            `}
          >
            <p
              style={css`
                text-wrap: nowrap;
              `}
            >
              {post.cta} :
            </p>

            <CTAWrapper
              $justify="center"
              $customCss={`
                margin-top: 1rem !important;
              `}
            >
              <CTA $fontSize="normal">
                <Link href="/simulation" prefetch={false}>
                  ➞&nbsp;&nbsp;Calculer mes aides
                </Link>
              </CTA>
            </CTAWrapper>
          </div>
        )}
        <Contribution slug={params.slug} />
      </section>
      <hr />

      <OtherArticles excludeUrl={post.url} />
      <ArticleCta />
    </Article>
  )
}
