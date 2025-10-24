'use client'

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
    <span
      className="fr-icon-money-euro-circle-line fr-mr-1v"
      aria-hidden="true"
    ></span>,
    ' À vos calculs !',
  )
}
