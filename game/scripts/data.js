export const RECIPE = Object.freeze({ id: 'buckwheat', seconds: 5, vkcal: 100, benefit: 5, harm: 1 });
export const POT = Object.freeze({ capacity: 1, spoonSize: 0.1, maxSpoons: 10 });
export const ECONOMY = Object.freeze({ startingCoins: 20, coinsPerVkcal: 0.1, bagCapacity: 120, containerCapacity: 30, bagCost: 8 });
// Surface position is distinct from the reachable interaction point on the floor.
export const COUNTER = Object.freeze({ left: 300, right: 508, y: 145, pickupDistance: 58 });
export const PLACEMENT_SURFACES = Object.freeze([
  { id:'counter', object:'CounterSurface', left:COUNTER.left, right:COUNTER.right, top:132, bottom:184, fixedY:COUNTER.y, elevation:72, pickupOffsetY:72 },
  { id:'stove', object:'StoveSurface', left:506, right:611, top:129, bottom:188, elevation:72, pickupOffsetY:72 },
  { id:'ServingSlot_1', object:'ServingSurface', left:231, right:393, top:378, bottom:442, elevation:32, pickupOffsetY:32 }
]);
export const SLOTS = Object.freeze([
  { id: 'BurnerSlot_1', kind: 'burner', x: 538, y: 155, approachX: 538, approachY: 270, name: 'Левая конфорка' },
  { id: 'BurnerSlot_2', kind: 'burner', x: 579, y: 155, approachX: 594, approachY: 270, name: 'Правая конфорка' },
  { id: 'ServingSlot_1', kind: 'serving', x: 320, y: 392, approachX: 320, approachY: 350, name: 'Поставить / забрать на столе подачи' }
]);
export const STATIONS = Object.freeze([
  { object: 'PantryZone', id: 'pantry', name: 'Добавить 1 чайную ложку гречки' },
  { object: 'CounterZone', id: 'counter', name: 'Взять / поставить на столешницу' },
  { object: 'SinkZone', id: 'sink', name: 'Помыть гречку' },
  ...SLOTS.filter(s => s.kind !== 'counter').map(s => ({ object: s.id, id: s.id, name: s.name })),
  { object: 'OutdoorZone', id: 'outdoor', name: 'Выход на улицу' },
  { object: 'LivingRoomZone', id: 'living', name: 'Проход в гостиную' }
]);
