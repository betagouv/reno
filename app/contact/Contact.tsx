'use client'
import MapBehindCTA from '@/components/MapBehindCTA'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

export default function Contact({ fromLocation }) {
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const [type, setType] = useState('')
  const createIssue = (
    body: string,
    labels = ['💁 contribution externe'],
  ) => {
    if (body == null || body =='') {
      return null
    }
  
    fetch(
      '/faq/api?' +
        Object.entries({
          repo: 'mesaidesreno/feedback-utilisateur',
          title: "Retour utilisateurs",
          body,
          labels,
        })
          .map(([k, v]) => k + '=' + encodeURIComponent(v))
          .join('&'),
      { mode: 'cors' },
    )
      .then((response) => response.json())
      .then((json) => {
        setSent(true)
        setType("anonyme")
      })
  }

  return sent ? (
    <section>
      <h3> 😍 Merci à vous</h3>
      <p>Grâce à votre retour, vous contribuer à l'amélioration de ce service.</p>
      { type == "email" && (
        <p>Nous nous efforçons de revenir vers vous dans les plus brefs délais.</p>
      )}
      <p>Vous pouvez également contacter <strong> l'espace France Rénov' le plus proche de chez vous </strong> 
        qui est <strong>votre interlocuteur privilégié</strong> pour toutes les questions concernant votre projet de rénovation.</p>
      <MapBehindCTA
          {...{
            what: 'trouver-conseiller-renov',
            text: 'Trouver mon conseiller',
            link: 'https://france-renov.gouv.fr/preparer-projet/trouver-conseiller#trouver-un-espace-conseil-france-renov',
          }}
      />
    </section>
  ) : (
    <>
      <h3>🙋 J'ai une question</h3>
      <p>
        Nous sommes preneurs de toutes vos remarques, questions, suggestions et avis.<br />
        <strong>N'hésitez pas</strong> à nous envoyer un message via le formulaire de contact ci-dessous.
      </p>
      <form css={formStyle}>
        <label>
          <textarea
            aria-describedby="messageAttention"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            name="comment"
            placeholder="S'il s'agit d'un bug, merci de nous indiquer le navigateur que vous utilisez
              (par exemple Firefox version 93, Chrome version 95, Safari, etc.),
              la plateforme (iPhone, Android, ordinateur Windows, etc.) ainsi que l'url concernée, vous
              nous aiderez à résoudre le bug plus rapidement."
            required
          />
        </label>
        <Link
          css={`background: var(--color);
              color: white;
              padding: 0.8rem 1.2rem;
              border: none;
              text-decoration: none;`  
          }
          href={`mailto:contact@mesaidesreno.fr?subject=&body=${encodeURIComponent(comment)}`}
          title="Nous vous recontacterons dans les plus brefs délais"
          target="_blank"
          onClick={() => {
            setSent(true)
            setType("email")
          }}
        >
          ✉️ Je souhaite une réponse
        </Link>
        <span css={`display: inline-block; margin: 0.5rem 0.5rem;`}>ou</span>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            const augmentedComment =
              comment +
              (fromLocation
                ? '\n> ' + 'Depuis la page' + ': `' + fromLocation + '`'
                : '')
            createIssue(augmentedComment)
          }}
          title="Cette contribution sera privée et anonyme : n'hésitez pas à vous exprimer"
        >
          ✍ Témoignage anonyme
        </Button> 
      </form>
    </>
  )
}

export const Button = styled.button`
  appearance: none;
  background: var(--color);
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
`

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