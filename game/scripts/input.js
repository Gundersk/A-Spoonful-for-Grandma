export class Input {
  constructor(keyboard) { this.keyboard = keyboard; this.previous = new Set(); this.current = new Set(); }
  poll() {
    this.previous = this.current; this.current = new Set();
    for (const code of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','KeyE','KeyQ']) {
      if (this.keyboard.isKeyDown(code)) this.current.add(code);
    }
  }
  down(...codes) { return codes.some(c => this.current.has(c)); }
  pressed(code) { return this.current.has(code) && !this.previous.has(code); }
}
