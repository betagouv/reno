import styled from 'styled-components'

export const AmpleurWrapper = styled.div`
  background: white;
  padding: 1rem;
  position: relative;
  height: 100%;

  @media (min-width: 400px) {
    > div {
      padding-left: 4rem;
    }
    header,
    footer {
      margin-left: 4rem;
    }
    footer {
      margin-top: 1rem;
    }
  }
  > div {
    max-width: 40rem;
  }
  header {
    display: flex;
    align-items: center;
    gap: 4vw;

    justify-content: space-between;
    img {
    }
  }
  h2,
  h3 {
    font-size: 120%;
    font-weight: 500;
  }
  h2 {
    margin-top: 0.6rem;
    margin-bottom: 0.8rem;
    font-size: 130%;
    font-weight: 600;
  }
  h3 {
    margin-bottom: 0.6rem;
    @media (max-width: 400px) {
      margin-top: 0.6rem;
    }
  }
`
