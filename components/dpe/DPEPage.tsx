'use client'
import { HeaderWrapper } from '@/app/LandingUI'
import DPE from '@/components/dpe/DPE'
import DPELabel, { conversionLettreIndex } from '@/components/dpe/DPELabel'
import { Intro, PageBlock, Section } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import dpeData from '@/components/dpe/DPE.yaml'
import ValeurVerteModule from '@/components/module/ValeurVerte'
import Ampleur from '@/app/module/Ampleur'
import { useSearchParams } from 'next/navigation'
import {
  encodeDottedName,
  encodeSituation,
  getSituation,
} from '@/components/publicodes/situationUtils'
import rules from '@/app/règles/rules'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import useSetSearchParams from '@/components/useSetSearchParams'
import DpeAddressSearch from '../DpeAddressSearch'
import { useState } from 'react'
import enrichSituation from '../personas/enrichSituation'
import DPEFacture from './DPEFacture'

export default function DPEPage({ lettre }) {
  const [dpe, setDpe] = useState()
  const [situation, setSituation] = useState({})
  const index = dpeData.findIndex((c) => c.lettre == lettre)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const handleSelectDpe = async (dpe) => {
    const indexEtiquette = conversionLettreIndex.indexOf(dpe['etiquette']) + 1
    let situation = await enrichSituation({
      'logement . commune': `"${dpe['Code_INSEE_(BAN)']}"*`,
      'logement . département': `"${dpe['N°_département_(BAN)']}"*`,
      'logement . commune . nom': `"${dpe['Nom__commune_(BAN)']}"*`,
      'DPE . actuel': indexEtiquette + '*',
      'projet . DPE visé': Math.max(indexEtiquette - 2, 0) + '*',
      'logement . type': `"${dpe['Type_bâtiment']}"`,
      'ménage . région . IdF': `"${
        ['75', '77', '78', '91', '92', '93', '94', '95'].includes(
          dpe['N°_département_(BAN)'],
        )
          ? 'oui'
          : 'non'
      }"*`,
    })

    setSearchParams(encodeSituation({ ...situation }))

    setDpe(dpe)
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
            Faire parler mon DPE
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
                <h2>Comprendre son DPE</h2>
                <p>
                  L'étiquette énergétique finale est définie selon la méthode
                  des double seuils: un logement étant classé selon sa plus
                  mauvaise performance, en énergie primaire ou en gaz à effet de
                  serre.
                </p>
                <p>
                  Un logement classé <DPELabel label={dpe['etiquette']} />{' '}
                  consomme au pire{' '}
                  {index == 6 ? (
                    <>
                      plus de <strong>{dpeData[index]['énergie']}</strong>
                      <sub>kWhEP/m².an</sub>
                    </>
                  ) : (
                    <>
                      <strong>{dpeData[index + 1]['énergie']}</strong>
                      <sub>kWhEP/m².an</sub>
                    </>
                  )}{' '}
                  et émet au pire{' '}
                  {index == 6 ? (
                    <>
                      plus de <strong>{dpeData[index]['climat']}</strong>
                      <sub>kgeqCO²/m².an</sub>
                    </>
                  ) : (
                    <>
                      <strong>{dpeData[index + 1]['climat']}</strong>
                      <sub>kgeqCO²/m².an</sub>
                    </>
                  )}
                  .
                </p>
                <div></div>
              </Content>
            </Wrapper>
            <Wrapper $background="white" $noMargin={true}>
              <Content>
                <h2>Quel impact sur la valeur de mon logement ?</h2>
                <ValeurVerteModule type="widget" />
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
                <h2>Quels impact sur votre facture énergétique?</h2>
                <DPEFacture
                  {...{
                    setSearchParams,
                    situation,
                    dpe,
                  }}
                />
                <h2>Quels travaux privilégiés ?</h2>
                <h2>Une interdiction de location est-elle prévue?</h2>
                {Object.keys(interdictionLocation).includes(lettre) ? (
                  <>
                    Une interdiction de location est prévue à partir du{' '}
                    <strong>
                      1<sup>er</sup> janvier {interdictionLocation[lettre]}
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
