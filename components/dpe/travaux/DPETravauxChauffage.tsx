import { Dot } from '@/app/module/AmpleurQuestions'
import GesteQuestion from '@/components/GesteQuestion'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { Card, CTA } from '@/components/UI'
import { formatValue } from 'publicodes'
import { useEffect, useState } from 'react'
import React from 'react'
import { MontantPrimeTravaux } from '../DPETravaux'

export function DPETravauxChauffage({
  dpe,
  xml,
  rules,
  engine,
  situation,
  setSearchParams,
}) {
  const [visibleDivs, setVisibleDivs] = useState({})
  const [questions, setQuestions] = useState([])
  async function isEligibleReseauChaleur(dpe) {
    const [lat, lon] = dpe['_geopoint'].split(',')
    const response = await fetch(`/api/fcu?lat=${lat}&lon=${lon}`)
    if (!response.ok) return false

    const json = await response.json()
    return json.isEligible
  }
  // Les règles métiers:
  let conseil = ''
  let priorite = 1
  let gestes = []
  const typeChauffage = dpe['type_generateur_chauffage_principal']
  const typeEmetteur = dpe['type_emetteur_installation_chauffage_n1']
  // On veut absolument remplacer les chauffages au fioul et au charbon
  if (['Fioul domestique', 'Charbon'].includes(dpe['type_energie_n1'])) {
    if (dpe['type_energie_n1'] == 'Fioul domestique') {
      gestes.push('gestes . chauffage . fioul . dépose cuve')
    }
    conseil = `le chauffage au ${dpe['type_energie_n1']} est très polluant, remplacer le par un système performant.`
    priorite = 3
  }
  // Test raccordement réseau chaleur, via FCU
  isEligibleReseauChaleur(dpe).then((eligibility) => {
    if (eligibility) {
      conseil = 'Votre domicile peut se raccorder à un réseau de chaleur'
      gestes.push('gestes . chauffage . raccordement réseau . chaleur')
    }
  })
  if (typeChauffage.startsWith('Chaudière')) {
    const anneeInstallation = typeChauffage.slice(-4)
    if (anneeInstallation < new Date().getFullYear() - 20) {
      // Si la chaudière a plus de 20 ans, on peut la remplacer
      conseil =
        'la chaudière a plus de 20 ans, remplacez-la par un système performant'
      priorite = 3
    }
    if (anneeInstallation < new Date().getFullYear() - 10) {
      // Si la chaudière a plus de 10 ans, on peut la remplacer
      conseil =
        'la chaudière a plus de 10 ans, remplacer la par un système performant'
      priorite = 2
    }
  }
  // S'il y a des vieux radiateurs, on peut proposer des radiateurs à chaleur douce connectés
  if (typeChauffage == 'Chaudière électrique') {
    conseil =
      'La chaudière électrique est très énergivore, remplace-la par un système performant'
    priorite = 3
  }
  // Horizontal = peu efficace, il faut changer
  if (typeChauffage == 'Ballon électrique à accumulation horizontal') {
    conseil =
      'Les ballons à accumulation horizontal sont peu performants, il est préférable de les remplacer.'
    gestes.push('chauffage . chauffe-eau thermodynamique')
    gestes.push('gestes . chauffage . chauffe-eau solaire')
    priorite = 3
  }
  // Vieux chauffe-eau
  if (
    typeChauffage ==
    'Ballon électrique à accumulation vertical Catégorie B ou 2 étoiles'
  ) {
    conseil =
      'Votre chauffe-eau est peu performant, il est préférable de le remplacer.'
    priorite = 3
    gestes.push('gestes . chauffage . chauffe-eau thermodynamique')
    gestes.push('gestes . chauffage . chauffe-eau solaire')
  }
  if (typeEmetteur == 'Convecteur électrique NFC, NF** et NF***') {
    //TODO: Implémenter BAR-TH-158 pour les radiateurs à chaleurs douce connectés
    conseil =
      'Les convecteurs électriques sont peu efficaces, il est préférable de changer ce système.'
    priorite = 3
  }

  gestes.push({ code: 'pac', titre: 'Installer une PAC' })
  gestes.push({ code: 'appoint', titre: "Ajouter un chauffage d'appoint" })
  gestes.push({ code: 'chaudiere', titre: 'Installer une chaudière' })

  useEffect(() => {
    if (!situation['gestes . chauffage . PAC . type']) return
    const rule =
      'gestes . chauffage . PAC . ' +
      situation['gestes . chauffage . PAC . type']
    const questions = getNextQuestions(
      engine
        .setSituation({
          ...situation,
          'MPR . non accompagnée . éligible': 'oui',
          [rule]: 'oui',
        })
        .evaluate(rule + ' . montant'),
      [],
      [],
      rules,
    )
    setQuestions(questions)
  }, [situation['gestes . chauffage . PAC . type']])

  const handleClick = (index, geste) => {
    if (geste == 'PAC') {
      console.log('handle PAC')
    }

    setVisibleDivs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  return (
    <table>
      {/* <thead>
        <tr>
          <th>Travaux</th>
          <th>Priorité</th>
          <th>Explication</th>
          <th>Aides</th>
        </tr>
      </thead> */}
      <tbody>
        {Object.values(gestes).map((geste, i) => {
          return (
            <React.Fragment key={i}>
              <tr>
                <td>
                  <Dot />
                  {rules[geste.code] ? rules[geste.code].titre : geste.titre}
                </td>
                {/* <td
                  css={`
                    text-align: center;
                  `}
                >
                  <Priorité valeur={priorite} />
                </td> */}
                <td>
                  {/* <Explication geste={geste} dpe={dpe} xml={xml} index={i} /> */}
                </td>
                <td
                  css={`
                    div {
                      margin: auto;
                    }
                  `}
                >
                  <CTA
                    $fontSize="normal"
                    $importance="secondary"
                    className="estimer"
                    onClick={() => handleClick(i, geste)}
                  >
                    <span>{visibleDivs[i] ? '-' : '+'}</span>
                  </CTA>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <div
                    className={`slide-down ${visibleDivs[i] ? 'active' : ''}`}
                  >
                    <Card>
                      <GesteQuestion
                        {...{
                          rules,
                          question: 'gestes . chauffage . PAC . type',
                          engine,
                          situation,
                          setSearchParams,
                        }}
                      />
                      {questions?.map((question, index) => (
                        <GesteQuestion
                          key={index}
                          {...{
                            rules,
                            question,
                            engine,
                            situation,
                            setSearchParams,
                          }}
                        />
                      ))}

                      <MontantPrimeTravaux
                        {...{
                          questions,
                          evaluation: engine.evaluate(
                            'gestes . chauffage . PAC . ' +
                              situation['gestes . chauffage . PAC . type'] +
                              ' . montant',
                          ),
                          situation,
                        }}
                      />
                    </Card>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
