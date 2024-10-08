import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'
import { No, Yes } from '../ResultUI'
import { Card } from '../UI'
import { InformationBlock } from './AideAmpleur'
import ExplicationsMPRA from '../mpra/ExplicationsMPRA'
import ExplicationAngers from '../mpra/locales/ExplicationAngers'

export default function AidesLocalesByLevel({
  aides,
  level,
  engine,
  situation,
  rules,
}) {
  const activeAide = aides.find((aide) => aide.level === level)

  const rule = activeAide && rules[activeAide.dottedName]
  return (
    <li
      css={`
        p,
        header {
          display: inline-block;
          margin-right: 0.6rem;
        }
      `}
    >
      <header>{level} :</header>
      {!activeAide ? (
        <p>Aucune aide trouvée</p>
      ) : activeAide.nodeValue > 0 ? (
        <section>
          <p>
            <Yes>Il y a une aide pour {activeAide.name}</Yes>
          </p>
          <Card $background="#f7f8f8">
            <div
              css={`
                display: flex;
                align-items: center;
                margin-top: 1rem;
              `}
            >
              <Image
                src={calculatorIcon}
                alt="Icône calculette"
                css={`
                  width: 3rem !important;
                  height: auto !important;
                  margin-right: 0.8rem !important;
                `}
              />
              {activeAide.dottedName.startsWith('aides locales . angers') ? (
                <ExplicationAngers {...{ engine, situation }} />
              ) : (
                // TODO connect the locale/Place component here, injecting the user situation and handling the fast that it's a wide explanation that should be folded by default, giving only the total amount before click
                <div>
                  <p>Nous n'avons pas encore le détail de cette aide.</p>
                  <p
                    dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
                  />
                </div>
              )}
            </div>
          </Card>
          {false && (
            <InformationBlock>
              <div
                dangerouslySetInnerHTML={{
                  __html: rules[dottedName].informationsUtilesHtml,
                }}
              />
            </InformationBlock>
          )}
        </section>
      ) : (
        <p>
          <No>L'absence d'aides</No> est confirmée à {activeAide.name}.
        </p>
      )}
    </li>
  )
}
