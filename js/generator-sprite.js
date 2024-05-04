const fs = require('fs-extra')

const { resolve } = require('path')

const inquirer = require('inquirer')

const { imagesPath, spritePath, cssPath, dataPath } = require('./config')

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
  optionsFileName,
  ext,
}) {
  const optionsFilePath = resolve(dataPath, optionsFileName)

  const optionsFileContent = optionsFileName
    ? await fs.readJson(optionsFilePath)
    : []

  const order = optionsFileContent.map((v) => v.namePY)

  const dirPath = resolve(inputDirPath, dirname)

  const dirImages = await getFolderImages(dirPath, order)

  const { spriteWidth, spriteHeight, spriteLayers, images } = calcSpriteInfos({
    folderImages: dirImages,
    resolvePathFn: (filename) => resolve(dirPath, filename),
  })

  const spriteFilePath = resolve(outputImagePath, `${dirname}-sprite`)

  const cssFilePath = resolve(outputCssPath, `${dirname}-sprite.css`)

  if (ensureSpriteImage) {
    await generatorCssSprite({
      width: spriteWidth,
      height: spriteHeight,
      layers: spriteLayers,
      dest: spriteFilePath,
      ext,
    })
  }

  const spriteUrl = `@/assets/sprite/${dirname}-sprite.png`

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

  const optionsFileMap = {
    beverages: 'beverages',
    'character-normal': 'character_normal',
    'character-rare': 'character_rare',
    'character-rare-rz': 'character_rare',
    ingredients: 'ingredients',
    'ingredients-rz': 'ingredients',
    recipes: 'recipes',
    'recipes-rz': 'recipes',
  }

  const functionChoices = ['image', 'css'].map((v) => ({ name: v, value: v }))

  const { funcChoice } = await inquirer.prompt({
    type: 'checkbox',
    name: 'funcChoice',
    message: 'select function for script',
    default: ['image'],
    choices: functionChoices,
  })

  const extChoices = ['jpeg', 'jp2', 'png', 'gif', 'webp', 'avif'].map((v) => ({
    name: v,
    value: v,
  }))

  const { extChoice } = await inquirer.prompt({
    type: 'list',
    name: 'extChoice',
    message: 'select generator sprite-image type',
    default: 'jpeg',
    choices: extChoices,
  })

  console.log(funcChoice, extChoice)

  const ensureSpriteImage = funcChoice.includes('image')
  const ensureSpriteCss = funcChoice.includes('css')

  if (ensureSpriteImage) {
    await fs.remove(spritePath)
    await fs.ensureDir(spritePath)
  }

  if (ensureSpriteCss) {
    await fs.remove(cssPath)
    await fs.ensureDir(cssPath)
  }

  for await (let dirname of folderNames) {
    const optionsFileName = Reflect.has(optionsFileMap, dirname)
      ? optionsFileMap[dirname] + '.json'
      : ''
    await generatorSpriteImage({
      inputDirPath: imagesPath,
      outputImagePath: spritePath,
      outputCssPath: cssPath,
      dirname,
      optionsFileName,
      ensureSpriteImage,
      ensureSpriteCss,
      ext: extChoice,
    })
  }

  console.log('generator css sprite success')
}

main()