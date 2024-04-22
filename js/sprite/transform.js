const { kebabCase } = require('lodash')

exports.transformCssStyle = function ({
  modulename,
  attrs,
  indent = 2,
}) {

  const prefix = `.${modulename} {\n`

  const suffix = `}\n`

  const middle = Object.entries(attrs).reduce((total, current) => {

    const [key, value] = current

    const whiteSpace = ' '.repeat(indent)

    const content = `${whiteSpace}${kebabCase(key)}: ${value};\n`

    return total += content

  }, '')

  const resut = prefix + middle + suffix

  return resut

}