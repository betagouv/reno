import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { CTA, Card, ExternalLink, PrimeStyle } from '../UI'
import { encodeDottedName } from '../publicodes/situationUtils'
import { uncapitalise0, aideStyles } from '../utils'
import AideCTAs from './AideCTAs'
import styled from 'styled-components'
import { useSearchParams } from 'next/navigation'
import { formatValue } from 'publicodes'
import FatConseiller from '../FatConseiller'
import AideDurée from './AideDurée'
import { createExampleSituation } from './AmpleurSummary'
import AnimatedNumbers from 'react-animated-numbers'

export default function AideAmpleur({
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
  children,
  expanded,
  level = null,
}) {
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const rule = rules[dottedName]
  const marque2 = rule['complément de marque'],
    title = rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : '')
  const style = aideStyles[rule['type']] || {}

  const isModeste =
    engine &&
    engine
      .setSituation(situation)
      .evaluate('ménage . revenu . classe')
      .nodeValue.includes('modeste')
  const isSelected = searchParams['ampleur.synthèse']
    ?.split(',')
    .find((item) => item === '"' + encodeDottedName(dottedName) + '"')
  const extremeSituation = createExampleSituation(engine, situation, true)
  const montant =
    engine &&
    engine.setSituation(extremeSituation).evaluate(dottedName + ' . montant')

  return (
    <section
      id={'aide-' + encodeDottedName(dottedName)}
      css={
        false &&
        level === 2 &&
        !expanded &&
        `
		  border-left: 2px dashed #dfdff1;
		  padding-top: .6rem;
		  padding-left: 1rem;
		  position: relative;
		  `
      }
    >
      {expanded && (
        <header>
          <small>En détails</small>
        </header>
      )}
      <Card
        css={`
          background: ${isSelected ? 'rgba(205, 228, 255, 0.20);' : ''};
        `}
      >
        <header
          css={`
            margin: 0 0 1rem 0;
            ${level === 2 && 'font-size: 110%;'}
            font-size: 130%;
            align-items: flex-start;
            justify-content: space-between;
          `}
        >
          {rule['type'] && (
            <div
              css={`
                float: right;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                align-items: flex-end;
              `}
            >
              <PictoTypeAide $style={style} $expanded={expanded}>
                <span className="icon"></span>
                <span className="type">{rule['type']}</span>
              </PictoTypeAide>
              {isModeste &&
                dottedName == 'MPR . accompagnée' && ( // Petite exception pour MPRA qui peut être de 2 formes
                  <PictoTypeAide
                    $style={aideStyles['avance']}
                    $expanded={expanded}
                  >
                    <span className="icon"></span>
                    <span className="type">avance</span>
                  </PictoTypeAide>
                )}
            </div>
          )}
          <div>
            <h3
              css={`
                margin: 0 0 0.5rem 0;
                color: var(--darkColor0);
              `}
            >
              {title}
            </h3>
            <PrimeWithLabel
              {...{
                montant,
                engine,
                situation,
                dottedName,
              }}
            />
          </div>
        </header>
        <div
          css={`
            margin-top: 1rem;
          `}
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].descriptionHtml,
          }}
        />
        {children}
        {expanded && (
          <>
            {dottedName != 'ampleur . prime individuelle copropriété' && (
              <p
                css={`
                  margin-top: 1.6rem;
                `}
              >
                <ExternalLink href={rules[dottedName]['lien']} target="_blank">
                  Plus d'infos sur cette aide
                </ExternalLink>
              </p>
            )}
            <FatConseiller
              {...{
                situation,
                margin: 'small',
                titre: 'Comment toucher cette aide ?',
                texte: rule.commentFaireHtml,
              }}
            />
          </>
        )}
        <AideCTAs
          {...{
            dottedName,
            setSearchParams,
            situation,
            answeredQuestions,
            expanded,
          }}
        />
      </Card>
    </section>
  )
}

export const PrimeWithLabel = ({ montant, engine, dottedName, situation }) =>
  console.log('you', montant.nodeValue) || montant.nodeValue ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
    >
      {['ampleur . prime individuelle copropriété'].includes(dottedName)
        ? 'Prime de '
        : ['taxe foncière'].includes(dottedName)
          ? ''
          : "Jusqu'à "}
      <strong>
        {dottedName.includes('taxe foncière')
          ? situation['taxe foncière . commune . taux']
          : formatValue(montant)}
      </strong>
      <AnimatedNumbers
        includeComma
        transitions={(index) => ({
          type: 'spring',
          duration: index + 0.1,
        })}
        animateToNumber={montant.nodeValue}
        fontStyle={{
          fontSize: 40,
          color: 'black',
        }}
      />
      <AideDurée engine={engine} dottedName={dottedName} />
    </PrimeStyle>
  ) : (
    ''
  )

export const PictoTypeAide = styled.div`
  width: fit-content;
  color: ${(p) => p.$style.color};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .icon {
    padding: 1rem;
    background: url('${(p) => p.$style.icon.src}')
      ${(p) => p.$style.backgroundColor} no-repeat center;
    border: 1px solid ${(p) => p.$style.borderColor};
    border-radius: 5px;
  }
  .type {
    display: inline-block;
    margin-top: 0.3rem;
  }
  span {
    font-size: 60%;
  }
`

export const InformationBlock = ({ children }) => (
  <section
    css={`
      margin-top: 2vh !important;

      header {
        display: flex;
        align-items: center;
        h4 {
          color: #0359bf;
          margin: 0;

          font-weight: 500;
        }
        margin-bottom: 1.5vh !important;
      }
      ol li {
        margin: 0.6rem 0;
        list-style-type: disc;
      }
    `}
  >
    <header>
      <Image
        src={informationIcon}
        width="25"
        css={`
          margin-right: 0.4rem;
        `}
        alt="icone d'information"
      />
      <h4>Informations utiles</h4>
    </header>
    <ol>{children}</ol>
  </section>
)
export function AideCTA({ children, text }) {
  return (
    <details
      css={`
        margin: 1.8rem 0 1rem;
        summary {
          list-style-type: none;
        }
        > section {
          margin: 1rem 0;
          padding-left: 1rem;
          border-left: 2px solid var(--color);
        }
      `}
    >
      <summary>
        <CTA $importance="secondary">
          <span>
            <span
              css={`
                display: flex;
                align-items: center;
                padding: 0.6rem 0;
                img {
                  filter: invert(1);
                  width: 1.8rem;
                  margin-right: 0.6rem;
                  height: auto;
                  vertical-align: bottom;
                }
                color: inherit;
              `}
            >
              {text}
            </span>
          </span>
        </CTA>
      </summary>
      <section>{children}</section>
    </details>
  )
}
