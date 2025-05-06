import Article from '@/components/Article'
import { CTA, CTAWrapper } from '@/components/UI'
import image from '@/public/blog-images/2025.jpg'
import Link from 'next/link'
import Contribution from '../Contribution'
import OtherArticles from '../OtherArticles'
import { ArticleCta, BlogBackButton } from '../UI'
import { dateCool } from '../utils'
import Content from './Content'
import css from '@/components/css/convertToJs'
import Image from 'next/image'

const title = 'Quelles aides à la rénovation en 2025 ?',
  description =
    "Découvrez les changements qui touchent les aides à la rénovation énergétique en 2025. L'essentiel des aides, dont MaPrimeRénov', est maintenu. On fait le point."

const date = '2024-12-23'

const image = '/blog-images/2025.jpg'

export const metadata = {
  title,
  description,
  openGraph: {
    images: [image],
    type: 'article',
    publishedTime: date + 'T00:00:00.000Z',
    url: 'https://mesaidesreno.beta.gouv.fr/blog/aides-renovation-2025',
  },
}

export const article = {
  titre: title,
  url: '/blog/aides-renovation-2025',
  slug: 'aides-renovation-2025',
  description,
  image,
  date,
}

// On code à la main cet article fortement intéractif, car contentlayer n'arrive pas à importer nos composants. Décidément, je suis déçu par contentlayer.
export default function Blog2025() {
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
              height: 30rem;
            `}
          >
            <Image
              src={image}
              layout="fill"
              objectFit="contain"
              alt="Illustration de l'article"
            />
          </div>
          <h1 style={css``}>{title}</h1>
          <p>{description}</p>
          <small>
            publié le <time dateTime={date}>{dateCool(date)}</time>
          </small>
        </section>
      </header>
      <section>
        <Content />
        <div
          style={css`
            margin-top: 1rem;
          `}
        >
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
        <Contribution slug={'aides-renovation-2025'} />
      </section>
      <hr />

      <OtherArticles excludeUrl={'aides-renovation-2025'} />
      <ArticleCta />
    </Article>
  )
}
