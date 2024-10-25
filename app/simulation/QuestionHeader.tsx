import { styled } from 'styled-components'

export const QuestionHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  flex-direction: column;
  margin: 0.4rem 0.2rem 0.4rem 0.2rem;
  > small {
    color: var(--color);
    font-weight: 600;
  }
  h3 {
    margin: 0;
    margin-top: 0.2rem;
    @media (max-width: 800px) {
      font-size: 110%;
    }
  }
  h3 + p {
    margin-left: 0.2rem;
  }
`
