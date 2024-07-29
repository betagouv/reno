'use client'
import styled from 'styled-components'

const Article = styled.article`
  margin: 0 auto;
  padding-bottom: 10vh;

  header {
    background: white;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    section {
      max-width: 50rem;
      margin: 0 auto;
    }
    img {
    }
    small {
      margin-top: 1rem;
      display: block;
      text-align: center;
      color: var(--color);
      font-size: 90%;
    }
  }

  h1 {
    font-size: 240%;
    margin-bottom: 1rem;
    line-height: 2.6rem;
    text-align: center;
  }
  header + section {
    max-width: 700px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  h2 {
    font-size: 120%;
    font-weight: 600;
    line-height: 1.6rem;
    margin-top: 2rem;
  }
  img,
  video {
    max-width: 90%;
    max-height: 30rem;
    display: block;
    margin: 1rem auto;
  }

  @media (max-width: 800px) {
    img {
      width: 100vw !important;
      max-width: initial !important;
      margin-left: -1rem;
      border-radius: 0 !important;
      box-shadow: none !important;
      margin-right: -1rem;
    }
  }
  img + em,
  video + p em {
    font-size: 90%;
    line-height: 1rem;
    text-align: center;
    max-width: 70%;
    margin: 0 auto;
    display: block;
    margin-bottom: 0.8rem;
    @media (max-width: 800px) {
      line-height: 1.3rem;
    }
  }
  blockquote {
    margin-left: 0;
    padding-left: 1.4rem;
    border-left: 6px solid var(--color1);
  }
  ul {
    padding-left: 1rem;
  }
  #sommaire + ul {
    background: var(--darkestColor);
    padding: 0.6rem 2rem;
    border-radius: 1rem;
  }
  hr {
    opacity: 0.25;
    margin: 1.6rem 0;
    border: 1px solid var(--lightColor);
  }
  iframe {
    width: 90%;
    margin: 1.4rem auto;
    display: block;
    border: none;
    border-radius: 0.4rem;
  }
  del  {
    text-decoration-thickness: 3px;
    text-decoration-color: var(--lightColor);
    text-decoration-style: wavy;
  }
`

export default Article
