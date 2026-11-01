export class Player {
  constructor(runtime, input) {
    this.body = runtime.objects.PlayerBody.getFirstInstance();
    this.sprite = runtime.objects.Grandma.getFirstInstance();
    this.motion = this.body.behaviors.Move8; this.input = input; this.facing = 'S';
    this.currentAnimation = null;
  }
  beforeTick() {
    const controls = [['left','ArrowLeft','KeyA'],['right','ArrowRight','KeyD'],['up','ArrowUp','KeyW'],['down','ArrowDown','KeyS']];
    for (const [control,...keys] of controls) if (this.input.down(...keys)) this.motion.simulateControl(control);
  }
  render(carrying) {
    this.sprite.x = this.body.x; this.sprite.y = this.body.y;
    const vx = this.motion.vectorX, vy = this.motion.vectorY;
    const moving = Math.hypot(vx,vy) > 1;
    if (moving) {
      const directions = ['E','SE','S','SW','W','NW','N','NE'];
      this.facing = directions[(Math.round(Math.atan2(vy,vx) / (Math.PI/4)) + 8) % 8];
    }
    let name = `${carrying ? 'carry_' : ''}${moving ? 'walk' : 'idle'}_${this.facing}`;
    const generated = moving && ['W','E','SW','SE'].includes(this.facing);
    if (generated) name += '_generated';
    // E mirrors the new W, NE mirrors NW, SE mirrors the new SW.
    // scripting property: mirror its native world-instance width instead.
    this.sprite.width = Math.abs(this.sprite.width) * (['E', 'NE', 'SE'].includes(this.facing) && moving ? -1 : 1);
    // Playback is a state transition, not a per-tick command. Let Construct's
    // animation clock advance uninterrupted while the same walk continues.
    if (name !== this.currentAnimation) {
      this.sprite.setAnimation(name);
      this.sprite.animationSpeed = moving ? (generated ? 8 : 6) : 0;
      if (moving) this.sprite.startAnimation('beginning');
      else {
        this.sprite.stopAnimation();
        this.sprite.animationFrame = 0;
      }
      this.currentAnimation = name;
    }
  }
}
