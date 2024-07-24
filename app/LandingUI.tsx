'use client'
import { Content } from '@/components/explications/ExplicationUI'
import styled from 'styled-components'

export const HeaderWrapper = styled(Content)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    width: 30rem;
    max-width: 90vw;
  }
  > img {
    display: none;
  }
  @media (min-width: 800px) {
    flex-direction: row;
    > img {
      display: block;
      margin-top: 4rem;
      margin-left: 4rem;
      order: 1;
      width: 20rem;
      max-width: 25vw;
      height: auto;
      margin: 4rem;
    }
  }
`
export const LandingGreenBanner = styled.div`
  background: #f7f8f8;
  margin: 5vh 0;
  padding-bottom: 1vh;
  > div {
    color: black;
    padding: 1rem;
    width: 61rem;
    max-width: 90vw;
    margin: 0 auto;
    text-align: center;
    text-align: left;
    font-size: 90%;
    p {
      line-height: 1.3rem;
    }
    img {
      margin: 0.4rem;
      margin-left: 0;
      width: 7rem;
      height: auto;
    }
    p {
      margin: 0;
    }
    @media (min-width: 800px) {
      display: flex;
      align-items: center;
      justify-content: start;
      > img {
        order: 0;
      }
      > p {
        margin-top: 1rem;
        margin-left: 1rem;
      }
    }
  }
`
export const Labels = styled.ul`
  display: flex;
  list-style-type: none;
  justify-content: start;
  padding: 0;
  li {
    margin-right: 0.6rem;
    padding: 0.1rem 0.3rem;
    color: ${(p) => p.$color || '#18753c'};
    background: ${(p) => p.$background || '#b8fec9'};
    font-weight: bold;
    font-size: 90%;
    border-radius: 0.6rem;
  }
`

export const HomeList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  list-style-type: none;
  padding-left: 0;
  text-align: center;
  li {
    margin: 1rem 0.6rem;
    width: 12rem;
    strong {
      color: var(--lightColor);
      font-weight: 800;
      font-size: 300%;
      display: block;
    }
  }
`

export const HomeTestimonies = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: top;
  list-style-type: none;
  padding-left: 0;
  text-align: left;
  .fr-quote {
    width: 50%;
    padding: 1rem;
    h3 {
      font-size: 1.2rem;
      margin: 0 0 1rem 1rem;
    }
    &:before {
      color: #6a6af4;
      content: "";
      display: block;
      margin-bottom: .5rem;
      background-color: currentColor;
      display: inline-block;
      flex: 0 0 auto;
      height: 2rem;
      -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE0IDNhOCA4IDAgMSAxIDAgMTZ2My41Yy01LTItMTItNS0xMi0xMS41YTggOCAwIDAgMSA4LThoNFptMCAyaC00YTYgNiAwIDAgMC02IDZjMCAzLjYxIDIuNDYyIDUuOTY2IDggOC40OFYxN2gyYTYgNiAwIDEgMCAwLTEyWm0tMiAyLjUtMi41MDYgMy43NUwxMiAxNUg5LjI5NUw2Ljc1IDExLjI1IDkuMjk1IDcuNUgxMlptNC41IDAtMi41MDYgMy43NUwxNi41IDE1aC0yLjcwNWwtMi41NDUtMy43NSAyLjU0NS0zLjc1SDE2LjVaIi8+PC9zdmc+);
      mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE0IDNhOCA4IDAgMSAxIDAgMTZ2My41Yy01LTItMTItNS0xMi0xMS41YTggOCAwIDAgMSA4LThoNFptMCAyaC00YTYgNiAwIDAgMC02IDZjMCAzLjYxIDIuNDYyIDUuOTY2IDggOC40OFYxN2gyYTYgNiAwIDEgMCAwLTEyWm0tMiAyLjUtMi41MDYgMy43NUwxMiAxNUg5LjI5NUw2Ljc1IDExLjI1IDkuMjk1IDcuNUgxMlptNC41IDAtMi41MDYgMy43NUwxNi41IDE1aC0yLjcwNWwtMi41NDUtMy43NSAyLjU0NS0zLjc1SDE2LjVaIi8+PC9zdmc+);
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      vertical-align: calc(.375em - 1rem);
      width: 2rem;
    }
    .see-more {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease;
    }
    .see-more.expanded {
      max-height: 300px;
    }
    .see-more-click {
        cursor: pointer;
        display: block;
        text-align: right;
        text-decoration: underline;
    }
  }
`

export const BlueEm = styled.em`
  color: var(--lightColor);
  font-style: normal;
`
