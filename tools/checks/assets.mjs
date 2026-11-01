import {writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,objects,items,imageName} from './lib.mjs';
export function assetDocument(){
 const lines=['# Каталог игровых кадров','','Техническая таблица строится `npm run assets` из game/objectTypes. При изменении кадров обновлять вместе с игрой. Происхождение и статус источников — [ASSET_SOURCES](ASSET_SOURCES.md), инструкции дизайнеру — [DESIGNER](DESIGNER.md). Все пути ниже от корня репозитория.','','## Как читать бабушкины анимации','','Руки вверх (`carry_`) означают перенос предмета над головой. Отдельный PotVisual рисуется кодом, не должен быть впечён в фигуру. При ходьбе W/E/SW/SE выбираются *_generated: 4 кадра, 8 кадров/с. E зеркалит W, SE зеркалит SW, NE зеркалит NW через отрицательную width в player.js; не рисовать зеркальную пару независимо. Для переноски вниз используется carry_walk_S_generated: 4 новых цельных кадра, 8 кадров/с; обычный walk_S и carry_idle_S сохранены. Старый carry_walk_S (один кадр покоя) архивный. Переноска NW и NE использует один carry_walk_NW_generated (4 кадра, 8fps); NE зеркалится в движке, отдельной NE_generated нет. Старые carry_walk_NW/NE архивные. Обычная ходьба по верхним диагоналям и idle сохранены. Остальные направления и idle сохраняют собственные исходные наборы. Старые walk/carry_walk W/E/SW/SE без generated архивные и при ходьбе не используются. Метка «исходный» ниже не означает неиспользуемый: N/S/NW и idle активны.','','## Sprite и кадры',''];
 lines.push('Невидимые маркеры CounterZone/CounterSurface/StoveSurface/ServingSurface используют PNG 1×1 при нативном frame metadata 100×100; это сохранено из исходника, геометрию задают размеры экземпляров. Остальные размеры ниже соответствуют PNG.','');
 for(const object of objects().filter(o=>o['plugin-id']==='Sprite')){
  lines.push(`### ${object.name}`,'',`Определение: \`game/objectTypes/${object.name}.json\`. Изменять размеры/Origin согласованно с OBJECTS и геометрией.`, '', '| Анимация | Кадр | PNG | Размер | Origin | fps / loop | Статус |','|---|---:|---|---|---|---|---|');
  for(const a of items(object.animations))for(const [i,f] of a.frames.entries()){
   const status=object.name==='Grandma'?(a.name.endsWith('_generated')?'активный новый':/^(carry_)?walk_(W|E|SW|SE)$/.test(a.name)||['carry_walk_S','carry_walk_NW','carry_walk_NE'].includes(a.name)?'архивный':'исходный'):object.name==='PotVisual'?'временный игровой':'игровой';
   lines.push(`| ${a.name} | ${i} | game/images/${imageName(object.name,a.name,i)} | ${f.width}×${f.height} | ${f.originX}, ${f.originY} | ${a.speed} / ${a.isLooping} | ${status} |`);
  }
  lines.push('');
 }
 return lines.join('\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 writeFileSync(path.join(root,'docs/ASSETS.md'),assetDocument());console.log('Updated docs/ASSETS.md');
}
