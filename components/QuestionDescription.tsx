import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import css from './css/convertToJs'
import { Card } from './UI'
export default function QuestionDescription({ currentQuestion, rule }) {
  return (
    currentQuestion &&
    rule.description && (
      <div
        style={css`
          display: flex;
          align-items: center;
        `}
      >
        <Card
          css={`
            width: 100%;
          `}
        >
          <span
            css={`
              display: flex;
              align-items: center;
              margin-bottom: 0.8rem;
              color: #2a82dd;
              font-weight: 500;
            `}
          >
            <Image
              src={informationIcon}
              width="25"
              style={css`
                margin-right: 0.4rem;
              `}
            />{' '}
            <small>Plus d'informations</small>
          </span>
          <div
            dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}
            css={`
              blockquote {
                margin-top: 0.8rem;
                border-left: 4px solid var(--lighterColor);
                padding: 0 0.6rem;
                color: #333;
              }
            `}
          ></div>
        </Card>
      </div>
    )
  )
}
