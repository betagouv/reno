'use client'
import { CTA } from '@/components/UI'
import { push } from '@socialgouv/matomo-next'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import iconSmileyNo from '@/public/smiley-no.svg'
import iconSmileyMaybe from '@/public/smiley-maybe.svg'
import iconSmileyYes from '@/public/smiley-yes.svg'

export default function Feedback({ title, fromLocation }) {
  const [comment, setComment] = useState('')
  const [vote, setVote] = useState(null)
  const [sent, setSent] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
      })
  }

  return (
    <ContactForm css={`
          background: #FDF8DB;
          align-items: center;
          padding: 1rem;
          text-align: center;
      `}
    >
      <div css={`font-weight: bold`}>
        👋 {title}
      </div>
      <VoteBox>
        <div
          className={vote == "unhappy" ? 'unhappy-active' : 'unhappy'}
          onClick={() => {
            setVote("unhappy")
            push(["trackEvent", "Feedback vote satisfait", "Clic", "Non"])
          }}
        >
          <Image 
            src={iconSmileyNo}
            alt="smiley unhappy"
          />
          <div>Non</div>
        </div>
        <div
          className={vote == "normal" ? 'normal-active' : 'normal'}
          onClick={() => {
            setVote("normal")
            push(["trackEvent", "Feedback vode satisfait", "Clic", "En partie"]) 
          }}>
          <Image 
            alt="smiley normal"
            src={iconSmileyMaybe} 
            />
          <div>En partie</div>
        </div>
        <div 
          className={vote == "happy" ? 'happy-active' : 'happy'}
          onClick={() => {
            setVote("happy")
            push(["trackEvent", "Feedback vode satisfait", "Clic", "Oui"]) 
          }}>
          <Image 
            alt="smiley happy"
            src={iconSmileyYes} 
            />
          <div>Oui</div>
        </div>
      </VoteBox>
      { (vote || sent) && (<div css={`margin-bottom: 1rem;font-weight: bold`}>✅ Merci pour votre retour</div>)}
      <div className="active">
        {sent ? (
          <p>
            Vos suggestions nous aident à améliorer l'outil et à rendre l'expérience plus efficace pour tous·tes. 🙏
          </p>
        ) : (
          <form>
            { isOpen && (
              <>
                <label htmlFor='commentaire'>Comment pouvons-nous améliorer cet outil?</label>
                <textarea
                  css={`
                    margin-top: 0.5rem;
                    background: #EEEEEE;
                    border-bottom: 3px solid #3A3A3A;
                    height: 100px;
                    width: 100%;
                  `}
                  id="commentaire"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  name="comment"
                  placeholder=""
                  required
                />
              </>
            )}
            <CTA
              $fontSize="normal"
              $importance='emptyBackground'
              css={`
                width: fit-content;
                margin: auto;
              `}
              onClick={(e) => {
                if(!isOpen) {
                  setIsOpen(true);
                  push(["trackEvent", "Feedback", "Clic", "donne son avis"])
                  return;
                }
                push(["trackEvent", "Feedback", "Clic", "valide son avis"])
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
              <span css={`font-weight: bold`}>Je donne mon avis</span>
            </CTA>
          </form>
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

export const VoteBox = styled.div`
  display: flex;
  justify-content:space-evenly;
  padding: 1rem 0;  
  .unhappy-active,
  .unhappy:hover { 
    cursor: pointer;
    filter: invert(19%) sepia(84%) saturate(7173%) hue-rotate(358deg) brightness(101%) contrast(114%);
  }
  .normal-active,
  .normal:hover { 
    cursor: pointer;
    filter: invert(72%) sepia(50%) saturate(3873%) hue-rotate(356deg) brightness(103%) contrast(102%);
  }
  .happy-active,  
  .happy:hover { 
    cursor: pointer;
    filter: invert(31%) sepia(78%) saturate(468%) hue-rotate(90deg) brightness(98%) contrast(89%);
  }
`