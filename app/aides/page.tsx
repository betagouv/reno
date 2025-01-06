import { CardLink, Main, MiseEnAvant, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import mprImage from '@/public/maprimerenov.svg'
import ceeImage from '@/public/cee.svg'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import localeImage from '@/public/locale-logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

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
        <CardLink>
          <Link href="/simulation" prefetch={false}>
            <Image src={mprImage} alt="Logo MaPrimeRénov" width="100" />
            <div>
              <h3>MaPrimeRénov' - Parcours accompagné</h3>
              <p>
                Le parcours accompagné est <strong>accessible pour tous</strong>
                , il vise à encourager des{' '}
                <strong>rénovations d'ampleurs</strong> permettant un gain
                minimum de 2 classes énergétiques.
              </p>
              <p>
                Les sommes sont importantes et vous êtes{' '}
                <strong>accompagné par un professionnel agréé</strong> MAR (Mon
                Accompagnateur Rénov') tout au long de votre parcours
              </p>
            </div>
          </Link>
        </CardLink>
        <CardLink>
          <Link href="/aides/ma-prime-renov">
            <Image src={mprImage} alt="Logo MaPrimeRénov" width="100" />
            <div>
              <h3>MaPrimeRénov' - Parcours par geste</h3>
              <p>
                Le parcours par geste est{' '}
                <strong>accessible sous condition de revenus</strong> pour les
                propriétaires souhaitant entreprendre des travaux de rénovation
                effectués <strong>par des professionnels agréés RGE</strong>{' '}
                dans leur logement (installation de pompe à chaleur, poêle à
                granulés, isolation des combles...).
              </p>
            </div>
          </Link>
        </CardLink>
        <CardLink>
          <Link href="/aides/cee">
            <Image src={ceeImage} alt="Logo CEE" width="100" />
            <div>
              <h3>Les Certificats d'économies d'énergie (CEE)</h3>
              <p>
                Le dispositif des certificats d’économies d’énergie est{' '}
                <strong>accessible pour tous</strong>.<br /> Des fournisseurs
                d'énergie (électricité, gaz, fioul domestique, carburants pour
                véhicules) vous proposent des aides pour rénover votre logement.
                Il s'agit pour elles d'une{' '}
                <strong>obligation encadrée par l’État</strong>.
              </p>
            </div>
          </Link>
        </CardLink>
        <CardLink>
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
        </CardLink>
        <CardLink>
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
        </CardLink>
      </Section>
    </Main>
  )
}
