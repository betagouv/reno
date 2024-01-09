import { parentName } from '@/components/publicodes/utils'
import Engine, { RuleNode } from 'publicodes'
import { NotificationsBlock } from './NotificationsBlock'
import { Card } from './UI'

// To add a new notification to a simulator, you should create a publicodes rule
// with the "type: notification" attribute. The display can be customized with
// the "sévérité" attribute. The notification will only be displayed if the
// publicodes rule is applicable.
type Notification = {
  dottedName: RuleNode['dottedName']
  descriptionHtml: 'string'
  sévérité: 'avertissement' | 'information' | 'invalide'
}

export function getNotifications(engine: Engine) {
  const notifications = Object.values(engine.getParsedRules())
    .filter(
      (rule) =>
        rule.rawNode['type'] === 'notification' &&
        !!engine.evaluate(rule.dottedName).nodeValue,
    )
    .map(({ dottedName, rawNode: { sévérité, descriptionHtml } }) => ({
      dottedName,
      sévérité,
      descriptionHtml,
    }))

  console.log('notifications', notifications)
  return notifications
}

export function getCurrentNotification(
  engine,
  currentQuestion: RuleNode['dottedName'],
) {
  if (!currentQuestion) return
  const messages: Array<Notification> = getNotifications(
    engine,
  ) as Array<Notification>

  if (!messages?.length) return null
  // Here we filter notifications to not display them out of context
  // but this supposes that notifications would be well placed in termes of namespaces
  // for now we're using only one notifcation, so that's the behavior we want
  const filteredMessages = messages.filter(
    ({ dottedName }) =>
      parentName(currentQuestion).includes(parentName(dottedName)) ||
      currentQuestion.includes(parentName(dottedName)),
  )
  return filteredMessages
}

export default function Notifications({ currentQuestion, engine, objectives }) {
  const hiddenNotifications = []

  /*
		useSelector(
    (state ) => state.simulation[objectives[0]]?.hiddenNotifications,
  )
  */

  const filteredMessages = getCurrentNotification(engine, currentQuestion)

  if (!filteredMessages) return null

  return (
    <NotificationsBlock>
      <ul style={{ margin: 0, padding: 0 }}>
        {filteredMessages.map(({ sévérité, dottedName, descriptionHtml }) =>
          hiddenNotifications?.includes(dottedName) ? null : (
            <li key={dottedName}>
              <div role="alert" className="notification">
                {sévérité == 'avertissement'
                  ? '⚠️'
                  : sévérité == 'invalide'
                    ? '🚫'
                    : '💁🏻'}
                <Card className="notificationText" $fullWidth>
                  <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                  {sévérité !== 'invalide' && false && (
                    <button
                      className="hide"
                      aria-label="close"
                      onClick={() => {
                        /*
								 
                          dispatch({
                            type: 'HIDE_NOTIFICATION',
                            id: dottedName,
                            objectives,
                          })
						  */
                      }}
                    >
                      ×
                    </button>
                  )}
                </Card>
              </div>
            </li>
          ),
        )}
      </ul>
    </NotificationsBlock>
  )
}
