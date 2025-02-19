import styled from 'styled-components'

export const AmpleurWrapper = styled.div`
  border: 2px solid var(--color);
  border-radius: 0.3rem;
  max-width: 600px;
  height: 100vh;
  padding: 1rem;

  scrollbar-color: red purple;
  &::-webkit-scrollbar {
    width: 3px; /* Mostly for vertical scrollbars */
    height: 3px; /* Mostly for horizontal scrollbars */
  }

  &::-webkit-scrollbar-thumb {
    /* Foreground */
    background: chartreuse;
  }
  &::webkit-scrollbar-track {
    /* Background */
    background: blue;
  }

  @media (min-width: 400px) {
    padding: 1rem 1.6rem;
  }

  overflow: scroll;
  > div {
    width: 100%;
    height: 100%;
    background: white;

    @media (min-width: 400px) {
      footer {
        margin-top: 1rem;
      }
    }
    header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.6rem;
      img {
        width: 5rem;
        height: auto;
      }
    }
    h1,
    h2 {
      font-size: 120%;
      font-weight: 500;
    }
    h1 {
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
      font-size: 130%;
      font-weight: 600;
    }
    h2 {
      margin-bottom: 0.6rem;
      @media (max-width: 400px) {
        margin-top: 0.6rem;
      }
    }
  }
`
