import editorMessages from '../../messages/editorMessages'

export const textModeValues = {
  HTML: 'html',
  RICHTEXT: 'rich-text',
}

export const textPostionValues = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
}

export const textAlignmentValues = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
}

export const callActionValues = {
  NONE: 'none',
  BUTTON: 'button',
  LINK: 'link',
}

export const textModeTypes = {
  TEXT_MODE_HTML: {
    name: editorMessages.info_card_textMode_html.id,
    value: textModeValues.HTML,
  },
  TEXT_MODE_RICHTEXT: {
    name: editorMessages.info_card_textMode_rich_text.id,
    value: textModeValues.RICHTEXT,
  },
}

export const textPositionTypes = {
  TEXT_POSITION_LEFT: {
    name: editorMessages.info_card_textPosition_left.id,
    value: textPostionValues.LEFT,
  },
  TEXT_POSITION_CENTER: {
    name: editorMessages.info_card_textPosition_center.id,
    value: textPostionValues.CENTER,
  },
  TEXT_POSITION_RIGHT: {
    name: editorMessages.info_card_textPosition_right.id,
    value: textPostionValues.RIGHT,
  },
}

export const textAlignmentTypes = {
  TEXT_ALIGNMENT_LEFT: {
    name: editorMessages.info_card_textAlignment_left.id,
    value: textAlignmentValues.LEFT,
  },
  TEXT_ALIGNMENT_CENTER: {
    name: editorMessages.info_card_textAlignment_center.id,
    value: textAlignmentValues.CENTER,
  },
  TEXT_ALIGNMENT_RIGHT: {
    name: editorMessages.info_card_textAlignment_right.id,
    value: textAlignmentValues.RIGHT,
  },
}

export const callToActionModeTypes = {
  CALL_ACTION_NONE: {
    name: editorMessages.info_card_callAction_none.id,
    value: callActionValues.NONE,
  },
  CALL_ACTION_BUTTON: {
    name: editorMessages.info_card_callAction_button.id,
    value: callActionValues.BUTTON,
  },
  CALL_ACTION_LINK: {
    name: editorMessages.info_card_callAction_link.id,
    value: callActionValues.LINK,
  },
}
