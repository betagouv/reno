import { PageBlock } from '@/components/UI'
import { Metadata } from 'next/types'
import { StartDsfrOnHydration } from '@/src/dsfr-bootstrap'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { getAllArticles } from '../blog/articles'
import rules from '@/index'

export const metadata: Metadata = {
  title: 'Sitemap - Mes aides réno',
}
const Sitemap = async () => {
  const sortedArticles = await getAllArticles()
  const simulateurMPR = Object.keys(rules)
    .filter(
      (dottedName) =>
        dottedName.startsWith('gestes') && dottedName.endsWith('MPR'),
    )
    .map((dottedName) => dottedName.replace(' . MPR', ''))
    .map((dottedName) => ({
      titre: rules[dottedName].titre,
      url: `/aides/ma-prime-renov/${encodeURIComponent(rules[dottedName].titre)}`,
    }))

  const simulateurCEE = Object.keys(rules)
    .filter(
      (dottedName) =>
        dottedName.startsWith('gestes') && dottedName.endsWith('CEE'),
    )
    .map((dottedName) => ({
      titre: rules[dottedName].titre,
      url: `/aides/cee/${rules[dottedName].code}/${encodeURIComponent(rules[dottedName].titre)}`,
    }))

  const simulateurCoupDePouce = Object.keys(rules)
    .filter(
      (dottedName) =>
        dottedName.startsWith('gestes') && dottedName.endsWith('Coup de pouce'),
    )
    .map((dottedName) => dottedName.replace(' . Coup de pouce', ''))
    .map((dottedName) => ({
      titre: rules[dottedName].titre,
      url: `/aides/coup-de-pouce/${encodeURIComponent(rules[dottedName].titre)}`,
    }))

  return (
    <>
      <StartDsfrOnHydration />
      <PageBlock>
        <Breadcrumb
          currentPageLabel="Sitemap"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <h1>Plan du site</h1>
        <ul>
          <li>
            <a href="/" className="fr-link">
              Accueil
            </a>
            <ul>
              <li>
                <a className="fr-link" href="/blog">
                  Blog
                </a>
              </li>
              <ul>
                {sortedArticles.map(({ url, titre }, i) => (
                  <li key={i}>
                    <a href={url} className="fr-link">
                      {titre}
                    </a>
                  </li>
                ))}
              </ul>
              <li>
                <a className="fr-link" href="/aides">
                  Les Aides
                </a>
              </li>
              <ul>
                <li>
                  <a className="fr-link" href="/simulation">
                    MaPrimeRénov' parcours accompagné
                  </a>
                </li>
                <li>
                  <a className="fr-link" href="/aides/ma-prime-renov">
                    MaPrimeRénov' rénovation par geste
                  </a>
                </li>
                <ul>
                  {simulateurMPR.map(({ titre, url }) => (
                    <li>
                      <a href={url} className="fr-link">
                        {titre}
                      </a>
                    </li>
                  ))}
                </ul>
                <li>
                  <a className="fr-link" href="/aides/pret-taux-0">
                    Les prêts à taux 0
                  </a>
                  <ul>
                    <li>
                      <a className="fr-link" href="/aides/pret-taux-0/eco-ptz">
                        L'éco-PTZ
                      </a>
                    </li>
                    <li>
                      <a
                        className="fr-link"
                        href="/aides/pret-taux-0/pret-avance-renovation"
                      >
                        Le prêt avance rénovation
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="fr-link" href="/aides/exoneration-fiscale">
                    Les exonérations fiscales
                  </a>
                </li>
                <ul>
                  <li>
                    <a
                      className="fr-link"
                      href="/aides/exoneration-fiscale/taxe-fonciere"
                    >
                      L'exonération de taxe foncière
                    </a>
                  </li>
                  <li>
                    <a
                      className="fr-link"
                      href="/aides/exoneration-fiscale/denormandie"
                    >
                      Le dispositif Denormandie
                    </a>
                  </li>
                </ul>
                <li>
                  <a className="fr-link" href="/aides/cee">
                    Les Certificats d'économie d'énergie (CEE)
                  </a>
                </li>
                <ul>
                  {simulateurCEE.map(({ titre, url }) => (
                    <li>
                      <a href={url} className="fr-link">
                        {titre}
                      </a>
                    </li>
                  ))}
                </ul>
                <li>
                  <a className="fr-link" href="/aides/coup-de-pouce">
                    Les Coups de pouce "Chauffage"
                  </a>
                </li>
                <ul>
                  {simulateurCoupDePouce.map(({ titre, url }) => (
                    <li>
                      <a href={url} className="fr-link">
                        {titre}
                      </a>
                    </li>
                  ))}
                </ul>
              </ul>
              <li>
                <a href="/contact" className="fr-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="/devenir-partenaire" className="fr-link">
                  Devenir Partenaire
                </a>
              </li>
              <ul>
                <li>
                  <a className="fr-link" href="/integration">
                    Les iframes
                  </a>
                </li>
                <li>
                  <a className="fr-link" href="/api-doc">
                    API
                  </a>
                </li>
                <li>
                  <a className="fr-link" href="/npm">
                    NPM
                  </a>
                </li>
              </ul>
              <li>
                <a href="/a-propos" className="fr-link">
                  À propos
                </a>
              </li>
              <li>
                <a className="fr-link" href="/simulation">
                  Simulateur
                </a>
              </li>
              <li>
                <a className="fr-link" href="/copropriete">
                  Simulateur Copropriété
                </a>
              </li>
              <li>
                <a className="fr-link" href="/module/plus-value">
                  Ma plus-value Réno
                </a>
              </li>
              <li>
                <a className="fr-link" href="/module">
                  Rénovation d'ampleur
                </a>
              </li>
              <li>
                <a href="/faq" className="fr-link">
                  Questions fréquentes
                </a>
              </li>
              <li>
                <a href="/personas" className="fr-link">
                  Personas
                </a>
              </li>
              <li>
                <a href="/stats" className="fr-link">
                  Statistiques
                </a>
              </li>
              <li>
                <a href="/sitemap" className="fr-link">
                  Plan du site
                </a>
              </li>
              <li>
                <a href="/accessibilité" className="fr-link">
                  Accessibilité
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="fr-link">
                  Confidentialité
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </PageBlock>
    </>
  )
}

export default Sitemap
