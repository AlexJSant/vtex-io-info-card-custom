import React from 'react'
import PropTypes from 'prop-types'
import { ListContextProvider, useListContext } from 'vtex.list-context'

import { getInfoCardsAsJSXList } from '../../modules/infoCardsAsList'
import editorMessages from '../../messages/editorMessages'

const InfoCardList = ({ infoCards = [], blockClass, children }) => {
  const list = useListContext()?.list ?? []
  const infoCardListContent = getInfoCardsAsJSXList(infoCards, blockClass)
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
  properties: {
    blockClass: {
      title: editorMessages.blockClass_title.id,
      description: editorMessages.blockClass_description.id,
      type: 'string',
      isLayout: true,
    },
  },
}

InfoCardList.propTypes = {
  infoCards: PropTypes.arrayOf(PropTypes.object),
  blockClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.node,
}

export default InfoCardList
