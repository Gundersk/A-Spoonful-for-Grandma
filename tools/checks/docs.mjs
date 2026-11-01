import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
let base=process.argv[2];
if(!base&&process.env.GITHUB_EVENT_PATH){
 const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8'));
 base=event.pull_request?.base?.sha??event.before;
}
if(!base||/^0+$/.test(base)){console.log('No comparison base (initial import or manual run). Pass a commit: npm run docs:check -- <base>');process.exit(0);}
const changed=execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split('\n');
const required=new Set();
if(changed.some(x=>x.startsWith('game/'))){required.add('docs/STATUS.md');required.add('docs/CHANGELOG.md');}
if(changed.some(x=>/^game\/(objectTypes|layouts)\//.test(x)))required.add('docs/OBJECTS.md');
if(changed.some(x=>/^game\/(images|objectTypes)\//.test(x)))required.add('docs/ASSETS.md');
const added=execFileSync('git',['diff','--name-only','--diff-filter=A',base,'HEAD'],{encoding:'utf8'});
if(added.split('\n').some(x=>/^game\/scripts\/.+\.js$/.test(x)))required.add('docs/ARCHITECTURE.md');
const missing=[...required].filter(x=>!changed.includes(x));
if(missing.length){console.error('Update documentation with game changes:',missing.join(', '));process.exit(1);}
console.log('Documentation change gate passed. A reviewer must check its meaning.');
