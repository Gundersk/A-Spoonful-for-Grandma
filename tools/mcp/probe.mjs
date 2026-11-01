import {mkdirSync,writeFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {root,game,json} from '../checks/lib.mjs';
const server=process.env.CONSTRUCT_MCP_DIR??path.join(root,'.local/tools/construct3-mcp');
if(!existsSync(path.join(server,'dist/index.js')))throw new Error('Install pinned/patched MCP first; see docs/MCP_SETUP.md');
const sdk=path.join(server,'node_modules/@modelcontextprotocol/sdk/dist/esm');
const {Client}=await import(pathToFileURL(path.join(sdk,'client/index.js')).href);
const {StdioClientTransport}=await import(pathToFileURL(path.join(sdk,'client/stdio.js')).href);
const c=new Client({name:'spoon-project-check',version:'0.1.0'});
try{
 await c.connect(new StdioClientTransport({command:process.execPath,args:[path.join(server,'dist/index.js'),game]}));
 const listed=await c.listTools();
 const summary=await c.callTool({name:'get_project_summary',arguments:{}});
 const layouts=await c.callTool({name:'list_layouts',arguments:{}});
 if(summary.isError||layouts.isError)throw new Error('MCP project read failed');
 const result=await c.callTool({name:'validate_project',arguments:{}});
 if(result.isError)throw new Error('MCP validate_project failed');
 const data=JSON.parse(result.content.find(x=>x.type==='text').text);
 if(data.success===false||!data.valid||!data.complete)throw new Error('Project invalid/incompletely scanned: '+JSON.stringify(data.summary));
 const report={project:'game/',projectRead:true,toolCount:listed.tools.length,tools:listed.tools.map(x=>x.name),valid:data.valid,complete:data.complete,summary:data.summary,info:data.info,nativeAgentConnection:'not established by SDK probe',preview:'not checked'};
 mkdirSync(path.join(root,'.local/reports'),{recursive:true});writeFileSync(path.join(root,'.local/reports/mcp-validation.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({toolCount:report.toolCount,summary:report.summary,valid:report.valid,preview:report.preview}));
}finally{await c.close();}
