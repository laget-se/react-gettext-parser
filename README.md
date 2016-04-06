> **Note:** This is being built. Some of the info here is made up dreams and fairy tales.

# react-gettext-parser

A gettext parser for React. Extracts translatable texts from components and spits it out into a .pot file.

## Problem

...

## Features

* Parses anything that Babel does
* Map component names and properties to gettext variables
* Map function names and arguments to gettext variables
* Available as a regular JavaScript object, a CLI utility, Babel plugin and Gulp task

## Usage

### Using the CLI

```bash
react-gettext-parser --target messages.pot 'src/**/*.js*'
```

### Using the API

```js
import { parseFile } from 'react-gettext-parser';

parseFile('MyComponent.jsx', {
  target: 'messages.pot',
});
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
    "build:pot": "react-gettext-parser --target messages.pot 'src/**/*.js*'"
  }
}
```

### As a gulp task

```js
var reactGettextParser = require('react-gettext-parser').gulp;

gulp.task('build:pot', function() {
  return gulp.src('src/**/*.js*')
    .pipe(reactGettextParser({
      target: 'messages.pot',
    }))
    .pipe(gulp.dest('translations'));
});
```

## Options

#### `target`

The destination path for the .pot file.

#### `componentPropsMap`

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

```jsx
// MyComponent.jsx
<GetText
  message="One item" 
  messagePlural="{{ count }} items" 
  count={numItems}
  context="Cart"
  comment="The number of items added to the cart"
/>
```

...would result in the following translation definition:

```gettext
# The number of items added to the cart
#: MyComponent.jsx:2
msgctxt "Cart"
msgid "One item"
msgid_plural "{{ count }} items"
```

#### `funcArgumentsMap`

```
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

## Known issues

* Inline texts inside components are not extracted

## Developing

```bash
npm i && npm run dev
npm run lint
npm run build
```

## License

ISC
