import { Dot } from '@/app/module/AmpleurQuestions'
import GesteQuestion from '@/components/GesteQuestion'
import { Card, CTA, MiseEnAvant } from '@/components/UI'
import { useEffect, useMemo, useState } from 'react'
import React from 'react'
import {
  Explication,
  getQuestions,
  MontantPrimeTravaux,
} from './DPETravauxModule'
import { encodeSituation } from '@/components/publicodes/situationUtils'

export function DPETravauxChauffage({
  dpe,
  xml,
  rules,
  engine,
  situation,
  setSearchParams,
}) {
  const [gestes, setGestes] = useState([])
  const [selectedGeste, setSelectedGeste] = useState(null)
  const questionsByRule = useMemo(() => {
    const qbr = {}
    gestes.forEach(({ code }) => {
      if (situation[code] === 'oui' && rules[code + ' . montant']) {
        qbr[code] = getQuestions(code, situation, engine)
      }
    })

    if (selectedGeste && !qbr[selectedGeste]) {
      qbr[selectedGeste] = getQuestions(selectedGeste, situation, engine)
    }
    console.log('selectedGeste', selectedGeste)
    console.log('qbr', qbr)
    return qbr
  }, [situation, selectedGeste, gestes])
  useEffect(() => {
    let allGestes = []
    // Les règles métiers:
    let conseil = ''
    let priorite = 1
    const typeChauffage = dpe['type_generateur_chauffage_principal']
    const typeEmetteur = dpe['type_emetteur_installation_chauffage_n1']
    // On veut absolument remplacer les chauffages au fioul et au charbon
    if (['Fioul domestique', 'Charbon'].includes(dpe['type_energie_n1'])) {
      if (dpe['type_energie_n1'] == 'Fioul domestique') {
        allGestes.push({
          code: 'gestes . chauffage . fioul . dépose cuve',
          titre: 'Suppression du chauffage au fioul',
        })
      }
      conseil = `le chauffage au ${dpe['type_energie_n1']} est très polluant, remplacer le par un système performant.`
      priorite = 3
    }
    // Test raccordement réseau chaleur, via FCU
    isEligibleReseauChaleur(dpe).then((eligibility) => {
      if (eligibility) {
        conseil = 'Votre domicile peut se raccorder à un réseau de chaleur'
        allGestes.push('gestes . chauffage . raccordement réseau . chaleur')
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
    // Vieux chauffe-eau
    if (typeChauffage == 'Ballon électrique à accumulation horizontal') {
      conseil =
        'Les ballons à accumulation horizontal sont peu performants, il est préférable de les remplacer.'
      priorite = 3
    }
    if (
      typeChauffage ==
      'Ballon électrique à accumulation vertical Catégorie B ou 2 étoiles'
    ) {
      conseil =
        'Votre chauffe-eau est peu performant, il est préférable de le remplacer.'
      priorite = 3
    }
    if (typeEmetteur == 'Convecteur électrique NFC, NF** et NF***') {
      //TODO: Implémenter BAR-TH-158 pour les radiateurs à chaleurs douce connectés
      conseil =
        'Les convecteurs électriques sont peu efficaces, il est préférable de changer ce système.'
      priorite = 3
    }

    allGestes.push(
      {
        code: 'gestes . chauffage . PAC',
        titre: 'Les Pompes à Chaleur',
      },
      {
        code: 'gestes . chauffage . bois . chaudière',
        titre: 'Les Chaudières',
      },
      {
        code: 'gestes . chauffage . bois',
        titre: 'Les Poêles et inserts',
      },
      {
        code: 'gestes . chauffage . chauffe-eau thermodynamique',
        titre: 'Chauffe-eau thermodynamique',
      },
      {
        code: 'gestes . chauffage . solaire',
        titre: 'Les solutions solaires',
      },
    )
    setGestes(allGestes)
  }, [dpe])
  async function isEligibleReseauChaleur(dpe) {
    const [lat, lon] = dpe['_geopoint'].split(',')
    const response = await fetch(`/api/fcu?lat=${lat}&lon=${lon}`)
    if (!response.ok) return false

    const json = await response.json()
    return json.isEligible
  }

  const handleClick = (geste) => {
    if (geste.code.includes('chauffe-eau thermodynamique')) {
      setSelectedGeste(geste.code)
    }
    setSearchParams(
      encodeSituation(
        {
          ...situation,
          [geste.code]: situation[geste.code] === 'oui' ? 'non' : 'oui',
        },
        false,
      ),
    )
  }

  return (
    <div>
      <table>
        <tbody>
          {Object.values(gestes).map((geste, i) => {
            return (
              <React.Fragment key={i}>
                <tr>
                  <td>
                    <Dot />
                    {geste.titre}
                  </td>
                  <td
                    css={`
                      white-space: nowrap;
                      width: 1px;
                    `}
                  >
                    <CTA
                      $fontSize="normal"
                      $importance="secondary"
                      className="estimer"
                      onClick={() => handleClick(geste)}
                    >
                      <span>
                        {situation[geste.code] === 'oui' ? 'Fermer' : 'Estimer'}
                      </span>
                    </CTA>
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <div
                      className={`slide-down ${situation[geste.code] === 'oui' ? 'active' : ''}`}
                    >
                      <Card>
                        <GesteQuestion
                          {...{
                            rules,
                            question: geste.code + ' . type',
                            engine,
                            situation,
                            onChangeEvent: (value) =>
                              setSelectedGeste(geste.code + ' . ' + value),
                            setSearchParams,
                            noMargin: true,
                          }}
                        />
                        {selectedGeste && (
                          <>
                            {questionsByRule[selectedGeste]?.map(
                              (question, index) => (
                                <GesteQuestion
                                  key={selectedGeste.code + '' + index}
                                  {...{
                                    rules,
                                    question,
                                    engine,
                                    situation,
                                    setSearchParams,
                                  }}
                                />
                              ),
                            )}
                            <MontantPrimeTravaux
                              {...{
                                questions: questionsByRule,
                                engine,
                                rule: selectedGeste,
                                situation,
                              }}
                            />
                          </>
                        )}
                      </Card>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
