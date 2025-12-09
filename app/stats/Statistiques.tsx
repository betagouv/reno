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
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-date-fns'
import logoLeboncoin from '@/public/logo-partenaire/logo-leboncoin.jpg'
import logoBonPote from '@/public/logo-partenaire/logo-bon-pote-rect.png'
import logoFranceInfo from '@/public/logo-partenaire/logo-france-info.jpg'
import logoTf1Info from '@/public/logo-partenaire/logo-tf1-info.svg'
import logoActualImmo from '@/public/logo-partenaire/logo-actual-immo.png'
import logoMoneyVox from '@/public/logo-partenaire/logo-moneyvox.webp'
import logoJDN from '@/public/logo-partenaire/logo-jdn.png'
import logoOuestFranceImmo from '@/public/logo-partenaire/logo-ouestfrance-immo.png'
import logoLeProgres from '@/public/logo-partenaire/logo-le-progres.svg'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Loader } from '@/components/UI'

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

export const formatter = new Intl.NumberFormat('fr-FR', {})

export const formatTime = (seconds) => {
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
  })
  const [satisfaction, setSatisfaction] = useState({
    oui: 0,
    'en partie': 0,
    non: 0,
  })

  const fetchVisitData = async () => {
    try {
      const responseVisitors = await fetch('/api/matomo?type=visitors')
      const data = await responseVisitors.json()

      const weeklyData = Object.entries(data).map(([dateRange, weekData]) => ({
        date: new Date(dateRange.split(',')[1]),
        visits: weekData[1] ? weekData[1].step_nb_visits_actual : 0,
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
          (acc, curr) => acc + curr[15].step_nb_visits_actual,
          0,
        ) /
          nbSimuEndedMonth) *
        100

      const avgTimeOnSite = formatTime(totalTimeOnSite / 4)

      setData({
        weeklyData,
        transfoRateFranceRenov,
        nbSimuEndedMonth,
        avgTimeOnSite,
      })
    } catch (error) {
      console.error('Error fetching visit data:', error)
    }
  }
  const fetchSatisficationData = async () => {
    try {
      const responseEvents = await fetch('/api/matomo?type=events')
      const satisfied = await responseEvents.json()

      setSatisfaction(satisfied)
    } catch (error) {
      console.error('Error fetching events data:', error)
    }
  }

  useEffect(() => {
    fetchVisitData()
    fetchSatisficationData()
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
            displayFormats: { week: 'dd/MM/yyyy' },
          },
        },
        y: {
          max: 100000,
          beginAtZero: true,
          title: { display: true, text: 'Nombre de simulation' },
        },
      },
    }),
    [],
  )

  return (
    <>
      <h2>Statistiques</h2>
      <p>
        <strong>Notre mission</strong> : simplifier l'accès à l'information sur
        les aides à la rénovation énergétique pour augmenter le nombre de
        personnes qui engagent des travaux de rénovation.
      </p>
      <h3>Données d'interaction avec le simulateur</h3>
      <p
        css={`
          color: #0974f6 !important;
          font-weight: bold;
        `}
      >
        Sur les 30 derniers jours :{' '}
      </p>
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
          type="warning"
          target="100 000"
        />
        <StatCard
          label="taux de conversion*"
          value={`${Math.round(data.transfoRateFranceRenov)}%`}
          target="10%"
          type="success"
        />
        <StatCard
          label="durée moyenne<br />
                des sessions (minutes)"
          value={data.avgTimeOnSite}
        />
      </div>
      <p
        css={`
          font-style: italic;
          margin-top: 1rem;
        `}
      >
        *taux de conversion : pourcentage de simulations pendant lesquelles
        l'usager clique sur le bouton "Trouver mon conseiller local" par rapport
        aux simulations terminées.
      </p>
      <h3>
        Evolution des visiteurs uniques et simulations terminées (hebdomadaire)
      </h3>
      {data.weeklyData && <Line data={chartData} options={options} />}
      <h3
        css={`
          margin: 1rem 0;
        `}
      >
        Intégration du simulateur par des tiers
      </h3>
      <p
        css={`
          margin: 1rem 0;
        `}
      >
        Le simulateur Mes Aides Réno a été construit sur un modèle de calcul
        open-source, documenté et à jour, disponible pour être intégré (iframe
        ou API) dans des parcours usagers de partenaires tiers lorsque la
        question d'une rénovation énergétique se pose.
      </p>
      <div
        css={`
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        `}
      >
        <StatCard
          label="intégrations du simulateur<br />Mes aides réno"
          value={12}
        />
        <StatCard label="mentions par des médias<br />&nbsp;" value="30+" />
      </div>
      <div
        css={`
          margin-top: 1rem;
        `}
      >
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
            <a
              title="leboncoin"
              href="https://www.leboncoin.fr/guide/immobilier/Renovation-energetique-leboncoin-sallie-a-Mes-Aides-Reno-pour-simplifier-vos-demarches-qdl94tpj.html"
            >
              <Image src={logoLeboncoin} alt="Logo leboncoin" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="Bon Pote"
              href="https://bonpote.com/connaitre-en-quelques-clics-les-aides-de-letat-pour-renover-son-logement/"
            >
              <Image src={logoBonPote} alt="Logo Bon Pote" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="Ouest France Immo"
              href="https://www.ouestfrance-immo.com/"
            >
              <Image src={logoOuestFranceImmo} alt="Logo Ouest France Immo" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="France Info"
              href="https://www.francetvinfo.fr/economie/immobilier/logements-bouilloires-ces-obstacles-qui-freinent-l-adaptation-aux-fortes-chaleurs_6737814.html"
            >
              <Image src={logoFranceInfo} alt="Logo France Info" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="Money Vox"
              href="https://www.moneyvox.fr/immobilier/actualites/99663/renovation-energetique-ce-simulateur-officiel-gratuit-revele-les-aides-que-vous-ignorez"
            >
              <Image src={logoMoneyVox} alt="Logo Money Vox" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="Actual Immo"
              href="https://www.actual-immo.fr/investissement-passoires-energetiques/"
            >
              <Image src={logoActualImmo} alt="Logo Actual Immo" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="TF1 Info"
              href="https://www.tf1info.fr/immobilier/bouilloires-thermiques-comment-adapter-son-logement-aux-vagues-de-chaleur-2315763.html"
            >
              <Image src={logoTf1Info} alt="Logo TF1 Info" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="Le Progrès"
              href="https://www.leprogres.fr/magazine-immobilier/2024/09/30/connaissez-vous-ce-nouvel-outil-qui-vous-permet-d-estimer-vos-travaux"
            >
              <Image src={logoLeProgres} alt="Logo Le Progrès" />
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a
              title="Journal du net"
              href="https://www.leprogres.fr/magazine-immobilier/2024/09/30/connaissez-vous-ce-nouvel-outil-qui-vous-permet-d-estimer-vos-travaux"
            >
              <Image src={logoJDN} alt="Logo Journal du net" />
            </a>
          </SwiperSlide>
        </Swiper>
      </div>

      {satisfaction?.oui > 0 && (
        <>
          <h3
            css={`
              margin: 1rem 0;
            `}
          >
            Satisfaction des usagers
          </h3>
          <p className="fr-mt-3v">
            Les taux de satisfaction ci-dessous correspondent aux pourcentages
            d'usagers ayant cliqué sur "Oui" / "En partie" / "Non" sur
            l'ensemble des usagers ayant répondu au module de satisfaction.
          </p>
          <div
            css={`
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 1rem;
            `}
          >
            <StatCard label="Oui" value={`${satisfaction['oui']}%`} />

            <StatCard
              label="En partie"
              value={`${satisfaction['en partie']}%`}
            />

            <StatCard label="Non" value={`${satisfaction['non']}%`} />
          </div>
        </>
      )}
    </>
  )
}

export const StatCard = ({
  label,
  value,
  target = null,
  type = 'none',
  noMinWidth,
}) => (
  <div
    css={`
      padding: 1rem;
      ${!noMinWidth && 'min-width: 250px;'}
      text-align: center;
      border: 1px solid #d9d9ee;
      border-radius: 5px;
      > strong {
        display: block;
        font-size: 2rem;
        padding: 1rem;
        color: #000091;
      }
      span {
        font-size: 0.9rem;
      }
    `}
  >
    <strong>
      {value && value !== '0%' && value != 0 ? value : <Loader></Loader>}
    </strong>
    <div
      dangerouslySetInnerHTML={{
        __html: label,
      }}
    />
    {target && (
      <div
        css={`
          width: fit-content;
          border-radius: 1rem;
          padding: 0.2rem 0.5rem;
          margin: auto;
          font-weight: bold;
          margin-top: 1rem;
          ${type == 'success' &&
          `
              background: #DCFFDC;
              color: #1A4F23;
            `}
          ${type == 'warning' &&
          `
              background: #FDF8DB;
              color: #6E4444;
            `}
        `}
      >
        🎯cible: {target}
      </div>
    )}
  </div>
)
