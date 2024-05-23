'use client'

import Image from 'next/image'
import { Label } from './Label'
import checkIcon from '@/public/check-green.svg'
import crossIcon from '@/public/remix-close-empty.svg'

export const SummaryAide = ({ condition, icon, text, text2 }) => (
  <div
    css={`
      display: flex;
      align-items: center;
    `}
  >
    <span
      css={`
        img {
          width: 1.6rem;
          height: auto;
          vertical: middle;
          margin-right: 0.1rem;
        }
      `}
    >
      {condition ? (
        <Image src={checkIcon} alt={"Icône d'une coche"} />
      ) : (
        <Image src={crossIcon} alt="Icône d'une croix" />
      )}
    </span>
    <h4
      css={`
        font-weight: 400;
        margin: 0;
        font-size: 100%;
        span {
          margin: 0 0.2rem;
        }
        display: inline-flex;
        align-items: center;
      `}
    >
      <Label>
        <Image
          src={`/${icon}.svg`}
          alt={`Icône ${text}`}
          width="25"
          height="25"
        />
        <span>{text}</span>
      </Label>{' '}
      <span>{text2}</span>
    </h4>
  </div>
)
