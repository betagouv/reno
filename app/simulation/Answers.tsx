import css from '@/components/css/convertToJs'
import Link from '@/node_modules/next/link'
import styled from 'styled-components'

export default function Answers({ answeredQuestions }) {
  return (
    <section>
      {answeredQuestions.length > 0 && (
        <div
          style={css`
            text-align: right;
            float: right;
            margin-bottom: 0.6rem;
          `}
        >
          <Link href={'/simulation'}>Recommencer</Link>
        </div>
      )}
      <Details>
        <summary>Votre situation</summary>
      </Details>
    </section>
  )
}

const Details = styled.details`
  border-bottom: 1px solid lightgrey;
`
