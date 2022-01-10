import fs from 'fs'
import c from 'ansi-colors'

export const outputPot = (filePath, contents, cb = () => {}) => {
  if (filePath) {
    fs.writeFileSync(filePath, contents)
  } else {
    console.log(contents)
  }

  console.log(c.green(`Did write .pot contents to ${filePath}`))

  cb()
}
