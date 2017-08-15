/* global describe it */

import { assert, expect } from 'chai';
import { spy } from 'sinon';
import { po } from 'gettext-parser';
import fs from 'fs';
import path from 'path';

import {
  extractMessages,
  extractMessagesFromFile,
  extractMessagesFromGlob,
  toPot,
} from '../src/index.js';

const getSource = file => fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8');
const getJson = file => require(`./fixtures/${file}`);

describe('react-gettext-parser', () => {

  describe('basic extraction', () => {

    it('should extract a message from jsx', () => {
      const code = getSource('SingleString.jsx');
      const messages = extractMessages(code);

      const expected = getJson('SingleString.json');

      expect(messages).to.have.length(1);
      expect(messages[0].msgid).to.equal(expected[0].msgid);
    });

    it('should extract a message from a js function call', () => {
      const code = getSource('SingleString.js');
      const messages = extractMessages(code);

      const expected = getJson('SingleString.json');

      expect(messages).to.have.length(1);
      expect(messages[0].msgid).to.equal(expected[0].msgid);
    });

    it('should do nothing when no strings are found', () => {
      const code = getSource('NoStrings.js');
      const messages = extractMessages(code);

      expect(messages).to.have.length(0);
    });

    it('should ignore empty strings', () => {
      const code = getSource('EmptyStrings.js');
      const messages = extractMessages(code);

      expect(messages).to.have.length(0);
    });

    it('should ignore non-static messages', () => {
      const code = getSource('NonStatic.js');
      const messages = extractMessages(code);

      expect(messages).to.have.length(0);
    });

    it('should support es6 template strings', () => {
      const code = getSource('Es6Strings.js');
      const messages = extractMessages(code);

      expect(messages).to.have.length(2);

      expect(messages[0].msgctxt).to.eql('context');
      expect(messages[0].msgid).to.eql('Value is: {{ value }}');
      expect(messages[0].msgid_plural).to.eql('Values are: {{ value }}');
      expect(messages[0].comments.extracted[0]).to.eql('Comment');

      expect(messages[1].msgctxt).to.eql('context');
      expect(messages[1].msgid).to.eql('One thing');
      expect(messages[1].msgid_plural).to.eql('Many things');
    });

  });

  describe('plural extraction', () => {

    it('extracts plural blocks from both function calls and components', () => {
      const code = getSource('Plurals.js');
      const messages = extractMessages(code);

      expect(messages).to.have.length(2);
      expect(messages[0].msgid_plural).to.not.be.empty;
      expect(messages[0].msgstr).to.eql(['', '']);
      expect(messages[1].msgid_plural).to.not.be.empty;
      expect(messages[1].msgstr).to.eql(['', '']);
    });

  });

  describe('customization', () => {

    it('should parse strings from custom jsx components', () => {
      const messages = extractMessagesFromFile('tests/fixtures/CustomComponent.jsx', {
        componentPropsMap: {
          T: { str: 'msgid' },
        },
      });

      expect(messages).to.have.length(1);
    });

    it('should parse strings from custom js functions', () => {
      const messages = extractMessagesFromFile('tests/fixtures/CustomFunc.jsx', {
        funcArgumentsMap: {
          translate: ['msgid'],
        },
      });

      expect(messages).to.have.length(1);
    });

    it('should not fail on import()', () => {
      const messages = extractMessagesFromFile('tests/fixtures/DynamicImportCaller.js');
    });

  });

  describe('merging identical strings', () => {

    it('should merge two identical strings and concatenate references', () => {
      const messages = extractMessagesFromGlob('tests/fixtures/Merge{A,B}.jsx');
      expect(messages).to.have.length(1);
      expect(messages[0].comments.reference).to.have.length(2);
    });

    it('should merge identical strings independant of jsx or js', () => {
      const messages = extractMessagesFromGlob('tests/fixtures/Merge{A,C}.jsx');
      expect(messages).to.have.length(1);
      expect(messages[0].comments.reference).to.have.length(2);
    });

    it('should sort references alphabetically', () => {
      const messages = extractMessagesFromGlob('tests/fixtures/Merge*.jsx');
      expect(messages).to.have.length(1);

      const references = messages[0].comments.reference;
      expect(references).to.have.length(3);
      expect(references[0]).to.contain('MergeA.jsx');
      expect(references[1]).to.contain('MergeB.jsx');
      expect(references[2]).to.contain('MergeC.jsx');
    });

  });

  describe('compiling to pot', () => {

    it('should use gettext-parser', () => {
      const compileSpy = spy(po, 'compile');
      toPot(getJson('SingleString.json'));

      expect(compileSpy.called).to.equal(true);
      compileSpy.restore();
    });

    it('should spit out a pot file containing an extracted string', () => {
      const messages = getJson('SingleString.json');
      const pot = toPot(messages);
      const relevantPot = pot.split('\n\n').pop();

      const expected = getSource('SingleString.pot');

      expect(relevantPot.trim()).to.equal(expected.trim());
    });

    it('should write empty pot when given no strings', () => {
      const pot = toPot([]);
      expect(/msgid\s".+"/.test(pot)).to.equal(false);
    });

    it('should add references to pure code parsing when provided a filename', () => {
      const code = getSource('SingleString.jsx');
      const messages = extractMessages(code, { filename: 'SingleString.jsx' });
      const pot = toPot(messages);

      expect(pot).to.contain('#: SingleString.jsx');
    });

  });

});
