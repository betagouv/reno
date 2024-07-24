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
  background: #f67f7254;
  font-style: normal;
  padding: 0 0.2rem;
`
export const Yes = styled.em`
  background: #bef2c5;
  font-style: normal;
  padding: 0 0.2rem;
`
