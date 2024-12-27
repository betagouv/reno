import { Card, CardLink, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import mprImage from '@/public/maprimerenov.svg'
import ceeImage from '@/public/cee.svg'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import ptzImage from '@/public/eco-ptz.png'
import localeImage from '@/public/locale-logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { CardMosaic } from '@/components/DevenirPartenaire'

export const metadata: Metadata = {
  title: 'Les aides à la rénovation énergétique en ' + new Date().getFullYear(),
  description:
    'Les aides à la rénovation énergétique en ' +
    new Date().getFullYear() +
    ": MaPrimeRénov', CEE, Coup de pouce chauffage.",
}

export default function Aides() {
  return (
    <Main>
      <Section>
        <Breadcrumb links={[{ 'Les aides': '/aides' }]} />
        <h2>
          Les principaux dispositifs d'aides à la rénovation énergétique en{' '}
          {new Date().getFullYear()}
        </h2>
        <CardMosaic $smallTitle>
          <Card>
            <Link href="/simulation">
              <Image src={mprImage} alt="Logo MaPrimeRénov" width="100" />
              <div>
                <h3>MaPrimeRénov' - Parcours accompagné</h3>
                <p>
                  Le parcours accompagné est{' '}
                  <strong>accessible pour tous</strong>, il vise à encourager
                  des <strong>rénovations d'ampleurs</strong>.
                </p>
                <p>
                  Les sommes sont importantes et vous êtes{' '}
                  <strong>accompagné par un professionnel agréé</strong> tout au
                  long de votre parcours.
                </p>
              </div>
            </Link>
          </Card>
          <Card>
            <Link href="/aides/ma-prime-renov">
              <Image src={mprImage} alt="Logo MaPrimeRénov" width="100" />
              <div>
                <h3>MaPrimeRénov' - Parcours par geste</h3>
                <p>
                  Le parcours par geste est{' '}
                  <strong>accessible sous condition de revenus</strong> pour les
                  propriétaires souhaitant réalisés des travaux de rénovation
                  effectués par <strong>des professionnels agréés RGE</strong>{' '}
                  (pompe à chaleur, poêle à granulés, isolation...).
                </p>
              </div>
            </Link>
          </Card>
          <Card>
            <Link href="/aides/pret-taux-0">
              <Image src={ptzImage} alt="Logo Eco-ptz" width="100" />
              <div>
                <h3>Les prêts à taux 0</h3>
                <p>
                  <strong>L'éco-prêt à taux zéro</strong> (éco-PTZ) ainsi que le{' '}
                  <strong>prêt avance rénovation</strong> sont accessibles{' '}
                  <strong>sans condition de ressources</strong>
                </p>
                <p>
                  Ces dispositifs visent à financer des travaux d'amélioration
                  de la performance énergétique des logements.
                </p>
              </div>
            </Link>
          </Card>
          <Card>
            <Link href="/aides/cee">
              <Image src={ceeImage} alt="Logo CEE" width="100" />
              <div>
                <h3>Les Certificats d'économies d'énergie</h3>
                <p>
                  Le dispositif des certificats d’économies d’énergie (CEE) est{' '}
                  <strong>accessible pour tous</strong>.<br /> Des fournisseurs
                  d'énergie (électricité, gaz, fioul domestique) vous proposent
                  des aides pour rénover votre logement.
                </p>
                <p>
                  Il s'agit pour elles d'une{' '}
                  <strong>obligation encadrée par l’État</strong>.
                </p>
              </div>
            </Link>
          </Card>
          <Card>
            <Link href="/aides/coup-de-pouce">
              <Image
                src={coupDePouceImage}
                alt="Logo Coup de pouce"
                width="100"
              />
              <div>
                <h3>Les Coups de pouce Chauffage</h3>
                <p>
                  Les primes dites <em>"Coup de pouce"</em> sont{' '}
                  <strong>accessibles à tous les ménages</strong> qui
                  entreprennent le{' '}
                  <strong>remplacement d'un mode de chauffage polluant</strong>{' '}
                  (chaudière au charbon, au fioul ou au gaz).
                </p>
              </div>
            </Link>
          </Card>
          <Card>
            <Link href="/locales">
              <Image src={localeImage} alt="Logo Locale" width="100" />
              <div>
                <h3>Les aides des collectivités locales</h3>
                <p>
                  Certaines régions, départements, intercommunalités ou communes
                  peuvent accorder des aides{' '}
                  <strong>complémentaires aux aides nationales</strong> dans le
                  cadre de la réalisation de travaux d’amélioration de la
                  performance énergétique.
                </p>
              </div>
            </Link>
          </Card>
        </CardMosaic>
      </Section>
    </Main>
  )
}
