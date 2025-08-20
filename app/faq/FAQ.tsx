'use client'
import data from '@/app/faq/FAQ.yaml'
import { Questions } from './FAQUI'
import { parse } from 'marked'
import { useRouter } from 'next/navigation'
import { push } from '@socialgouv/matomo-next'
import Button from '@codegouvfr/react-dsfr/Button'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import { Tag } from '@codegouvfr/react-dsfr/Tag'

export default function FAQ() {
  const router = useRouter()
  return (
    <>
      <Breadcrumb
        currentPageLabel="Questions et contact"
        homeLinkProps={{
          href: '/',
        }}
        segments={[]}
      />
      <Button
        iconId="fr-icon-arrow-left-line fr-mb-5v"
        priority="secondary"
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
        Retour
      </Button>
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
                    <Tag>{question.catégorie}</Tag>
                    <h3>{question.question}</h3>
                  </div>
                </summary>
                <section
                  dangerouslySetInnerHTML={{ __html: parse(question.réponse) }}
                />
              </details>
            </li>
          ))}
        <p>De nouvelles questions viendront bientôt completer cette page.</p>
      </Questions>
    </>
  )
}
