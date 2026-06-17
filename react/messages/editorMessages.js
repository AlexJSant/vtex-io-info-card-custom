import { defineMessages } from 'react-intl'

const editorMessages = defineMessages({
  blockClass_description: {
    id: 'admin/editor.blockClass.description',
    defaultMessage: 'Adds an extra class name to make styling easier',
  },
  blockClass_title: {
    id: 'admin/editor.blockClass.title',
    defaultMessage: 'CSS block class',
  },
  info_card_list_description: {
    id: 'admin/editor.info-card-list.description',
    defaultMessage: 'Renders a list of Info Cards that can be composed with layout blocks such as slider-layout',
  },
  info_card_list_infoCards_title: {
    id: 'admin/editor.info-card-list.infoCards.title',
    defaultMessage: 'Info Cards',
  },
  info_card_list_title: {
    id: 'admin/editor.info-card-list.title',
    defaultMessage: 'Info Card List',
  },
  info_card_body_text_description: {
    id: 'admin/editor.info-card.body-text.description',
    defaultMessage: 'Text under subheader inside component',
  },
  info_card_body_text_title: {
    id: 'admin/editor.info-card.body-text.title',
    defaultMessage: 'Body text',
  },
  info_card_callAction_button: {
    id: 'admin/editor.info-card.callAction.button',
    defaultMessage: 'Button',
  },
  info_card_callAction_link: {
    id: 'admin/editor.info-card.callAction.link',
    defaultMessage: 'Link',
  },
  info_card_callAction_none: {
    id: 'admin/editor.info-card.callAction.none',
    defaultMessage: 'None',
  },
  info_card_callToActionLinkTarget_blank: {
    id: 'admin/editor.info-card.callToActionLinkTarget.blank',
    defaultMessage: 'Link opens in a new tab',
  },
  info_card_callToActionLinkTarget_self: {
    id: 'admin/editor.info-card.callToActionLinkTarget.self',
    defaultMessage: 'Link opens in the same tab',
  },
  info_card_callToActionLinkTarget_title: {
    id: 'admin/editor.info-card.callToActionLinkTarget.title',
    defaultMessage: 'Redirection type of call-to-action link',
  },
  info_card_callToActionMode_description: {
    id: 'admin/editor.info-card.callToActionMode.description',
    defaultMessage: 'Controls how your call to action is displayed',
  },
  info_card_callToActionMode_title: {
    id: 'admin/editor.info-card.callToActionMode.title',
    defaultMessage: 'Call to action mode',
  },
  info_card_callToActionText_description: {
    id: 'admin/editor.info-card.callToActionText.description',
    defaultMessage: 'Text inside call-to-action component',
  },
  info_card_callToActionText_title: {
    id: 'admin/editor.info-card.callToActionText.title',
    defaultMessage: 'Call to action text',
  },
  info_card_callToActionUrl_description: {
    id: 'admin/editor.info-card.callToActionUrl.description',
    defaultMessage: 'Redirect URL when CTA is clicked',
  },
  info_card_callToActionUrl_title: {
    id: 'admin/editor.info-card.callToActionUrl.title',
    defaultMessage: 'Call to action URL',
  },
  info_card_description: {
    id: 'admin/editor.info-card.description',
    defaultMessage: 'A component with image and text which you can choose how to display',
  },
  info_card_headline_description: {
    id: 'admin/editor.info-card.headline.description',
    defaultMessage: 'Headline text inside component',
  },
  info_card_headline_title: {
    id: 'admin/editor.info-card.headline.title',
    defaultMessage: 'Headline',
  },
  info_card_imageActionUrl_description: {
    id: 'admin/editor.info-card.imageActionUrl.description',
    defaultMessage: 'Pass the URL to turn the image into a link and be able to redirect the user',
  },
  info_card_imageActionUrl_title: {
    id: 'admin/editor.info-card.imageActionUrl.title',
    defaultMessage: 'Image action URL',
  },
  info_card_imageAltText_description: {
    id: 'admin/editor.info-card.imageAltText.description',
    defaultMessage: 'Alternative text for the image',
  },
  info_card_imageAltText_title: {
    id: 'admin/editor.info-card.imageAltText.title',
    defaultMessage: 'Image alternative text',
  },
  info_card_imageUrl_description: {
    id: 'admin/editor.info-card.imageUrl.description',
    defaultMessage: 'Image for desktop',
  },
  info_card_imageUrl_title: {
    id: 'admin/editor.info-card.imageUrl.title',
    defaultMessage: 'Image',
  },
  info_card_isFullModeStyle_description: {
    id: 'admin/editor.info-card.isFullModeStyle.description',
    defaultMessage: 'If true, the provided image will be used as background image and text will be displayed over it',
  },
  info_card_isFullModeStyle_title: {
    id: 'admin/editor.info-card.isFullModeStyle.title',
    defaultMessage: 'Image as background',
  },
  info_card_mobileImageUrl_description: {
    id: 'admin/editor.info-card.mobileImageUrl.description',
    defaultMessage: 'Image to be used on mobile',
  },
  info_card_mobileImageUrl_title: {
    id: 'admin/editor.info-card.mobileImageUrl.title',
    defaultMessage: 'Mobile image',
  },
  info_card_subhead_description: {
    id: 'admin/editor.info-card.subhead.description',
    defaultMessage: 'Text below headline inside component',
  },
  info_card_subhead_title: {
    id: 'admin/editor.info-card.subhead.title',
    defaultMessage: 'Subheader',
  },
  info_card_textAlignment_center: {
    id: 'admin/editor.info-card.textAlignment.center',
    defaultMessage: 'Center',
  },
  info_card_textAlignment_description: {
    id: 'admin/editor.info-card.textAlignment.description',
    defaultMessage: 'Controls the text alignment inside component',
  },
  info_card_textAlignment_left: {
    id: 'admin/editor.info-card.textAlignment.left',
    defaultMessage: 'Left',
  },
  info_card_textAlignment_right: {
    id: 'admin/editor.info-card.textAlignment.right',
    defaultMessage: 'Right',
  },
  info_card_textAlignment_title: {
    id: 'admin/editor.info-card.textAlignment.title',
    defaultMessage: 'Text alignment',
  },
  info_card_textMode_description: {
    id: 'admin/editor.info-card.textMode.description',
    defaultMessage: 'Text mode InfoCard will receive. HTML is the default, and rich text enables you to use markdown.',
  },
  info_card_textMode_html: {
    id: 'admin/editor.info-card.textMode.html',
    defaultMessage: 'HTML',
  },
  info_card_textMode_rich_text: {
    id: 'admin/editor.info-card.textMode.rich-text',
    defaultMessage: 'Rich Text',
  },
  info_card_textMode_title: {
    id: 'admin/editor.info-card.textMode.title',
    defaultMessage: 'Text mode',
  },
  info_card_textPosition_center: {
    id: 'admin/editor.info-card.textPosition.center',
    defaultMessage: 'Center',
  },
  info_card_textPosition_description: {
    id: 'admin/editor.info-card.textPosition.description',
    defaultMessage: 'Choose the component position where the text will be displayed: left, center, or right',
  },
  info_card_textPosition_left: {
    id: 'admin/editor.info-card.textPosition.left',
    defaultMessage: 'Left',
  },
  info_card_textPosition_right: {
    id: 'admin/editor.info-card.textPosition.right',
    defaultMessage: 'Right',
  },
  info_card_textPosition_title: {
    id: 'admin/editor.info-card.textPosition.title',
    defaultMessage: 'Text position',
  },
  info_card_title: {
    id: 'admin/editor.info-card.title',
    defaultMessage: 'InfoCard',
  },
})

export default editorMessages
