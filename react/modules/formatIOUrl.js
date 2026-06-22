import { formatIOMessage } from 'vtex.native-types'

const isIOMessageDescriptor = value =>
  value != null &&
  typeof value === 'object' &&
  typeof value.id === 'string'

export const formatIOUrl = (value, intl) => {
  if (value == null || value === '') {
    return ''
  }

  if (isIOMessageDescriptor(value)) {
    return formatIOMessage({ intl, ...value })
  }

  return formatIOMessage({ id: value, intl })
}
