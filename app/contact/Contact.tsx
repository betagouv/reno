'use client'
import MapBehindCTA from '@/components/MapBehindCTA'
import { CTA, CTAWrapper } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import iconClose from '@/public/close.svg'
import Image from 'next/image'

export default function Contact({ fromLocation, display }) {
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const [type, setType] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

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

  return (
    <ContactForm css={`
        ${isHidden ? 'display: none;' : ''}
        ${display ? fixed : ''}
      `}
    >
      { display ? 
          (
            <>
              <div 
                css={`
                  padding: 0.2rem;
                  background:var(--color);
                  float: right;
                  height: 1.4rem;
                  cursor: pointer;
                `}
                onClick={() => {
                  setIsHidden(true)
                }}
              >
                <Image src={iconClose} width="15" />  
              </div>
              {!isOpen && (
                <div 
                  css={`
                    display: flex; 
                    justify-content: flex-end;
                    align-items: center;
                  `}
                >
                  <span css={`margin-right: 1rem;`}>Avez-vous trouvé l'information recherchée ?</span>
                  <CTAWrapper css={`margin: 0 3rem;`}>
                    <CTA 
                      $fontSize="normal"
                      onClick={() => {
                        setIsOpen(!isOpen)
                        push(["trackEvent", "Feedback vode satisfait", "Clic", "Oui"]) 
                      }}>
                      <button>Oui</button>
                    </CTA>
                    <CTA 
                      $fontSize="normal"
                      onClick={() => {
                        setIsOpen(!isOpen)
                        push(["trackEvent", "Feedback vode satisfait", "Clic", "Non"])
                      }}>
                      <button>Non</button>
                    </CTA>
                  </CTAWrapper>
                </div>
              )}
            </>
          ) : 
          (<h3 onClick={() => setIsOpen(!isOpen)} css={h3Style}>🙋 J'ai une question</h3>) 
      }
      <div className={`slide-up ${!display || isOpen ? 'active' : ''}`}>
        {sent ? (
          <section>
            <h3 css={`margin: 0 0 1rem;`}> 😍 Merci à vous</h3>
            <p>
              Grâce à votre retour, vous contribuer à l'amélioration de ce service.
              { type == "email" && (
                <>Nous nous efforçons de revenir vers vous dans les plus brefs délais.</>
              )}
            </p>
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
            <p>Nous sommes preneurs de toutes vos remarques, questions, suggestions et avis.<br />
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
                ✉️ Je souhaite pouvoir être recontacté
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
        )}
      </div>
    </ContactForm>
  )
}

export const ContactForm = styled.div`
.slide-up {
  overflow: hidden;
  max-height: 0;
  transition: max-height 2s ease-out;
}

.slide-up.active {
  max-height: 500px; /* Ajuste cette valeur en fonction de la taille du contenu */
}
`

export const Button = styled.button`
  appearance: none;
  background: var(--color);
  color: white;
  padding: 0.8rem 1.2rem;
  border: none;
`

export const fixed = `
  position: fixed;
  z-index: 1000;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--color);
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

export const h3Style = `
  cursor: pointer;
  padding: 0rem;
  margin: 1rem 0;
  background: var(--color-light);
  color: var(--color-dark);
  text-align: start;
  
`