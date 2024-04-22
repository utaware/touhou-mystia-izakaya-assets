const fs = require('fs-extra')
const { resolve } = require('path')

const sharp = require('sharp')

exports.getFolderImages = async function (src) {

  const folder_files = await fs.readdir(src)

  const result = []

  for await(const filename of folder_files) {

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