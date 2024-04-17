import styled from 'styled-components'

export const Results = styled.ul`
  padding-left: 0;
  margin-top: 1rem;
  list-style-type: none;
  @media (max-width: 800px) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
    > span {
      margin: 0.6rem;
    }
  }
`
