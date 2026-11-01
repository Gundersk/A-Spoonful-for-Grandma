import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Player} from '../game/scripts/player.js';

function fixture(){
 const calls=[];
 const body={x:352,y:336,behaviors:{Move8:{vectorX:0,vectorY:100}}};
 const sprite={width:128,setAnimation(name){calls.push(['set',name]);},startAnimation(mode){calls.push(['start',mode]);},stopAnimation(){calls.push(['stop']);}};
 const runtime={objects:{PlayerBody:{getFirstInstance:()=>body},Grandma:{getFirstInstance:()=>sprite}}};
 return {player:new Player(runtime,{}),body,sprite,calls};
}

test('carry south uses a multi-frame loop and does not restart it each tick',()=>{
 const f=fixture();for(let i=0;i<30;i++)f.player.render(true);
 assert.equal(f.player.currentAnimation,'carry_walk_S_generated');
 assert.equal(f.sprite.animationSpeed,8);
 assert.deepEqual(f.calls,[['set','carry_walk_S_generated'],['start','beginning']]);
 const object=JSON.parse(readFileSync(new URL('../game/objectTypes/Grandma.json',import.meta.url),'utf8'));
 const animation=object.animations.items.find(a=>a.name===f.player.currentAnimation);
 assert.ok(animation);assert.equal(animation.isLooping,true);assert.equal(animation.frames.length,4);assert.equal(animation.speed,8);
 const frames=animation.frames.map((_,i)=>readFileSync(new URL(`../game/images/grandma-carry_walk_s_generated-${String(i).padStart(3,'0')}.png`,import.meta.url)));
 assert.equal(new Set(frames.map(b=>b.toString('base64'))).size,4,'All four full-body frames must differ');
});

test('stop, resume and release pot use the expected south animations',()=>{
 const f=fixture();f.player.render(true);f.body.behaviors.Move8.vectorY=0;f.player.render(true);
 assert.equal(f.player.currentAnimation,'carry_idle_S');assert.equal(f.sprite.animationFrame,0);assert.equal(f.sprite.animationSpeed,0);
 f.body.behaviors.Move8.vectorY=100;f.player.render(true);assert.equal(f.player.currentAnimation,'carry_walk_S_generated');
 f.player.render(false);assert.equal(f.player.currentAnimation,'walk_S');assert.equal(f.sprite.animationSpeed,6);
});

test('other carrying directions retain their existing animation routing',()=>{
 for(const [vx,vy,name] of [[100,0,'carry_walk_E_generated'],[-100,0,'carry_walk_W_generated'],[-100,-100,'carry_walk_NW'],[0,-100,'carry_walk_N']]){
  const f=fixture();Object.assign(f.body.behaviors.Move8,{vectorX:vx,vectorY:vy});f.player.render(true);assert.equal(f.player.currentAnimation,name);
 }
});
