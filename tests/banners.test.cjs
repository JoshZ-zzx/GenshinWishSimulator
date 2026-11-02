const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
function harness(saved) {
  const storage = new Map(saved ? [['test', JSON.stringify(saved)]] : []);
  const c = vm.createContext({JSON, Number, STORAGE_KEY:'test', localStorage:{getItem:k=>storage.get(k)||null, setItem:(k,v)=>storage.set(k,v)}, pulling:false, predictionRunning:false});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../data/catalog.js'), 'utf8'), c);
  vm.runInContext(app.slice(app.indexOf('      function clone('), app.indexOf('      function randomUnit(')), c);
  vm.runInContext(app.slice(app.indexOf('      function selectCurrentBanner('), app.indexOf('      function renderState(')), c);
  vm.runInContext('config = clone(DEFAULT_CONFIG); catalogs = clone(DEFAULT_CATALOGS); elementMap = clone(DEFAULT_ELEMENTS); wishState = clone(DEFAULT_STATE);',c);
  for (const key of ['renderState','syncPredictionState','populateSettings','showToast']) c[key]=()=>{};
  c.loadData();
  return {c,storage};
}
const plain = value => JSON.parse(JSON.stringify(value));
test('new saves default to Mitya with the shared featured four-stars',()=>{
  const {c}=harness(); assert.equal(c.config.up5,'米提亚');
  assert.deepEqual(plain(c.config.up4), ['瓦列里','夏洛蒂','罗莎莉亚']);
  assert(c.catalogs.limitedFive.includes('米提亚')); assert(c.catalogs.fourCharacters.includes('瓦列里'));
});
test('both switches preserve every pity and statistic, persist and reload',()=>{
  const {c,storage}=harness();
  Object.keys(c.wishState).forEach((key,i)=>{c.wishState[key]=typeof c.wishState[key]==='boolean'?true:i+1;});
  const before=plain(c.wishState);
  for(const name of ['芙宁娜','米提亚']) {
    c.selectCurrentBanner(name);
    assert.equal(c.config.up5,name); assert.deepEqual(plain(c.wishState),before);
    assert.deepEqual(plain(c.config.up4),['瓦列里','夏洛蒂','罗莎莉亚']);
    assert.deepEqual(JSON.parse(storage.get('test')).state,before);
    assert.equal(harness(JSON.parse(storage.get('test'))).c.config.up5,name);
  }
});
test('legacy custom saves retain their banner and pools; preset restores removed characters',()=>{
  const base=harness().c;
  const saved={config:plain(base.config),catalogs:plain(base.catalogs),state:plain(base.wishState),elements:{}};
  saved.config.up5='丝柯克';saved.config.up4=['塔利雅','坎蒂丝','米卡'];
  saved.catalogs.limitedFive=saved.catalogs.limitedFive.filter(n=>!['米提亚','芙宁娜'].includes(n));
  saved.catalogs.fourCharacters=saved.catalogs.fourCharacters.filter(n=>!['瓦列里','夏洛蒂','罗莎莉亚'].includes(n));
  saved.config.fourPool=['塔利雅'];
  const {c}=harness(saved);
  assert.equal(c.config.up5,'丝柯克'); assert.deepEqual(plain(c.config.up4),saved.config.up4);
  assert.deepEqual(plain(c.config.fourPool),['塔利雅']);
  c.selectCurrentBanner('芙宁娜');
  for(const name of ['瓦列里','夏洛蒂','罗莎莉亚']) {assert(c.catalogs.fourCharacters.includes(name));assert(c.config.fourPool.includes(name));}
  assert(c.catalogs.limitedFive.includes('芙宁娜'));
});
test('switching refuses changes while pulling or predicting, and rejects unknown banners',()=>{
  const {c}=harness(); const before=plain(c.config);
  c.pulling=true;c.selectCurrentBanner('芙宁娜');assert.deepEqual(plain(c.config),before);
  c.pulling=false;c.predictionRunning=true;c.selectCurrentBanner('芙宁娜');assert.deepEqual(plain(c.config),before);
  c.predictionRunning=false;c.selectCurrentBanner('unknown');assert.deepEqual(plain(c.config),before);
});
