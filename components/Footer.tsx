"use client"
import Link from 'next/link'
import { FooterWrapper, ExternalLink, InternalLink } from './UI'
import useIsInIframe from '@/components/useIsInIframe'

export default function Footer() {
  const isInIframe = useIsInIframe()
  return !isInIframe && (
    <>
      <FooterWrapper className="fr-footer" role="contentinfo">
        <div className="fr-footer__top">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
              {/* <div className="fr-col-12 fr-col-sm-3 fr-col-md-2">
                <h3 className="fr-footer__top-cat">Nos dossiers</h3>
                <ul className="fr-footer__top-list">
                <li><InternalLink className="fr-footer__top-link" href="#">La rénovation énergétique</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">Les passoires thermiques</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">Les Pompes à chaleur</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">L'isolation</InternalLink></li>
                </ul>
              </div>
              <div className="fr-col-12 fr-col-sm-3 fr-col-md-2">
                <h3 className="fr-footer__top-cat">Les aides</h3>
                <ul className="fr-footer__top-list">
                  <li><InternalLink className="fr-footer__top-link" href="#">MaPrimeRénov</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">L'éco-prêt à taux zéro</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">L'exonération de taxe foncière</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">Le dispositif Denormandie</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">Les aides des collectivités locales</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="#">Certificats d'économie d'énergie (CEE)</InternalLink></li>
                </ul>
              </div>
              </div> */}
              <div className="fr-col-12 fr-col-sm-3 fr-col-md-2">
                <h3 className="fr-footer__top-cat">Nos partenaires</h3>
                <ul className="fr-footer__top-list">
                  <li><ExternalLink className="fr-footer__top-link" href="#">France Rénov'</ExternalLink></li>
                  <li><ExternalLink className="fr-footer__top-link" href="#">Dossier Facile</ExternalLink></li>
                  <li><ExternalLink className="fr-footer__top-link" href="#">France Chaleur Urbaine</ExternalLink></li>
                  <li><ExternalLink className="fr-footer__top-link" href="#">Pacoupa</ExternalLink></li>
                  <li><ExternalLink className="fr-footer__top-link" href="#">Zéro Logement Vacant</ExternalLink></li>
                </ul>
              </div>
              <div className="fr-col-12 fr-col-sm-3 fr-col-md-2">
                <h3 className="fr-footer__top-cat">Liens utiles</h3>
                <ul className="fr-footer__top-list">
                  <li><InternalLink className="fr-footer__top-link" href="/a-propos">À propos</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="/faq">Questions et contact</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="/api-doc">API</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="/integration">Intégrer notre calculateur</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="/personas">Personas</InternalLink></li>
                  <li><InternalLink className="fr-footer__top-link" href="/confidentialite">Confidentialité</InternalLink></li>
                  {/* <li><InternalLink className="fr-footer__top-link" href="/accessibilite">Accessibilité : non conforme</InternalLink></li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </FooterWrapper>
    </>
  )
}
