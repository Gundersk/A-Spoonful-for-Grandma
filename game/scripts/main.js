import { CameraController } from './camera.js';
import { Input } from './input.js';
import { Player } from './player.js';
import { KitchenState } from './state.js';
import { Interactions } from './interactions.js';
import { HUD } from './hud.js';
import { ThrowController, readSurfaces, syncServingSurface } from './throw.js';

// Official Construct runtime entry point. No DOM, canvas replacement, or event-sheet workaround.
runOnStartup(runtime => {
  runtime.addEventListener('beforeprojectstart', () => {
    const input = new Input(runtime.keyboard);
    const state = new KitchenState();
    const player = new Player(runtime, input);
    const camera = new CameraController(runtime, () => player.body);
    camera.update();
    const interactions = new Interactions(runtime, player, state);
    const hud = new HUD(runtime);
    syncServingSurface(runtime);
    const throwing = new ThrowController(state,()=>readSurfaces(runtime));
    runtime.addEventListener('mousedown', event => {
      if (event.button !== 0 || !state.carrying) return;
      const [ux,uy] = runtime.mouse.getMousePosition('UI');
      if (ux<0 || ux>960 || uy<36 || uy>496) return;
      const [x,y] = runtime.mouse.getMousePosition('World');
      throwing.start({x:player.body.x,y:player.body.y-132},{x,y},Math.abs(hud.pot.width),Math.abs(hud.pot.height),{x:player.body.x,y:player.body.y});
    });
    runtime.addEventListener('pretick', () => { syncServingSurface(runtime); input.poll(); player.beforeTick(); });
    runtime.addEventListener('tick', () => {
      state.tick(Math.max(0, Math.min(runtime.dt, 0.1)));
      const jar = runtime.objects.BuckwheatContainerVisual.getFirstInstance();
      throwing.tick(runtime.dt,jar.isVisible?[{x:jar.x,width:Math.abs(jar.width)}]:[]);
      interactions.update(input);
      player.render(state.carrying);
      camera.update();
      hud.update(state, interactions, player);
    });
    console.info('OneMoreSpoon: prototype initialized; native 8Direction + Solid, 2 layers, 0 events.');
  });
});
