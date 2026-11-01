// Native Construct object rendering; this module only computes flight/placement.
import { PLACEMENT_SURFACES } from './data.js';
export const THROW = Object.freeze({ gravity: 900, maxRange: 220, maxStep: 1/240 });
export const SURFACES = PLACEMENT_SURFACES;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function bounds(instance){
 const w=Math.abs(instance.width),h=Math.abs(instance.height);
 const left=instance.x-w*(instance.originX??.5),top=instance.y-h*(instance.originY??.5);
 return {left,right:left+w,top,bottom:top+h};
}
export function readSurfaces(runtime){
 return SURFACES.map(s=>{const rect=bounds(runtime.objects[s.object].getFirstInstance());return {...s,...rect,...(s.fixedY===undefined?{}:{fixedY:rect.top+s.fixedY-s.top})};});
}
export function syncServingSurface(runtime){
 const t=runtime.objects.ServingTableVisual.getFirstInstance(),s=runtime.objects.ServingSurface.getFirstInstance();
 s.x=t.x;s.y=t.y-Math.abs(t.height)/2+2+Math.abs(t.height)*.30;s.width=Math.abs(t.width)-4;s.height=Math.abs(t.height)*.60;
}
// Segment vs expanded AABB: includes edge/corner grazing and prevents tunnelling.
export function contact(a,b,s,halfW,halfH){
 let lo=0,hi=1;
 for(const [p,d,min,max]of [[a.x,b.x-a.x,s.left-halfW,s.right+halfW],[a.y,b.y-a.y,s.top-halfH,s.bottom+halfH]]){
  if(Math.abs(d)<1e-10){if(p<min||p>max)return null;continue;}
  const t1=(min-p)/d,t2=(max-p)/d;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));if(lo>hi)return null;
 }
 return {t:lo,x:a.x+(b.x-a.x)*lo,y:a.y+(b.y-a.y)*lo};
}
export function placement(s,hit,width,height,obstacles=[]){
 const halfW=width/2,halfH=height/2,min=s.left+halfW,max=s.right-halfW;
 if(min>max||s.top+halfH>s.bottom-halfH)return null;
 let intervals=[[min,max]];
 for(const o of obstacles){
  const left=o.x-o.width/2-halfW-4,right=o.x+o.width/2+halfW+4;
  intervals=intervals.flatMap(([a,b])=>right<=a||left>=b?[[a,b]]:[[a,Math.min(b,left)],[Math.max(a,right),b]].filter(([l,r])=>l<=r));
 }
 if(!intervals.length)return null;
 const xs=intervals.map(([a,b])=>clamp(hit.x,a,b));const x=xs.reduce((a,b)=>Math.abs(a-hit.x)<=Math.abs(b-hit.x)?a:b);
 return {x,y:s.fixedY??clamp(hit.y,s.top+halfH,s.bottom-halfH)};
}
export class ThrowController {
 constructor(state,surfaces=()=>SURFACES){this.state=state;this.flight=null;this.surfaces=surfaces;}
 start(start,target,width=64,height=48,ground={x:start.x,y:start.y+132}){
  if(!this.state.carrying||this.flight)return false;
  if(![start.x,start.y,target.x,target.y,width,height,ground.x,ground.y].every(Number.isFinite)||width<=0||height<=0)return false;
  const aimed=this.surfaces().find(s=>target.x>=s.left&&target.x<=s.right&&target.y>=s.top&&target.y<=s.bottom);
  const targetZ=aimed?.elevation??aimed?.pickupOffsetY??0;
  let dx=target.x-ground.x,dy=target.y+targetZ-ground.y;const distance=Math.hypot(dx,dy);
  if(distance<4)return false;
  if(distance>THROW.maxRange){dx*=THROW.maxRange/distance;dy*=THROW.maxRange/distance;}
  const duration=clamp(.45+Math.hypot(dx,dy)/900,.45,.8),z0=Math.max(0,ground.y-start.y);
  this.flight={start:{...ground},target:{x:ground.x+dx,y:ground.y+dy},x:ground.x,y:ground.y,z:z0,z0,
   vx:dx/duration,vy:dy/duration,vz:(targetZ-z0+.5*THROW.gravity*duration**2)/duration,
   t:0,duration,width,height,depth:height*.5};
  Object.assign(this.state.pot,{location:'flight',x:start.x,y:start.y,flightAngle:0});this.state.say('Кастрюля летит…');return true;
 }
 tick(dt,obstacles=[]){
  if(!this.flight||!Number.isFinite(dt)||dt<=0)return;
  let rest=Math.min(dt,.25);
  while(rest>1e-8&&this.flight){
   const f=this.flight,previous=f.t,h=Math.min(rest,THROW.maxStep,f.duration-f.t);rest-=h;
   const a={x:f.x,y:f.y};f.t+=h;f.x=f.start.x+f.vx*f.t;f.y=f.start.y+f.vy*f.t;f.z=f.z0+f.vz*f.t-.5*THROW.gravity*f.t*f.t;
   const hits=[];
   for(const s of this.surfaces()){
    const z=s.elevation??s.pickupOffsetY??0,plane={...s,top:s.top+z,bottom:s.bottom+z};
    const disc=f.vz*f.vz+2*THROW.gravity*(f.z0-z);
    if(disc>=0){const t=(f.vz+Math.sqrt(disc))/THROW.gravity;
     if(t>=previous-1e-8&&t<=f.t+1e-8){const point={x:f.start.x+f.vx*t,y:f.start.y+f.vy*t};if(contact(point,point,plane,f.width/2,f.depth/2))hits.push({s,z,t,point});}}
    // A side contact is incoming only on entry, never an initial overlap/departure.
    const entry=contact(a,f,plane,f.width/2,f.depth/2);
    if(entry&&!contact(a,a,plane,f.width/2,f.depth/2)){
     const t=previous+entry.t*h,alt=f.z0+f.vz*t-.5*THROW.gravity*t*t;
     if(alt<=z&&f.vz-THROW.gravity*t<=0)hits.push({s,z,t,point:{x:entry.x,y:entry.y}});
    }
   }
   const candidates=hits.map(hit=>{
    const pos=placement(hit.s,{x:hit.point.x,y:hit.point.y-hit.z},f.width,f.depth,hit.s.id==='counter'?obstacles:[]);
    return {...hit,pos,distance:pos?Math.hypot(pos.x-hit.point.x,pos.y+hit.z-hit.point.y):Infinity};
   }).filter(hit=>hit.pos);
   candidates.sort((a,b)=>Math.abs(a.t-b.t)<1e-7?a.distance-b.distance:a.t-b.t);
   for(const {s,z,pos}of candidates){
    const dx=pos.x-f.start.x,dy=pos.y+z-f.start.y;
    if(Math.hypot(dx,dy)>THROW.maxRange+1e-6||dx*f.vx+dy*f.vy< -1e-6)continue;
    this.land(s,pos);break;
   }
   if(!this.flight)break;
   Object.assign(this.state.pot,{x:f.x,y:f.y-f.z,flightAngle:Math.sin(f.t/f.duration*Math.PI)*.35*Math.sign(f.vx)});
   if(f.t>=f.duration-1e-8){this.flight=null;Object.assign(this.state.pot,{location:'hands',flightAngle:0});this.state.say('Мимо поверхности — кастрюля вернулась в руки.');}
  }
 }
 land(surface,pos){
  const state=this.state,p=state.pot;this.flight=null;p.location='hands';p.flightAngle=0;
  if(surface.id==='counter'){Object.assign(p,{location:'counter',...pos});state.say('Кастрюля приземлилась на столешницу.');}
  else{const id=surface.id==='stove'?(pos.x<558.5?'BurnerSlot_1':'BurnerSlot_2'):surface.id;state.act(id);Object.assign(p,pos);}
 }
}
