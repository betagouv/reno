'use client'

import DPELabel, { conversionLettreIndex } from '@/components/dpe/DPELabel'
import { Section } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import dpeData from '@/components/dpe/DPE.yaml'
import PlusValueModule from '@/components/module/ValeurVerte'
import Ampleur from '@/app/module/Ampleur'
import { useSearchParams } from 'next/navigation'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import DpeAddressSearch from '../DpeAddressSearch'
import { useEffect, useState } from 'react'
import enrichSituation from '../personas/enrichSituation'
import DPEFacture from './DPEFacture'
import DPETravaux from './travaux/DPETravaux'

export default function DPEPage({ numDpe }) {
  const [dpe, setDpe] = useState(null)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  useEffect(() => {
    async function fetchDPE() {
      try {
        const url = `https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?q=numero_dpe%3D${numDpe}`
        const request = await fetch(url)
        const json = await request.json()
        handleSelectDpe(json.results[0]).then(() => setDpe(json.results[0]))
      } catch (e) {
        console.error(e)
      }
    }
    fetchDPE()
  }, [numDpe])

  const handleSelectDpe = async (dpe) => {
    if (!dpe) return
    const lettre =
      conversionLettreIndex.indexOf(dpe['etiquette_dpe']) >
      conversionLettreIndex.indexOf(dpe['etiquette_ges'])
        ? dpe['etiquette_dpe']
        : dpe['etiquette_ges']
    const index = conversionLettreIndex.indexOf(lettre) + 1
    const anneeConstruction = dpe['periode_construction'].slice(-4)
    let situation = await enrichSituation({
      'logement . commune': `"${dpe['code_insee_ban']}"*`,
      'logement . département': `"${dpe['code_departement_ban']}"*`,
      'logement . commune . nom': `"${dpe['nom_commune_ban']}"*`,
      'logement . surface': `${dpe['surface_habitable_logement']}*`,
      'logement . période de construction': `'${
        anneeConstruction < new Date().getFullYear() - 15
          ? 'au moins 15 ans'
          : anneeConstruction < new Date().getFullYear() - 2
            ? 'de 2 à 10 ans'
            : 'moins de 2 ans'
      }'*`,
      'DPE . actuel': index + '*',
      'projet . DPE visé': Math.max(index - 2, 0) + '*',
      'logement . type': `"${dpe['type_batiment']}*"`,
      'ménage . région . IdF': `"${
        ['75', '77', '78', '91', '92', '93', '94', '95'].includes(
          dpe['code_departement_ban'],
        )
          ? 'oui'
          : 'non'
      }"*`,
    })

    setSearchParams(encodeSituation({ ...situation }))
  }

  const interdictionLocation = {
    G: 2025,
    F: 2028,
    E: 2032,
  }

  return (
    <main
      style={css`
        background: white;
        padding-top: calc(1.5vh + 1.5vw);
      `}
    >
      <Section>
        <div>
          <h1
            style={css`
              margin-top: 0.6rem;
              margin-bottom: 1rem;
            `}
          >
            Ma Bonne Réno
          </h1>
          <DpeAddressSearch
            searchParams={searchParams}
            onSelectDpe={handleSelectDpe}
          />
        </div>
        {dpe && (
          <>
            <Wrapper>
              <Content>
                <h2>Analyse globale du bien</h2>
                <p>
                  {dpe['type_batiment'] == 'maison'
                    ? 'Cette maison constuite'
                    : 'Cet appartement construit'}{' '}
                  durant la période{' '}
                  <strong>{dpe['periode_construction']}</strong> a une surface
                  de habitable de{' '}
                  <strong>{dpe['surface_habitable_logement']}m²</strong> et une
                  classe de consommation d'énergie{' '}
                  <DPELabel label={dpe['etiquette_dpe']} /> et une classe
                  d'émission de gaz à effet de serre{' '}
                  <DPELabel label={dpe['etiquette_ges']} />.
                </p>
                <p>
                  Mode de chauffage :{' '}
                  <strong>
                    {dpe['description_installation_chauffage_n1']}
                  </strong>
                  <strong>
                    {dpe['description_installation_chauffage_n2']}
                  </strong>
                  .
                </p>
                <p>
                  Système assurant l'eau chaude sanitaire :{' '}
                  <strong>{dpe['type_generateur_n1_ecs_n1']}</strong>
                </p>
                <div></div>
              </Content>
            </Wrapper>
            <Wrapper $background="white" $noMargin={true}>
              <Content>
                <h2>Quel impact sur la valeur de mon logement ?</h2>
                <PlusValueModule type="widget" />
              </Content>
            </Wrapper>
            <Wrapper $background="white" $noMargin={true} $last={true}>
              <Content>
                <h2>Quelles aides sont mobilisables ?</h2>
                <div
                  css={`
                    h2 {
                      font-size: 130% !important;
                    }
                  `}
                >
                  <Ampleur type="widget" />
                </div>
                <h2>Quels travaux privilégiés ?</h2>
                <DPETravaux {...{ setSearchParams, dpe }} />
                <h2>Quels impact sur votre facture énergétique?</h2>
                <DPEFacture
                  {...{
                    setSearchParams,
                    dpe,
                  }}
                />
                <h2>Une interdiction de location est-elle prévue?</h2>
                {Object.keys(interdictionLocation).includes(
                  dpe['etiquette'],
                ) ? (
                  <>
                    Une interdiction de location est prévue à partir du{' '}
                    <strong>
                      1<sup>er</sup> janvier{' '}
                      {interdictionLocation[dpe['etiquette']]}
                    </strong>{' '}
                    pour les logements avec un DPE{' '}
                    <DPELabel label={dpe['etiquette']} />
                  </>
                ) : (
                  <>
                    Aucune interdiction de location n'est actuellement prévu
                    pour un logement avec un DPE{' '}
                    <DPELabel label={dpe['etiquette']} />
                  </>
                )}
              </Content>
            </Wrapper>
          </>
        )}
      </Section>
    </main>
  )
}
