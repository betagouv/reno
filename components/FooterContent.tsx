import { Footer } from '@codegouvfr/react-dsfr/Footer'

export default async function FooterContent() {
  return (
    <div className="fr-mt-20v">
      <Footer
        accessibility="partially compliant"
        accessibilityLinkProps={{
          href: '/accessibilite',
        }}
        websiteMapLinkProps={{
          href: '/sitemap',
        }}
        termsLinkProps={{
          href: '/mentions-legales',
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
          {
            text: 'A propos',
            linkProps: {
              href: '/a-propos',
            },
          },
          {
            text: 'Questions fréquentes',
            linkProps: {
              href: '/faq',
            },
          },
          {
            text: 'Personas',
            linkProps: {
              href: '/personas',
            },
          },
          {
            text: 'Statistiques',
            linkProps: {
              href: '/stats',
            },
          },
        ]}
        contentDescription=""
        license={
          <>
            Sauf mention contraire, tous les contenus de ce site sont sous{' '}
            <a
              title="licence MIT  - nouvelle fenêtre"
              href="https://github.com/betagouv/reno/blob/master/LICENSE"
              target="_blank"
            >
              licence MIT
            </a>{' '}
          </>
        }
        contentDescription={
          <>
            MesAidesRéno est propulsé par{' '}
            <a
              title="La direction interministérielle du numérique  - nouvelle fenêtre"
              href="https://www.numerique.gouv.fr/numerique-etat/dinum/"
              rel="noopener external"
              target="_blank"
            >
              la direction interministérielle du numérique
            </a>{' '}
            en partenariat avec{' '}
            <a
              title="l'ANAH  - nouvelle fenêtre"
              href="https://www.anah.gouv.fr"
              rel="noopener external"
              target="_blank"
            >
              l'ANAH
            </a>
            .
            <br />
            <a
              title="Code source MesAidesRéno sur Github - nouvelle fenêtre"
              href="https://github.com/betagouv/reno"
              rel="noopener external"
              target="_blank"
            >
              Le code source est disponible
            </a>{' '}
            en licence libre
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
    </div>
  )
}
