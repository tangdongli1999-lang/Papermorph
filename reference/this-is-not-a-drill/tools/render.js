// node tools/render.js film/ch1.json outdir [mode]   (needs `python3 -m http.server 8766` running in web/, and playwright)
//  mode: 'mid' (one frame per shot) | 'w<k>of<n>' (worker k of n, by shot) | 'f<a>-<b>'
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [film,out,mode='mid']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('E:',e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))console.log('C:',m.text())});
await p.route('**/three.min.js',r=>r.fulfill({path:require('path').join(__dirname,'../web/vendor/three.min.js')}));   // three.js r128, bundled, so no network is needed
await p.goto('http://localhost:8766/film.html');await p.waitForFunction(()=>window.filmLoad);
const info=await p.evaluate(u=>filmLoad(u),film);const F=JSON.parse(fs.readFileSync('/home/claude/lockdown/web/'+film));
let frames=[];
if(mode==='mid') frames=F.shots.map(s=>Math.round(((s.t0+s.t1)/2-F.t0)*30));
else if(mode[0]==='w'){const [k,n]=mode.slice(1).split('of').map(Number);for(let f=0;f<info.frames;f++){const si=await p.evaluate(f=>filmShotOf(f),f);if(si%n===k)frames.push(f);}}
else {for(const part of mode.slice(1).split(',')){const [a,c]=part.split('-').map(Number);for(let f=a;f<=c;f++)frames.push(f);}}
const t0=Date.now();let last=-1;
for(const f of frames){const si=await p.evaluate(f=>filmFrame(f),f);if(si!==last){await p.waitForTimeout(250);await p.evaluate(f=>filmFrame(f),f);last=si;}
 await p.screenshot({path:`${out}/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
console.log('done',frames.length,'frames',((Date.now()-t0)/1000).toFixed(0)+'s');await b.close();})();
