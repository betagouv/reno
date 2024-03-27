'use client'
import { useState } from 'react'

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
	height: 6em;
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
        repo: 'betagouv/reno',
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
        `}
      >
        Le titre bref de votre problème ou question
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
            et la plateforme (iPhone, Android, ordinateur Windows, etc.), vous
            nous aiderez à résoudre le bug plus rapidement.
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
          Cette contribution sera publique : n'y mettez{' '}
          <strong>pas d'informations sensibles</strong>.
        </em>
      </p>
      <button
        className="ui__ button"
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
              : '') +
            'publicodes.Contribution.commentaireAugmenté'
          createIssue(sujet, augmentedComment, setURL, disableButton, [
            '❓ FAQ',
            '💁 contribution externe',
          ])
        }}
      >
        Envoyer
      </button>
    </form>
  ) : (
    <section>
      <p role="status">
        Merci 😍 ! Suivez l'avancement de votre suggestion en cliquant sur{' '}
        <a href={URL}>ce lien</a>.
      </p>
      <p>
        Si vous désirez être notifié de nos réponses,
        <strong>
          vous pouvez{' '}
          <a href="https://github.com/betagouv/reno/issues/new?assignees=&labels=contribution&template=retour-utilisateur.md&title=">
            créer un compte sur la plateforme Github
          </a>
        </strong>{' '}
        afin de suivre les échanges et discuter avec nous.
      </p>
    </section>
  )
}

export const GithubContributionCard = ({ fromLocation }) => {
  return (
    <div className="ui__ card" css="padding: 1rem 0">
      <p>
        Pour toute remarque ou question, nous vous invitons à{' '}
        <a href="https://github.com/betagouv/reno/issues/new?assignees=&labels=contribution&template=retour-utilisateur.md&title=">
          ouvrir un ticket directement sur GitHub
        </a>
        .
      </p>
      <details>
        <summary>
          🐛 Vous avez un bug qui vous empêche d'utiliser Nos Gestes Climat ?
        </summary>
        <GithubContributionForm fromLocation={fromLocation} />
      </details>
    </div>
  )
}

export default function Contact({ fromLocation }) {
  return (
    <div className="ui__ container" css="padding-bottom: 1rem">
      <h2>🙋 J'ai une autre question</h2>
      <p>
        Vous pouvez nous envoyer un message via le formulaire de contact
        ci-dessous. N'y mettez <strong>pas d'informations sensibles</strong>{' '}
        (nom, adresse précise, etc) car votre message sera utilisé pour
        consolider la base de questions-réponses.
      </p>
      <div
        className="ui__ card"
        css={`
          padding: 1rem 0;
          margin: 1rem 0;
        `}
      >
        <GithubContributionForm fromLocation={fromLocation} />
      </div>
      {false && (
        <p>
          Enfin, vous avez la possibilité de nous envoyer un mail à l'adresse{' '}
          <a href="mailto:contact@nosgestesclimat.fr">
            contact@nosgestesclimat.fr
          </a>
          . Cependant, le délais de réponse sera plus long que les solutions
          précédentes.
        </p>
      )}
    </div>
  )
}
