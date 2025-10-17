import React, { useMemo } from 'react'
import insane from '@vtex/insane'

export const DEFAULTS = {
  allowedAttributes: {
    '*': [
      'id',
      'title',
      'accesskey',
      'class',
      'style',
      'aria-label',
      'width',
      'height',
      'hidden',
    ],
    a: ['href', 'name', 'target'],
    iframe: ['allow', 'allowfullscreen', 'frameborder', 'src'],
    img: ['src', 'alt'],
    link: ['rel', 'type', 'href'],
    td: ['colspan', 'rowspan', 'headers'],
  },
  allowedClasses: {},
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedTags: [
    'a',
    'abbr',
    'article',
    'b',
    'blockquote',
    'br',
    'caption',
    'code',
    'del',
    'details',
    'div',
    'em',
    'figure',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'header',
    'footer',
    'i',
    'img',
    'ins',
    'iframe',
    'kbd',
    'li',
    'main',
    'mark',
    'ol',
    'p',
    'picture',
    'pre',
    'section',
    'source',
    'span',
    'strike',
    'strong',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ],
}

function sanitizeHTML(
  html,
  { allowedAttributes, allowedClasses, allowedTags } = {}
) {
  const opts = { ...DEFAULTS }

  if (allowedTags) opts.allowedTags = allowedTags
  if (allowedClasses) opts.allowedClasses = allowedClasses
  if (allowedAttributes) opts.allowedAttributes = allowedAttributes

  return insane(html, opts)
}

function getDangerousSanitizedHTML(html, opts = {}) {
  return { __html: sanitizeHTML(html, opts) }
}

function useSanitizedHTML(
  html,
  { allowedAttributes, allowedClasses, allowedTags } = {}
) {
  const sanitizedHTML = useMemo(() => {
    return getDangerousSanitizedHTML(html, {
      allowedAttributes,
      allowedClasses,
      allowedTags,
    })
  }, [allowedAttributes, allowedClasses, allowedTags, html])

  return sanitizedHTML
}

export const SanitizedHTML = ({
  content,
  allowedAttributes,
  allowedClasses,
  allowedTags,
}) => {
  const sanitizedContent = useSanitizedHTML(content, {
    allowedAttributes,
    allowedClasses,
    allowedTags,
  })

  if (!content) {
    return null
  }

  return (
    <div
      style={{ display: 'contents' }}
      dangerouslySetInnerHTML={sanitizedContent}
    />
  )
}
