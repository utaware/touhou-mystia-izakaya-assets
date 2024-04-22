const { resolve } = require('path')

const [
  assetsPath,
  imagesPath,
  spritePath,
  cssPath,
  jsonPath,
  dataPath,
] = [
  'assets',
  'images',
  'sprite',
  'css',
  'json',
  'data',
].map(v => resolve(__dirname, '../../', v))

module.exports = {
  assetsPath,
  imagesPath,
  spritePath,
  cssPath,
  jsonPath,
  dataPath
}
