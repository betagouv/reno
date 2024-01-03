import { styled } from 'styled-components'

export const QuestionHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  h3 {
    margin: 0.4rem 0.8rem 0.4rem 0.4rem;
  }
  details {
    summary {
      list-style-type: none;
      border: none;
      font-size: 110%;
      cursor: pointer;
    }
  }
`
