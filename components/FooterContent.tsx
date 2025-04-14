import { sortedArticles } from '@/app/blog/page'
import { ExternalLink, FooterWrapper, InternalLink } from './UI'

export default function FooterContent() {
  return (
    <FooterWrapper className="fr-footer" role="contentinfo">
      <div>
        <div className="fr-footer__top">
          <div className="footer-col">
            <h3 className="fr-footer__top-cat">
              <InternalLink className="fr-footer__top-link" href={'/blog'}>
                Blog
              </InternalLink>
            </h3>
            <ul className="fr-footer__top-list">
              {sortedArticles
                .filter(
                  ({ tags, brouillon }) =>
                    !tags?.includes('notes de version') && !brouillon,
                )
                .map(({ url, titre }) => (
                  <li key={url}>
                    <InternalLink className="fr-footer__top-link" href={url}>
                      {titre}
                    </InternalLink>
                  </li>
                ))
                .slice(0, 5)}
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="fr-footer__top-cat">
              <InternalLink href="/aides">Les aides</InternalLink>
            </h3>
            <ul className="fr-footer__top-list">
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/aides/ma-prime-renov"
                >
                  MaPrimeRénov
                </InternalLink>
              </li>
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/aides/bareme-revenus"
                >
                  Tableau des revenus
                </InternalLink>
              </li>
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/aides/coup-de-pouce"
                >
                  Les Coups de pouce
                </InternalLink>
              </li>
              <li>
                <InternalLink className="fr-footer__top-link" href="/aides/cee">
                  Certificats d'économie d'énergie (CEE)
                </InternalLink>
              </li>
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/aides/pret-taux-0"
                >
                  Les prêts à taux zéro
                </InternalLink>
              </li>
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/aides/exoneration-fiscale/taxe-fonciere"
                >
                  L'exonération de taxe foncière
                </InternalLink>
              </li>
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/aides/exoneration-fiscale/denormandie"
                >
                  Le dispositif Denormandie
                </InternalLink>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="fr-footer__top-cat">Nos partenaires</h3>
            <ul className="fr-footer__top-list">
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="France Rénov'"
                  href="https://france-renov.gouv.fr"
                >
                  France Rénov'
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="Dossier Facile"
                  href="https://www.dossierfacile.logement.gouv.fr"
                >
                  Dossier Facile
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="France Chaleur Urbaine"
                  href="https://france-chaleur-urbaine.beta.gouv.fr"
                >
                  France Chaleur Urbaine
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="Pacoupa"
                  href="https://pacoupa.ademe.fr"
                >
                  Pacoupa
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="Zéro Logement Vacant"
                  href="https://zerologementvacant.beta.gouv.fr"
                >
                  Zéro Logement Vacant
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="Jagis"
                  href="https://jagis.beta.gouv.fr"
                >
                  Jagis
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  className="fr-footer__top-link"
                  title="Nos Gestes Climat"
                  href="https://nosgestesclimat.fr/"
                >
                  Nos Gestes Climat
                </ExternalLink>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="fr-footer__top-cat">Liens utiles</h3>
            <ul className="fr-footer__top-list">
              <li>
                <InternalLink className="fr-footer__top-link" href="/a-propos">
                  À propos
                </InternalLink>
              </li>
              <li>
                <InternalLink className="fr-footer__top-link" href="/faq">
                  Questions fréquentes
                </InternalLink>
              </li>
              <li>
                <InternalLink className="fr-footer__top-link" href="/contact">
                  Contact
                </InternalLink>
              </li>
              <li>
                <InternalLink className="fr-footer__top-link" href="/api-doc">
                  API
                </InternalLink>
              </li>
              <li>
                <InternalLink
                  className="fr-footer__top-link"
                  href="/integration"
                >
                  Intégrer notre calculateur
                </InternalLink>
              </li>
              <li>
                <InternalLink className="fr-footer__top-link" href="/personas">
                  Personas
                </InternalLink>
              </li>
              <li>
                <InternalLink className="fr-footer__top-link" href="/stats">
                  Statistiques
                </InternalLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer_bottom-list">
            <li className="fr-footer__bottom-item">
              <InternalLink href="/accessibilite">
                Accessibilité : non conforme
              </InternalLink>
            </li>
            <li className="fr-footer__bottom-item">
              <InternalLink
                className="fr-footer__top-link"
                href="/confidentialite"
              >
                Confidentialité
              </InternalLink>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les contenus de ce site sont sous{' '}
              <ExternalLink
                href="https://github.com/betagouv/reno/blob/master/LICENSE"
                target="_blank"
                title="licence MIT - nouvelle fenêtre"
                css={`
                  text-decoration: underline;
                `}
              >
                licence MIT
              </ExternalLink>
            </p>
          </div>
        </div>
      </div>
    </FooterWrapper>
  )
}
