const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const USED_KEY_SOURCES = [
  'react/components/InfoCard/index.js',
  'react/components/InfoCard/SchemaTypes.js',
  'react/components/InfoCardList/index.js',
  'store/contentSchemas.json',
]

const pattern = /admin\/editor\.[a-zA-Z0-9._-]+/g
const usedKeys = new Set()

for (const file of USED_KEY_SOURCES) {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8')
  for (const match of content.match(pattern) || []) {
    usedKeys.add(match)
  }
}

const sortedKeys = [...usedKeys].sort()

const toMsgKey = id =>
  id
    .replace(/^admin\/editor\./, '')
    .replace(/[.\-/]/g, '_')

const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'messages/en.json'), 'utf8')
)

const editorMessagesContent = `import { defineMessages } from 'react-intl'

const editorMessages = defineMessages({
${sortedKeys
  .map(id => {
    const key = toMsgKey(id)
    const defaultMessage = (en[id] || '').replace(/'/g, "\\'")
    return `  ${key}: {\n    id: '${id}',\n    defaultMessage: '${defaultMessage}',\n  },`
  })
  .join('\n')}
})

export default editorMessages
`

fs.mkdirSync(path.join(ROOT, 'react/messages'), { recursive: true })
fs.writeFileSync(
  path.join(ROOT, 'react/messages/editorMessages.js'),
  editorMessagesContent
)

const messagesDir = path.join(ROOT, 'messages')
for (const file of fs.readdirSync(messagesDir)) {
  if (!file.endsWith('.json')) continue

  const filePath = path.join(messagesDir, file)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const filtered = {}

  for (const key of sortedKeys) {
    if (key in data) {
      filtered[key] = data[key]
    } else if (file === 'context.json') {
      filtered[key] = key
    } else if (file === 'en.json') {
      filtered[key] = en[key] || key
    } else {
      console.warn(`Missing ${key} in ${file}, using en fallback`)
      filtered[key] = en[key] || key
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2) + '\n')
  console.log(`Filtered ${file}: ${Object.keys(filtered).length} keys`)
}

console.log(`\nTotal used keys: ${sortedKeys.length}`)
console.log('Generated react/messages/editorMessages.js')
