
import fs from 'fs';
// import path from 'path';
import colors from 'colors';

export const outputPot = (target, contents, cb = () => {}) => {
  if (target) {
    fs.writeFileSync(target, contents);
  }
  else {
    console.log(contents);
  }

  console.log(`Did write .pot contents to ${target.bold}`.green);

  cb();
};
