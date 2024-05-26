const fs = require('fs-extra')

const { resolve, parse } = require('path')

const sharp = require('sharp')

const { assetsPath, webpPath } = require('./config')

const dirname = 'beverages-rz'

const dirPath = resolve(assetsPath, dirname)

async function main() {
  const folderImages = await fs.readdir(dirPath)
  await fs.remove(webpPath)
  await fs.ensureDir(webpPath)
  for await (let filename of folderImages) {
    const filePath = resolve(dirPath, filename)
    const { name } = parse(filename)
    const dest = resolve(webpPath, name + '.png')
    await sharp(filePath).png({ quality: 100 }).toFile(dest)
  }
  console.log('complete')
}

main()
