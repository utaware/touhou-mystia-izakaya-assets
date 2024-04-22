import pandas as pd

from custom_utils import (
  map_multi_headers,
  combine_columns_with_names
)

def compose_headers(item, i, arr):
  k, v = item
  if k == '基本信息':
    return v
  if k == '食材特性':
    return k + str(v)

def generator_ingredients_json(
  io_excel_path,
  output_json_path,
  output_json_name
):
  df = pd.read_excel(
    io=io_excel_path,
    sheet_name='食材',
    header=[0, 1]
  )

  rename_columns = map_multi_headers(df, compose_headers)

  df.columns = rename_columns

  df.drop(columns=['图鉴', '料理涉及食材个数'], inplace=True)

  df.drop(index=0, inplace=True)

  df.dropna(subset=['食材'], inplace=True)

  df.fillna('', inplace=True)

  df = combine_columns_with_names(df, ['食材特性'])

  outputFilePath = f'{output_json_path}/{output_json_name}.json'

  df.to_json(outputFilePath, force_ascii=False, orient='records', indent=2)
