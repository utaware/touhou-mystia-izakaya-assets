from pathlib import Path, PurePath

from beverages import generator_beverages_json
from recipes import generator_recipes_json
from ingredients import generator_ingredients_json
from character_normal import generator_char_nr_json
from character_rare import generator_char_ra_json

from constant import (
  IO_EXCEL_PATH,
  OUTPUT_JSON_PATH,
)

method_config_map = {
  'beverages': {
    'name': '酒水',
    'handler': generator_beverages_json,
    'enabled': False
  },
  'recipes': {
    'name': '料理',
    'handler': generator_recipes_json,
    'enabled': False
  },
  'ingredients': {
    'name': '食材',
    'handler': generator_ingredients_json,
    'enabled': False
  },
  'character_normal': {
    'name': '普客',
    'handler': generator_char_nr_json,
    'enabled': False
  },
  'character_rare': {
    'name': '稀客',
    'handler': generator_char_ra_json,
    'enabled': True
  }
}

abs_curren_path = Path('.').resolve()
abs_dirname_path = Path(__file__).parent

abs_excel_path = Path(abs_dirname_path, IO_EXCEL_PATH).resolve()
abs_json_path = Path(abs_dirname_path, OUTPUT_JSON_PATH).resolve()

rel_io_excel_path = Path.relative_to(abs_excel_path, abs_curren_path, walk_up=True)
rel_output_json_path = Path.relative_to(abs_json_path, abs_curren_path, walk_up=True)

Path(abs_json_path).mkdir(exist_ok=True)

for filename, item in method_config_map.items():
  handler, enabled = item['handler'], item['enabled']
  if enabled:
    handler(
      io_excel_path=rel_io_excel_path,
      output_json_path=rel_output_json_path,
      output_json_name=filename
    )