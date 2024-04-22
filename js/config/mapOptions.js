function split(str, sep = ',') {
  return str.split(sep)
}

function getPlace(str) {
  return str.split(',').map((v) => {
    const [dlc, place] = v.split(' ')
    return place
  })
}

const beverages = {
  'DLC': 'dlc',
  '名称': 'name',
  '价格(円)': 'price',
  '等级': 'level',
  '正特性': ['beverage_tags', split]
}

const ingredients = {
  '食材': 'name',
  '类别': 'type',
  '食材特性': ['ingredient_tags', split]
}

const recipes = {
  'DLC': 'dlc',
  '名称': 'name',
  '厨具': 'tool',
  '时间 lv1': 'time_lv1',
  '时间 lv50': 'time_lv50',
  '等级': 'level',
  '获取方式': 'from',
  '食材': ['ingredients', split],
  '正特性': ['positive_tags', split],
  '反特性': ['negative_tags', split],
}

const characterNormal = {
  '人物': 'name',
  'DLC': 'dlc',
  '出没地点': ['place', getPlace],
  '料理喜好': ['like_tags', split],
  '酒水喜好': ['beverage_tags', split],
}

const characterRare = {
  '人物': 'name',
  '地点': 'place',
  '持有金(円)': 'price',
  '奖励符卡': 'bonus_card',
  '惩罚符卡': 'punish_card',
  '奖励': 'reward',
  '任务': 'task',
  '料理喜好': ['like_tags', split],
  '料理厌恶': ['hate_tags', split],
  '酒水喜好': ['beverage_tags', split],
}

module.exports = {
  beverages,
  ingredients,
  recipes,
  character_rare: characterRare,
  character_normal: characterNormal
}
