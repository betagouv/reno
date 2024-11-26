'use client'
import { useEffect, useMemo, useState } from 'react'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-date-fns'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import 'swiper/css'
import 'swiper/css/navigation'
import { dataInternes } from './pageData'
import { getSituation } from '@/components/publicodes/situationUtils'

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
)
export default function Statistiques() {
  const engine = new Publicodes(rules)
  const fetchTypeLogement = async () => {
    let maison = dataInternes.filter((d) => d.label.endsWith('maison"*'))
    let maisonTotal = maison.reduce((acc, cur) => acc + cur.nb_visits, 0)
    let appartement = dataInternes.filter((d) =>
      d.label.endsWith('appartement"*'),
    )
    let appartementTotal = appartement.reduce(
      (acc, cur) => acc + cur.nb_visits,
      0,
    )
  }

  const fetchCategorieRevenu = async () => {
    dataInternes
      .filter((d) => d.label.startsWith('/simulation') && d.label.endsWith('*'))
      .map((d) => {
        const url = new URL('https://mesaidesreno.beta.gouv.fr/' + d.label)
        console.log('url', url)
        const params = Object.fromEntries(new URLSearchParams(url.search))

        const keys = Object.keys(params)
        const lastKey = keys[keys.length - 1]
        // On ne considère que les users qui viennent de valider leur revenu pour éviter d'avoir des doublons
        console.log('lastKey', lastKey)
        console.log('params', params)
        if (lastKey != 'ménage.revenu') {
          return
        }

        let situation = getSituation(params, rules)
        let result = engine
          .setSituation(situation)
          .evaluate('ménage . revenu . classe')
        if (!result.missingVariables.length) {
          console.log('result', result)
          console.log('classe', result.nodeValue)
        }
        return d
      })
  }

  useEffect(() => {
    fetchTypeLogement()
    fetchCategorieRevenu()
  }, [])

  return (
    <div
      css={`
        h4 {
          font-size: 1rem;
        }
      `}
    >
      <Wrapper $background="white" $noMargin={true}>
        <Content
          css={`
            h3 {
              font-size: 1.1rem;
            }
          `}
        >
          <h2>Statistiques</h2>
          <p>
            <strong>Notre mission</strong> : simplifier l'accès à l'information
            sur les aides à la rénovation énergétique pour augmenter le nombre
            de personnes qui engagent des travaux de rénovation.
          </p>
          <h3>Données d'interaction avec le simulateur</h3>
        </Content>
      </Wrapper>
    </div>
  )
}
