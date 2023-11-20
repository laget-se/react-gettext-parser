import React from 'react'
import { GetText, gettext } from 'gettext-lib'

// This is a unique key word in typescript, we use this to test the parser
type T = {
  readonly key: string
}

const TsxComments = () => (
  <div>
    <GetText message="Translate me" comment="This is a comment" />

    {
      // Translators: This is also a comment
      gettext('Translate me too')
    }
  </div>
)

export default TsxComments
