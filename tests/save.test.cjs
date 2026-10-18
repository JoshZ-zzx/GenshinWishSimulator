const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function harness() {
 const elements = new Map(); const storage = new Map(); const downloads = [];
 function id(key) { if (!elements.has(key)) elements.set(key,{value:'',addEventListener(type,fn){this[type]=fn;}}); return elements.get(key); }
 const c=vm.createContext({id, localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}, confirm:()=>true, location:{reload(){c.reloaded=true;}}, downloadSave:value=>downloads.push(value), Date, JSON, Number, Error, STORAGE_KEY:'test-save'});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../data/catalog.js'),'utf8'),c);
 c.config=c.DEFAULT_CONFIG;c.wishState=c.DEFAULT_STATE;c.catalogs=c.DEFAULT_CATALOGS;c.elementMap=c.DEFAULT_ELEMENTS;
 const app=fs.readFileSync(path.join(__dirname,'../js/app.js'),'utf8');
 vm.runInContext(app.slice(app.indexOf('      function setupExtensions()'),app.indexOf('      function downloadSave('))+'\nsetupExtensions();',c);
 return {c,id,storage,downloads};
}
test('export includes all persisted settings and state in versioned envelope',()=>{
 const h=harness();h.id('backup-export').click();
 const save=h.downloads[0];assert.equal(save.format,'teyvat-wish-save');assert.equal(save.version,1);
 for(const k of ['state','config','catalogs','elements'])assert(save.data[k]);
});
test('import accepts legacy raw and new wrapped saves and protects previous save',async()=>{
 for(const wrapped of [false,true]){
 const h=harness(); const data={state:{fivePity:89,guaranteed5:true},config:h.c.DEFAULT_CONFIG,catalogs:h.c.DEFAULT_CATALOGS,elements:h.c.DEFAULT_ELEMENTS};
 const value=wrapped?{format:'teyvat-wish-save',version:1,data}:data;
 h.storage.set('test-save','previous');
 await h.id('backup-import').change({target:{files:[{size:100,text:async()=>JSON.stringify(value)}],value:'file'}});
 assert.equal(h.c.reloaded,true); assert.equal(JSON.parse(h.storage.get('test-save')).state.fivePity,89);
 assert.equal(h.storage.get('test-save-before-import'),'previous');
 }
});
test('invalid or oversized saves do not overwrite current data',async()=>{
 for(const value of [{format:'other',version:1},{state:{fivePity:-1},config:{},catalogs:{}},{}]){
 const h=harness();h.storage.set('test-save','previous');
 await h.id('backup-import').change({target:{files:[{size:100,text:async()=>JSON.stringify(value)}],value:'file'}});
 assert.equal(h.storage.get('test-save'),'previous');assert.match(h.id('backup-status').textContent,/未导入/);
 }
});
