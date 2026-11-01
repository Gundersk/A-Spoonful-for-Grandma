import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {root,game,json,walk,items,objects,imageName,polygonValid} from './lib.mjs';
import {assetDocument} from './assets.mjs';
const manifest=json(path.join(game,'project.c3proj'));
const all=objects(),names=new Set(all.map(o=>o.name));
for(const file of walk(game).filter(p=>p.endsWith('.json')||p.endsWith('.c3proj')))json(file);
let frameCount=0,instanceCount=0;const usedUIDs=new Set();
const registry=readFileSync(path.join(root,'docs/OBJECTS.md'),'utf8');
for(const name of items(manifest.layouts)){
 const layout=json(path.join(game,'layouts',name+'.json'));
 const layers=l=>l.flatMap(x=>[x,...layers(x.subLayers??[])]);
 assert.ok(layers(layout.layers).length<=2,'Free prototype: at most two layers');
 for(const l of layers(layout.layers))for(const inst of l.instances??[]){
  assert.ok(names.has(inst.type),`Unknown object ${inst.type}`);
  assert.ok(!usedUIDs.has(inst.uid),`Duplicate UID ${inst.uid}`);usedUIDs.add(inst.uid);instanceCount++;
  assert.ok(registry.includes(`| ${inst.type} | ${inst.uid} |`),`Registry missing ${inst.type} UID ${inst.uid}`);
 }
 assert.ok(existsSync(path.join(game,'eventSheets',layout.eventSheet+'.json')),'Missing event sheet');
}
for(const object of all){
 const frames=object['plugin-id']==='Sprite'?items(object.animations).flatMap(a=>a.frames.map((f,i)=>({f,a,i}))):[];
 for(const {f,a,i} of frames){
  const id=`${object.name}/${a.name}/${i}`;frameCount++;
  if(f.collisionPoly!==undefined)assert.ok(polygonValid(f.collisionPoly.points),`Invalid collisionPoly ${id}`);
  const file=path.join(game,'images',imageName(object.name,a.name,i));
  const png=readFileSync(file);assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`PNG ${id}`);
  // Existing invisible geometry markers intentionally have a 1px texture;
  // their native frame metadata is 100x100 and their instance size is geometry.
  const marker=['CounterZone','CounterSurface','StoveSurface','ServingSurface'].includes(object.name)
    &&png.readUInt32BE(16)===1&&png.readUInt32BE(20)===1;
  if(!marker){assert.equal(png.readUInt32BE(16),f.width,`PNG width ${id}`);assert.equal(png.readUInt32BE(20),f.height,`PNG height ${id}`);}
 }
}
const registered=items(manifest.rootFileFolders.script).map(x=>x.name);
for(const name of registered){
 const file=path.join(game,'scripts',name);assert.ok(existsSync(file),`Missing script ${name}`);
 const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 const source=readFileSync(file,'utf8');
 for(const m of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g))assert.ok(existsSync(path.resolve(path.dirname(file),m[1])),`Missing import ${m[1]}`);
}
for(const file of walk(path.join(game,'scripts')).filter(x=>x.endsWith('.js')))assert.ok(registered.includes(path.basename(file)),`Unregistered script ${file}`);
assert.equal(readFileSync(path.join(root,'docs/ASSETS.md'),'utf8').trim(),assetDocument().trim(),'ASSETS stale: npm run assets');
console.log(`Project check passed: ${all.length} object types, ${instanceCount} instances, ${frameCount} frames, ${registered.length} scripts. Not a Preview.`);
