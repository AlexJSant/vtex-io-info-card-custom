import React, { useMemo } from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import { callActionValues } from './SchemaTypes'
import { resolveHandlesWithBlockClass } from '../../modules/cssHandlesWithBlockClass'

const CSS_HANDLES = ['infoCardCallActionContainer', 'infoCardCallActionText']

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const CallToAction = ({ mode, text, url, linkTarget, blockClass }) => {
  const { handles: baseHandles, withModifiers } = useCssHandles(CSS_HANDLES)
  const handles = useMemo(
    () =>
      resolveHandlesWithBlockClass(baseHandles, withModifiers, blockClass),
    [baseHandles, withModifiers, blockClass]
  )

  if (mode === callActionValues.NONE) {
    return null
  }

  // eslint-disable-next-line no-shadow
  const ActionWrapper = ({ text, mode }) => {
    if (mode === callActionValues.BUTTON) {
      return (
        <button
          onClick={noop}
          className="vtex-button bw1 ba b--action-primary bg-action-primary white br2 ph5 pv3 pointer"
          type="button"
        >
          {text}
        </button>
      )
    }

    // Mode is link
    return (
      <p
        className={`${handles.infoCardCallActionText} link t-body b underline c-action-primary`}
      >
        {text}
      </p>
    )
  }

  return (
    <Link
      className={`${handles.infoCardCallActionContainer} mt6 mb6`}
      target={linkTarget}
      to={url}
      alt={text}
    >
      <ActionWrapper text={text} mode={mode} />
    </Link>
  )
}

export default CallToAction
