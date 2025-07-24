'use client'
import calculatorIcon from '@/public/calculator-black.svg'
import Image from 'next/image'
import React from 'react'
import { useEffect } from 'react'

export default function CalculatorWidget({
  isMobile = null,
  titleAs = 'h3',
  children,
}) {
  useEffect(() => {
    if (!isMobile) {
      isMobile = window.innerWidth <= 600
    }
  }, [])
  return (
    <div
      className="fr-callout fr-callout--blue-cumulus"
      // css={`
      //   background: linear-gradient(180deg, #f7f7f7 0%, #e6f7fb 100%);
      //   box-shadow: 1px 4px 6px 0px #ccd0d5;
      //   margin-bottom: 1rem;
      //   > div:nth-child(2) {
      //     display: flex;
      //     ${isMobile && 'flex-direction: column;'}
      //     justify-content: space-between;
      //     gap: 1rem;
      //   }
      // `}
    >
      <TitleWithIcon titleAs={titleAs} />
      {children}
    </div>
  )
}

const TitleWithIcon = ({ titleAs }) => {
  return React.createElement(
    titleAs,
    { className: 'fr-callout__title' },
    <span aria-hidden="true">
      <Image src={calculatorIcon} alt="icone calculatrice" />
    </span>,
    ' À vos calculs !',
  )
}
