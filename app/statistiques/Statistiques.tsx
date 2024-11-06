'use client'
import { useEffect, useRef, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
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
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote.jpg'
import logoFranceInfo from '@/public/logo-partenaire/logo-france-info.jpg'
import logoTf1Info from '@/public/logo-partenaire/logo-tf1-info.svg'
import logoActualImmo from '@/public/logo-partenaire/logo-actual-immo.png'
import logoOuestFranceImmo from '@/public/logo-partenaire/logo-ouestfrance-immo.png'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

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
  const [weeklyData, setWeeklyData] = useState(null)
  const [transfoRateSimulation, setTransfoRateSimulation] = useState(0)
  const [transfoRateFranceRenov, setTransfoRateFranceRenov] = useState(0)
  const swiperRef = useRef(null)

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const response = await fetch('/api/matomo')
        if (!response.ok) throw new Error('Failed to fetch visit data')
        const data = await response.json()
        const tmpWeeklyData = []
        let nbSimuEndedTotal = 0
        let nbSimuStartedTotal = 0
        let nbClickFranceRenov = 0
        Object.entries(data).forEach(([dateRange, weekData]) => {
          const startDate = dateRange.split(',')[1]
          tmpWeeklyData.push({
            date: new Date(startDate),
            visits: weekData[1].step_nb_visits_actual,
            uniqVisitors: weekData.nb_uniq_visitors,
          })

          nbClickFranceRenov += weekData[2].step_nb_visits_actual
          nbSimuEndedTotal += weekData[1].step_nb_visits_actual
          nbSimuStartedTotal += weekData[0].step_nb_visits_actual
        })

        setWeeklyData(tmpWeeklyData)

        setTransfoRateSimulation(
          Math.round((nbSimuEndedTotal / nbSimuStartedTotal) * 10000) / 100,
        )
        setTransfoRateFranceRenov(
          Math.round((nbClickFranceRenov / nbSimuEndedTotal) * 10000) / 100,
        )
      } catch (error) {
        console.error('Error fetching visit data:', error)
      }
    }

    fetchVisitData()
  }, [])

  const chartData = {
    labels: weeklyData ? weeklyData.map((entry) => entry.date) : [],
    datasets: [
      {
        label: 'Nombre de simulations terminées',
        data: weeklyData ? weeklyData.map((entry) => entry.visits) : [],
        borderColor: '#000091',
        borderWidth: 1,
        backgroundColor: '#2a82dd',
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Nombre de visiteurs uniques',
        data: weeklyData ? weeklyData.map((entry) => entry.uniqVisitors) : [],
        borderColor: '#ff5c8d',
        borderWidth: 1,
        backgroundColor: '#ff97b5',
        fill: true,
        yAxisID: 'y',
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
              content: 'Objectif de simulations par semaine : 25 000',
              enabled: true,
              position: 'end',
              color: 'white',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              font: {
                size: 14,
              },
              padding: { top: 5, bottom: 5, left: 5, right: 5 },
              yAdjust: -20,
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
          tooltipFormat: 'dd/MM/yyyy',
          displayFormats: {
            week: 'dd/MM/yyyy',
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
    },
  }

  const chartDataTransfoSimulation = {
    labels: ['Pourcentage de simulations terminées'],
    datasets: [
      {
        data: [transfoRateSimulation],
        backgroundColor: ['#2a82dd'],
      },
    ],
  }

  const chartDataTransfoFranceRenov = {
    labels: ["Pourcentage d'utilisateurs redirigés vers France Renov"],
    datasets: [
      {
        data: [transfoRateFranceRenov],
        backgroundColor: ['#2a82dd'],
      },
    ],
  }

  const optionsTransfoSimulation = {
    responsive: true,
    aspectRatio: 1.5,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const optionsTransfoFranceRenov = {
    responsive: true,
    aspectRatio: 1.5,
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          objectifLine: {
            type: 'line',
            yMin: 10,
            yMax: 10,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              display: true,
              content: 'Objectif de transformation: 10 %',
              enabled: true,
              position: 'center',
              color: 'white',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              font: {
                size: 14,
              },
              padding: { top: 5, bottom: 5, left: 5, right: 5 },
              yAdjust: -20,
            },
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const ChartWrapper = ({ data, children }) => {
    return data ? children : <p>Chargement des données...</p>
  }

  return (
    <>
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <h2>Indicateurs d'impact Mes Aides Réno</h2>
          <p
            css={`
              margin: 1rem 0;
            `}
          >
            Notre mission: Simplifier l'accès à l'information sur les aides à la
            rénovation énergétique pour augmenter le nombre de personnes qui
            engagent des travaux de rénovation.
          </p>
          <ChartWrapper data={weeklyData}>
            <Line data={chartData} options={options} />
          </ChartWrapper>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <h2>Taux de transformation</h2>
          <p
            css={`
              margin: 1rem 0;
            `}
          >
            Le taux de transformation des utilisateurs redirigés vers France
            Rénov' correspond au pourcentage d'utilisateurs qui ont cliqué sur
            le bouton "Trouver mon conseiller local" parmi ceux qui ont terminé
            leur simulation.
          </p>
          <div
            css={`
              display: flex;
              gap: 2rem;
              > div {
                width: 50%;
              }
            `}
          >
            <div>
              <ChartWrapper data={weeklyData}>
                <Bar
                  data={chartDataTransfoSimulation}
                  options={optionsTransfoSimulation}
                />
              </ChartWrapper>
            </div>
            <div>
              <ChartWrapper data={weeklyData}>
                <Bar
                  data={chartDataTransfoFranceRenov}
                  options={optionsTransfoFranceRenov}
                />
              </ChartWrapper>
            </div>
          </div>
        </Content>
      </Wrapper>
      <Wrapper>
        <Content>
          <h3>En chiffres</h3>
          <div
            css={`
              background: #e8edff;
              border: 1px solid black;
              font-size: 5rem;
              width: 50%;
              margin: auto;
              padding: 3rem;
              border-radius: 0.5rem;
              display: flex;
              align-items: center;
              color: #0063cb;
            `}
          >
            <div>8</div>
            <div
              css={`
                font-size: 1rem;
                margin-left: 1rem;
              `}
            >
              intégrations du simulateur mes aides réno
            </div>
          </div>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <h3
            css={`
              margin-bottom: 0;
            `}
          >
            Parmi eux
          </h3>
          <div
            css={`
              display: flex;
              justify-content: space-between;
              width: 100%;
              position: relative;
              top: 120px;
              button {
                background-color: var(--lightColor);
                color: #fff;
                padding: 10px 20px;
                border: none;
                cursor: pointer;
                border-radius: 5px;
                font-size: 1rem;
                &:hover {
                  background-color: var(--color);
                }
              }
            `}
          >
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="prevButton"
            >
              &lt;
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="nextButton"
            >
              &gt;
            </button>
          </div>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={30}
            slidesPerView={4}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            css={`
              position: relative;
              margin: 0 60px;
              .swiper-slide {
                align-self: center;
              }
              .swiper-button-next,
              .swiper-button-prev {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                color: #000;
              }

              img {
                width: 100%;
                height: auto;
              }
            `}
          >
            <SwiperSlide>
              <Link
                href="https://www.francetvinfo.fr/economie/immobilier/logements-bouilloires-ces-obstacles-qui-freinent-l-adaptation-aux-fortes-chaleurs_6737814.html"
                target="_blank"
              >
                <Image src={logoOuestFranceImmo} alt="Logo Ouest France Immo" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link
                href="https://www.francetvinfo.fr/economie/immobilier/logements-bouilloires-ces-obstacles-qui-freinent-l-adaptation-aux-fortes-chaleurs_6737814.html"
                target="_blank"
              >
                <Image src={logoFranceInfo} alt="Logo France Info" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link
                href="https://www.tf1info.fr/immobilier/bouilloires-thermiques-comment-adapter-son-logement-aux-vagues-de-chaleur-2315763.html"
                target="_blank"
              >
                <Image src={logoTf1Info} alt="Logo TF1 Info" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link
                href="https://www.actual-immo.fr/investissement-passoires-energetiques/"
                target="_blank"
              >
                <Image src={logoActualImmo} alt="Logo Actual Immo" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link
                href="https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/"
                target="_blank"
              >
                <Image src={logoBonPote} alt="Logo Bon Pote" />
              </Link>
            </SwiperSlide>
          </Swiper>
        </Content>
      </Wrapper>
    </>
  )
}
