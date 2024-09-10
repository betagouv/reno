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
  font-style: normal;
  margin: 0px -0.1rem;
  padding: 0.1em 0.4em;
  border-radius: 0.8em 0.3em;
  background: transparent
    linear-gradient(
      to right,
      rgba(246, 127, 114, 0.1),
      rgba(246, 127, 114, 0.6) 8%,
      rgba(246, 127, 114, 0.3)
    );
  box-decoration-break: clone;
  text-wrap: nowrap;
`
export const Yes = styled.em`
  font-style: normal;
  margin: 0px -0.1rem;
  padding: 0.1em 0.4em;
  border-radius: 0.8em 0.3em;
  background: transparent
    linear-gradient(
      to right,
      rgba(190, 242, 197, 0.1),
      rgba(190, 242, 197, 1) 8%,
      rgba(190, 242, 197, 0.6)
    );
  box-decoration-break: clone;
  text-wrap: nowrap;
`
