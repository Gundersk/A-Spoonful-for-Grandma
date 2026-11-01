export class HUD {
  constructor(runtime) {
    this.runtime = runtime;
    this.stats = runtime.objects.HudStats.getFirstInstance();
    this.hint = runtime.objects.HudHint.getFirstInstance();
    this.message = runtime.objects.HudMessage.getFirstInstance();
    this.timer = runtime.objects.PotLabel.getFirstInstance();
    this.pot = runtime.objects.PotVisual.getFirstInstance();
  }
  update(state, interactions, player) {
    const p = state.pot;
    this.stats.text = `вккал ${state.vkcal} | польза ${state.benefit} | вред ${state.harm} | монеты ${state.coins} | ложки ${p.spoons}/10 (${state.fill.toFixed(1)}/1.0) | ${state.itemLabel} | запас ${state.container}+${state.bag}`;
    this.hint.text = `${interactions.hint}    •    ЛКМ — бросить; E — действие; Q — поставить`;
    this.message.text = state.message;
    this.pot.setAnimation(state.visualState);
    this.pot.x = state.carrying ? player.body.x : p.x;
    this.pot.y = state.carrying ? player.body.y - 132 : p.y;
    this.pot.angle = p.location === 'flight' ? (p.flightAngle || 0) : 0;
    this.pot.isVisible = true;
    const table=this.runtime.objects.ServingTableVisual.getFirstInstance();
    table.moveAdjacentToInstance(this.runtime.objects.KitchenMockup.getFirstInstance(),true);
    player.sprite.moveToTop();
    if (state.carrying || p.location === 'floor' || p.location === 'flight') this.pot.moveToTop();
    else this.pot.moveAdjacentToInstance(table,true);
    this.timer.isVisible = state.cooking;
    this.timer.text = `ВАРКА ${Math.ceil(p.remaining)} с`;
    this.timer.x = this.pot.x - 48; this.timer.y = this.pot.y - 45;
    if (state.cooking) this.timer.moveToTop();
  }
}
