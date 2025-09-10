import AideAmpleur from '../ampleur/AideAmpleur'
import { createExampleSituation } from '../ampleur/AmpleurSummary'
import Value from '../Value'
import CalculatorWidget from '../CalculatorWidget'
import TargetDPETabs from '../mpra/TargetDPETabs'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import { BlocMontantTravaux } from '../maPrimeAdapt/MaPrimeAdapt'
import DPELabel from '../dpe/DPELabel'
import { YesNoQuestion } from '@/app/module/AmpleurQuestions'
import rules from '@/app/règles/rules'

export default function MaPrimeLogementDecent({
  isEligible,
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
  expanded,
}) {
  const dottedName =
    'MPLD . ' + situation['MPLD . situation demandeur'].replaceAll('"', '')
  const exampleSituation = createExampleSituation(situation)
  const extremeSituation = createExampleSituation(situation, 'best')
  const bonusSortiePassoire = engine
    .setSituation(situation)
    .evaluate('MPLD . occupant . bonus').nodeValue

  return (
    <AideAmpleur
      {...{
        isEligible,
        engine,
        dottedName: 'MPLD',
        setSearchParams,
        situation,
        answeredQuestions,
        exampleSituation,
        extremeSituation,
        expanded,
        noCondition: true,
      }}
    >
      <h3>Comment est calculée l'aide ?</h3>
      <CalculatorWidget>
        {dottedName == 'MPLD . occupant' && (
          <>
            <p>
              En tant que ménage{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: 'ménage . revenu . classe',
                  state: 'normal',
                }}
              />{' '}
              vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + " . pourcentage d'aide",
                  state: 'normal',
                }}
              />{' '}
              {bonusSortiePassoire && (
                <>
                  (dont <strong>{bonusSortiePassoire} %</strong> de bonus
                  "Sortie de passoire"){' '}
                </>
              )}
              dans la limite d'un plafond de travaux subventionnables de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant travaux . plafond',
                  state: 'normal',
                }}
              />
              .
            </p>
            <div className="fr-mt-5v">
              <DPEQuickSwitch situation={situation} noSuccess />
              <TargetDPETabs
                {...{
                  setSearchParams,
                  situation,
                  text: 'DPE visé :',
                  noSuccess: true,
                }}
              />
            </div>
            <BlocMontantTravaux
              {...{
                engine,
                situation,
                exampleSituation,
                dottedName,
                setSearchParams,
                rule: 'MPLD . montant travaux',
              }}
            />
          </>
        )}
        {dottedName == 'MPLD . bailleur' && (
          <>
            <p>
              Il est obligatoire de signer une convention avec l'Agence
              nationale de l'habitat (Anah) pour bénéficier de l'aide.
            </p>
            <p>
              En tant que propriétaire bailleur vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + " . pourcentage d'aide",
                  state: 'normal',
                }}
              />{' '}
              du montant des travaux avec un plafond de travaux maximum de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + ' . montant travaux . plafond',
                  state: 'normal',
                }}
              />{' '}
              par logement
              {situation['logement . surface'] > 80 &&
                ' (dans la limite de 80m²)'}
              .
            </p>
            <div className="fr-mt-5v">
              <YesNoQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  rules,
                  rule: 'MPLD . bailleur . bonus gain',
                  noSuccess: true,
                }}
              />
            </div>
            <BlocMontantTravaux
              {...{
                engine,
                situation,
                exampleSituation,
                dottedName,
                setSearchParams,
                rule: 'MPLD . montant travaux',
              }}
            />
            <div className="fr-highlight fr-highlight--yellow-moutarde fr-my-5v">
              Sous réserve que le logement atteigne au moins la classe{' '}
              <DPELabel index={3} />.
            </div>
          </>
        )}
        {dottedName == 'MPLD . copropriété' && (
          <>
            <p>
              En tant que syndicat de copropriété vous bénéficiez d'une aide de{' '}
              <Value
                {...{
                  engine,
                  situation,
                  dottedName: dottedName + " . pourcentage d'aide",
                  state: 'prime-black',
                }}
              />{' '}
              sans plafond (travaux limités à ceux nécessaires pour lever la
              procédure ou mettre fin à la situation d’habitat indigne) .
            </p>
            <BlocMontantTravaux
              {...{
                engine,
                situation,
                exampleSituation,
                dottedName,
                setSearchParams,
                rule: 'MPLD . montant travaux',
              }}
            />
          </>
        )}
      </CalculatorWidget>
    </AideAmpleur>
  )
}
