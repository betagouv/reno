import { HeaderWrapper } from '@/app/LandingUI'
import DPE from '@/components/DPE'
import DPELabel from '@/components/DPELabel'
import { Intro, PageBlock } from '@/components/UI'
import css from '@/components/css/convertToJs'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import dpeData from '@/components/DPE.yaml'
import ValeurVerteWidget from '@/components/ValeurVerteWidget'

export async function generateMetadata({ params }) {
  return {
    title: `Les informations importantes pour les logements avec un DPE ${params.lettre}`,
    description: `Pour les logements classés ${params.lettre} : quelles sont les aides à la rénovation? y a-t-il une interdiction de location? quel est l'impact sur le prix à la revente?`,
    openGraph: { images: ['/jaquette.png'] },
  }
}

export default async function Page(props: Props) {
  const lettre = (await props.params).lettre
  const index = dpeData.findIndex((c) => c.lettre == lettre)

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
      <PageBlock>
        <HeaderWrapper>
          <div>
            <h1
              style={css`
                margin-top: 0.6rem;
                margin-bottom: 1rem;
              `}
            >
              Le DPE de classe <DPELabel label={lettre} />
            </h1>
            <Intro>
              <p>
                En France hexagonale, le Diagnostic de Performance Énergétique
                informe sur la performance énergétique d'un bien.
              </p>
              <p>
                Il vise à renseigner sur la performance énergétique et
                climatique en se basant sur:
              </p>
              <ul>
                <li>la consommation en énergie primaire</li>
                <li>les émissions de gaz à effet de serre</li>
              </ul>
              <p>
                Ce diagnostic est un élément clé à prendre en compte lorsque
                l'on cherche à acheter, louer, vendre ou encore rénover un
                logement.
              </p>
            </Intro>
          </div>
          <DPE
            avecGES={true}
            letter={lettre}
            gesLetter={lettre}
            avecLegend={true}
          />
        </HeaderWrapper>
        <Wrapper>
          <Content>
            <h2>Comprendre son DPE</h2>
            <p>
              L'étiquette énergétique finale est définie selon la méthode des
              double seuils: un logement étant classé selon sa plus mauvaise
              performance, en énergie primaire ou en gaz à effet de serre.
            </p>
            <p>
              Un logement classé <DPELabel label={lettre} /> consomme au pire{' '}
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
            <ValeurVerteWidget lettre={lettre} />
          </Content>
        </Wrapper>
        <Wrapper $background="white" $noMargin={true} $last={true}>
          <Content>
            <h2>Quelles aides sont mobilisables ?</h2>
            <div></div>
            <h2>Une interdiction de location est-elle prévue?</h2>
            {Object.keys(interdictionLocation).includes(lettre) ? (
              <>
                Une interdiction de location est prévue à partir du{' '}
                <strong>
                  1<sup>er</sup> janvier {interdictionLocation[lettre]}
                </strong>{' '}
                pour les logements avec un DPE <DPELabel label={lettre} />
              </>
            ) : (
              <>
                Aucune interdiction de location n'est actuellement prévu pour un
                logement avec un DPE <DPELabel label={lettre} />
              </>
            )}
          </Content>
        </Wrapper>
      </PageBlock>
    </main>
  )
}
