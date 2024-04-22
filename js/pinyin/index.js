const { pinyin } = require('pinyin-pro')

function isChinese (character) {
  return (/[\u4e00-\u9fa5]/).test(character)
}

function toPinyin(s) {
  return pinyin(s, { toneType: 'none', type: 'array', v: true })
}

exports.wordNormalize = function (word) {

  const trimWord = word.trim()

  return trimWord.split('').map((v) => {

    return isChinese(v) ? toPinyin(v) : v.trim()

  }).join('')

}