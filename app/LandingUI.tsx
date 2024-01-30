'use client'
import { Content } from '@/components/explications/ExplicationUI'
import styled from 'styled-components'

export const HeaderWrapper = styled(Content)`
  display: flex;
  align-items: center;
  img {
    margin-top: 4rem;
    margin-left: 4rem;
    width: 13rem;
    height: auto;
  }
  @media (max-width: 800px) {
    > img {
      display: none;
    }
  }
`
