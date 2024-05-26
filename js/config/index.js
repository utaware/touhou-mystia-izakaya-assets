const { resolve } = require('path')

const [
  assetsPath,
  imagesPath,
  spritePath,
  cssPath,
  jsonPath,
  dataPath,
  webpPath,
] = ['assets', 'images', 'sprite', 'css', 'json', 'data', 'webp'].map((v) =>
  resolve(__dirname, '../../', v)
)

module.exports = {
  assetsPath,
  imagesPath,
  spritePath,
  cssPath,
  jsonPath,
  dataPath,
  webpPath,
}
