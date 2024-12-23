'use client'
import data from '@/app/faq/FAQ.yaml'
import { Questions } from './FAQUI'
import { parse } from 'marked'
import css from '@/components/css/convertToJs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { push } from '@socialgouv/matomo-next'
import { CTA, CTAWrapper } from '@/components/UI'

export default function FAQ() {
  const router = useRouter()
  return (
    <section>
      <CTAWrapper
        $justify="start"
        css={`
          margin-top: 0;
        `}
      >
        <CTA
          $fontSize="normal"
          $importance="emptyBackground"
          css={`
            a {
              padding: 0.5rem 0.8rem;
            }
          `}
        >
          <Link
            href="#"
            onClick={() => {
              push([
                'trackEvent',
                'Simulateur Principal',
                'Clic',
                'retour depuis FAQ',
              ])
              router.back()
            }}
          >
            ⬅ Retour
          </Link>
        </CTA>
      </CTAWrapper>
      <h1>Questions et contact</h1>
      <p>
        Voici quelques réponses aux questions les plus fréquentes au sujet des
        aides à la rénovation thermique.{' '}
      </p>
      <p>
        Si vous ne trouvez pas ce que vous cherchez, contactez-nous via le
        formulaire ci-dessous.
      </p>
      <h2>Questions fréquentes</h2>
      <Questions>
        {data
          .filter((question) => !question.désactivée)
          .map((question) => (
            <li key={question.id || question.question}>
              <details>
                <summary open={false}>
                  <div>
                    <small>{question.catégorie}</small>

                    <h3>{question.question}</h3>
                  </div>
                </summary>
                <section
                  dangerouslySetInnerHTML={{ __html: parse(question.réponse) }}
                ></section>
              </details>
            </li>
          ))}
        <p
          style={css`
            font-style: italic;
          `}
        >
          De nouvelles questions viendront bientôt completer cette page.
        </p>
      </Questions>
    </section>
  )
}
