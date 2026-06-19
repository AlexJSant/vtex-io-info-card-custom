/**
 * Normalizes blockClass to an array of modifier strings.
 * VTEX IO accepts blockClass as a string or string[] in blocks.json.
 */
export const normalizeBlockClass = blockClass => {
  if (!blockClass) {
    return []
  }

  if (Array.isArray(blockClass)) {
    return blockClass.filter(Boolean)
  }

  return [blockClass]
}

/**
 * Merges list-level and per-item blockClass values.
 * Per-item blockClass takes precedence when present.
 */
export const resolveBlockClass = (listBlockClass, itemBlockClass) => {
  const itemBlockClasses = normalizeBlockClass(itemBlockClass)

  if (itemBlockClasses.length > 0) {
    return itemBlockClasses
  }

  return normalizeBlockClass(listBlockClass)
}

const hasAllModifiers = (handle, blockClasses) =>
  blockClasses.every(blockClass => handle.includes(`--${blockClass}`))

/**
 * Applies blockClass modifiers to CSS handles when the component is rendered
 * outside its own block context (e.g. items inside list-context).
 * Skips when useCssHandles already applied the modifier via extension context.
 */
export const resolveHandlesWithBlockClass = (
  handles,
  withModifiers,
  blockClass
) => {
  const blockClasses = normalizeBlockClass(blockClass)

  if (blockClasses.length === 0) {
    return handles
  }

  const sampleHandle = handles[Object.keys(handles)[0]] || ''

  if (hasAllModifiers(sampleHandle, blockClasses)) {
    return handles
  }

  return Object.keys(handles).reduce((acc, key) => {
    const missingModifiers = blockClasses.filter(
      modifier => !handles[key].includes(`--${modifier}`)
    )

    acc[key] =
      missingModifiers.length > 0
        ? withModifiers(key, missingModifiers)
        : handles[key]

    return acc
  }, {})
}
