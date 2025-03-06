'use client'
import calculatorIcon from '@/public/calculator-black.svg'
import Image from 'next/image'
import { Card } from './UI'

export default function CalculatorWidget({ isMobile, children }) {
  if (!isMobile) {
    isMobile = window.innerWidth <= 600
  }
  return (
    <Card
      css={`
        background: linear-gradient(180deg, #f7f7f7 0%, #e6f7fb 100%);
        box-shadow: 1px 4px 6px 0px #ccd0d5;
        margin-bottom: 1rem;
        > div:nth-child(2) {
          display: flex;
          ${isMobile && 'flex-direction: column;'}
          justify-content: space-between;
          gap: 1rem;
        }
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          h3 {
            margin: 0.5rem 0;
          }
        `}
      >
        <Image src={calculatorIcon} alt="icone calculatrice" />{' '}
        <h3>À vos calculs !</h3>
      </div>
      {children}
    </Card>
  )
}
