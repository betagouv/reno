import Link from 'next/link'
import styled from 'styled-components'

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`
export const AnswerWrapper = styled.div`
  display: flex;
  align-items: end;
  flex-direction: column;
`
export const Input = styled.input`
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    rgba(61, 59, 53, 0.16) 0px 0px 0px 1px,
    rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
  width: 8rem;
  height: 1.6rem;
  padding: 0 0.4rem;
  margin: 0.4rem 0;
  border-radius: 0.2rem;
  border: 1px solid grey;
`

export const FormLinkButton = styled(Link)`
  background: black;
  color: white;
  border-radius: 0.2rem;
  padding: 0.3rem 0.6rem;
  text-decoration: none;
  margin: 0.4rem;
`

export const SuggestionsList = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0.2rem 0;
  li {
    margin: 0 0.4rem;
    a {
      text-decoration-style: dashed;
    }
  }
`
