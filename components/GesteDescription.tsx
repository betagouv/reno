import { useState } from 'react'
import styled from 'styled-components'
import iconReduire from '@/public/reduire.svg'
import Image from 'next/image'

export default function GesteDescription({ rule }) {
  const { completeDescriptionHtml, descriptionHtml } = rule
  const hasDetails = completeDescriptionHtml != null
  const [open, setOpen] = useState(false)
  return (
    <Details open={open}>
      <summary>
        <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        <button
          onClick={() => setOpen(!open)}
          css={`
            margin-left: 0.5rem;
            background: none;
            border: none;
            img {
              width: 1rem;
              height: auto;
              transform: rotate(${!open ? '90deg' : '180deg'});
            }
          `}
        >
          {' '}
          {hasDetails && <Image src={iconReduire} alt="icone réduire" />}
        </button>
      </summary>
      <div dangerouslySetInnerHTML={{ __html: completeDescriptionHtml }} />
    </Details>
  )
}

const Details = styled.details`
  color: var(--mutedColor);
  width: 100%;
  > summary {
    width: 100%;
    list-style-type: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  p {
    line-height: 1.3rem;
  }
  font-size: 90%;
`
