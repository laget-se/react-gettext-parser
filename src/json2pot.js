
import { po } from 'gettext-parser';
import groupBy from 'lodash.groupby';

/**
 * Creates a gettext-parser/node-gettext compatible JSON PO(T)
 * structure from a list of gettext blocks.
 */
const createTranslationsTable = (blocks, headers = {}) => {
  const translations = groupBy(blocks, b => b.msgctx || '');

  // Hack
  // TODO: Explain this gettext-parser thingy
  translations[''] = translations[''] || {};
  translations[''][''] = {
    msgid: '',
    msgstr: [''],
  };

  return {
    charset: headers.charset || 'utf-8',
    headers: {
      'content-type': headers['content-type'] || 'text/plain; charset=utf-8',
      'pot-creation-date': new Date().toString(),
      'content-transfer-encoding': headers['content-transfer-encoding'] || '8bit',
      'plural-forms': headers['plural-forms'] || 'nplurals=2; plural=(n != 1);',
    },
    translations,
  };
};

const convertReferenceToString = reference => `${reference.filename}:${reference.line}`;

const convertCommentArraysToStrings = (blocks) =>
  blocks.map(b => ({
    ...b,
    comments: {
      reference: b.comments.reference.map(ref => convertReferenceToString(ref)).join('\n'),
      extracted: b.comments.extracted.join('\n'),
    },
  }));

export const toPot = (blocks) => {
  const parsedBlocks = convertCommentArraysToStrings(blocks);
  const pot = po.compile(createTranslationsTable(parsedBlocks));

  return pot.toString();
};
