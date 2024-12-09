'use client'
import { ExternalLink } from '@/components/UI'
import { useState } from 'react'
import styled from 'styled-components'

export const formStyle = `
label {
	display: block;
	margin-bottom: 1em;
}
label input, label textarea {
	display: block;
	border-radius: .3em;
	padding: .3em ;
	border: 1px solid var(--color);
	box-shadow: none;
	margin-top: .6em;
	font-size: 100%;
	width: 80%

}
label textarea {
	height: 10em;
}`

export const createIssue = (
  title,
  body,
  setURL,
  disableButton,
  labels = ['💁 contribution externe'],
) => {
  if (title == null || body == null || [title, body].includes('')) {
    return null
  }

  fetch(
    '/faq/api?' +
      Object.entries({
        repo: 'mesaidesreno/feedback-utilisateur',
        title,
        body,
        labels,
      })
        .map(([k, v]) => k + '=' + encodeURIComponent(v))
        .join('&'),
    { mode: 'cors' },
  )
    .then((response) => response.json())
    .then((json) => {
      setURL(json.url)
      disableButton(false)
    })
}

export const GithubContributionForm = ({ fromLocation }) => {
  const [sujet, setSujet] = useState('')
  const [comment, setComment] = useState('')
  const [URL, setURL] = useState(null)
  const [buttonDisabled, disableButton] = useState(false)

  return !URL ? (
    <form css={formStyle}>
      <label
        css={`
          color: var(--color);
          input {
            text-align: left !important;
          }
        `}
      >
        Le titre bref de votre requête
        <input
          aria-describedby="messageAttention"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          type="text"
          name="sujet"
          required
        />
      </label>
      <label css="color: var(--color)">
        <p>La description complète de votre problème ou votre question</p>
        <p>
          <small>
            S'il s'agit d'un bug, en indiquant le navigateur que vous utilisez
            (par exemple Firefox version 93, Chrome version 95, Safari, etc.),
            la plateforme (iPhone, Android, ordinateur Windows, etc.) ainsi que
            l'url concernée, vous nous aiderez à résoudre le bug plus
            rapidement.
          </small>
        </p>
        <textarea
          aria-describedby="messageAttention"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="comment"
          required
        />
      </label>
      <p id="messageAttention">
        <em>
          Cette contribution sera privée et anonyme :{' '}
          <strong>n'hésitez pas à vous exprimer</strong> et à nous laisser vos
          coordonnées{' '}
          <strong>uniquement si vous souhaitez être recontacté</strong>.
        </em>
      </p>
      <Button
        type="submit"
        disabled={buttonDisabled}
        onClick={(e) => {
          if (buttonDisabled) return null

          e.preventDefault()
          disableButton(true)
          const augmentedComment =
            comment +
            (fromLocation
              ? '\n> ' + 'Depuis la page' + ': `' + fromLocation + '`'
              : '')
          createIssue(sujet, augmentedComment, setURL, disableButton, [
            '❓ FAQ',
            '💁 contribution externe',
          ])
        }}
      >
        ✉️ Nous contacter
      </Button>
    </form>
  ) : (
    <section>
      <p role="status">
        Merci 😍 ! Vos suggestions nous aident à améliorer l'outil et à rendre
        l'expérience plus efficace pour tous·tes. 🙏.
      </p>
      <p></p>
      {/* <p>
        Suivez l'avancement de votre suggestion en cliquant sur{' '}
        <ExternalLink href={URL}>ce lien</ExternalLink>.
        Si vous désirez être notifié de nos réponses,
        <strong>
          vous pouvez{' '}
          <ExternalLink href="https://github.com/betagouv/reno/issues/new?assignees=&labels=contribution&template=retour-utilisateur.md&title=">
            créer un compte sur la plateforme Github
          </ExternalLink>
        </strong>{' '}
        afin de suivre les échanges et discuter avec nous.
      </p> */}
    </section>
  )
}

export default function Contact({ fromLocation }) {
  return (
    <div className="ui__ container" css="padding-bottom: 1rem">
      <h2>🙋 J'ai une question</h2>
      <p>
        Nous sommes preneurs de toutes vos remarques, questions, suggestions et
        avis.
        <br />
        <strong>N'hésitez pas</strong> à nous envoyer un message via le
        formulaire de contact ci-dessous.
      </p>
      <div
        css={`
          padding: 1rem 0;
          margin: 1rem 0;
        `}
      >
        <GithubContributionForm fromLocation={fromLocation} />
      </div>
    </div>
  )
}

export const Button = styled.button`
  appearance: none;
  background: var(--color);
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
`
