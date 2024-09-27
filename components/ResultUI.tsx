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

export const No = styled.em`
  font-style: normal;
  padding: 0 0.2rem;
  a {
    text-decoration-color: salmon;
    color: black;
  }
`
export const Yes = styled.em`
  font-style: normal;
  padding: 0 0.2rem;
  a {
    text-decoration-color: green;
    color: black;
  }
`
