import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {root} from '../tools/checks/lib.mjs';

test('documentation gate rejects undocumented game change and accepts documented change',()=>{
 const tempRoot=realpathSync(tmpdir());
 const dir=mkdtempSync(path.join(tempRoot,'spoon-doc-gate-'));
 const git=(...args)=>execFileSync('git',['-c','user.name=Test','-c','user.email=test@example.invalid',...args],{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 try{
  git('init');writeFileSync(path.join(dir,'README.md'),'fixture');git('add','.');git('commit','-m','base');const base=git('rev-parse','HEAD');
  mkdirSync(path.join(dir,'game/scripts'),{recursive:true});writeFileSync(path.join(dir,'game/scripts/new.js'),'export const test = 1;');git('add','.');git('commit','-m','undocumented');
  const check=()=>spawnSync(process.execPath,[path.join(root,'tools/checks/docs.mjs'),base],{cwd:dir,encoding:'utf8'});
  const bad=check();assert.equal(bad.status,1);assert.match(bad.stderr,/STATUS.md/);assert.match(bad.stderr,/ARCHITECTURE.md/);
  mkdirSync(path.join(dir,'docs'));for(const name of ['STATUS','CHANGELOG','ARCHITECTURE'])writeFileSync(path.join(dir,'docs',name+'.md'),'meaningful test fixture update');
  git('add','.');git('commit','-m','documented');const good=check();assert.equal(good.status,0,good.stderr);
 }finally{
  const resolved=realpathSync(dir);assert.ok(resolved.startsWith(tempRoot+path.sep)&&path.basename(resolved).startsWith('spoon-doc-gate-'));
  rmSync(resolved,{recursive:true,force:true});
 }
});
