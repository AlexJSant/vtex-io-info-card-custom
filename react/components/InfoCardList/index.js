import React from 'react'
import PropTypes from 'prop-types'
import { ListContextProvider, useListContext } from 'vtex.list-context'

import { getInfoCardsAsJSXList } from '../../modules/infoCardsAsList'
import editorMessages from '../../messages/editorMessages'

const InfoCardList = ({ infoCards = [], children }) => {
  const list = useListContext()?.list ?? []
  const infoCardListContent = getInfoCardsAsJSXList(infoCards)
  const newListContextValue = list.concat(infoCardListContent)
  const childArray = React.Children.toArray(children).filter(Boolean)

  if (childArray.length === 0) {
    return <>{infoCardListContent}</>
  }

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

InfoCardList.schema = {
  title: editorMessages.info_card_list_title.id,
  description: editorMessages.info_card_list_description.id,
  type: 'object',
  properties: {},
}

InfoCardList.propTypes = {
  infoCards: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
}

export default InfoCardList
