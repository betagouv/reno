'use client'
import useIsInIframe from '@/components/useIsInIframe'
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote-rect.png'
import logoFranceInfo from '@/public/logo-partenaire/logo-france-info.jpg'
import logoTf1Info from '@/public/logo-partenaire/logo-tf1-info.svg'
import logoActualImmo from '@/public/logo-partenaire/logo-actual-immo.png'
import Image from 'next/image'

export default function HomepageTalkAboutUs() {
  const isInIFrame = useIsInIframe()
  const links = [
    {
      href: 'https://www.francetvinfo.fr/economie/immobilier/logements-bouilloires-ces-obstacles-qui-freinent-l-adaptation-aux-fortes-chaleurs_6737814.html',
      src: logoFranceInfo,
      alt: 'Logo France Info',
    },
    {
      href: 'https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/',
      src: logoBonPote,
      alt: 'Logo Bon Pote',
    },
    {
      href: 'https://www.tf1info.fr/immobilier/bouilloires-thermiques-comment-adapter-son-logement-aux-vagues-de-chaleur-2315763.html',
      src: logoTf1Info,
      alt: 'Logo TF1 Info',
    },
    {
      href: 'https://www.actual-immo.fr/investissement-passoires-energetiques/',
      src: logoActualImmo,
      alt: 'Logo Actual Immo',
    },
  ]
  return (
    !isInIFrame && (
      <>
        <h2 className="fr-mt-5v">Ils parlent de nous</h2>
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          {links.map((link, index) => (
            <div key={index} className="fr-col-6 fr-col-md-3">
              <a
                title={link.alt + ' - nouvelle fenêtre'}
                key={index}
                rel="noopener external"
                className="fr-raw-link"
                href={link.href}
                target="_blank"
              >
                <Image
                  src={link.src}
                  alt={link.alt}
                  className="fr-responsive-img"
                />
              </a>
            </div>
          ))}
        </div>
      </>
    )
  )
}
