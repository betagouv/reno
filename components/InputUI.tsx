import styled from 'styled-components'

export const AnswerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`
export const SuggestionsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0.2rem 0;
  padding: 0;
  li {
    margin: 1rem 0.3rem;
    &:first-child {
      margin-left: 0;
    }
    a {
      text-decoration: none;
      color: #004396;
      font-weight: bold;
      background: #a5d1ff;
      padding: 0.5rem 0.8rem;
      border-radius: 1.5rem;
      border: 2px solid #a5d1ff;
      &:hover {
        border: 2px solid #004396;
      }
    }
  }
`
export const Subtitle = styled.div`
  p {
    color: #666;
    font-size: 90%;
    line-height: 1.25rem;
  }
`
