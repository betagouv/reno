import { Card, Main, Section } from '@/components/UI'
import { Metadata } from 'next/types'
import mprImage from '@/public/maprimerenov.svg'
import ceeImage from '@/public/cee.svg'
import coupDePouceImage from '@/public/cee-coup-de-pouce.svg'
import ptzImage from '@/public/ptz-bleu.svg'
import exoFiscaleImage from '@/public/exoneration-fiscale.svg'
import localeImage from '@/public/locale-logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { CardMosaic } from '@/components/DevenirPartenaire'
import css from '@/components/css/convertToJs'

export const metadata: Metadata = {
  title: 'Les aides à la rénovation énergétique en ' + new Date().getFullYear(),
  description:
    'Les aides à la rénovation énergétique en ' +
    new Date().getFullYear() +
    ": MaPrimeRénov', Mon Accompagnateur Rénov', aides des fournisseurs d’énergie (CEE), prime "Coup de Pouce" chauffage, éco-prêt à taux zéro, exonération de taxe foncière et dispositif Denormandie.",
}

export default function Aides() {
  return (
    <Main>
      <Section>
        <Breadcrumb links={[{ 'Les aides': '/aides' }]} />
        <h1>
          Les principaux dispositifs d'aides à la rénovation énergétique en{' '}
          {new Date().getFullYear()}
        </h1>
        <CardMosaic $smallTitle>
          <Card>
            <Image src={mprImage} alt="Logo MaPrimeRénov" width="100" />
            <h2>
              <Link href="/simulation">
                MaPrimeRénov' - Parcours accompagné
              </Link>
            </h2>
            <p>
              Le parcours accompagné est <strong>accessible pour tous</strong>,
              il vise à encourager des <strong>rénovations d'ampleurs</strong>.
            </p>
            <p>
              Les sommes sont importantes et vous êtes{' '}
              <strong>accompagné par un professionnel agréé</strong>.
            </p>
          </Card>
          <Card>
            <Image src={mprImage} alt="Logo MaPrimeRénov" width="100" />

            <h2>
              <Link href="/aides/ma-prime-renov">
                MaPrimeRénov' rénovation par geste
              </Link>
            </h2>
            <p>
              Le parcours par geste est{' '}
              <strong>accessible sous condition de revenus</strong>.
            </p>
            <p>
              Les travaux de rénovation effectués par{' '}
              <strong>des professionnels agréés RGE</strong> (pompe à chaleur,
              poêle à granulés, isolation...).
            </p>
          </Card>
          <Card>
            <Image src={ptzImage} alt="Logo Eco-ptz" width="100" />
            <h2>
              <Link href="/aides/pret-taux-0">Les prêts à taux 0</Link>
            </h2>
            <p>
              <strong>L'éco-prêt à taux zéro</strong> (ou éco-PTZ) ainsi que le{' '}
              <strong>prêt avance rénovation</strong> (PAR+) sont accessibles{' '}
              <strong>sans condition de ressources</strong>
            </p>
            <p>
              Ces dispositifs visent à financer des travaux de rénovation
              énergétique des logements.
            </p>
          </Card>
          <Card>
            <Image
              src={exoFiscaleImage}
              alt="Logo Exonération Fiscale"
              width="100"
            />
            <h2>
              <Link href="/aides/exoneration-fiscale">
                Les exonérations fiscales
              </Link>
            </h2>
            <p>
              Les collectivités locales peuvent proposer une{' '}
              <strong>exonération de taxe foncière</strong> pour certains
              logements rénovés.
            </p>
            <p>
              Le <strong>dispositif Denormandie</strong> s'adresse quant à lui
              au propriétaire bailleur. Il a été prolongé jusqu'au 31 décembre
              2027.
            </p>
          </Card>
          <Card>
            <Image src={ceeImage} alt="Logo CEE" width="100" />
            <h2>
              <Link href="/aides/cee">
                Les aides des fournisseurs d’énergie (CEE)
              </Link>
            </h2>
            <p>
              Le dispositif des certificats d’économies d’énergie (CEE) est{' '}
              <strong>accessible pour tous</strong>.
            </p>
            <p>
              Des fournisseurs d'énergie proposent des aides pour rénover votre
              logement.
            </p>
            <p>
              Il s'agit d'une <strong>obligation encadrée par l’État</strong>.
            </p>
          </Card>
          <Card>
            <Image
              src={coupDePouceImage}
              alt="Logo Coup de pouce"
              width="100"
            />
            <h2>
              <Link href="/aides/coup-de-pouce">
                Les primes Coup de Pouce Chauffage
              </Link>
            </h2>
            <p>
              Les primes dites <em>"Coup de pouce"</em> sont{' '}
              <strong>accessibles à tous les ménages.</strong>
            </p>
            <p>
              Ils financent le{' '}
              <strong>remplacement d'un mode de chauffage polluant</strong>{' '}
              (chaudière au charbon, au fioul ou au gaz) par une installation
              moins énergivore.
            </p>
          </Card>
        </CardMosaic>
      </Section>
    </Main>
  )
}
