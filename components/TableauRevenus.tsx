import rules from '@/app/règles/rules'
import { Small } from './TableauRevenusUI'

const dottedName = 'ménage . revenu . barème'

export default function TableauRevenus() {
  const rule = rules[dottedName]

  return (
    <table>
      <thead>
        <tr>
          <td></td>
          <td colSpan={4}>Revenu fiscal de référence du ménage</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Nombre de personnes composant le foyer</th>
          <th scope="col">
            <span>BLEU</span>
            (revenus très modestes)
          </th>
          <th scope="col">
            <span>JAUNE</span>
            (revenus modestes)
          </th>
          <th scope="col">
            <span>VIOLET</span>
            (revenus intermédiaires)
          </th>
          <th scope="col">
            <span>ROSE</span>
            (revenus supérieurs)
          </th>
        </tr>
        {rule.formule.variations.map((variation) => {
          if (!variation.si) {
            const list = variation.sinon.variations
            return (
              <tr>
                {list.map((element, i) => (
                  <td>{element.si}</td>
                ))}
              </tr>
            )
          }
          const variations2 = variation.alors.variations

          const personnes = variation.si.match(/\d/)
          return (
            <tr>
              <th scope="row">{personnes}</th>
              {variations2.map((variation2, i) => {
                if (!variation2.si) {
                  const threshold = variations2[i - 1].si.match(/\d\d\d\d\d/)
                  const formatted = formatter(threshold)
                  return (
                    <td>
                      <Small>À partir de</Small> {formatted} €
                    </td>
                  )
                }
                const threshold = variation2.si.match(/\d\d\d\d\d/)
                const formatted = formatter(threshold)
                return (
                  <td>
                    <Small>Jusqu'à</Small> {formatted} €
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const frenchFormatter = new Intl.NumberFormat('fr-FR')
const formatter = (num) => frenchFormatter.format(num)
