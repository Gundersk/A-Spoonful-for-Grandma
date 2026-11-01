import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const root=fileURLToPath(new URL('../../',import.meta.url));
export const game=path.join(root,'game');
export const json=p=>JSON.parse(readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
export function items(folder){return [...(folder?.items??[]),...(folder?.subfolders??[]).flatMap(items)];}
export function imageName(object,animation,index){return `${object.toLowerCase()}-${animation.toLowerCase()}-${String(index).padStart(3,'0')}.png`;}
export const objects=()=>items(json(path.join(game,'project.c3proj')).objectTypes).map(name=>json(path.join(game,'objectTypes',name+'.json')));
export function polygonValid(points){
 if(!Array.isArray(points)||points.length<6||points.length%2||points.some(x=>typeof x!=='number'||!Number.isFinite(x)))return false;
 const unique=[];
 for(let i=0;i<points.length;i+=2)if(!unique.some(p=>p[0]===points[i]&&p[1]===points[i+1]))unique.push([points[i],points[i+1]]);
 if(unique.length<3)return false;
 const [a,b]=unique;
 return unique.slice(2).some(c=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))>1e-12);
}
