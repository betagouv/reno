'use client'
import calculatorIcon from '@/public/calculator-black.svg'
import Image from 'next/image'
import React from 'react'

export default function CalculatorWidget({ titleAs = 'h3', children }) {
  return (
    <div className="fr-callout fr-callout--blue-cumulus">
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
