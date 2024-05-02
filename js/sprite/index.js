const fs = require('fs-extra')
const { resolve, parse } = require('path')

const sharp = require('sharp')

exports.getFolderImages = async function (src, order) {
  const folder_files = await fs.readdir(src)

  if (Array.isArray(order) && order.length) {
    folder_files.sort((a, b) => {
      const [m, n] = [a, b].map((v) => {
        const { name } = parse(v)
        const idx = order.indexOf(name)
        return idx < 0 ? folder_files.length : idx
      })
      return m - n
    })
  }

  const result = []

  for await (const filename of folder_files) {
    const dest = resolve(src, filename)

    const { width, height } = await sharp(dest).metadata()

    result.push({ filename, width, height })
  }

  return result
}

exports.generatorCssSprite = function ({
  width,
  height,
  layers,
  dest = 'sprite.jpeg'
}) {

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
    .composite(layers)
    .toFile(dest)
}