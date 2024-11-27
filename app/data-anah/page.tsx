'use client'

import { useEffect, useState } from 'react'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import Papa from 'papaparse'

export default function CsvTable() {
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const engine = new Publicodes(rules)

  const dpeData = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 }
  const incomeClasses = {
    TMO: 'très modeste',
    MO: 'modeste',
    INT: 'intermédiaire',
    SUP: 'supérieure',
  }

  const calculateRowData = (row) => {
    const situation = {
      'logement . propriétaire occupant': 'oui',
      'logement . période de construction': 'de 15 à 25 ans',
      'logement . résidence principale propriétaire': 'oui',
      'logement . surface': '150',
      'logement . type': 'maison',
      'ménage . code département': '53',
      'ménage . code région': '52',
      'ménage . commune': '"53096"',
      'ménage . commune . nom': '"Ernée"',
      'ménage . personnes': '2',
      'vous . propriétaire . statut': 'propriétaire',
      'DPE . actuel': dpeData[row['lgt_etiquette_dpe']],
      'projet . DPE visé': dpeData[row['lgt_etiquette_dpe_proj']],
      'projet . travaux': row['mt_tvx_eligibles'],
    }

    row['% aide réel'] = Math.round(
      (row['mt_subv_anah'] / row['mt_tvx_eligibles']) * 100,
    )

    let amountFound = false
    let ecart = 9999
    Object.keys(incomeClasses).map((incomeClass) => {
      situation['ménage . revenu . classe'] = `"${incomeClasses[incomeClass]}"`
      row[`montant aide ${incomeClass}`] = Math.round(
        engine.setSituation(situation).evaluate('MPR . accompagnée . montant')
          .nodeValue || 0,
      )
      let tmpEcart = Math.abs(
        row['mt_subv_anah'] - row[`montant aide ${incomeClass}`],
      )
      if (row['mt_subv_anah'] == row[`montant aide ${incomeClass}`]) {
        amountFound = true
      }
      if (tmpEcart < ecart) {
        ecart = tmpEcart
      }
    })
    row['ecart'] = ecart

    return row
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/combined.csv')
      const csvText = await response.text()

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const selectedColumns = {
            'N° dossier': 'dos_numero',
            Propriétaire: 'tdm_code',
            DPE: 'lgt_etiquette_dpe',
            'DPE visé': 'lgt_etiquette_dpe_proj',
            'Montant travaux': 'mt_tvx_eligibles',
            'Montant aide ANAH': 'mt_subv_anah',
            Ecart: 'ecart',
            '% aide réel': '% aide réel',
            'montant aide TMO': 'montant aide TMO',
            'montant aide MO': 'montant aide MO',
            'montant aide INT': 'montant aide INT',
            'montant aide SUP': 'montant aide SUP',
          }

          setColumns(selectedColumns)

          const filteredData = results.data.slice(0, 100).map(calculateRowData)
          setTableData(filteredData)
        },
      })
    }

    fetchData()
  }, [])
  return (
    <div>
      <h1>Vérification MPRA Locale</h1>
      <table border="1">
        <thead>
          <tr>
            {Object.keys(columns).map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(columns).map((col) => (
                <td
                  key={col}
                  style={
                    col !== 'mt_subv_anah' && row[col] == row['mt_subv_anah']
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
