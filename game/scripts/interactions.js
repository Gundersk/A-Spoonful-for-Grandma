import { STATIONS } from './data.js';
import { readSurfaces, bounds } from './throw.js';
const distanceToRect=(p,r)=>Math.hypot(Math.max(0,r.left-p.x,p.x-r.right),Math.max(0,r.top-p.y,p.y-r.bottom));
export function canReachPot(pot,body,width,height,surfaces){
 if(['hands','flight'].includes(pot.location))return false;
 const id=pot.location.startsWith('BurnerSlot_')?'stove':pot.location;
 const offset=surfaces.find(s=>s.id===id)?.pickupOffsetY??0;
 return distanceToRect(body,{left:pot.x-width/2,right:pot.x+width/2,top:pot.y+offset-height/4,bottom:pot.y+offset+height/4})<=72;
}

export class Interactions {
  constructor(runtime, player, state) {
    this.runtime = runtime; this.player = player; this.state = state;
    this.stations = STATIONS.map(s => ({...s, instance: runtime.objects[s.object].getFirstInstance()}));
    this.target = null;
  }
  update(input) {
    const body = this.player.body, pot = this.state.pot;
    const sprite=this.runtime.objects.PotVisual.getFirstInstance();
    const nearbyPot = canReachPot(pot,body,Math.abs(sprite.width),Math.abs(sprite.height),readSurfaces(this.runtime));
    let best = 72; this.target = null;
    for (const station of this.stations) {
      const zone = station.instance;
      const dist = station.id === 'ServingSlot_1'
        ? distanceToRect(body,bounds(this.runtime.objects.ServingTableVisual.getFirstInstance()))
        : station.id === 'counter'
        ? Math.hypot(Math.max(0, Math.abs(body.x-zone.x)-Math.abs(zone.width)/2), body.y-zone.y)
        : Math.hypot(body.x-zone.x,body.y-zone.y);
      if (dist < best) { best = dist; this.target = station; }
    }
    this.hint = nearbyPot ? 'E — поднять кастрюлю' : this.target ? `E — ${this.target.name}` : 'Подойдите к станции';
    const act = () => {
      if (!this.target) return;
      if(!this.state.carrying&&(this.target.id==='counter'||/Slot_/.test(this.target.id))){this.state.say('Подойдите ближе к кастрюле.');return;}
      const sprite = this.runtime.objects.PotVisual.getFirstInstance();
      const jar = this.runtime.objects.BuckwheatContainerVisual.getFirstInstance();
      this.state.act(this.target.id, body.x, Math.abs(sprite.width), jar.isVisible ? [{x:jar.x,width:jar.width}] : []);
    };
    if (input.pressed('KeyQ')) {
      if (this.state.carrying && this.target && (this.target.id === 'counter' || /Slot_/.test(this.target.id))) act();
      else this.state.drop(body.x, body.y);
    }
    else if (input.pressed('KeyE')) {
      if (nearbyPot) this.state.pickUp(); else if (this.target) act();
    }
  }
}
