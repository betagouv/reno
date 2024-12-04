'use client'
import { useEffect, useMemo, useState } from 'react'
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
import { Line } from 'react-chartjs-2'

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
export default function StatistiquesInternes() {
  const [data, setData] = useState({
    global: null,
    site: null,
    iframe: null,
    module: null,
  })

  const fetchData = async () => {
    let res
    try {
      res = await fetch('/api/matomo?type=internes')
      const global = Object.entries(await res.json()).map(
        ([date, dayData]) => ({
          date: new Date(date),
          simuEnded: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
          uniqVisitors: dayData.nb_uniq_visitors,
        }),
      )

      res = await fetch('/api/matomo?type=internes&segment=site')
      const site = Object.entries(await res.json()).map(([date, dayData]) => ({
        date: new Date(date),
        simuEnded: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
        uniqVisitors: dayData.nb_uniq_visitors,
      }))

      res = await fetch('/api/matomo?type=internes&segment=iframe')
      const iframe = Object.entries(await res.json()).map(
        ([date, dayData]) => ({
          date: new Date(date),
          simuEnded: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
          uniqVisitors: dayData.nb_uniq_visitors,
        }),
      )

      res = await fetch('/api/matomo?type=internes&segment=module')
      const module = Object.entries(await res.json()).map(
        ([date, dayData]) => ({
          date: new Date(date),
          nbDisplay: dayData[0] ? dayData[0].step_nb_visits_actual : 0,
          nbInteraction: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
          nbClick: dayData[2] ? dayData[2].step_nb_visits_actual : 0,
        }),
      )
      // const totalTimeOnSite = Object.entries(data)
      //   .slice(-4)
      //   .reduce((acc, [, weekData]) => acc + weekData.avg_time_on_site, 0)

      // const transfoRateFranceRenov =
      //   (Object.values(dataLastMonth).reduce(
      //     (acc, curr) => acc + curr[2].step_nb_visits_actual,
      //     0,
      //   ) /
      //     nbSimuEndedMonth) *
      //   100

      // const avgTimeOnSite = formatTime(totalTimeOnSite / 4)
      setData({
        global,
        site,
        iframe,
        module,
      })
    } catch (error) {
      console.error('Error fetching visit data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const globalChart = useMemo(
    () => ({
      labels: data.global ? data.global.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.global ? data.global.map((entry) => entry.simuEnded) : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.global
            ? data.global.map((entry) => entry.uniqVisitors)
            : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.global],
  )

  const siteChart = useMemo(
    () => ({
      labels: data.site ? data.site.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.site ? data.site.map((entry) => entry.simuEnded) : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.site ? data.site.map((entry) => entry.uniqVisitors) : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.site],
  )

  const iframeChart = useMemo(
    () => ({
      labels: data.iframe ? data.iframe.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.iframe ? data.iframe.map((entry) => entry.simuEnded) : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.iframe
            ? data.iframe.map((entry) => entry.uniqVisitors)
            : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.iframe],
  )

  const moduleChart = useMemo(
    () => ({
      labels: data.module ? data.module.map((entry) => entry.date) : [],
      datasets: [
        {
          label: "Nombre d'affichage du module OFI",
          data: data.module ? data.module.map((entry) => entry.nbDisplay) : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
        {
          label: "% d'interaction",
          data: data.module
            ? data.module.map((entry) =>
                Math.round((entry.nbInteraction / entry.nbDisplay) * 100),
              )
            : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y2',
        },
        {
          label: '% de clic',
          data: data.module
            ? data.module.map((entry) =>
                Math.round((entry.nbClick / entry.nbInteraction) * 100),
              )
            : [],
          borderColor: '#00FF00',
          borderWidth: 1,
          backgroundColor: '#00FF00',
          yAxisID: 'y2',
        },
      ],
    }),
    [data.module],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'week',
            tooltipFormat: 'dd/MM/yyyy',
            displayFormats: { week: 'dd/MM/yyyy' },
          },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Nombre de simulation' },
        },
      },
    }),
    [],
  )

  const optionsModule = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'week',
            tooltipFormat: 'dd/MM/yyyy',
            displayFormats: { week: 'dd/MM/yyyy' },
          },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Nombre de simulation' },
        },
        y2: {
          beginAtZero: true,
          title: { display: true, text: 'Pourcentage' },
        },
      },
    }),
    [],
  )

  return (
    <Wrapper $background="white" $noMargin={true}>
      <Content
        css={`
          h3 {
            font-size: 1.1rem;
          }
        `}
      >
        <h2>Statistiques Internes</h2>
        <h3>Global</h3>
        {data.global && <Line data={globalChart} options={options} />}
        <h3>Site</h3>
        {data.site && <Line data={siteChart} options={options} />}
        <h3>Iframe</h3>
        {data.iframe && <Line data={iframeChart} options={options} />}
        <h3>Module OFI</h3>
        {data.module && <Line data={moduleChart} options={optionsModule} />}
      </Content>
    </Wrapper>
  )
}
