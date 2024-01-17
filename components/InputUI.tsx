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
  margin-top: 3vh;
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
  background: var(--color);
  color: white;
  border-radius: 0.2rem;
  padding: 0.3rem 0.6rem;
  text-decoration: none;
  margin: 0.4rem 0;
  font-size: 115%;
`
export const FormButtonsWrapper = styled.div`
  margin: 1.4rem 0 0.6rem 0;
  height: calc(1.2rem + 1vw);
`

export const SuggestionsList = styled.div`
  margin-top: 0.8rem;
  overflow: scroll hidden;
  white-space: nowrap;
  max-width: 90vw;
  height: 2rem;
  scrollbar-width: none;
  ul {
    display: flex;
    list-style-type: none;
    margin: 0.2rem 0;
    align-items: center;
    li {
      margin: 0 0.4rem;
      a {
        text-decoration-style: dashed;
        text-underline-offset: 4px;
      }
    }
  }
`
export const PersonasList = styled.div`
  margin-top: 0.8rem;
  ul {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    padding: 0;
    display: flex;
    list-style-type: none;
    margin: 0.2rem 0;
    align-items: center;
    li {
      > div {
        width: 14rem;
        height: 12rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 1rem 0.6rem;
        h3 {
          margin: 0;
        }
      }
      margin: 0 0.6rem;
    }
  }
`
