import { getAllArticles } from '@/app/blog/articles'
import { Footer } from '@codegouvfr/react-dsfr/Footer'

export default async function FooterContent() {
  const sortedArticles = await getAllArticles()

  return (
    <>
      <Footer
        accessibility="partially compliant"
        accessibilityLinkProps={{
          href: '/accessiblite',
        }}
        websiteMapLinkProps={{
          href: '/sitemap.xml', //TODO: créer un plan de site consultable en non-xml
        }}
        termsLinkProps={{
          href: '/a-propos',
        }}
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANCAISE
          </>
        }
        homeLinkProps={{
          href: '/',
          title: 'Accueil - Mes Aides Réno',
        }}
        bottomItems={[
          {
            text: 'Confidentialité',
            linkProps: {
              href: '/confidentialite',
            },
          },
        ]}
        contentDescription=""
        license={
          <>
            Sauf mention contraire, tous les contenus de ce site sont sous{' '}
            <a
              href="https://github.com/betagouv/reno/blob/master/LICENSE"
              target="_blank"
            >
              licence MIT
            </a>{' '}
          </>
        }
        linkList={[
          {
            categoryName: 'Blog',
            links: sortedArticles
              .filter(
                ({ tags, brouillon }) =>
                  !tags?.includes('notes de version') && !brouillon,
              )
              .map(({ url, titre }) => {
                return {
                  linkProps: {
                    href: url,
                  },
                  text: titre,
                }
              })
              .slice(0, 5),
          },
          {
            categoryName: 'Les aides',
            links: [
              {
                linkProps: {
                  href: '/aides/ma-prime-renov',
                },
                text: "MaPrimeRénov'",
              },
              {
                linkProps: {
                  href: '/aides/bareme-revenus',
                },
                text: 'Tableau des revenus',
              },
              {
                linkProps: {
                  href: '/aides/coup-de-pouce',
                },
                text: 'Les Coups de pouce',
              },
              {
                linkProps: {
                  href: '/aides/cee',
                },
                text: "Certificats d'économie d'énergie (CEE)",
              },
              {
                linkProps: {
                  href: '/aides/pret-taux-0',
                },
                text: 'Les prêts à taux zéro',
              },
              {
                linkProps: {
                  href: '/aides/exoneration-fiscale/taxe-fonciere',
                },
                text: "L'exonération de taxe foncière",
              },
              {
                linkProps: {
                  href: '/aides/exoneration-fiscale/denormandie',
                },
                text: 'Le dispositif Denormandie',
              },
            ],
          },
          {
            categoryName: 'Liens utiles',
            links: [
              {
                linkProps: {
                  href: '/a-propos',
                },
                text: 'À propos',
              },
              {
                linkProps: {
                  href: '/faq',
                },
                text: 'Questions fréquentes',
              },
              {
                linkProps: {
                  href: '/contact',
                },
                text: 'Contact',
              },
              {
                linkProps: {
                  href: '/api-doc',
                },
                text: 'API',
              },
              {
                linkProps: {
                  href: '/integration',
                },
                text: 'Intégrer nos calculettes',
              },
              {
                linkProps: {
                  href: '/personas',
                },
                text: 'Personas',
              },
              {
                linkProps: {
                  href: '/stats',
                },
                text: 'Statistiques',
              },
            ],
          },
        ]}
        contentDescription={
          <>
            MesAidesRéno est propulsé par{' '}
            <a
              href="https://www.numerique.gouv.fr/numerique-etat/dinum/"
              rel="noopener external"
              target="_blank"
            >
              la direction interministérielle du numérique
            </a>{' '}
            en partenariat avec{' '}
            <a
              href="https://www.anah.gouv.fr"
              rel="noopener external"
              target="_blank"
            >
              l'ANAH
            </a>
            .
            <br /> Le code source est disponible en licence libre
          </>
        }
        operatorLogo={{
          alt: 'Logo Mes Aides Réno',
          imgUrl: '/logo.svg',
          orientation: 'horizontal',
        }}
        partnersLogos={{
          main: {
            alt: "Logo France Rénov'",
            href: 'https://france-renov.gouv.fr',
            imgUrl: '/logo-france-renov-blanc.svg',
          },
          sub: [
            {
              alt: 'Logo ADEME',
              href: 'https://www.ademe.fr',
              imgUrl: '/logo-partenaire/logo-ademe.svg',
            },
            {
              alt: 'Logo Nos Gestes Climat',
              href: 'https://nosgestesclimat.fr',
              imgUrl: '/logo-partenaire/logo-nos-gestes-climat.png',
            },
            {
              alt: 'Logo Jagis',
              href: 'https://jagis.beta.gouv.fr',
              imgUrl: '/logo-partenaire/logo-jagis.svg',
            },
            {
              alt: 'Logo Zéro Logement Vacant',
              href: 'https://zerologementvacant.beta.gouv.fr',
              imgUrl: '/logo-partenaire/logo-zero-logement-vacant.svg',
            },
            {
              alt: 'Logo France Chaleur Urbaine',
              href: 'https://france-chaleur-urbaine.beta.gouv.fr',
              imgUrl: '/logo-partenaire/logo-fcu.jpg',
            },
          ],
        }}
      />
    </>
  )
}
