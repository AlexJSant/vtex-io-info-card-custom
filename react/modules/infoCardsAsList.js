import React from 'react'

import InfoCard from '../components/InfoCard'
import { resolveBlockClass } from './cssHandlesWithBlockClass'

export const getInfoCardsAsJSXList = (infoCards = [], blockClass) =>
  infoCards.map((infoCardProps, index) => {
    const { blockClass: cardBlockClass, ...cardProps } = infoCardProps

    return (
      <InfoCard
        key={index}
        {...cardProps}
        blockClass={resolveBlockClass(blockClass, cardBlockClass)}
      />
    )
  })
