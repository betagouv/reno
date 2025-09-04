import Image from 'next/image'
import { No, Yes } from '../ResultUI'
import { Card } from '../UI'
import ExplicationAngers from '../mpra/locales/ExplicationAngers'

export default function AidesLocalesByLevel({
  aides,
  level,
  engine,
  situation,
  rules,
  expanded,
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
        header {
          font-weight: bold;
          font-size: 90%;
          color: var(--color);
        }
        header + section {
          display: inline-block;
        }
        em {
          text-wrap: wrap;
        }
      `}
    >
      <header>{level.charAt(0).toUpperCase() + level.substring(1)}</header>
      {!activeAide ? (
        <p>aucune aide trouvée</p>
      ) : activeAide.nodeValue > 0 ? (
        <section>
          <p>
            <Yes>{activeAide.name}</Yes>
          </p>
          {expanded && (
            <Card $background="#f7f8f8">
              <div
                css={`
                  display: flex;
                  align-items: center;
                  margin-top: 1rem;
                `}
              >
                <span
                  className="fr-icon-money-euro-circle-line fr-mr-1v"
                  aria-hidden="true"
                ></span>
                {activeAide.dottedName.startsWith('aides locales . angers') ? (
                  <ExplicationAngers {...{ engine, situation }} />
                ) : (
                  // TODO connect the locale/Place component here, injecting the user situation and handling the fast that it's a wide explanation that should be folded by default, giving only the total amount before click
                  <div>
                    <p>
                      Nous n'avons pas encore le détail du calcul de cette aide.
                    </p>
                    <p
                      dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
                    />
                  </div>
                )}
              </div>
            </Card>
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
