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
    globalData: null,
    siteData: null,
    iframeData: null,
    moduleData: null,
  })

  const fetchData = async () => {
    let res
    try {
      res = await fetch('/api/matomo?type=internes')
      const globalData = Object.entries(await res.json()).map(
        ([date, dayData]) => ({
          date: new Date(date),
          simuEnded: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
          uniqVisitors: dayData.nb_uniq_visitors,
        }),
      )

      res = await fetch('/api/matomo?type=internes&segment=site')
      const siteData = Object.entries(await res.json()).map(
        ([date, dayData]) => ({
          date: new Date(date),
          simuEnded: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
          uniqVisitors: dayData.nb_uniq_visitors,
        }),
      )

      res = await fetch('/api/matomo?type=internes&segment=iframe')
      const iframeData = Object.entries(await res.json()).map(
        ([date, dayData]) => ({
          date: new Date(date),
          simuEnded: dayData[1] ? dayData[1].step_nb_visits_actual : 0,
          uniqVisitors: dayData.nb_uniq_visitors,
        }),
      )

      const moduleData = null
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
        globalData,
        siteData,
        iframeData,
        moduleData,
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
      labels: data.globalData ? data.globalData.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.globalData
            ? data.globalData.map((entry) => entry.simuEnded)
            : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.globalData
            ? data.globalData.map((entry) => entry.uniqVisitors)
            : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.globalData],
  )

  const siteChart = useMemo(
    () => ({
      labels: data.siteData ? data.siteData.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.siteData
            ? data.siteData.map((entry) => entry.simuEnded)
            : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.siteData
            ? data.siteData.map((entry) => entry.uniqVisitors)
            : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.siteData],
  )

  const iframeChart = useMemo(
    () => ({
      labels: data.iframeData ? data.iframeData.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.iframeData
            ? data.iframeData.map((entry) => entry.simuEnded)
            : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.iframeData
            ? data.iframeData.map((entry) => entry.uniqVisitors)
            : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.iframeData],
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
        {data.globalData && <Line data={globalChart} options={options} />}
        <h3>Site</h3>
        {data.siteData && <Line data={siteChart} options={options} />}

        <h3>Iframe</h3>
        {data.iframeData && <Line data={iframeChart} options={options} />}

        <h3>Module</h3>
        {data.weeklyData && <Line data={chartData} options={options} />}
      </Content>
    </Wrapper>
  )
}
