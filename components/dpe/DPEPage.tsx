'use client'

import DPELabel, { conversionLettreIndex } from '@/components/dpe/DPELabel'
import { Section } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import dpeData from '@/components/dpe/DPE.yaml'
import PlusValueModule from '@/components/module/ValeurVerte'
import Ampleur from '@/app/module/Ampleur'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { encodeSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import DPEAddressSearch from './DPEAddressSearch'
import { useEffect, useState } from 'react'
import enrichSituation from '../personas/enrichSituation'
import DPEFactureModule from './DPEFactureModule'
import DPETravauxModule from './travaux/DPETravauxModule'
import DPEMap from './DPEMap'
import iconChauffage from '@/public/chauffage.svg'
import iconEauChaude from '@/public/eauChaude.png'
import iconSurface from '@/public/surface.png'
import Image from 'next/image'
import useDpe from './useDpe'

export const getIndexLettre = (dpe) =>
  conversionLettreIndex.indexOf(
    conversionLettreIndex.indexOf(dpe['etiquette_dpe']) >
      conversionLettreIndex.indexOf(dpe['etiquette_ges'])
      ? dpe['etiquette_dpe']
      : dpe['etiquette_ges'],
  ) + 1

export default function DPEPage({ numDpe: initialNumDpe }) {
  const [numDpe, setNumDpe] = useState(initialNumDpe)
  const dpe = useDpe(numDpe)
  const setSearchParams = useSetSearchParams()
  useEffect(() => {
    async function handleSelectDpe() {
      if (!dpe) return
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
        'DPE . actuel': getIndexLettre(dpe) + '*',
        'projet . DPE visé': Math.max(getIndexLettre(dpe) - 2, 1) + '*',
        'logement . type': `"${dpe['type_batiment']}"*`,
        'ménage . région . IdF': `"${
          ['75', '77', '78', '91', '92', '93', '94', '95'].includes(
            dpe['code_departement_ban'],
          )
            ? 'oui'
            : 'non'
        }"*`,
      })

      setSearchParams(
        encodeSituation({ ...situation }),
        'push',
        true,
        `/dpe/${dpe['numero_dpe']}`,
      )
    }
    handleSelectDpe()
  }, [dpe])
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const interdictionLocation = {
    G: 2025,
    F: 2028,
    E: 2032,
  }

  return (
    dpe && (
      <main
        style={css`
          background: white;
          padding-top: calc(1.5vh + 1.5vw);
        `}
      >
        <Section>
          <h1
            style={css`
              margin-top: 0.6rem;
              margin-bottom: 1rem;
            `}
          >
            Mon Étude Réno
          </h1>
          <div
            css={`
              display: flex;
              > div {
                width: 50%;
              }
            `}
          >
            <div>
              <DPEAddressSearch
                searchParams={searchParams}
                dpe={dpe}
                click={true}
              />
              <p>
                {dpe['type_batiment'] == 'maison'
                  ? 'maison constuite'
                  : 'appartement construit'}{' '}
                la période <strong>{dpe['periode_construction']}</strong>
              </p>
              <div
                css={`
                  > div {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-bottom: 1px solid grey;
                    padding: 0.5rem 0;
                  }
                `}
              >
                <div
                  css={`
                    justify-content: space-between;
                    > div {
                      text-align: center;
                    }
                  `}
                >
                  <div>
                    <div>Consommation d'énergie</div>
                    <DPELabel label={dpe['etiquette_dpe']} small={false} />
                  </div>
                  <div>
                    <div>Émission Gaz à effet de serre</div>
                    <DPELabel label={dpe['etiquette_ges']} small={false} />
                  </div>
                </div>
                <div>
                  <Image src={iconSurface} alt={`icone surface`} width="30" />
                  <div>
                    Surface habitable: {dpe['surface_habitable_logement']}m²
                  </div>
                </div>
                <div>
                  <Image
                    src={iconChauffage}
                    alt={`icone chauffage`}
                    width="30"
                  />
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: dpe[
                          'description_installation_chauffage_n1'
                        ]?.replace('.', '<br />'),
                      }}
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: dpe[
                          'description_installation_chauffage_n2'
                        ]?.replace('.', '<br />'),
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Image
                    src={iconEauChaude}
                    alt={`icone eau chaude sanitaire`}
                    width="30"
                  />
                  {dpe['type_generateur_n1_ecs_n1']}
                </div>
              </div>
            </div>
            <DPEMap
              searchParams={searchParams}
              onSelectDpe={setNumDpe}
              dpe={dpe}
            />
          </div>
          <Wrapper $background="white" $noMargin={true}>
            <Content>
              <h2>Quel impact sur la valeur de mon logement ?</h2>
              <PlusValueModule type="widget" />
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
              <DPETravauxModule numDpe={numDpe} type="widget" />
              <h2>Quels impact sur votre facture énergétique?</h2>
              <DPEFactureModule numDpe={numDpe} type="widget" />
              <h2>Une interdiction de location est-elle prévue?</h2>
              {Object.keys(interdictionLocation).includes(dpe['etiquette']) ? (
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
                  Aucune interdiction de location n'est actuellement prévu pour
                  un logement avec un DPE <DPELabel label={dpe['etiquette']} />
                </>
              )}
            </Content>
          </Wrapper>
        </Section>
      </main>
    )
  )
}
