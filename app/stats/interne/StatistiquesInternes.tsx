'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
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
import { formatter, formatTime, StatCard } from '../Statistiques'
ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarController,
  BarElement,
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

  const fetchSegmentData = async (segment: string = '') => {
    const response = await fetch(`/api/matomo?type=internes&segment=${segment}`)
    const json = await response.json()

    return Object.entries(json).map(([date, dayData]: [string, any]) => ({
      date: new Date(date),
      simuEnded: dayData[1]?.step_nb_visits_actual || 0,
      uniqVisitors: dayData.nb_uniq_visitors,
      avgTime: dayData.avg_time_on_site,
      nbActions: dayData.nb_actions_per_visit,
      nbDisplay: dayData[0]?.step_nb_visits_actual || 0,
      nbInteraction: dayData[1]?.step_nb_visits_actual || 0,
      nbClick: dayData[2]?.step_nb_visits_actual || 0,
    }))
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const global = await fetchSegmentData()
        setData((prev) => ({ ...prev, global }))
        const site = await fetchSegmentData('site')
        setData((prev) => ({ ...prev, site }))
        const iframe = await fetchSegmentData('iframe')
        setData((prev) => ({ ...prev, iframe }))
        const module = await fetchSegmentData('module')
        setData((prev) => ({ ...prev, module }))
      } catch (error) {
        console.error('Error fetching visit data:', error)
      }
    }
    fetchData()
  }, [])

  const generateChartConfig = (data, labels, yAxisConfig = {}) => ({
    labels: data ? data.map((entry) => entry.date) : [],
    datasets: labels.map((labelConfig) => ({
      label: labelConfig.label,
      data: data ? data.map((entry) => labelConfig.getData(entry)) : [],
      borderColor: labelConfig.borderColor,
      backgroundColor: labelConfig.backgroundColor,
      borderWidth: 1,
      type: labelConfig.type,
      yAxisID: labelConfig.yAxisID || 'y',
    })),
    ...yAxisConfig,
  })

  const dataSets = [
    {
      label: 'Nombre de simulations terminées',
      getData: (entry) => entry.simuEnded,
      borderColor: '#000091',
      backgroundColor: '#2a82dd',
    },
    {
      label: 'Nombre de visiteurs uniques',
      getData: (entry) => entry.uniqVisitors,
      borderColor: '#ff5c8d',
      backgroundColor: '#ff97b5',
    },
    {
      label: 'Durée de la visite',
      getData: (entry) => entry.avgTime,
      borderColor: '#CCC',
      backgroundColor: '#CCC',
      yAxisID: 'y2',
      type: 'bar',
    },
  ]

  const globalChart = useMemo(
    () => generateChartConfig(data.global, dataSets),
    [data.global],
  )

  const siteChart = useMemo(
    () => generateChartConfig(data.site, dataSets),
    [data.site],
  )

  const iframeChart = useMemo(
    () => generateChartConfig(data.iframe, dataSets),
    [data.iframe],
  )

  const moduleChart = useMemo(
    () =>
      generateChartConfig(data.module, [
        {
          label: "Nombre d'affichage du module OFI",
          getData: (entry) => entry.nbDisplay,
          borderColor: '#ff5c8d',
          backgroundColor: '#ff97b5',
        },
        {
          label: "% d'interaction",
          getData: (entry) =>
            Math.round((entry.nbInteraction / entry.nbDisplay) * 100),
          borderColor: '#000091',
          backgroundColor: '#2a82dd',
          yAxisID: 'y2',
          type: 'line',
        },
        {
          label: '% de clic',
          getData: (entry) =>
            Math.round((entry.nbClick / entry.nbDisplay) * 100),
          borderColor: '#00FF00',
          backgroundColor: '#00FF00',
          yAxisID: 'y2',
          type: 'line',
        },
        {
          label: 'Durée de la visite',
          getData: (entry) => entry.avgTime,
          borderColor: '#CCC',
          backgroundColor: '#CCC',
        },
      ]),
    [data.module],
  )

  const createChartOptions = (customScales = {}) => ({
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ''
            const value = context.raw

            if (label === 'Durée de la visite') {
              return `${label}: ${formatTime(value)}`
            }
            return `${label}: ${value}`
          },
        },
      },
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
      ...customScales,
    },
  })

  const options = useMemo(
    () =>
      createChartOptions({
        y2: {
          beginAtZero: true,
          position: 'right',
          title: { display: true, text: 'Durée de la visite' },
          grid: { display: false },
          ticks: {
            callback: (value) => formatTime(value),
          },
        },
      }),
    [],
  )
  const optionsModule = useMemo(
    () =>
      createChartOptions({
        y2: {
          beginAtZero: true,
          position: 'right',
          title: { display: true, text: 'Taux de transfo' },
          grid: { display: false },
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
        {[
          { title: 'Global', data: data.global, chart: globalChart, options },
          { title: 'Site', data: data.site, chart: siteChart, options },
          { title: 'Iframe', data: data.iframe, chart: iframeChart, options },
          {
            title: 'Module',
            data: data.module,
            chart: moduleChart,
            options: optionsModule,
          },
        ].map(({ title, data, chart, options }, index) => {
          return (
            <section key={index}>
              <h3>{title}</h3>
              <p
                css={`
                  color: #0974f6 !important;
                  font-weight: bold;
                `}
              >
                Sur les 30 derniers jours :
              </p>
              {data && (
                <>
                  <div
                    css={`
                      display: flex;
                      gap: 1rem;
                    `}
                  >
                    <StatCard
                      label={
                        title === 'Module'
                          ? 'Clic sur<br />Découvrir mes aides'
                          : 'Simulations terminées'
                      }
                      value={formatter.format(
                        data.reduce((a, c) => a + c.simuEnded, 0),
                      )}
                      noMinWidth
                    />
                    <StatCard
                      label="Durée moyenne<br />des sessions"
                      value={formatTime(
                        data.reduce((a, c) => a + (c.avgTime || 0), 0) /
                          data.filter((e) => e.uniqVisitors > 0).length,
                      )}
                      noMinWidth
                    />
                    <StatCard
                      label="Nombre d'action"
                      value={Math.round(
                        data.reduce((a, c) => a + (c.nbActions || 0), 0) /
                          data.filter((e) => e.uniqVisitors > 0).length,
                      )}
                      noMinWidth
                    />
                    <StatCard
                      label="Taux de transformation"
                      value={
                        Math.round(
                          (data.reduce((a, c) => a + c.nbClick, 0) /
                            data.reduce((a, c) => a + c.simuEnded, 0)) *
                            100,
                        ) + '%'
                      }
                      noMinWidth
                    />
                  </div>
                  <Line data={chart} options={options} />
                </>
              )}
            </section>
          )
        })}
      </Content>
    </Wrapper>
  )
}
