import {test} from 'node:test';
import assert from 'node:assert/strict';
import {KitchenState} from '../game/scripts/state.js';
function ready(n){const s=new KitchenState();s.pickUp();for(let i=0;i<n;i++)s.act('pantry');s.act('sink');s.act('BurnerSlot_1');s.tick(5);assert.equal(s.pot.content,'ready');s.pickUp();return s;}
test('1 and 10 spoons produce proportional rewards and only one feeding',()=>{
 for(const n of [1,10]){const s=ready(n),coins=s.coins;s.act('ServingSlot_1');assert.equal(s.vkcal,n*10);assert.equal(s.coins-coins,n);assert.equal(s.benefit,n*.5);assert.equal(s.harm,n*.1);assert.equal(s.feedings,1);s.act('ServingSlot_1');assert.equal(s.vkcal,n*10);assert.equal(s.feedings,1);assert.equal(s.pot.spoons,0);}
});
test('11th spoon consumes no grain; washed grain can receive more and needs washing',()=>{
 const s=new KitchenState();s.pickUp();s.act('pantry');s.act('sink');assert.equal(s.pot.content,'washed');s.act('pantry');assert.equal(s.pot.content,'raw');assert.equal(s.pot.spoons,2);for(let i=0;i<8;i++)s.act('pantry');const stock=s.container;s.act('pantry');assert.equal(s.pot.spoons,10);assert.equal(s.fill,1);assert.equal(s.container,stock);
});
test('raw grain does not cook; cooking blocks pickup, ends after five seconds',()=>{
 const s=new KitchenState();s.pickUp();s.act('pantry');s.act('BurnerSlot_1');assert.equal(s.cooking,false);s.pickUp();s.act('sink');s.act('BurnerSlot_2');assert.equal(s.pickUp(),false);s.tick(4);assert.equal(s.pot.content,'washed');s.tick(1);assert.equal(s.pot.content,'ready');assert.equal(s.pickUp(),true);
});
