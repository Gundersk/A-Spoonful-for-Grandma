import {test} from 'node:test';import assert from 'node:assert/strict';
import {KitchenState} from '../game/scripts/state.js';import {ThrowController,SURFACES,THROW} from '../game/scripts/throw.js';
const setup=()=>{const s=new KitchenState();s.pickUp();Object.assign(s.pot,{content:'ready',spoons:5});return s;};
function run(s,body,target,dt=1/120){const t=new ThrowController(s);t.start({x:body.x,y:body.y-132},target,64,48,body);for(let i=0;i<1000&&t.flight;i++)t.tick(dt,[{x:320,width:32}]);return t;}
test('regression: held pot visually touches table behind, short forward throw does not land/feed',()=>{
 for(const dt of [1/240,1/60,.1]){const s=setup();run(s,{x:312,y:490},{x:312,y:496},dt);assert.equal(s.carrying,true);assert.equal(s.feedings,0);assert.equal(s.pot.spoons,5);}
});
test('throwing toward that same table still lands and feeds exactly once',()=>{
 const s=setup();run(s,{x:312,y:490},{x:312,y:400});assert.equal(s.pot.location,'ServingSlot_1');assert.equal(s.feedings,1);assert.equal(s.vkcal,50);
});
test('away throws from all4sides never snap backward onto table',()=>{
 for(const [body,target]of [[{x:312,y:350},{x:312,y:250}],[{x:312,y:490},{x:312,y:540}],[{x:210,y:426},{x:110,y:426}],[{x:414,y:426},{x:514,y:426}]]){const s=setup();run(s,body,target);assert.notEqual(s.pot.location,'ServingSlot_1');assert.equal(s.feedings,0);}
});
test('moving away from counter does not catch initial visual overlap; toward counter works',()=>{
 const a=setup();run(a,{x:450,y:270},{x:450,y:400});assert.equal(a.carrying,true);
 const b=setup();run(b,{x:450,y:270},{x:450,y:145});assert.equal(b.pot.location,'counter');assert.equal(b.pot.x,450);
});
test('ground direction is straight even while visual arc rises',()=>{
 const s=setup(),t=new ThrowController(s,()=>[]);t.start({x:500,y:268},{x:650,y:400},64,48,{x:500,y:400});let oldX=500;
 for(let i=0;i<20;i++){t.tick(.02);if(t.flight){assert.ok(t.flight.x>=oldX);oldX=t.flight.x;assert.equal(t.flight.y,400);assert.ok(Number.isFinite(t.flight.z));}}
});
test('range remains220 from player ground origin; close target stays close',()=>{
 for(const target of [{x:510,y:400},{x:1500,y:900}]){const s=setup(),t=new ThrowController(s);t.start({x:500,y:268},target,64,48,{x:500,y:400});const d=Math.hypot(t.flight.target.x-500,t.flight.target.y-400);assert.ok(d<=THROW.maxRange+1e-6);if(target.x===510)assert.equal(d,10);else assert.ok(Math.abs(d-220)<1e-6);}
});
test('initial overlap with generic elevated surface is not a new incoming side contact',()=>{
 const s=setup(),t=new ThrowController(s,()=>[{id:'ServingSlot_1',left:200,right:300,top:200,bottom:260,elevation:40}]);
 t.start({x:312,y:168},{x:400,y:300},64,48,{x:312,y:300});for(let i=0;i<200&&t.flight;i++)t.tick(.01);assert.equal(s.carrying,true);assert.equal(s.feedings,0);
});
test('washed content lands on stove and begins original cooking rule',()=>{
 const s=setup();s.pot.content='washed';run(s,{x:538,y:270},{x:538,y:155});assert.equal(s.pot.location,'BurnerSlot_1');assert.equal(s.pot.remaining,5);assert.equal(s.pot.spoons,5);
});
