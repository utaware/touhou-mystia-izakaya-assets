import pandas as pd

def combine_columns_with_names(df: pd.DataFrame, nameList: list):
  for name in nameList:
    columns = [ col for col in df.columns if name in col ]
    df[name] = df.apply(lambda row: combine_columns(row, columns), axis=1)
    df.drop(columns=columns, inplace=True)
  return df

def combine_columns(row: pd.DataFrame, columns: list):
  row_data = row[columns].values.astype(str)
  row_filter = [s for s in row_data if s]
  return ','.join(row_filter)

# 全空列会被认为是float类型, 在fill空字符时提示报错
def reset_empty_columns(df):
  for col in df:
    dt = df[col].dtype
    if dt == float:
      df[col] = df[col].astype(object)

def map_multi_headers(df: pd.DataFrame, fn):
  result = []
  for [i, items] in enumerate(df.columns):
    result.append(fn(items, i, df.columns))
  return result
