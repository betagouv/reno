import Link from 'next/link'
import { useEffect } from 'react'
import { styled } from 'styled-components'

export default function RhetoricalQuestion({ effect, html }) {
  useEffect(() => {
    effect()
  }, [effect])
  return (
    <Content>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Content>
  )
}

const Content = styled.div`
  margin: 1rem 1vw;
`
