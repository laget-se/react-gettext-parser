
import { po } from 'gettext-parser';
import groupBy from 'lodash.groupby';

const createTranslationsTable = (blocks) => {
  const groupedBlocks = groupBy(blocks, b => b.msgctx || '');
  return {
    translations: groupedBlocks,
  };
};

const convertCommentArraysToStrings = (blocks) =>
  blocks.map(b => {
    return {
      ...b,
      comments: {
        reference: b.comments.reference.join('\n'),
        translator: b.comments.translator.join('\n'),
      },
    };
  });

export const toPot = (blocks) => {
  const parsedBlocks = convertCommentArraysToStrings(blocks);
  const pot = po.compile(createTranslationsTable(parsedBlocks));

  return pot.toString();
};
