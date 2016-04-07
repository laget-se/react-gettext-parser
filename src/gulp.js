
import path from 'path';
import through from 'through2';
import { File, PluginError } from 'gulp-util';
import colors from 'colors';

import { toPot } from './json2pot';
import { getMessages } from './parse';

const GULP_OPTS = {
  target: 'messages.pot',
};

export const gulp = (opts = {}) => {
  let allMessages = [];

  const options = {
    ...GULP_OPTS,
    ...opts,
  };

  function read(file, enc, cb) {
    console.log(Object.keys(file));
    console.log(file.history);

    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-react-gettext-parser', 'Streams not supported'));
    }

    if (file.isBuffer()) {
      const messages = getMessages(file._contents.toString('utf8'), {
        ...options,
        filename: path.relative(process.cwd(), file.history[0]),
      });

      allMessages = allMessages.concat(messages);

      return cb();
    }

    return cb();
  }

  function write(cb) {
    const potFile = new File({
      base: process.cwd(),
      path: options.target,
      contents: new Buffer(toPot(allMessages)),
    });

    this.push(potFile);

    console.log(`Writing .pot file to ${options.target}`.green);

    cb();
  }

  return through.obj(read, write);
};
