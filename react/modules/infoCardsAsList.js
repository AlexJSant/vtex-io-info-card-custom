import React from 'react'

import InfoCard from '../components/InfoCard'
import { resolveBlockClass } from './cssHandlesWithBlockClass'

export const getInfoCardsAsJSXList = (infoCards = [], blockClass) =>
  infoCards
    .filter(infoCardProps => !infoCardProps.isHidden)
    .map((infoCardProps, index) => {
      const { blockClass: cardBlockClass, isHidden: _, ...cardProps } =
        infoCardProps

      return (
        <InfoCard
          key={index}
          {...cardProps}
          blockClass={resolveBlockClass(blockClass, cardBlockClass)}
        />
      )
    })
