const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const context = vm.createContext({Math});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/engine.js'),'utf8'), context);
test('hard pity and soft pity boundaries', () => {
 assert.equal(context.fiveRate(73), .006);
 assert.equal(context.fiveRate(74), .066);
 assert.equal(context.fiveRate(90), 1);
 assert.equal(context.fourRate(10), 1);
});
test('guarantee guarantees next five-star; radiance losses carry over', () => {
 const s = {fivePity:89,fourPity:9,guaranteed5:true,radianceLosses:2};
 assert.equal(context.predictionPull(s,()=>.99),5);
 assert.equal(s.fivePity,0); assert.equal(s.fourPity,10); assert.equal(s.guaranteed5,false); assert.equal(s.radianceLosses,2);
});
test('losing a small guarantee sets the next five-star to UP', () => {
 const s = {fivePity:0,fourPity:0,guaranteed5:false,radianceLosses:0};
 assert.equal(context.predictionFiveOutcome(s,()=>.99),-5);
 assert.equal(s.guaranteed5,true); assert.equal(s.radianceLosses,1);
 assert.equal(context.predictionFiveOutcome(s,()=>.99),5);
});
test('zero resources never produces a wish', () => {
 const r = context.simulatePredictionRun({fivePity:0,fourPity:0,guaranteed5:false,guaranteed4:false,radianceLosses:0,recycleProfile:'conservative'}, {total:0,starglitter:0,stardust:0,dustQuota:0},()=>0);
 assert.equal(r.success,false); assert.equal(r.pulls,0);
});
function planner(options) {
 const messages=[];
 const ctx = vm.createContext({Math,Uint16Array,self:{postMessage:m=>messages.push(m)},importScripts:()=>{}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/engine.js'),'utf8'),ctx);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/planner-worker.js'),'utf8'),ctx);
 ctx.self.onmessage({data:options}); return messages.at(-1);
}
test('multi-UP planning quantiles ordered and within hard guarantee', () => {
 const r=planner({copies:7,budget:1260,runs:20000,settings:{fivePity:0,guaranteed5:false,radianceLosses:0}});
 assert.equal(r.rate,1); assert(r.q50<=r.q90 && r.q90<=r.q95 && r.q95<=1260);
 assert(r.mean>0 && r.mean<1260);
});
test('89 pity with guarantee needs exactly one pull', () => {
 const r=planner({copies:1,budget:1,runs:20000,settings:{fivePity:89,guaranteed5:true,radianceLosses:0}});
 assert.equal(r.rate,1); assert.equal(r.q95,1); assert.equal(r.mean,1);
});
test('zero budget fails and invalid worker parameters are rejected', () => {
 assert.equal(planner({copies:1,budget:0,runs:20000,settings:{fivePity:0,guaranteed5:false,radianceLosses:0}}).rate,0);
 assert.equal(planner({copies:-1}).error,true);
});
