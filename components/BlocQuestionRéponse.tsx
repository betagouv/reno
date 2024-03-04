'use client'
import styled from 'styled-components'

export const BlocQuestionRéponse = styled.div`
  border: 1px solid var(--lighterColor);
  padding: 4vh 4vw;
  margin: 4vh 0;
  details:last-child summary {
    border-bottom: none;
  }
  details {
    summary {
      font-size: 130%;
      color: var(--color);
      border-bottom: 1px solid var(--lighterColor);
      padding: 0.8rem;
    }
    p {
      padding: 1rem;
      border-top: none;
    }
  }
`
