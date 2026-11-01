import assert from 'node:assert/strict';
import {CameraController} from '../game/scripts/camera.js';
const target={x:700,y:500};
const ui={scrollTo(x,y){this.position=[x,y];}};
const viewport={width:960,height:540};
const layout={name:'Kitchen',width:960,height:540,scrollX:480,scrollY:270,
 getLayer(name){return name==='World'?{getViewport:()=>viewport}:ui;},
 scrollTo(x,y){this.scrollX=x;this.scrollY=y;}};
const runtime={layout};let count=0;
function check(name,fn){fn();console.log('PASS',name);count++;}
const camera=new CameraController(runtime,()=>target);
check('Kitchen remains fixed while target moves',()=>{camera.update();target.x=200;camera.update();assert.deepEqual([layout.scrollX,layout.scrollY],[480,270]);});
const configs={Garden:{mode:'follow'}};
layout.name='Garden';layout.width=2000;layout.height=1400;
const follow=new CameraController(runtime,()=>target,configs);
check('Follow tracks target in a large layout',()=>{target.x=900;target.y=700;follow.update();assert.deepEqual([layout.scrollX,layout.scrollY],[900,700]);});
check('Both lower boundaries clamp',()=>{target.x=-100;target.y=-100;follow.update();assert.deepEqual([layout.scrollX,layout.scrollY],[480,270]);});
check('Both upper boundaries clamp',()=>{target.x=3000;target.y=3000;follow.update();assert.deepEqual([layout.scrollX,layout.scrollY],[1520,1130]);});
check('UI remains fixed independently of World',()=>{assert.deepEqual(ui.position,[480,270]);});
check('Actual viewport dimensions affect clamp',()=>{viewport.width=1200;viewport.height=800;follow.update();assert.deepEqual([layout.scrollX,layout.scrollY],[1400,1000]);});
check('Small layout centres on both axes',()=>{layout.width=400;layout.height=300;follow.update();assert.deepEqual([layout.scrollX,layout.scrollY],[200,150]);});
check('Unknown layout defaults to static centre',()=>{layout.name='Other';layout.width=2000;layout.height=1400;camera.update();assert.deepEqual([layout.scrollX,layout.scrollY],[1000,700]);});
check('Missing target keeps current scroll',()=>{layout.name='Garden';new CameraController(runtime,()=>null,configs).update();assert.deepEqual([layout.scrollX,layout.scrollY],[1000,700]);});
check('Invalid mode is rejected',()=>{assert.throws(()=>new CameraController(runtime,()=>target,{Garden:{mode:'bad'}}).update(),/Unknown camera/);});
