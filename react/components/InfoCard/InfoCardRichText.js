import React from 'react'
import RichText from 'vtex.rich-text/index'
import { useCssHandles } from 'vtex.css-handles'
import useCustomClasses from 'vtex.css-handles/useCustomClasses'

import { resolveHandlesWithBlockClass } from '../../modules/cssHandlesWithBlockClass'

export const RICH_TEXT_CSS_HANDLES = [
  'container',
  'heading',
  'headingLevel1',
  'headingLevel2',
  'headingLevel3',
  'headingLevel4',
  'headingLevel5',
  'headingLevel6',
  'image',
  'italic',
  'link',
  'list',
  'listItem',
  'listOrdered',
  'paragraph',
  'strong',
  'table',
  'tableBody',
  'tableHead',
  'tableTd',
  'tableTh',
  'tableTr',
  'wrapper',
]

const InfoCardRichText = ({ blockClass, className, ...richTextProps }) => {
  const { handles: baseHandles, withModifiers } = useCssHandles(
    RICH_TEXT_CSS_HANDLES
  )

  const classes = useCustomClasses(() => {
    const resolvedHandles = resolveHandlesWithBlockClass(
      baseHandles,
      withModifiers,
      blockClass
    )

    if (!className) {
      return resolvedHandles
    }

    const containerClass = resolvedHandles.container
      ? `${resolvedHandles.container} ${className}`
      : className

    return {
      ...resolvedHandles,
      container: containerClass,
    }
  }, [baseHandles, withModifiers, blockClass, className])

  return <RichText {...richTextProps} classes={classes} />
}

export default InfoCardRichText
