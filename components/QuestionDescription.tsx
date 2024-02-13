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
          margin-top: 2rem;
          display: flex;
          align-items: center;
        `}
      >
        <Image
          src={informationIcon}
          width="25"
          style={css`
            margin-right: 1rem;
          `}
        />
        <Card $background={`#2a82dd1f`} $noBorder={true}>
          <div dangerouslySetInnerHTML={{ __html: rule.descriptionHtml }}></div>
        </Card>
      </div>
    )
  )
}
