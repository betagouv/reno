'use client'

import { Suspense, useEffect, useState } from 'react'
import css from '@/components/css/convertToJs'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import Papa from 'papaparse'
import { StatCard } from '../stats/Statistiques'
import { Loader, PageBlock } from '@/components/UI'
import { useSearchParams } from 'next/navigation'

const engine = new Publicodes(rules)

const dpeData = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 }
const incomeClasses = {
  TMO: 'très modeste',
  MO: 'modeste',
}

function DataAnahContent() {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const subsetLength = 1000
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ diffus: 0, bailleur: 0, autre: 0 })
  const calculateRowData = (row) => {
    const situation = {
      'logement . propriétaire occupant': 'oui',
      'logement . période de construction': 'de 15 à 25 ans',
      'logement . résidence principale propriétaire': 'oui',
      'logement . surface': '150',
      'logement . type': 'maison',
      'ménage . code département': '53',
      'ménage . code région': '52',
      'ménage . commune': '"' + row['com_insee'] + '"',
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

    let bestCategory = '?'
    let smallestDifference = Infinity

    for (const [incomeClass, label] of Object.entries(incomeClasses)) {
      situation['ménage . revenu . classe'] = `"${label}"`
      const calculatedAid = Math.round(
        engine.setSituation(situation).evaluate('MPR . accompagnée . montant')
          .nodeValue || 0,
      )
      row[`montant aide ${incomeClass}`] = calculatedAid

      const difference = Math.abs(row['mt_subv_anah'] - calculatedAid)
      if (difference === 0) {
        row[`Catégorie`] = incomeClass
        row[`Montant MesAidesRéno`] = calculatedAid
        return row
      }

      if (difference < smallestDifference) {
        smallestDifference = difference
        bestCategory = incomeClass
      }
    }

    row[`Catégorie`] = bestCategory
    row[`Montant MesAidesRéno`] = row[`montant aide ${bestCategory}`]
    row['ecart'] = smallestDifference
    if (row['ecart'] != 0) {
      updateErrorCounts(
        row['stc_code'] === 'DIFFUS'
          ? 'diffus'
          : row['tdm_code'] === 'PB'
            ? 'bailleur'
            : 'autre',
      )
    }
    return row
  }

  const updateErrorCounts = (type) => {
    setError((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://mardata.osc-fr1.scalingo.io/file/` +
            searchParams.key +
            '/2024/mpra_tmo_mo_2024_10',
        )

        if (!response.ok) throw new Error('Failed to fetch CSV data')

        Papa.parse(await response.text(), {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setError({ diffus: 0, bailleur: 0, autre: 0 })
            const selectedColumns = {
              'N° dossier': 'dos_numero',
              Propriétaire: 'tdm_code',
              DPE: 'lgt_etiquette_dpe',
              'DPE visé': 'lgt_etiquette_dpe_proj',
              'Montant travaux': 'mt_tvx_eligibles',
              '% aide réel': '% aide réel',
              Catégorie: 'Catégorie',
              'Montant ANAH': 'mt_subv_anah',
              'Montant MesAidesRéno': 'Montant MesAidesRéno',
              Ecart: 'ecart',
              stc_code: 'stc_code',
            }

            setColumns(selectedColumns)
            const filteredData = results.data
              .slice(0, subsetLength)
              .map(calculateRowData)
              .filter((r) => r.ecart) // On n'affiche que les lignes en erreur
            setTableData(filteredData)
          },
        })
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Suspense>
      <main
        style={css`
          padding: 2rem;
        `}
      >
        <PageBlock>
          <h1>Vérification MPRA Locale</h1>
          {loading ? (
            <Loader></Loader>
          ) : (
            <>
              <div
                css={`
                  display: flex;
                  gap: 1rem;
                  justify-content: center;
                  margin-bottom: 1rem;
                `}
              >
                <StatCard
                  label={`% d'erreur sur les diffus (${error?.diffus} / ${tableData.filter((r) => r['stc_code'] == 'DIFFUS').length})`}
                  value={Math.round(
                    (error?.diffus /
                      tableData.filter((r) => r['stc_code'] == 'DIFFUS')
                        .length) *
                      100,
                  )}
                />
                <StatCard
                  label={`% d'erreur sur les bailleurs (${error?.bailleur} / ${tableData.filter((r) => r['tdm_code'] == 'PB').length})`}
                  value={Math.round(
                    (error?.bailleur /
                      tableData.filter((r) => r['tdm_code'] == 'PB').length) *
                      100,
                  )}
                />
                <StatCard
                  label="% d'erreur sur le reste"
                  value={Math.round((error?.autre / subsetLength) * 100)}
                />
              </div>
              <table
                css={`
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1rem 0;
                  font-size: 1rem;
                  text-align: left;

                  th,
                  td {
                    padding: 0.75rem 1rem;
                    border: 1px solid #ddd;
                  }

                  th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                  }

                  tr:nth-child(even) {
                    background-color: #f9f9f9;
                  }

                  tr:hover {
                    background-color: #f1f1f1;
                  }
                `}
              >
                <thead>
                  <tr>
                    {Object.keys(columns).map((col, i) => (
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
                          className={
                            col === 'ecart' && row['ecart'] !== 0
                              ? 'error'
                              : col !== 'mt_subv_anah' &&
                                  row[col] === row['mt_subv_anah']
                                ? 'highlight'
                                : ''
                          }
                        >
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </PageBlock>
      </main>
    </Suspense>
  )
}

export default function DataAnah() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DataAnahContent />
    </Suspense>
  )
}
