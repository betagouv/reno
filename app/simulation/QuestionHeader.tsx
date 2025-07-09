import { styled } from 'styled-components'

export const QuestionHeader = styled.header`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin: 0.4rem 0rem;
  div > small {
    color: var(--color);
    font-weight: 600;
  }
  h1 {
    margin: 0;
    margin-top: 0.2rem;
    font-size: 130%;
    @media (max-width: 800px) {
      font-size: 110%;
    }
  }
  h1 + p {
    margin-left: 0.2rem;
  }
`
