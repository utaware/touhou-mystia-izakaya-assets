const fs = require('fs-extra')

const { parse } = require('path')

const { transformCssStyle } = require('./transform')

exports.generatorCssFile = function ({
  dest,
  modulename = 'ingredients',
  spriteUrl,
  images = [],
}) {

  if (!images.length) {
    return false
  }

  const { width: iFW, height: iFH } = images[0]

  const isEqualSize = images.every((item) => {
    const { width, height } = item
    return width === iFW && height === iFH
  })
  // .ingredients - common
  const common_css = transformCssStyle({
    modulename: `${modulename}-sprite-item`,
    attrs: isEqualSize
      ? {
          backgroundImage: `url('${spriteUrl}')`,
          backgroundRepeat: 'no-repeat',
          width: `${iFW}px`,
          height: `${iFH}px`,
        }
      : {
          backgroundImage: `url('${spriteUrl}')`,
          backgroundRepeat: 'no-repeat',
        },
  })
  // .[name] - position
  const item_css = images.map(({ left, top, width, height, input }) => {
    const { name } = parse(input)
    return transformCssStyle({
      modulename: name,
      attrs: isEqualSize
        ? {
            backgroundPosition: `-${left}px -${top}px`,
          }
        : {
            backgroundPosition: `-${left}px -${top}px`,
            width: `${width}px`,
            height: `${height}px`,
          },
    })
  })

  const css_content = [
    common_css,
    ...item_css
  ].join('\n')

  return fs.writeFile(dest, css_content)

}