# react-gettext-parser

A gettext utility that extract translatable strings from JSX (and regular JavaScript) and puts them into a .pot file. It uses the [babylon](https://github.com/babel/babylon) AST parser.

It can be used directly in JavaScript, in gulp, [via babel](https://github.com/alexanderwallin/babel-plugin-react-gettext-parser) or as a standalone CLI utility to be used in the terminal or from npm scripts.

## Features

* Extracts translatable strings from JSX and JavaScript (obsviously)
* Maps component names and properties to gettext variables (configurable)
* Maps function names and arguments to gettext variables (configurable)
* Merges identical strings found in separate files and concatenates their references
* Writes .pot content the a specified output file
* Supports globs

## Usage

### Using the CLI

Providing a config, using a single glob string:

```sh
react-gettext-parser --config path/to/config.js --output messages.pot 'src/**/{*.js,*.jsx}'
```

Using an array of glob strings, which is passed to [`glob-all`](https://www.npmjs.com/package/glob-all):

```sh
react-gettext-parser --output messages.pot 'src/*.js' '!src/test.js'
```

### Using the API

```js
// Script somewhere

import { parseGlob } from 'react-gettext-parser';

// Parse a file and put it into a pot file
parseGlob(['src/**/{*.js,*.jsx}'], { output: 'messages.pot' }, () => {
  // Done!
});

// You can also get extracted strings as a list of message objects
import { extractMessagesFromGlob } from 'react-gettext-parser';
const messages = extractMessagesFromGlob(['src/**/{*.js,*.jsx}']);

/*
Results in something like:

[
  {
    msgctxt: "",
    msgid: "Translate me"
    msgstr: [""],
    comments: {
      translator: ["A comment to translators"],
      reference: ["MyComponent.jsx:13"]
    }
  },
  // And so on...
]
*/
```

### Via [`babel-plugin-react-gettext-parser`](http://github.com/alexanderwallin)

```bash
babel --plugins react-gettext-parser src
```

```js
// .babelrc
{
  "presets": ["es2015", "react"],
  "plugins": [
    ["react-gettext-parser", {
      // Options
    }]
  ]
}
```

### In an npm script

```js
{
  "scripts": {
    "build:pot": "react-gettext-parser --config path/to/config.js --output messages.pot 'src/**/*.js*'"
  }
}
```

### As a gulp task

```js
var reactGettextParser = require('react-gettext-parser').gulp;

gulp.task('build:pot', function() {
  return gulp.src('src/**/*.js*')
    .pipe(reactGettextParser({
      output: 'messages.pot',
      // ...more options
    }))
    .pipe(gulp.dest('translations'));
});
```

## API

### Extracting strings

##### `extractMessages(codeStr, [options])`

Parses a string with JS(X) source code for translatable strings and returns a list of message objects.

##### `extractMessagesFromFile(filePath, [options])`

Parses a JS(X) file for translatable strings and returns a list of message objects.

##### `extractMessagesFromGlob(globStr, [options])`

Parses JS(X) files matching a glob for translatable strings and returns a list of message objects.

##### `parse(code, [options], [callback])`

Parses a string with JS(X) source code for translatable strings and writes a .pot file containing those strings.

##### `parseFile(filePath, [options], [callback])`

Parses a JS(X) file for translatable strings and writes a .pot file containing those strings.

##### `parseGlob(globStr, [options], [callback])`

Parses JS(X) files matching a glob for translatable strings and writes a .pot file containing those strings.

### Converting messages to a POT string

##### `toPot(messages)`

### Writing POT contents to file

Converts an array of message objects into a POT string.

##### `outputPot(filePath, contents, [callback])`

Writes `contents` to `filePath` if `filePath` is truthy, i.e. a string. If `filePath` is falsy, `contents` is logged to the console.

## Options

##### `output`

The destination path for the .pot file. If omitted, the .pot output will be logged to the console.

##### `componentPropsMap`

A two-level object of prop-to-gettext mappings.

The defaults are:

```js
{
  GetText: {
    message: 'msgid',
    messagePlural: 'msgid_plural',
    context: 'msgctxt',
    comment: 'comment',
  }
}
```

The above would make this component...

```js
// MyComponent.jsx
<GetText
  message="One item"
  messagePlural="{{ count }} items"
  count={numItems}
  context="Cart"
  comment="The number of items added to the cart"
/>
```

...would result in the following translation block:

```pot
# The number of items added to the cart
#: MyComponent.jsx:2
msgctxt "Cart"
msgid "One item"
msgid_plural "{{ count }} items"
msgstr[0] ""
msgstr[1] ""
```

##### `funcArgumentsMap`

An object of function names and corresponding arrays of strings that matches arguments against gettext variables.

Defaults:

```js
{
  gettext: ['msgid'],
  dgettext: [null, 'msgid'],
  ngettext: ['msgid', 'msgid_plural'],
  dngettext: [null, 'msgid', 'msgid_plural'],
  pgettext: ['msgctxt', 'msgid'],
  dpgettext: [null, 'msgctxt', 'msgid'],
  npgettext: ['msgctxt', 'msgid', 'msgid_plural'],
  dnpgettext: [null, 'msgid', 'msgid_plural'],
}
```

This configs means that this...

```js
// Menu.jsx
<Link to="/inboxes">
  { npgettext('Menu', 'Inbox', 'Inboxes') }
</Link>
```

...would result in the following translation block:

```pot
#: Menu.jsx:13
msgctxt "Menu"
msgid "Inbox"
msgid_plural "Inboxes"
msgstr[0] ""
msgstr[1] ""
```

## Developing

Get `react-gettext-parser` up and running:

```sh
npm i && npm run build && npm link
```

Running the Mocha test suite:

```sh
npm test
```

Dev mode, running `build` in watch mode:

```sh
npm run dev
```

## License

ISC
