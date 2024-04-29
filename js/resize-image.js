const fs = require('fs-extra')

const { resolve } = require('path')

const sharp = require('sharp')

const { assetsPath } = require('./config')

const imagesName = '晓.jpeg'

const moduleName = 'beverages'

const filePath = resolve(assetsPath, moduleName, imagesName)

async function main() {
  await sharp(filePath).resize(84, 84).toFile(`./${imagesName}`)
  console.log('resize success')
}

main()
