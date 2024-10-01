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
  margin-bottom: 0.15rem;
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
export const Select = styled.select`
  appearance: none;
  line-height: 1.5rem;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  box-shadow: inset 0 -2px 0 0 #3a3a3a;
  border: none;
  background-color: #eee;
  color: #3a3a3a;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23161616' d='m12 13.1 5-4.9 1.4 1.4-6.4 6.3-6.4-6.4L7 8.1z'/%3E%3C/svg%3E");
  background-position: calc(100% - 0.5rem) 50%;
  background-repeat: no-repeat;
  background-size: 1rem 1rem;
  border-radius: 0.25rem 0.25rem 0 0;
`
