import pandas as pd

from custom_utils import (
  combine_columns_with_names,
  map_multi_headers,
  reset_empty_columns
)

def compose_headers(item, i, arr):
  k, v = item
  if k == '基本信息':
    return v
  elif k in ['出没地点', '料理喜好', '酒水喜好']:
    return f'{k}{v}'
  elif type(k) == int:
    return f'酒水喜好{v}'
  else:
    return v

def generator_char_nr_json(
  io_excel_path,
  output_json_path,
  output_json_name
):
  df = pd.read_excel(
    io = io_excel_path,
    sheet_name = '普客一览',
    header = [0, 1]
  )

  rename_columns = map_multi_headers(df, compose_headers)

  df.columns = rename_columns

  df.rename(columns={
    'NO': '序号',
    '持有金 / 円': '持有金(円)',
  }, inplace=True)

  df.drop(columns=['序号', '图鉴', '持有金(円)'], inplace=True)

  df.dropna(subset=['人物'], inplace=True)

  reset_empty_columns(df)

  df.fillna('', inplace=True)

  df = combine_columns_with_names(df, ['出没地点', '料理喜好', '酒水喜好'])

  outputFilepath = f'{output_json_path}/{output_json_name}.json'

  df.to_json(outputFilepath, force_ascii=False, orient='records', indent=2)