'use client'
import { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
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
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const formatter = new Intl.NumberFormat('fr-FR', {})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${Math.round(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}
export default function Statistiques() {
  const [data, setData] = useState({
    weeklyData: null,
    transfoRateFranceRenov: 0,
    nbSimuEndedMonth: 0,
    avgTimeOnSite: '',
    satisfied: { oui: 0, 'en partie': 0, non: 0 },
  })

  const fetchVisitData = async () => {
    try {
      const responseVisitors = await fetch('/api/matomo?type=visitors')
      const data = await responseVisitors.json()
      const weeklyData = Object.entries(data).map(([dateRange, weekData]) => ({
        date: new Date(dateRange.split(',')[1]),
        visits: weekData[1].step_nb_visits_actual,
        uniqVisitors: weekData.nb_uniq_visitors,
      }))
      const totalTimeOnSite = Object.entries(data)
        .slice(-4)
        .reduce((acc, [, weekData]) => acc + weekData.avg_time_on_site, 0)
      const responseLastMonth = await fetch('/api/matomo?type=lastMonth')
      const dataLastMonth = await responseLastMonth.json()
      const nbSimuEndedMonth = Object.values(dataLastMonth).reduce(
        (acc, curr) => acc + curr[1].step_nb_visits_actual,
        0,
      )

      const transfoRateFranceRenov =
        (Object.values(dataLastMonth).reduce(
          (acc, curr) => acc + curr[2].step_nb_visits_actual,
          0,
        ) /
          nbSimuEndedMonth) *
        100

      const avgTimeOnSite = formatTime(totalTimeOnSite / 4)
      const responseEvents = await fetch('/api/matomo?type=events')
      const satisfied = await responseEvents.json()

      setData({
        weeklyData,
        transfoRateFranceRenov,
        nbSimuEndedMonth,
        avgTimeOnSite,
        satisfied,
      })
    } catch (error) {
      console.error('Error fetching visit data:', error)
    }
  }

  useEffect(() => {
    fetchVisitData()
  }, [])

  const chartData = useMemo(
    () => ({
      labels: data.weeklyData ? data.weeklyData.map((entry) => entry.date) : [],
      datasets: [
        {
          label: 'Nombre de simulations terminées',
          data: data.weeklyData
            ? data.weeklyData.map((entry) => entry.visits)
            : [],
          borderColor: '#000091',
          borderWidth: 1,
          backgroundColor: '#2a82dd',
          yAxisID: 'y',
        },
        {
          label: 'Nombre de visiteurs uniques',
          data: data.weeklyData
            ? data.weeklyData.map((entry) => entry.uniqVisitors)
            : [],
          borderColor: '#ff5c8d',
          borderWidth: 1,
          backgroundColor: '#ff97b5',
          yAxisID: 'y',
        },
      ],
    }),
    [data.weeklyData],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
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
          max: 25000,
          beginAtZero: true,
          title: { display: true, text: 'Nombre de simulation' },
        },
      },
    }),
    [],
  )

  const StatCard = ({ label, value, target }) => (
    <div
      css={`
        padding: 1rem;
        min-width: 250px;
        text-align: center;
        border: 1px solid #d9d9ee;
        border-radius: 5px;
        > strong {
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
      <div
        dangerouslySetInnerHTML={{
          __html: label,
        }}
      />
      <div
        css={`
          text-align: left;
          margin-top: 1rem;
        `}
      >
        <small
          dangerouslySetInnerHTML={{
            __html: target,
          }}
        />
      </div>
    </div>
  )

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
          <p>Sur les 30 derniers jours : </p>
          <div
            css={`
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 1rem;
            `}
          >
            <StatCard
              label="simulations terminées"
              value={formatter.format(data.nbSimuEndedMonth)}
              target="pour une cible à <strong>100 000</strong>"
            />
            <StatCard
              label="taux de transformation"
              value={`${Math.round(data.transfoRateFranceRenov)}%`}
              target="pour une cible à <strong>10%</strong>"
            />
            <StatCard
              label="durée moyenne<br />
                des sessions (minutes)"
              value={data.avgTimeOnSite}
            />
          </div>
          <h4>
            Evolution hebdomadaire du nombre de visiteurs uniques et simulations
            terminées
          </h4>
          {data.weeklyData && <Line data={chartData} options={options} />}
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
            <StatCard label="Oui" value={`${data.satisfied['oui']}%`} />

            <StatCard
              label="En partie"
              value={`${data.satisfied['en partie']}%`}
            />

            <StatCard label="Non" value={`${data.satisfied['non']}%`} />
          </div>
        </Content>
      </Wrapper>
    </div>
  )
}
