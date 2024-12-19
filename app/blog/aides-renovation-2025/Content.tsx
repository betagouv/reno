import TableauRevenus from '@/components/TableauRevenus'
import Questions from '@/components/TableauRevenusQuestions'
import { Parcours } from './UI'
import { Card } from '@/components/UI'
import DPELabel from '@/components/DPELabel'
import { Suspense } from 'react'

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
        Le dispositif phare MaPrimeRénov' est reconduit. C'est pourtant loin
        d'être le seul : prêts à taux zéro, exonérations d'impôt et de taxe
        foncière... tous les propriétaires de logements anciens peuvent
        bénéficier d'un bouquet d'aides à la rénovation.
      </p>

      <p>Pour s'y retrouver, suivez ce guide !</p>
      <h2>Des aides globalement stables en 2025</h2>
      <p>
        Dans l'ensemble, les aides à la rénovation ne sont que peu modifiées en
        2025.
      </p>
      <p>
        Concernant MaPrimeRénov', le dispositif phare des aides à la rénovation
        energétique, la logique de choix entre deux parcours est inchangée :
        <Parcours>
          <li>
            <Card>
              <h3>⭐ Parcours ampleur</h3>
              <p>Des aides conséquentes pour 2 sauts de DPE</p>
            </Card>
          </li>
          <li>
            <Card>
              <h3>🧩️ Parcours par gestes</h3>
              <p>Des aides ciblées pour une rénovation plus progressive</p>
            </Card>
          </li>
        </Parcours>
      </p>
      <h2>Votre classe de revenu MaPrimeRénov' en 2025</h2>

      <p>
        Tous les ménages peuvent prétendre à des aides, même les plus aisés. Il
        n'en reste que le montant de chaque aide dépend fortement de votre
        **classe de revenu** : très modeste, modeste, intermédiaire ou
        supérieure.
      </p>
      <p>Découvrez ici le tableau des barèmes de revenu MaPrimeRénov' 2025.</p>

      <Suspense>
        <Questions />
        <TableauRevenus dottedName={'ménage . revenu . barème'} />
        <TableauRevenus dottedName={'ménage . revenu . barème IdF'} />
      </Suspense>
      <h2>Toujours autant d'aides, sauf pour les ménages aisés</h2>
      <p>TODO : ici le tableau des aides MPRA</p>
      <h2>Mais des plafonds maximum relevés</h2>
      <p>TODO la liste des écrêtements, parler des aides locales</p>
      <h2>Une baisse de l'avance pour les ménages modestes</h2>
      <p>
        Parler du PTZ et du PAM qui lui est nouveau, et comble clairement ce
        manque
      </p>
      <h2>Moins d'aides par geste pour les chauffages au bois</h2>
      <p>30 % de moins. TODO répertoire des aides par geste ici</p>
      <h2>Interdiction de location des passoires thermiques</h2>

      <p>
        Au 1er janvier 2025, il est interdit de mettre en nouvelle location une
        passoire thermique de <DPELabel index={6} />.
      </p>
      <p>Lien vers notre parcours copro ici.</p>
    </section>
  )
}
