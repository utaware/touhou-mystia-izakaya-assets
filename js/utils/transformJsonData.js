const { isFunction } = require('lodash')

module.exports = function transformJsonData(data, options) {
  const config = Object.entries(options)

  return data.map((items) => {
    return config.reduce((total, current) => {
      const [key, value] = current

      if (Array.isArray(value)) {
        const [name, handler] = value
        total[name] = handler(items[key])
      } else if (isFunction(value)) {
        value(items, key, total)
      } else {
        total[value] = items[key]
      }

      return total
    }, {})
  })
}
