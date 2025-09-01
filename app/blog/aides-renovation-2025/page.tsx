import Article from '@/components/Article'
import blogImage from '@/public/blog-images/2025.jpg'
import Link from 'next/link'
import Contribution from '../Contribution'
import OtherArticles from '../OtherArticles'
import { ArticleCta } from '../UI'
import { dateCool } from '../utils'
import Content from './Content'
import css from '@/components/css/convertToJs'
import Image from 'next/image'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { PageBlock } from '@/components/UI'

const title = 'Quelles aides à la rénovation en 2025 ?',
  description =
    "Découvrez les changements qui touchent les aides à la rénovation énergétique en 2025. L'essentiel des aides, dont MaPrimeRénov', est maintenu. On fait le point."

const date = '2024-12-23'

export const metadata = {
  title,
  description,
  openGraph: {
    images: ['/blog-images/2025.jpg'],
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
  image: '/blog-images/2025.jpg',
  date,
}

// On code à la main cet article fortement intéractif, car contentlayer n'arrive pas à importer nos composants. Décidément, je suis déçu par contentlayer.
export default function Blog2025() {
  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Article>
          <header>
            <Breadcrumb
              currentPageLabel={title}
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
            <div
              style={css`
                position: relative;
                width: 100%;
                height: 30rem;
              `}
            >
              <Image
                src={blogImage}
                layout="fill"
                objectFit="contain"
                alt="Illustration de l'article"
              />
            </div>
            <h1 className="fr-my-5v">{title}</h1>
            <p>{description}</p>
            <small>
              publié le <time dateTime={date}>{dateCool(date)}</time>
            </small>
          </header>
          <Content />
          <div
            style={css`
              margin-top: 1rem;
            `}
          >
            <Link
              className="fr-btn fr-icon-arrow-right-line fr-btn--icon-left"
              href="/simulation"
              prefetch={false}
            >
              Calculer mes aides
            </Link>
          </div>
          <Contribution slug={'aides-renovation-2025'} />
          <OtherArticles excludeUrl={'aides-renovation-2025'} />
          <ArticleCta />
        </Article>
      </PageBlock>
    </>
  )
}
