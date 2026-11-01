import { RECIPE, ECONOMY, POT, SLOTS, COUNTER } from './data.js';
import { rewardForVkcal } from './economy.js';

// One pot, integer spoon count; no floating-point accumulation or water supply.
export class KitchenState {
  constructor() {
    this.coins = ECONOMY.startingCoins;
    this.vkcal = 0; this.benefit = 0; this.harm = 0; this.feedings = 0;
    this.bag = ECONOMY.bagCapacity; this.container = ECONOMY.containerCapacity;
    this.pot = { location: 'counter', spoons: 0, content: 'empty', remaining: 0, served: false, x: 388, y: 145 };
    this.message = 'E у столешницы — взять кастрюлю. У крупы каждое E добавляет 1 ложку (0.1).';
  }
  get carrying() { return this.pot.location === 'hands'; }
  get fill() { return this.pot.spoons / POT.maxSpoons; }
  get cooking() { return this.pot.remaining > 0 && SLOTS.some(s => s.id === this.pot.location && s.kind === 'burner'); }
  get itemLabel() { return ({ empty: 'пустая', raw: 'сырая гречка', washed: 'помытая гречка', ready: 'готовая гречка' })[this.pot.content]; }
  get visualState() {
    const p = this.pot;
    return !p.spoons ? 'empty' : `${p.content}_${p.spoons <= 3 ? 'low' : p.spoons <= 6 ? 'medium' : 'full'}`;
  }
  say(text) { this.message = text; return text; }
  tick(dt) {
    if (!this.cooking || !Number.isFinite(dt) || dt <= 0) return;
    this.pot.remaining = Math.max(0, this.pot.remaining - dt);
    if (!this.pot.remaining) { this.pot.content = 'ready'; this.say('Гречка готова! E у занятой конфорки — забрать.'); }
  }
  drop(x, y) {
    if (!this.carrying) return this.say('В руках ничего нет.');
    Object.assign(this.pot, { location: 'floor', x, y });
    return this.say('Кастрюля на полу. E рядом — поднять. На станции используйте E или Q.');
  }
  pickUp() {
    const p = this.pot;
    if (this.carrying || p.location === 'flight') return false;
    if (this.cooking) { this.say(`Готовится: ещё ${Math.ceil(p.remaining)} с.`); return false; }
    if (p.served) Object.assign(p, { spoons: 0, content: 'empty', served: false });
    p.location = 'hands'; this.say('Кастрюля в руках.'); return true;
  }
  placeOnCounter(x, width = 64, obstacles = [{ x: 320, width: 40 }]) {
    const p = this.pot;
    if (!this.carrying) {
      if (p.location === 'counter' && Math.abs(x-p.x) <= COUNTER.pickupDistance) return this.pickUp();
      return this.say('Подойдите ближе к стоящей кастрюле.');
    }
    const half = Math.abs(width)/2;
    if (!Number.isFinite(x) || !Number.isFinite(half) || half <= 0 || x-half < COUNTER.left || x+half > COUNTER.right)
      return this.say('У края недостаточно места. Встаньте чуть ближе к середине столешницы.');
    if (obstacles.some(o => Math.abs(x-o.x) < half + Math.abs(o.width)/2 + 4))
      return this.say('Это место занято контейнером. Сместитесь вдоль столешницы.');
    Object.assign(p, { location: 'counter', x, y: COUNTER.y });
    return this.say('Кастрюля на столешнице над вами. E рядом — забрать.');
  }
  act(id, x, width, obstacles) {
    if (id === 'counter') return this.placeOnCounter(x, width, obstacles);
    const p = this.pot;
    if (id === 'outdoor' || id === 'living') return this.say('Проход обозначен. Другая локация пока не создана.');
    if (id === 'pantry') {
      if (!this.carrying) return this.say('Поднесите кастрюлю к контейнеру.');
      if (p.spoons >= POT.maxSpoons) return this.say('Кастрюля полная: 10 / 10 ложек, 1.0 / 1.0.');
      if (p.content === 'ready') return this.say('В готовую гречку сырую крупу не добавляем.');
      if (!this.container && this.bag) { this.container = Math.min(ECONOMY.containerCapacity, this.bag); this.bag -= this.container; }
      if (!this.container) return this.say('Запас крупы исчерпан.');
      const wasWashed = p.content === 'washed';
      --this.container; ++p.spoons; p.content = 'raw';
      if (wasWashed) return this.say(`Добавлена ложка: ${p.spoons} / 10. Новая крупа сырая — промойте содержимое ещё раз.`);
      return this.say(`Добавлена ложка: ${p.spoons} / 10 (${this.fill.toFixed(1)} / 1.0). Затем помойте гречку у раковины.`);
    }
    if (id === 'sink') {
      if (!this.carrying) return this.say('Поднесите кастрюлю к раковине.');
      if (!p.spoons) return this.say('Сначала положите гречку в кастрюлю.');
      if (p.content !== 'raw') return this.say(p.content === 'washed' ? 'Гречка уже помыта. Можно ставить на плиту.' : 'Готовую гречку нужно подать.');
      p.content = 'washed'; return this.say('Гречка помыта. Поставьте кастрюлю на одну из конфорок.');
    }
    const slot = SLOTS.find(s => s.id === id);
    if (!slot) return;
    if (p.location === slot.id) return this.pickUp();
    if (!this.carrying) return this.say('Эта зона свободна. Поднесите кастрюлю.');
    Object.assign(p, { location: slot.id, x: slot.x, y: slot.y });
    if (slot.kind === 'burner') {
      if (p.content === 'washed' && p.spoons > 0) { p.remaining = RECIPE.seconds; return this.say('Варка началась: 5 секунд. Кастрюля стоит на конфорке.'); }
      return this.say(p.content === 'raw' ? 'Кастрюля на плите, но варка не начнётся: сначала помойте гречку.' : 'Кастрюля на конфорке. E — забрать.');
    }
    if (slot.kind === 'serving' && p.content === 'ready' && !p.served) {
      const fraction = p.spoons / POT.maxSpoons;
      const vkcal = RECIPE.vkcal * fraction;
      const reward = rewardForVkcal(vkcal);
      this.vkcal += vkcal;
      this.benefit = Math.round((this.benefit + RECIPE.benefit * fraction) * 100) / 100;
      this.harm = Math.round((this.harm + RECIPE.harm * fraction) * 100) / 100;
      this.coins += reward; ++this.feedings;
      p.served = true;
      return this.say(`Подано ${p.spoons} ложек! +${vkcal} вккал, +${reward} монет. E — забрать опустевшую кастрюлю.`);
    }
    return this.say(slot.kind === 'serving' ? 'Кастрюля на столе. Для кормления нужна готовая гречка.' : 'Кастрюля стоит на столешнице. E — забрать.');
  }
}
