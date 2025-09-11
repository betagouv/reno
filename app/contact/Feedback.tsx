'use client'
import { push } from '@socialgouv/matomo-next'
import { useState } from 'react'
import styled from 'styled-components'
import Button from '@codegouvfr/react-dsfr/Button'
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons'
import Input from '@codegouvfr/react-dsfr/Input'

export default function Feedback({
  title = 'Ce simulateur a-t-il été utile ?',
}) {
  const [comment, setComment] = useState('')
  const [vote, setVote] = useState(null)
  const [sent, setSent] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const createIssue = (body, vote, labels = ['💁 contribution externe']) => {
    fetch(
      '/faq/api?' +
        Object.entries({
          repo: 'mesaidesreno/feedback-utilisateur',
          title: 'Retour utilisateurs',
          body,
          labels: vote ? [...labels, vote] : labels,
        })
          .map(([k, v]) => k + '=' + encodeURIComponent(v))
          .join('&'),
      { mode: 'cors' },
    )
      .then((response) => response.json())
      .then(() => {
        setSent(true)
      })
  }

  return (
    <div className="fr-callout fr-callout--yellow-tournesol">
      <form
        id="form-feedback"
        className="fr-callout__text fr-mt-5v"
        style={{ margin: 'auto', maxWidth: '40rem' }}
      >
        <h3 className="fr-callout__title fr-mb-5v">
          <span aria-hidden="true">👋</span> {title}
        </h3>
        <RadioButtons
          options={[
            {
              illustration: (
                <span
                  aria-hidden="true"
                  className="fr-icon-thumb-up-fill"
                ></span>
              ),
              label: 'Oui',
              nativeInputProps: {
                value: 'oui',
                checked: vote == 'satisfait',
                onChange: () => {
                  setVote('satisfait')
                  push(['trackEvent', 'Feedback vote satisfait', 'Clic', 'Oui'])
                },
              },
            },
            {
              illustration: (
                <span
                  aria-hidden="true"
                  className="fr-icon-question-fill"
                ></span>
              ),
              label: 'En partie',
              nativeInputProps: {
                value: 'normal',
                checked: vote == 'normal',
                onChange: () => {
                  setVote('normal')
                  push([
                    'trackEvent',
                    'Feedback vote satisfait',
                    'Clic',
                    'En partie',
                  ])
                },
              },
            },
            {
              illustration: (
                <span
                  aria-hidden="true"
                  className="fr-icon-thumb-down-fill"
                ></span>
              ),
              label: 'Non',
              nativeInputProps: {
                value: 'non',
                checked: vote == 'insatisfait',
                onChange: () => {
                  setVote('insatisfait')
                  push(['trackEvent', 'Feedback vote satisfait', 'Clic', 'Non'])
                },
              },
            },
          ]}
          disabled={vote}
          state={(vote || sent) && 'success'}
          stateRelatedMessage={(vote || sent) && 'Merci de votre retour'}
          orientation="horizontal"
        />
        {isOpen ? (
          <>
            <Input
              label="Comment pouvons-nous améliorer ce simulateur ?"
              textArea
              nativeTextAreaProps={{
                value: comment,
                onChange: (e) => setComment(e.target.value),
                name: 'commentaire',
                required: true,
              }}
              stateRelatedMessage={
                sent && (
                  <>
                    Vos suggestions nous aident à améliorer l'outil et à rendre
                    l'expérience plus efficace pour tous·tes. 🙏
                  </>
                )
              }
              state={sent && 'success'}
            />
            <Button
              onClick={(e) => {
                push(['trackEvent', 'Feedback', 'Clic', 'valide son avis'])
                e.preventDefault()
                if (!comment) {
                  return
                }
                createIssue(
                  comment + '\n> ' + 'Depuis la page: ' + window.location.href,
                  vote,
                )
              }}
              disabled={sent}
            >
              Je valide mon avis
            </Button>
          </>
        ) : (
          <Button
            priority="secondary"
            onClick={(e) => {
              setIsOpen(true)
              push(['trackEvent', 'Feedback', 'Clic', 'donne son avis'])
            }}
          >
            Je donne mon avis
          </Button>
        )}
      </form>
    </div>
  )
}

export const VoteBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  margin: 1rem 0;
  > div {
    text-align: center;
    margin: 0 1.5rem;
  }
  .unhappy-active,
  .unhappy:hover {
    cursor: pointer;
    filter: invert(19%) sepia(84%) saturate(7173%) hue-rotate(358deg)
      brightness(101%) contrast(114%);
  }
  .normal-active,
  .normal:hover {
    cursor: pointer;
    filter: invert(72%) sepia(50%) saturate(3873%) hue-rotate(356deg)
      brightness(103%) contrast(102%);
  }
  .happy-active,
  .happy:hover {
    cursor: pointer;
    filter: invert(31%) sepia(78%) saturate(468%) hue-rotate(90deg)
      brightness(98%) contrast(89%);
  }
`
