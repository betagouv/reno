'use client'

import Input from '@codegouvfr/react-dsfr/Input'
import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '@codegouvfr/react-dsfr/Button'

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
    <form>
      <Input
        label="Le titre bref de votre requête"
        nativeInputProps={{
          value: sujet,
          onChange: (e) => setSujet(e.target.value),
          type: 'text',
          name: 'sujet',
          required: true,
        }}
      />
      <Input
        label="La description complète de votre problème ou votre question"
        hintText="S'il s'agit d'un bug, en indiquant le navigateur que vous utilisez
          (par exemple Firefox version 93, Chrome version 95, Safari, etc.), la
          plateforme (iPhone, Android, ordinateur Windows, etc.) ainsi que l'url
          concernée, vous nous aiderez à résoudre le bug plus rapidement."
        textArea
        nativeInputProps={{
          value: comment,
          onChange: (e) => setComment(e.target.value),
          name: 'commentaire',
          required: true,
        }}
      />
      <p id="messageAttention">
        Cette contribution sera privée et anonyme :{' '}
        <strong>n'hésitez pas à vous exprimer</strong> et à nous laisser vos
        coordonnées{' '}
        <strong>uniquement si vous souhaitez être recontacté</strong>.
      </p>
      <Button
        iconId="fr-icon-mail-line"
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
        Nous contacter
      </Button>
    </form>
  ) : (
    <section>
      <p role="status">
        Merci <span aria-hidden="true">😍</span> ! Vos suggestions nous aident à
        améliorer l'outil et à rendre l'expérience plus efficace pour tous·tes.
        <span aria-hidden="true">🙏</span>.
      </p>
    </section>
  )
}

export default function Contact({ fromLocation }) {
  return (
    <>
      <h2>
        <span aria-hidden="true">🙋</span> J'ai une question
      </h2>
      <p>
        Nous sommes preneurs de toutes vos remarques, questions, suggestions et
        avis.
        <br />
        <strong>N'hésitez pas</strong> à nous envoyer un message via le
        formulaire de contact ci-dessous.
      </p>
      <GithubContributionForm fromLocation={fromLocation} />
    </>
  )
}
