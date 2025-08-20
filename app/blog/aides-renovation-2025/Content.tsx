import TableauRevenus from '@/components/TableauRevenus'
import Questions from '@/components/TableauRevenusQuestions'
import { Parcours, Tables } from './UI'
import { Card } from '@/components/UI'
import DPELabel from '@/components/dpe/DPELabel'
import { Suspense } from 'react'
import Link from 'next/link'
import ExampleBlock from './ExampleBlock'
import Badge from '@codegouvfr/react-dsfr/Badge'

export default function Content() {
  return (
    <section>
      <h2>Y a-t-il des aides publiques à la rénovation en 2025 ?</h2>
      <p>
        Oui, de nombreuses ! En 2025, la rénovation des logements et en
        particulier des passoires thermiques est plus que jamais une politique
        prioritaire.
      </p>
      <p>
        Le dispositif phare MaPrimeRénov' est reconduit, et l'enveloppe globale
        d'intervention de l'Agence nationale de l'habitat est augmentée de{' '}
        <em>600&nbsp;millions</em> d'€ par rapport aux moyens consommés en
        2024.{' '}
      </p>
      <p>
        De plus, MaPrimeRénov' est loin d'être le seul dispositif d'aide à la
        rénovation : prêts à taux zéro, exonérations d'impôt et de taxe
        foncière... tous les propriétaires de logements anciens peuvent
        bénéficier d'un bouquet d'aides à la rénovation.
      </p>
      <p>
        <strong>Suivez notre guide ⤵️ !</strong>
      </p>
      <h2>Des aides globalement stables en 2025</h2>
      <p>
        Dans l'ensemble, les aides à la rénovation ne sont que peu modifiées en
        2025.
      </p>
      <div>
        <p>
          Concernant MaPrimeRénov', le dispositif phare des aides à la
          rénovation energétique, la logique de choix entre deux parcours est
          inchangée :
        </p>
        <Parcours>
          <li>
            <Card>
              <h3>⭐ Parcours Accompagné</h3>
              <p>Des aides conséquentes pour 2 sauts de DPE</p>
            </Card>
          </li>
          <li>
            <Card>
              <h3>🧩️ Rénovation par gestes</h3>
              <p>Des aides ciblées pour une rénovation plus progressive</p>
            </Card>
          </li>
        </Parcours>
      </div>
      <ExampleBlock />
      <h2>Votre classe de revenu MaPrimeRénov' en 2025</h2>
      <p>
        Tous les ménages peuvent prétendre à des aides, même les plus aisés. Il
        n'en reste que le montant de chaque aide dépend fortement de votre{' '}
        <strong>classe de revenu</strong> : très modeste, modeste, intermédiaire
        ou supérieure.
      </p>
      <p>Découvrez ici le tableau des barèmes de revenu MaPrimeRénov' 2025.</p>
      <Suspense>
        <Questions />
        <Tables>
          <TableauRevenus
            dottedName={'ménage . revenu . barème'}
            headerTag="h3"
          />
          <TableauRevenus
            dottedName={'ménage . revenu . barème IdF'}
            headerTag="h3"
          />
        </Tables>
      </Suspense>
      <h2>Toujours autant d'aides, sauf pour les ménages aisés</h2>
      <p>
        Concernant le ⭐️ Parcours Accompagné, les taux d'aide ne changent pas
        en 2025 <strong>sauf pour les ménages au revenu supérieur</strong>.
      </p>
      <ul>
        <li>
          Pour 2 sauts de DPE, le financement MaPrimeRénov' parcours accompagné
          passe de 30 à 10 % des travaux.
        </li>
        <li>Pour 3 sauts de DPE, la subvention de 35 % est réduite à 15 %</li>
        <li>Pour 4 sauts de DPE, la subvention de 35 % est réduite à 20 %</li>
      </ul>
      <p>
        Dans chacun de ces trois cas, si les sauts mènent à une sortie de
        passoire énergétique (donc partant de <DPELabel index="5" /> ou{' '}
        <DPELabel index="6" />
        ), une bonification de 10 % s'ajoute toujours en 2025, y compris pour
        les ménages au revenu supérieur.
      </p>
      <h2>Mais des plafonds maximum relevés</h2>
      <p>
        Les aides publiques sont dites "écrêtées", c'est-à-dire qu'en les
        cumulant toutes, le taux de subvention ne peut pas dépasser un maximum.
      </p>
      <p>
        En 2025, ce maximum augmente pour les ménages aux revenus
        intermédiaires, passant de 60 à 80 %, et pour les revenus supérieurs,
        passant de 40 à 50 %.
      </p>
      <blockquote>
        Ces hausses du taux d'écrêtement pourront être l'occasion pour les
        collectivités locales de proposer en 2025 des compléments d'aide pour
        les ménages plus aisés.
      </blockquote>
      <h2>Une baisse de l'avance pour les ménages modestes</h2>
      <p>
        Les aides MaPrimeRénov' sont des subventions versées après travaux : une
        fois le dossier de subvention effectué, les ménages peuvent lancer les
        travaux, et les subventions seront versées par la suite.
      </p>
      <p>
        Mais pour aider les ménages modestes et très modestes à payer les
        factures, une avance des aides de l'État peut être demandée. Elle était
        de 70 % de MaPrimeRénov' en 2024, mais diminue à 30 % en 2025 pour
        MaPrimeRénov’ parcours accompagné (pour une rénovation d’ampleur), et à
        50 % pour MaPrimeRénov’ rénovation par geste où l'avance est réservée
        aux ménages très modestes uniquement.
      </p>
      <p>
        Cela dit, en 2025 l'éco-prêt à taux zéro (éco-PTZ) reste l'une des
        principales aides et permet de financer ce reste à charge MaPrimeRénov'.
      </p>
      <p>
        Depuis le 1er septembre 2024, en plus de l'éco-PTZ, pour les foyers
        modestes un nouveau prêt sans intérêts est disponible : le prêt avance
        rénovation, aussi nommé{' '}
        <a
          className="fr-link"
          rel="noopener external"
          href="https://www.service-public.fr/particuliers/vosdroits/F38425"
        >
          PAR+
        </a>
        .
      </p>
      <h2>Moins d'aides pour les gestes chauffages au bois 🪵</h2>
      <p>
        En 2025, les montants d'aide des gestes du 🧩️&nbsp;Parcours par gestes
        ne changent pas, <strong>sauf les 5 types de chauffage au bois</strong>,
        qui diminuent chacun de 30 % quelle que soit la catégorie de revenu.
      </p>
      <blockquote>
        À titre d'exemple, les chaudières à granulés automatiques restent
        toujours largement subventionnées, de{' '}
        <Badge severity="success">2 100 €</Badge> pour les ménages aux revenus
        intermédiaires jusqu'à <Badge severity="success">5 000 €</Badge> pour
        les ménages aux revenus très modestes.
      </blockquote>
      <h2>Interdiction à la location des passoires classées G</h2>
      <p>
        Enfin rappelons qu'au 1er janvier 2025, il est interdit de mettre en
        nouvelle location (nouveau contrat de bail ou renouvellement et
        reconduction tacites) une passoire thermique de DPE{' '}
        <DPELabel index={6} />.
      </p>
      <p>
        La prochaine échéance sera dans 3 ans, en 2028. Consultez le{' '}
        <Link
          className="fr-link"
          href="/blog/interdiction-location-passoire-thermique"
        >
          calendrier des interdictions de location
        </Link>
        .
      </p>
      <blockquote>
        Votre logement en location est dans une copropriété ? Les aides
        MaPrimeRénov' Copropriété restent stable en 2025, découvrez-les dans
        notre 🏙️{' '}
        <Link className="fr-link" href="/copropriete">
          parcours copro'
        </Link>
        .
      </blockquote>
      <h2>Au-delà de MaPrimeRénov', de multiples aides en 2025</h2>
      <p>
        Éco-PTZ, prêt avance rénovation, exonération de la taxe foncière,
        dispositif Denormandie... les aides à la rénovation sont nombreuses.
      </p>
      <p>
        Mes Aides Réno vous aide à calculer vos aides et choisir le parcours le
        plus adapté pour votre projet.
      </p>
    </section>
  )
}
