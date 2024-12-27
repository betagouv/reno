'use client'
import rules from '@/app/règles/rules'
import { Small, Table, TableWrapper, Tr } from './TableauRevenusUI'
import { useSearchParams } from 'next/navigation'
import styled from 'styled-components'

const colors = {
  bleu: { color: '#0063cb', label: 'très modestes' },
  jaune: { color: '#a36b00', label: 'modestes' },
  violet: { color: '#a558a0', label: 'intermédiaires' },
  rose: { color: '#a94645', label: 'supérieurs' },
}
const HeaderTag = styled.h2``
export default function TableauRevenus({ dottedName, headerTag = 'h2' }) {
  const rule = rules[dottedName]

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const personnes = +searchParams['ménage.personnes']
  return (
    <section>
      <HeaderTag as={headerTag}>{rule.titre}</HeaderTag>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <td></td>
              <td colSpan={4}>Revenu fiscal de référence</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Nombre de personnes composant le foyer</th>
              {Object.entries(colors).map(([colorName, { color, label }]) => (
                <th scope="col">
                  <span style={{ color, textTransform: 'uppercase' }}>
                    <strong>{colorName}</strong>
                  </span>
                  <div>
                    revenus <strong>{label}</strong>
                  </div>
                </th>
              ))}
            </tr>
            {rule.formule.variations.map((variation, i) => {
              if (!variation.si) {
                const list = variation.sinon.variations
                return (
                  <Tr $active={personnes > 5}>
                    <th scope="row">Par personne supplémentaire</th>
                    {list.map((element, i) => {
                      const si =
                        i < list.length - 1 ? element.si : list[i - 1].si
                      const num = si.match(/(\d+)\s€/)[1]
                      const formatted = formatter(num)
                      return <td>+ {formatted} €</td>
                    })}
                  </Tr>
                )
              }
              const variations2 = variation.alors.variations

              const tablePersonnes = variation.si.match(/\d/)
              return (
                <Tr $active={personnes === i + 1}>
                  <th scope="row">{tablePersonnes}</th>
                  {variations2.map((variation2, i) => {
                    if (!variation2.si) {
                      const threshold =
                        variations2[i - 1].si.match(/\d\d\d\d\d/)
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
                </Tr>
              )
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </section>
  )
}

const frenchFormatter = new Intl.NumberFormat('fr-FR')
const formatter = (num) => frenchFormatter.format(num)
