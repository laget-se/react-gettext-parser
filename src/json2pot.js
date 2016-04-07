
import deepExtend from 'deep-extend';

// Default gettext json options
export const GETTEXT_JSON_OPTS = {
  charset: 'utf8',
  headers: {
    'pot-creation-date': new Date().toString(),
    'mime-version': '1.0',
    'content-type': 'text/plain; charset=utf8',
    'content-transfer-encoding': '8bit',
    'language': 'en',
    'plural-forms': 'nplurals=2; plural=(n!=1);',
  },
};

const GENERATED_INFO = `#\n# Generated using json2pot\n#`;

export const toTitleSnakeCase = str =>
  str.replace(/([^\w]|^)([\w])/g, x => x.toUpperCase());

export const headers = (meta = {}) =>
  Object.keys(meta)
    .reduce((headerList, key) => headerList.concat({
      name: [toTitleSnakeCase(key)],
      value: meta[key],
    }), [])
    .map(header => `"${header.name}: ${header.value}"`)
    .filter(str => str.trim())
    .join('\n');

export const comment = message => (
  message.comment ? `# ${message.comment}` : ''
);

export const sources = message => (
  message.sources
    ? message.sources.sort().map(loc => `#: ${loc}`).join('\n')
    : ''
);

export const context = message => (
  message.msgctxt ? `msgctxt "${message.msgctxt}"` : ''
);

export const strings = message => (
  message.msgid_plural
    ? `msgid "${message.msgid}"\nmsgid_plural "${message.msgid_plural}"\nmsgstr[0] ""\nmsgstr[1] ""`
    : `msgid "${message.msgid}"\nmsgstr ""`
);

export const messageDef = message =>
  [comment, sources, context, strings]
    .map(fn => fn(message))
    .filter(str => str.trim())
    .join('\n');

export const toPot = (messages, meta = {}) => {
  const potHeaders = headers(deepExtend(GETTEXT_JSON_OPTS, meta).headers);
  const potMessages = messages.map(messageDef).join('\n\n');

  return `${GENERATED_INFO}\n${potHeaders}\n\n\n${potMessages}`;
};
