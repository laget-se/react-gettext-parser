import fs from 'fs'
import colors from 'colors'

export const outputPot = (filePath, contents, cb = () => {}) => {
  if (filePath) {
    fs.writeFileSync(filePath, contents)
  } else {
    console.log(contents)
  }

  console.log(`Did write .pot contents to ${filePath}`.green)

  cb()
}
