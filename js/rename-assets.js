const fs = require('fs-extra')

const { resolve, parse } = require('path')

const inquirer = require('inquirer')

const { assetsPath, imagesPath } = require('./config')

const { wordNormalize } = require('./pinyin')

function generatorPyName(filename) {

  const { name, ext } = parse(filename)

  const pinyinName = wordNormalize(name) + ext

  return pinyinName

}

async function renameDirWithPy(inputDir, outPutDir) {

  const folderFiles = await fs.readdir(inputDir)

  const callqueue = folderFiles.map((filename) => {

    const pyName = generatorPyName(filename)

    const inputFilePath = resolve(inputDir, filename)

    const outputFilePath = resolve(outPutDir, pyName)

    return fs.copyFile(inputFilePath, outputFilePath)

  })

  return Promise.all(callqueue)

}

async function main() {

  const folderNames = fs.readdirSync(assetsPath)

  const choices = folderNames.map((v) => ({ name:v, value: v }))

  await fs.remove(imagesPath)

  await fs.ensureDir(imagesPath)

  const { choice } = await inquirer.prompt({
    type: 'checkbox',
    name: 'choice',
    message: 'choice rename dirname:',
    default: null,
    choices
  })

  for await (let dirname of choice) {

    const originDirPath = resolve(assetsPath, dirname)

    const renameDirPath = resolve(imagesPath, dirname)

    await fs.ensureDir(renameDirPath)

    await renameDirWithPy(originDirPath, renameDirPath)
  }

  console.log('rename choice dir success')

}

main()