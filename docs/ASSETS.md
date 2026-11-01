# Каталог игровых кадров

Техническая таблица строится `npm run assets` из game/objectTypes. При изменении кадров обновлять вместе с игрой. Происхождение и статус источников — [ASSET_SOURCES](ASSET_SOURCES.md), инструкции дизайнеру — [DESIGNER](DESIGNER.md). Все пути ниже от корня репозитория.

## Как читать бабушкины анимации

Руки вверх (`carry_`) означают перенос предмета над головой. Отдельный PotVisual рисуется кодом, не должен быть впечён в фигуру. При ходьбе W/E/SW/SE выбираются *_generated: 4 кадра, 8 кадров/с. E зеркалит W, SE зеркалит SW, NE зеркалит NW через отрицательную width в player.js; не рисовать зеркальную пару независимо. Для переноски вниз используется carry_walk_S_generated: 4 новых цельных кадра, 8 кадров/с; обычный walk_S и carry_idle_S сохранены. Старый carry_walk_S (один кадр покоя) архивный. Остальные направления и idle сохраняют собственные исходные наборы. Старые walk/carry_walk W/E/SW/SE без generated архивные и при ходьбе не используются. Метка «исходный» ниже не означает неиспользуемый: N/S/NW и idle активны.

## Sprite и кадры

Невидимые маркеры CounterZone/CounterSurface/StoveSurface/ServingSurface используют PNG 1×1 при нативном frame metadata 100×100; это сохранено из исходника, геометрию задают размеры экземпляров. Остальные размеры ниже соответствуют PNG.

### KitchenMockup

Определение: `game/objectTypes/KitchenMockup.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/kitchenmockup-default-000.png | 1672×941 | 0, 0 | 0 / false | игровой |

### CollisionBlocker

Определение: `game/objectTypes/CollisionBlocker.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/collisionblocker-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### PlayerBody

Определение: `game/objectTypes/PlayerBody.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/playerbody-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### Grandma

Определение: `game/objectTypes/Grandma.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| idle_S | 0 | game/images/grandma-idle_s-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_SW | 0 | game/images/grandma-idle_sw-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_W | 0 | game/images/grandma-idle_w-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_NW | 0 | game/images/grandma-idle_nw-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_N | 0 | game/images/grandma-idle_n-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_NE | 0 | game/images/grandma-idle_ne-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_E | 0 | game/images/grandma-idle_e-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| idle_SE | 0 | game/images/grandma-idle_se-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| walk_S | 0 | game/images/grandma-walk_s-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_S | 1 | game/images/grandma-walk_s-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_SW | 0 | game/images/grandma-walk_sw-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_SW | 1 | game/images/grandma-walk_sw-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_W | 0 | game/images/grandma-walk_w-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_W | 1 | game/images/grandma-walk_w-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_W | 2 | game/images/grandma-walk_w-002.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_W | 3 | game/images/grandma-walk_w-003.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_NW | 0 | game/images/grandma-walk_nw-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_NW | 1 | game/images/grandma-walk_nw-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_N | 0 | game/images/grandma-walk_n-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_N | 1 | game/images/grandma-walk_n-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_NE | 0 | game/images/grandma-walk_ne-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_NE | 1 | game/images/grandma-walk_ne-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| walk_E | 0 | game/images/grandma-walk_e-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_E | 1 | game/images/grandma-walk_e-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_E | 2 | game/images/grandma-walk_e-002.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_E | 3 | game/images/grandma-walk_e-003.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_SE | 0 | game/images/grandma-walk_se-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| walk_SE | 1 | game/images/grandma-walk_se-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_idle_S | 0 | game/images/grandma-carry_idle_s-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_SW | 0 | game/images/grandma-carry_idle_sw-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_W | 0 | game/images/grandma-carry_idle_w-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_NW | 0 | game/images/grandma-carry_idle_nw-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_N | 0 | game/images/grandma-carry_idle_n-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_NE | 0 | game/images/grandma-carry_idle_ne-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_E | 0 | game/images/grandma-carry_idle_e-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_idle_SE | 0 | game/images/grandma-carry_idle_se-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| carry_walk_S | 0 | game/images/grandma-carry_walk_s-000.png | 256×320 | 0.5, 0.95 | 0 / false | архивный |
| carry_walk_SW | 0 | game/images/grandma-carry_walk_sw-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_SW | 1 | game/images/grandma-carry_walk_sw-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_W | 0 | game/images/grandma-carry_walk_w-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_W | 1 | game/images/grandma-carry_walk_w-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_NW | 0 | game/images/grandma-carry_walk_nw-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| carry_walk_NW | 1 | game/images/grandma-carry_walk_nw-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| carry_walk_N | 0 | game/images/grandma-carry_walk_n-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| carry_walk_N | 1 | game/images/grandma-carry_walk_n-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| carry_walk_NE | 0 | game/images/grandma-carry_walk_ne-000.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| carry_walk_NE | 1 | game/images/grandma-carry_walk_ne-001.png | 256×320 | 0.5, 0.95 | 6 / true | исходный |
| carry_walk_E | 0 | game/images/grandma-carry_walk_e-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_E | 1 | game/images/grandma-carry_walk_e-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_SE | 0 | game/images/grandma-carry_walk_se-000.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| carry_walk_SE | 1 | game/images/grandma-carry_walk_se-001.png | 256×320 | 0.5, 0.95 | 6 / true | архивный |
| source_variant_4 | 0 | game/images/grandma-source_variant_4-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| source_variant_5 | 0 | game/images/grandma-source_variant_5-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| source_variant_19 | 0 | game/images/grandma-source_variant_19-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| source_variant_22 | 0 | game/images/grandma-source_variant_22-000.png | 256×320 | 0.5, 0.95 | 0 / false | исходный |
| walk_W_generated | 0 | game/images/grandma-walk_w_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_W_generated | 1 | game/images/grandma-walk_w_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_W_generated | 2 | game/images/grandma-walk_w_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_W_generated | 3 | game/images/grandma-walk_w_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_E_generated | 0 | game/images/grandma-walk_e_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_E_generated | 1 | game/images/grandma-walk_e_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_E_generated | 2 | game/images/grandma-walk_e_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_E_generated | 3 | game/images/grandma-walk_e_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SW_generated | 0 | game/images/grandma-walk_sw_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SW_generated | 1 | game/images/grandma-walk_sw_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SW_generated | 2 | game/images/grandma-walk_sw_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SW_generated | 3 | game/images/grandma-walk_sw_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SE_generated | 0 | game/images/grandma-walk_se_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SE_generated | 1 | game/images/grandma-walk_se_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SE_generated | 2 | game/images/grandma-walk_se_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| walk_SE_generated | 3 | game/images/grandma-walk_se_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_W_generated | 0 | game/images/grandma-carry_walk_w_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_W_generated | 1 | game/images/grandma-carry_walk_w_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_W_generated | 2 | game/images/grandma-carry_walk_w_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_W_generated | 3 | game/images/grandma-carry_walk_w_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_E_generated | 0 | game/images/grandma-carry_walk_e_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_E_generated | 1 | game/images/grandma-carry_walk_e_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_E_generated | 2 | game/images/grandma-carry_walk_e_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_E_generated | 3 | game/images/grandma-carry_walk_e_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SW_generated | 0 | game/images/grandma-carry_walk_sw_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SW_generated | 1 | game/images/grandma-carry_walk_sw_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SW_generated | 2 | game/images/grandma-carry_walk_sw_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SW_generated | 3 | game/images/grandma-carry_walk_sw_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SE_generated | 0 | game/images/grandma-carry_walk_se_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SE_generated | 1 | game/images/grandma-carry_walk_se_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SE_generated | 2 | game/images/grandma-carry_walk_se_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_SE_generated | 3 | game/images/grandma-carry_walk_se_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_S_generated | 0 | game/images/grandma-carry_walk_s_generated-000.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_S_generated | 1 | game/images/grandma-carry_walk_s_generated-001.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_S_generated | 2 | game/images/grandma-carry_walk_s_generated-002.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |
| carry_walk_S_generated | 3 | game/images/grandma-carry_walk_s_generated-003.png | 256×320 | 0.5, 0.95 | 8 / true | активный новый |

### PantryZone

Определение: `game/objectTypes/PantryZone.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/pantryzone-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### SinkZone

Определение: `game/objectTypes/SinkZone.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/sinkzone-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### OutdoorZone

Определение: `game/objectTypes/OutdoorZone.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/outdoorzone-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### LivingRoomZone

Определение: `game/objectTypes/LivingRoomZone.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/livingroomzone-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### HudPanel

Определение: `game/objectTypes/HudPanel.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Default | 0 | game/images/hudpanel-default-000.png | 1×1 | 0.5, 0.5 | 0 / false | игровой |

### BuckwheatContainerVisual

Определение: `game/objectTypes/BuckwheatContainerVisual.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/buckwheatcontainervisual-animation 1-000.png | 585×939 | 0.5, 0.5 | 0 / false | игровой |

### PotVisual

Определение: `game/objectTypes/PotVisual.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| empty | 0 | game/images/potvisual-empty-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| raw_low | 0 | game/images/potvisual-raw_low-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| raw_medium | 0 | game/images/potvisual-raw_medium-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| raw_full | 0 | game/images/potvisual-raw_full-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| washed_low | 0 | game/images/potvisual-washed_low-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| washed_medium | 0 | game/images/potvisual-washed_medium-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| washed_full | 0 | game/images/potvisual-washed_full-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| ready_low | 0 | game/images/potvisual-ready_low-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| ready_medium | 0 | game/images/potvisual-ready_medium-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |
| ready_full | 0 | game/images/potvisual-ready_full-000.png | 64×48 | 0.5, 0.5 | 0 / false | временный игровой |

### BurnerSlot_1

Определение: `game/objectTypes/BurnerSlot_1.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/burnerslot_1-animation 1-000.png | 8×8 | 0.5, 0.5 | 0 / false | игровой |

### BurnerSlot_2

Определение: `game/objectTypes/BurnerSlot_2.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/burnerslot_2-animation 1-000.png | 8×8 | 0.5, 0.5 | 0 / false | игровой |

### ServingSlot_1

Определение: `game/objectTypes/ServingSlot_1.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/servingslot_1-animation 1-000.png | 8×8 | 0.5, 0.5 | 0 / false | игровой |

### CounterZone

Определение: `game/objectTypes/CounterZone.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/counterzone-animation 1-000.png | 100×100 | 0.5, 0.5 | 0 / false | игровой |

### ServingTableVisual

Определение: `game/objectTypes/ServingTableVisual.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/servingtablevisual-animation 1-000.png | 1380×879 | 0.5, 0.5 | 0 / false | игровой |

### CounterSurface

Определение: `game/objectTypes/CounterSurface.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/countersurface-animation 1-000.png | 100×100 | 0.5, 0.5 | 0 / false | игровой |

### StoveSurface

Определение: `game/objectTypes/StoveSurface.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/stovesurface-animation 1-000.png | 100×100 | 0.5, 0.5 | 0 / false | игровой |

### ServingSurface

Определение: `game/objectTypes/ServingSurface.json`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.

| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |
|---|---:|---|---|---|---|---|
| Animation 1 | 0 | game/images/servingsurface-animation 1-000.png | 100×100 | 0.5, 0.5 | 0 / false | игровой |
