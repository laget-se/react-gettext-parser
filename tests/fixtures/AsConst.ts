import { gettext } from 'gettext-lib'

const AsConst = () => {
  const strs = [gettext('Translate me') as string, 'raw string'] as const
  return strs
}

export default AsConst
