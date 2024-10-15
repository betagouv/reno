import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import starIcon from '@/public/star-full-gold.svg'
import Image from 'next/image'
import { CTA, Card, ExternalLink, PrimeStyle } from '../UI'
import { encodeDottedName } from '../publicodes/situationUtils'
import { uncapitalise0, aideStyles } from '../utils'
import chainIcon from '@/public/link-chain.svg'
import AideCTAs from './AideCTAs'
import styled from 'styled-components'
import { useSearchParams } from 'next/navigation'
import { formatValue } from 'publicodes'
import FatConseiller from '../FatConseiller'
import AideDurée from './AideDurée'
import { createExampleSituation } from './AmpleurSummary'

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
  const isFavorite = rule.favorite === 'oui',
    marque2 = rule['complément de marque'],
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
      <Card
        css={`
          background: ${isSelected ? 'rgba(205, 228, 255, 0.20);' : ''};
        `}
      >
        {false && level === 2 && (
          <span>
            <Image
              css={`
                position: absolute;
                top: -1.1rem;
                left: 50%;
                transform: translateX(-60%);
                width: 3rem;
                height: auto;
              `}
              src={chainIcon}
              alt="Icône représentant le lien chainé entre l'aide MaPrimeRénov' parcours accompagnée, et l'aide à l'audit energétique"
            />
          </span>
        )}
        {expanded ? (
          <>
            <header
              css={`
                margin: 0;
              `}
            >
              <small>En détails</small>
              <div
                css={`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <h2
                  css={`
                    font-size: 120%;
                    margin: 0.5rem 0 !important;
                  `}
                >
                  {title}
                </h2>
                {rule['type'] && (
                  <PictoTypeAide $style={style} $expanded={expanded}>
                    <span className="icon"></span>
                    <span>{rule['type']}</span>
                  </PictoTypeAide>
                )}
              </div>
            </header>
            <PrimeWithLabel
              {...{
                montant,
                engine,
                situation,
                dottedName,
              }}
            />
            <div
              css={`
                margin-top: 1rem;
              `}
              dangerouslySetInnerHTML={{
                __html: rules[dottedName].descriptionHtml,
              }}
            />
            {children}
            <p
              css={`
                margin-top: 1.6rem;
              `}
            >
              <ExternalLink href={rules[dottedName]['lien']} target="_blank">
                Plus d'infos sur cette aide
              </ExternalLink>
            </p>
            <FatConseiller
              {...{
                situation,
                margin: 'small',
                titre: 'Comment toucher cette aide ?',
                texte: rule.commentFaireHtml,
              }}
            />
            <AideCTAs
              {...{
                dottedName,
                setSearchParams,
                situation,
                answeredQuestions,
                expanded,
              }}
            />
          </>
        ) : (
          <>
            <header
              css={`
                margin: 0 0 1rem 0;
                ${level === 2 && 'font-size: 110%;'}
                font-size: 130%;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
              `}
            >
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
              {rule['type'] && (
                <div
                  css={`
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
                        <span className="type">70 % versés avant travaux</span>
                      </PictoTypeAide>
                    )}
                </div>
              )}
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
            <AideCTAs
              {...{
                dottedName,
                setSearchParams,
                situation,
                answeredQuestions,
                expanded,
              }}
            />
          </>
        )}
      </Card>
    </section>
  )
}

export const PrimeWithLabel = ({ montant, engine, dottedName, situation }) =>
  montant.nodeValue ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
    >
      {[
        'MPR . accompagnée . prise en charge MAR',
        'ampleur . prime individuelle copropriété',
      ].includes(dottedName)
        ? 'Prime de '
        : ['taxe foncière'].includes(dottedName)
          ? ''
          : "Jusqu'à "}
      <strong>
        {['taxe foncière'].includes(dottedName)
          ? situation['taxe foncière . commune . taux']
          : formatValue(montant)}
      </strong>
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
    font-size: ${(p) => (p.$expanded ? '80%' : '60%')};
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
