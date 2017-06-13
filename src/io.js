import fs from 'fs';
import colors from 'colors';

export const outputPot = (filePath, contents, cb = () => {}, verbose) => {
  if (filePath) {
    fs.writeFileSync(filePath, contents);
  }
  else {
    console.log(contents);
  }

  if (verbose) {
    console.log(`Did write .pot contents to ${filePath}`.green);
  }

  cb();
};
