const fs = require('fs-extra')

const { resolve, relative, sep } = require('path')

const { imagesPath, spritePath, cssPath } = require('./config')

const { getFolderImages, generatorCssSprite } = require('./sprite')

const { calcSpriteInfos } = require('./sprite/calc')

const { generatorCssFile } = require('./sprite/template')

async function generatorSpriteImage({
  inputDirPath,
  outputImagePath,
  outputCssPath,
  dirname
}) {

  const dirPath = resolve(inputDirPath, dirname)

  const dirImages = await getFolderImages(dirPath)

  const { spriteWidth, spriteHeight, spriteLayers, images } = calcSpriteInfos({
    folderImages: dirImages,
    resolvePathFn: (filename) => resolve(dirPath, filename)
  })

  const spriteFilePath = resolve(outputImagePath, `${dirname}-sprite.jpeg`)

  const cssFilePath = resolve(outputCssPath, `${dirname}-sprite.css`)

  await generatorCssSprite({
    width: spriteWidth,
    height: spriteHeight,
    layers: spriteLayers,
    dest: spriteFilePath
  })

  const spriteUrl = relative(cssFilePath, spriteFilePath).split(sep).join('/')

  await generatorCssFile({
    modulename: dirname,
    images,
    spriteUrl,
    dest: cssFilePath
  })

  console.log(`generator ${dirname} Css sprite success`)

}

async function main() {

  const folderNames = await fs.readdir(imagesPath)

  await fs.remove(spritePath)

  await fs.ensureDir(spritePath)

  await fs.remove(cssPath)

  await fs.ensureDir(cssPath)

  for await (let dirname of folderNames) {

    await generatorSpriteImage({
      inputDirPath: imagesPath,
      outputImagePath: spritePath,
      outputCssPath: cssPath,
      dirname
    })

  }

  console.log('generator css sprite success')

}

main()