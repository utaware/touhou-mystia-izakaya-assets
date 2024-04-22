const { chunk, pick, isEmpty } = require('lodash')

exports.calcSpriteInfos = function ({ folderImages, colCount = 10, resolvePathFn }) {

  if (isEmpty(folderImages)) {

    return new Error('folderImages is empty')

  }

  const chunkList = chunk(folderImages, colCount)

  const rowHeightList = chunkList.map((v) => Math.max(...v.map(({ height }) => height)))

  const spriteHeight = rowHeightList.reduce((t, c) => t + c, 0)

  const spriteWidth = Math.max(...chunkList.map((v => v.reduce((t, c) => t + c.width, 0))))

  let top = 0

  chunkList.forEach((rows, i) => {

    let left = 0

    rows.forEach((item) => {

      item.top = top
      item.left = left
      item.input = resolvePathFn(item.filename)

      left += item.width

    })

    top += rowHeightList[i]

  })

  const images = chunkList.flat()

  const spriteLayers = images.map(v => pick(v, ['left', 'top', 'input']))

  return { spriteHeight, spriteWidth, spriteLayers, images }

}