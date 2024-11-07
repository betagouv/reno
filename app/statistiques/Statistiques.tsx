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
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote-rect.png'
import logoFranceInfo from '@/public/logo-partenaire/logo-france-info.jpg'
import logoTf1Info from '@/public/logo-partenaire/logo-tf1-info.svg'
import logoActualImmo from '@/public/logo-partenaire/logo-actual-immo.png'
import logoOuestFranceImmo from '@/public/logo-partenaire/logo-ouestfrance-immo.png'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

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
  const [nbSimuEndedTotal, setNbSimuEndedTotal] = useState(0)
  const [nbSimuStartedTotal, setNbSimuStartedTotal] = useState(0)
  const [nbClickFranceRenov, setNbClickFranceRenov] = useState(0)
  const [nbUniqVisitor, setNbUniqVisitor] = useState(0)
  const [bounceRate, setBounceRate] = useState(0)
  const [avgTimeOnSite, setAvgTimeOnSite] = useState('')
  const [satisfied, setSatisfied] = useState({ oui: 0, 'en partie': 0, non: 0 })

  const fetchVisitData = async () => {
    try {
      const responseVisitors = await fetch('/api/matomo?type=visitors')
      if (!responseVisitors.ok) throw new Error('Failed to fetch visit data')
      const data = await responseVisitors.json()
      let tmpWeeklyData = []
      let tempClickFranceRenov = 0
      let tempSimuEndedTotal = 0
      let tempSimuStartedTotal = 0
      let totalVisitors = 0
      let totalBounceCount = 0
      let totalTimeOnSite = 0

      Object.entries(data).forEach(([dateRange, weekData]) => {
        const startDate = dateRange.split(',')[1]
        tmpWeeklyData.push({
          date: new Date(startDate),
          visits: weekData[1].step_nb_visits_actual,
          uniqVisitors: weekData.nb_uniq_visitors,
          timeOnSite: weekData.avg_time_on_site,
          bounceCount: weekData.bounce_count,
        })

        tempClickFranceRenov += weekData[2].step_nb_visits_actual
        tempSimuEndedTotal += weekData[1].step_nb_visits_actual
        tempSimuStartedTotal += weekData[0].step_nb_visits_actual
        totalVisitors += weekData.nb_uniq_visitors
        totalBounceCount += weekData.bounce_count
        totalTimeOnSite += weekData.avg_time_on_site
      })

      setWeeklyData(tmpWeeklyData)
      setNbClickFranceRenov(tempClickFranceRenov)
      setNbSimuEndedTotal(tempSimuEndedTotal)
      setNbSimuStartedTotal(tempSimuStartedTotal)
      setNbUniqVisitor(totalVisitors)
      setBounceRate(Math.round((totalBounceCount / totalVisitors) * 100))

      const avgTime = totalTimeOnSite / tmpWeeklyData.length
      const minutes = Math.floor(avgTime / 60)
      const seconds = Math.round(avgTime % 60)
      setAvgTimeOnSite(`${minutes}:${seconds.toString().padStart(2, '0')}`)

      setTransfoRateSimulation(
        (tempSimuEndedTotal / tempSimuStartedTotal) * 100,
      )
      setTransfoRateFranceRenov(
        (tempClickFranceRenov / tempSimuEndedTotal) * 100,
      )

      const responseEvents = await fetch('/api/matomo?type=events')
      if (!responseEvents.ok) throw new Error('Failed to fetch events data')
      setSatisfied(await responseEvents.json())
    } catch (error) {
      console.error('Error fetching visit data:', error)
    }
  }

  useEffect(() => {
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
  const StatCard = ({ label, value, children }) => (
    <div
      css={`
        padding: 1rem;
        min-width: 250px;
        text-align: center;
        border: 1px solid #d9d9ee;
        border-radius: 5px;
        strong {
          display: block;
          font-size: 2rem;
          padding: 1rem;
        }
        span {
          font-size: 0.9rem;
        }
      `}
    >
      <strong>{value}</strong>
      <span
        dangerouslySetInnerHTML={{
          __html: label,
        }}
      />
      {children}
    </div>
  )

  const ChartWrapper = ({ data, children }) => {
    return data ? children : <p>Chargement des données...</p>
  }
  const formatter = new Intl.NumberFormat('fr-FR', {})

  return (
    <div
      css={`
        h4 {
          font-size: 1rem;
        }
      `}
    >
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <h2>Statistiques</h2>
          <p>
            Notre mission: Simplifier l'accès à l'information sur les aides à la
            rénovation énergétique pour augmenter le nombre de personnes qui
            engagent des travaux de rénovation.
          </p>
          <p>
            Nous mesurons les données qui visent à répondre à trois grands
            objectifs :
          </p>
          <ol
            css={`
              color: #333;
            `}
          >
            <li>Rendre accessible et lisible les informations aux usagers,</li>
            <li>Rediriger vers des agents conseillers,</li>
            <li>Tout en nous assurant de la satisfaction de nos usagers.</li>
          </ol>
          <h3>Exposer les informations d'aides à la rénovation énergétique</h3>
          <h4>Visibilité et engagement du simulateur Mes Aides Réno</h4>
          <p>Sur les 8 dernières semaines : </p>
          <div
            css={`
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 1rem;
            `}
          >
            <StatCard
              label="visiteurs uniques"
              value={formatter.format(nbUniqVisitor)}
            />
            <StatCard label="taux de rebond" value={`${bounceRate}%`} />
            <StatCard
              label="durée moyenne<br />
                des sessions (minutes)"
              value={avgTimeOnSite}
            />
          </div>
          <h4>
            Evolution hebdomadaire du nombre de visiteurs uniques et simulations
            terminées
          </h4>
          <ChartWrapper data={weeklyData}>
            <Line data={chartData} options={options} />
          </ChartWrapper>
          <h4>Intégrations partenaires</h4>
          <div
            css={`
              display: flex;
              gap: 1rem;
              align-items: center;
              justify-content: center;
            `}
          >
            <StatCard
              label="intégrations du simulateur<br /> mes aides réno"
              value={8}
            />
            <StatCard label="mentions par des médias<br />&nbsp;" value={10} />
          </div>
          <div>
            <h5
              css={`
                margin: 1rem 0;
              `}
            >
              Parmi eux
            </h5>
            <Swiper
              modules={[Navigation]}
              navigation
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              css={`
                .swiper-wrapper {
                  align-items: center;
                }
                .swiper-slide {
                  text-align: center;
                }
                img {
                  width: 200px;
                  height: auto;
                }
                .swiper-button-prev,
                .swiper-button-next {
                  background: black;
                  border-radius: 5rem;
                  color: white;
                  padding: 0px 20px;
                  &:after {
                    font-size: 0.7rem;
                    font-weight: bold;
                  }
                }
                .swiper-button-prev {
                  left: 0;
                }
                .swiper-button-next {
                  right: 0;
                }
              `}
            >
              <SwiperSlide>
                <Link
                  href="https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/"
                  target="_blank"
                >
                  <Image src={logoBonPote} alt="Logo Bon Pote" />
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link href="https://www.ouestfrance-immo.com/" target="_blank">
                  <Image
                    src={logoOuestFranceImmo}
                    alt="Logo Ouest France Immo"
                  />
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
                  href="https://www.actual-immo.fr/investissement-passoires-energetiques/"
                  target="_blank"
                >
                  <Image src={logoActualImmo} alt="Logo Actual Immo" />
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
            </Swiper>
          </div>
        </Content>
      </Wrapper>
      <Wrapper $noMargin={true}>
        <Content>
          <h3>Bien informer et rediriger vers un conseiller</h3>
          <p
            css={`
              margin: 1rem 0;
            `}
          >
            Après avoir informé le visiteur sur son éligibilité aux aides, notre
            objectif est de le rediriger vers un conseiller local. Le taux de
            transformation des utilisateurs redirigés vers France Rénov'
            correspond au pourcentage d'utilisateurs qui ont cliqués sur le
            bouton "Trouver mon conseiller local" par rapport aux utilisateurs
            qui ont démarré une simulation.
          </p>
          <h4>Taux de conversion par étapes clés du parcours usager</h4>
          <div
            css={`
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
              gap: 2rem;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: flex-end;
                text-align: center;
                gap: 2rem;
                > div {
                  > div {
                    background: var(--lightColor);
                  }
                  span:last-child {
                    display: inline-block;
                    margin-top: 1rem;
                  }
                }
              `}
            >
              <div>
                {formatter.format(nbSimuStartedTotal)} <strong>100%</strong>
                <div
                  css={`
                    height: 300px;
                  `}
                ></div>
                <span>
                  Simulations
                  <br />
                  démarrées
                </span>
              </div>
              <div>
                {formatter.format(nbSimuEndedTotal)}{' '}
                <strong>{Math.round(transfoRateSimulation)}%</strong>
                <div
                  css={`
                    height: ${transfoRateSimulation * 3}px;
                  `}
                ></div>
                <span>
                  Simulations
                  <br />
                  terminées
                </span>
              </div>
              <div>
                {formatter.format(nbClickFranceRenov)}{' '}
                <strong>{Math.round(transfoRateFranceRenov)}%</strong>
                <div
                  css={`
                    height: ${transfoRateFranceRenov * 3}px;
                    align-content: end;
                  `}
                >
                  <div
                    css={`
                      margin-bottom: 30px;
                      height: 3px;
                      background: red;
                      width: calc(100% + 20px);
                      margin-left: -10px;
                    `}
                  ></div>
                </div>
                <span>
                  Simulations
                  <br />
                  redirigées
                </span>
              </div>
            </div>
            <div
              css={`
                padding: 1rem;
                max-width: 50%;
                align-content: center;
                p {
                  strong {
                    font-size: 1rem;
                  }
                  font-size: 0.9rem;
                }
              `}
            >
              <p>
                <strong>Simulation démarrée</strong> : lorsqu'un visiteur charge
                la première question du formulaire
              </p>
              <p>
                <strong>Simulation terminée</strong> : lorsqu'un visiteur arrive
                sur la page de résultats d'éligibilité
              </p>
              <p>
                <strong>Simulation redirigée</strong> : lorsqu'un visiteur
                clique sur "Trouver mon conseiller local"
              </p>
              <p>
                <span
                  css={`
                    display: inline-block;
                    height: 3px;
                    background: red;
                    width: 50px;
                    margin: 0 10px 3px 0;
                  `}
                ></span>
                Objectif du taux de transformation : 10%
              </p>
            </div>
          </div>
        </Content>
      </Wrapper>
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <h3>Satisfaire nos utilisateurs</h3>
          <h4>Taux de satisfaction</h4>
          <div
            css={`
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 1rem;
            `}
          >
            <StatCard label="Oui" value={`${satisfied['oui']}%`} />

            <StatCard label="En partie" value={`${satisfied['en partie']}%`} />

            <StatCard label="Non" value={`${satisfied['non']}%`} />
          </div>
        </Content>
      </Wrapper>
    </div>
  )
}
