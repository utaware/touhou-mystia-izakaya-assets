const fs = require('fs-extra')

const { resolve, parse } = require('path')

const { transformJsonData } = require('./utils')

const { jsonPath, dataPath } = require('./config')

const mapOptions = require('./config/mapOptions')

async function main() {

  const folderNames = await fs.readdir(jsonPath)

  await fs.remove(dataPath)

  await fs.ensureDir(dataPath)

  for await (let filename of folderNames) {

    const originPath = resolve(jsonPath, filename)

    const originData = await fs.readJson(originPath)

    const { name } = parse(filename)

    const options = mapOptions[name]

    const transformData = transformJsonData(originData, options)

    const outputJsonPath = resolve(dataPath, filename)

    await fs.writeJson(outputJsonPath, transformData, { spaces: 2 })

  }

  console.log('all work complete')

}

main()