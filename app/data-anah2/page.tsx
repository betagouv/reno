'use client'

import { useEffect, useState } from 'react'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import Papa from 'papaparse'
import { useSearchParams } from 'next/navigation'

export default function DataAnah2() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const engine = new Publicodes(rules)

  const dpeData = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 }
  const incomeClasses = {
    TMO: '"très modeste"',
    MO: '"modeste"',
    INT: '"intermédiaire"',
    SUP: '"supérieure"',
  }

  const calculateRowData = (row) => {
    let dpeAct =
      dpeData[row['etiquette_init'] ? row['etiquette_init'] : row['dpeact']]

    let dpeVise =
      dpeData[
        row['etiquette_finale'] ? row['etiquette_finale'] : row['dpeproj']
      ]
    const situation = {
      'logement . propriétaire occupant': 'oui',
      'logement . période de construction': 'de 15 à 25 ans',
      'logement . résidence principale propriétaire': 'oui',
      'logement . surface': row['surface_habitable']
        ? row['surface_habitable']
        : '150',
      'logement . type': 'maison',
      'ménage . code département': row['dept'] ? row['dept'] : '53',
      'ménage . commune': row['codeinsee'] ? row['codeinsee'] : '53096',
      'ménage . personnes': row['occupantsnumber'],
      'vous . propriétaire . statut': 'propriétaire',
      'ménage . revenu . classe': incomeClasses[row['hometype']],
      'DPE . actuel': dpeAct,
      'projet . DPE visé': dpeVise,
      'projet . travaux': row['ttmtttcplanfin'],
    }

    row['montant aide calculée'] = Math.round(
      engine.setSituation(situation).evaluate('ampleur . montant').nodeValue,
    )

    row['ecart'] = Math.round(
      Math.abs(row['ttmtwp'] - row['montant aide calculée']),
    )

    return row
  }

  useEffect(() => {
    const fetchData = async () => {
      // const response = await fetch(
      //   `https://mardata.osc-fr1.scalingo.io/file/` +
      //     searchParams.key +
      //     '/2024/mpra_int_sup_2024_10',
      // )
      const response = await fetch('/mpra_int_sup_2024_10.csv')
      const csvText = await response.text()

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const selectedColumns = {
            'N° dossier': 'pyiddos',
            Propriétaire: 'typebenef',
            Catégorie: 'hometype',
            DPE: 'etiquette_init',
            'DPE visé': 'etiquette_finale',
            'Montant travaux TTC': 'ttmtttcplanfin',
            'Montant aide ANAH': 'ttmtwp',
            'Montant aide MesAidesRéno': 'montant aide calculée',
            Ecart: 'ecart',
          }

          setColumns(selectedColumns)

          const filteredData = results.data
            .slice(0, 5000)
            .filter(
              (r) =>
                r['etiquette_init'] &&
                r['dispositif'] == 'MPR PA Nouveau' &&
                r['pystatuswork'] != 'Solde en cours de montage',
            )
            .map(calculateRowData)
          setTableData(filteredData)
        },
      })
    }

    fetchData()
  }, [])
  return (
    <div>
      <h1>Vérification MPRA Nat</h1>
      <table border="1">
        <thead>
          <tr>
            <th>N°</th>
            {Object.keys(columns).map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {Object.values(columns).map((col) => (
                <td
                  key={col}
                  style={
                    col === 'ecart' && row['ecart'] == 0
                      ? { background: 'lightgreen' }
                      : col == 'ecart' && row['ecart'] != 0
                        ? { color: 'red' }
                        : undefined
                  }
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
