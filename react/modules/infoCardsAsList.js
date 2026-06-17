import React from 'react'

import InfoCard from '../components/InfoCard'

export const getInfoCardsAsJSXList = (infoCards = []) =>
  infoCards.map((infoCardProps, index) => (
    <InfoCard key={index} {...infoCardProps} />
  ))
