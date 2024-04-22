const fs = require('fs-extra')

const { parse } = require('path')

const { transformCssStyle } = require('./transform')

exports.generatorCssFile = function ({
  dest,
  modulename = 'ingredients',
  spriteUrl,
  images = [],
}) {
  // .ingredients - common
  const common_css = transformCssStyle({
    modulename,
    attrs: {
      backgroundImage: `url('${spriteUrl}')`,
      backgroundRepeat: 'no-repeat',
    }
  })
  // .[name] - position
  const item_css = images.map(({ left, top, width, height, input }) => {
    const { name } = parse(input)
    return transformCssStyle({
      modulename: name,
      attrs: {
        backgroundPosition: `-${left}px -${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }
    })
  })

  const css_content = [
    common_css,
    ...item_css
  ].join('\n')

  return fs.writeFile(dest, css_content)

}