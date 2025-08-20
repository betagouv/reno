import styled from 'styled-components'

export const Loader = styled.span`
  display: inline-block;
  width: 20px;
  margin: 0 0.6rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color);
  box-shadow: 0 0 0 0 #0004;
  animation: l1 1s infinite;

  @keyframes l1 {
    100% {
      box-shadow: 0 0 0 30px #0000;
    }
  }
`
