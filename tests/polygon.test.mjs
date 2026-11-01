import {test} from 'node:test';import assert from 'node:assert/strict';import {polygonValid} from '../tools/checks/lib.mjs';
test('polygon regression: valid rectangle and omitted-default handled by caller',()=>{assert.equal(polygonValid([0,0,1,0,1,1,0,1]),true);});
test('reject explicit empty, short, odd, nonfinite, repeated and collinear points',()=>{for(const p of [[],[0,0,1,1],[0,0,1,0,1,1,0],[0,0,NaN,0,1,1],[0,0,'1',0,1,1],[0,0,0,0,0,0],[0,0,.5,.5,1,1]])assert.equal(polygonValid(p),false);});
