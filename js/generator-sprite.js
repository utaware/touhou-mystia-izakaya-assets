const fs = require('fs-extra')

const { resolve } = require('path')

const inquirer = require('inquirer')

const { imagesPath, spritePath, cssPath } = require('./config')

const { getFolderImages, generatorCssSprite } = require('./sprite')

const { calcSpriteInfos } = require('./sprite/calc')

const { generatorCssFile } = require('./sprite/template')

async function generatorSpriteImage({
  inputDirPath,
  outputImagePath,
  outputCssPath,
  dirname,
  ensureSpriteImage,
  ensureSpriteCss,
}) {
  const dirPath = resolve(inputDirPath, dirname)

  const dirImages = await getFolderImages(dirPath)

  const { spriteWidth, spriteHeight, spriteLayers, images } = calcSpriteInfos({
    folderImages: dirImages,
    resolvePathFn: (filename) => resolve(dirPath, filename),
  })

  const spriteFilePath = resolve(outputImagePath, `${dirname}-sprite.jpeg`)

  const cssFilePath = resolve(outputCssPath, `${dirname}-sprite.css`)

  if (ensureSpriteImage) {
    await generatorCssSprite({
      width: spriteWidth,
      height: spriteHeight,
      layers: spriteLayers,
      dest: spriteFilePath,
    })
  }

  const spriteUrl = `@/assets/sprite/${dirname}-sprite.jpeg`

  if (ensureSpriteCss) {
    await generatorCssFile({
      modulename: dirname,
      images,
      spriteUrl,
      dest: cssFilePath,
    })
  }

  console.log(`generator ${dirname} Css sprite success`)
}

async function main() {
  const folderNames = await fs.readdir(imagesPath)

  const choices = ['image', 'css'].map((v) => ({ name: v, value: v }))

  const { choice } = await inquirer.prompt({
    type: 'checkbox',
    name: 'choice',
    message: 'choice rename dirname:',
    default: null,
    choices,
  })

  const ensureSpriteImage = choice.includes('image')
  const ensureSpriteCss = choice.includes('css')

  if (ensureSpriteImage) {
    await fs.remove(spritePath)
    await fs.ensureDir(spritePath)
  }

  if (ensureSpriteCss) {
    await fs.remove(cssPath)
    await fs.ensureDir(cssPath)
  }

  for await (let dirname of folderNames) {
    await generatorSpriteImage({
      inputDirPath: imagesPath,
      outputImagePath: spritePath,
      outputCssPath: cssPath,
      dirname,
      ensureSpriteImage,
      ensureSpriteCss,
    })
  }

  console.log('generator css sprite success')
}

main()