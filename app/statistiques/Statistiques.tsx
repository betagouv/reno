'use client'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
)

export default function Statistiques() {
  const [weeklySimulationEnded, setWeeklySimulationEnded] = useState(null)

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const response = await fetch('/api/matomo')
        if (!response.ok) throw new Error('Failed to fetch visit data')
        const data = await response.json()

        // Parse data
        const weeklySimuEnded = []
        Object.entries(data).forEach(([dateRange, steps]) => {
          const startDate = dateRange.split(',')[1] // Extract the starting date
          weeklySimuEnded.push({
            date: new Date(startDate),
            visits: steps[2].step_nb_visits_actual,
            transfoRate:
              Math.round(
                (steps[2].step_nb_visits_actual /
                  steps[1].step_nb_visits_actual) *
                  10000,
              ) / 100,
          })
        })
        console.log('weeklySimuEnded', weeklySimuEnded)
        setWeeklySimulationEnded(weeklySimuEnded)
      } catch (error) {
        console.error('Error fetching visit data:', error)
      }
    }

    fetchVisitData()
  }, [])

  const chartData = {
    labels: weeklySimulationEnded
      ? weeklySimulationEnded.map((entry) => entry.date)
      : [],
    datasets: [
      {
        label: 'Nombre de simulation terminées',
        data: weeklySimulationEnded
          ? weeklySimulationEnded.map((entry) => entry.visits)
          : [],
        borderColor: '#000091',
        borderWidth: 1,
        backgroundColor: '#2a82dd',
        fill: true,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Taux de transformation (%)',
        data: weeklySimulationEnded
          ? weeklySimulationEnded.map((entry) => entry.transfoRate)
          : [],
        borderColor: '#FF5733',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
        yAxisID: 'y1',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      annotation: {
        annotations: {
          objectifLine: {
            type: 'line',
            yMin: 25000,
            yMax: 25000,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              display: true,
              content: 'Objectif: 25k',
              enabled: true,
              position: 'center',
              color: 'white',
              backgroundColor: 'red',
              font: {
                size: 14,
              },
              padding: { top: 5, bottom: 5, left: 5, right: 5 },
              margin: { top: -8 },
            },
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'yyyy-MM-dd',
          displayFormats: {
            week: 'yyyy-MM-dd',
          },
        },
      },
      y: {
        max: 30000,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de simulation',
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Taux de transformation (%)',
        },
      },
    },
  }

  return (
    <div>
      <h2>Statistiques</h2>
      {weeklySimulationEnded ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading visit data...</p>
      )}
    </div>
  )
}
