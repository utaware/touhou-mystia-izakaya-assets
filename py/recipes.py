import pandas as pd

from custom_utils import (
  combine_columns_with_names,
  map_multi_headers,
  reset_empty_columns
)

def compose_headers(item, i, arr):
  k, v = item
  if i in [10, 16, 29, 32]:
    return '空列'
  elif k == '基本信息':
    return v
  elif k == '正特性':
    return f'{k}{v}' if type(v) == int else v
  elif k in ['食材', '反特性']:
    return f'{k}{v}'
  else:
    return v

def generator_recipes_json(
  io_excel_path,
  output_json_path,
  output_json_name
):
  df = pd.read_excel(
    io = io_excel_path,
    sheet_name = '料理一览',
    header = [0, 1]
  )

  rename_columns = map_multi_headers(df, compose_headers)

  df.columns = rename_columns

  df.rename(columns={
    'NO': '序号',
    '价格/円': '价格(円)',
  }, inplace=True)

  df.drop(columns=['序号', '图鉴', '价格(円)', '空列', '流行喜爱', '流行厌恶'], inplace=True)

  df.dropna(subset=['名称'], inplace=True)

  reset_empty_columns(df)

  df.fillna('', inplace=True)

  df = combine_columns_with_names(df, ['食材', '正特性', '反特性'])

  outputFilepath = f'{output_json_path}/{output_json_name}.json'

  df.to_json(outputFilepath, force_ascii=False, orient='records', indent=2)