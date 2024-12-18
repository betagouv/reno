import rules from '@/app/règles/rules'
import { Small, Table } from './TableauRevenusUI'

const dottedName = 'ménage . revenu . barème'

const colors = {
  bleu: { color: '#0063cb', label: 'très modestes' },
  jaune: { color: '#a36b00', label: 'modestes' },
  violet: { color: '#a558a0', label: 'intermédiaires' },
  rose: { color: '#a94645', label: 'supérieurs' },
}
export default function TableauRevenus() {
  const rule = rules[dottedName]

  return (
    <Table>
      <thead>
        <tr>
          <td></td>
          <td colSpan={4}>Revenu fiscal de référence du ménage</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Nombre de personnes composant le foyer</th>
          {Object.entries(colors).map(([colorName, { color, label }]) => (
            <th scope="col">
              <span style={{ color, textTransform: 'uppercase' }}>
                {colorName}
              </span>
              <div>revenus {label}</div>
            </th>
          ))}
        </tr>
        {rule.formule.variations.map((variation) => {
          if (!variation.si) {
            const list = variation.sinon.variations
            return (
              <tr>
                <th scope="row">Par personne supplémentaire</th>
                {list.map((element, i) => {
                  const si = i < list.length - 1 ? element.si : list[i - 1].si
                  const num = si.match(/\d\d\d\d/)
                  const formatted = formatter(num)
                  return <td>{formatted} €</td>
                })}
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
                    <td key={'apartir' + threshold}>
                      <Small>À partir de</Small> {formatted} €
                    </td>
                  )
                }
                const threshold = variation2.si.match(/\d\d\d\d\d/)
                const formatted = formatter(threshold)
                return (
                  <td key={'jusqua' + threshold}>
                    <Small>Jusqu'à</Small> {formatted} €
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

const frenchFormatter = new Intl.NumberFormat('fr-FR')
const formatter = (num) => frenchFormatter.format(num)
