import { gettext } from 'gettext-lib'

const someObject = {}

const OptionalChaining = () => {
  const expressionUsingOptionalChaining = someObject.something ?? 'defaultValue'
  gettext('Nullish coalescing works')
}

export default OptionalChaining
