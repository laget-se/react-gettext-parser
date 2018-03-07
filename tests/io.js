/* global describe it */

import { assert, expect } from 'chai';
import { mock, stub, spy } from 'sinon';
import { po } from 'gettext-parser';
import fs from 'fs';
import path from 'path';

import {
  outputPot,
} from '../src/io.js';

describe('io', () => {
  describe('outputPot', () => {
    it('should write contents to file', () => {
      const filePath = '/path/to/file.js'
      const contents = 'msgid "test"'

      const fsWriteFileSyncSpy = stub(fs, 'writeFileSync')
      outputPot(filePath, contents)
      fsWriteFileSyncSpy.restore()

      expect(fsWriteFileSyncSpy.calledWith(filePath, contents)).to.equal(true);
    });


    it('should write contents to console.log', () => {
      const contents = 'msgid "test"'

      const consoleLogSpy = stub(console, 'log')
      outputPot(undefined, contents)
      consoleLogSpy.restore()

      expect(consoleLogSpy.calledWith( contents)).to.equal(true);
    });


    it('should console.log if verbose is true', () => {
      const filePath = '/path/to/file.js'
      const contents = 'msgid "test"'

      const consoleLogSpy = stub(console, 'log')
      const fsWriteFileSyncSpy = stub(fs, 'writeFileSync')

      outputPot(filePath, contents, () => {}, true)

      consoleLogSpy.restore()
      fsWriteFileSyncSpy.restore()

      expect(consoleLogSpy.firstCall.args[0]).to.include('Did write');
    });

    it('should call callback', (done) => {
      const contents = 'msgid "test"'

      outputPot(undefined, contents, done)
    });


  });

});
