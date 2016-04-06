
import fs from 'fs';
// import path from 'path';

export const outputPot = (target, contents, cb = () => {}) => {
  if (target) {
    fs.writeFileSync(target, contents);
  }
  else {
    process.stdout.write(contents);
  }

  console.log(`\n\nDid write to ${target}`);

  cb();
};
