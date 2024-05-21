import data from '@/app/faq/FAQ.yaml'
import { Questions } from './FAQUI'
import { parse } from 'marked'
import css from '@/components/css/convertToJs'

export default function FAQ() {
  return (
    <section>
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
