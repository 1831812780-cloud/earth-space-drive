import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isOpen, readHands, type Point } from '../src/driving/gestures.ts';
function points(open:boolean,x=0.5,y=0.9): Point[]{
 const p=Array.from({length:21},()=>({x,y,z:0}));
 for(const b of [5,9,13,17]){p[b]={x,y:y-.2,z:0};p[b+1]={x,y:y-.35,z:0};p[b+2]={x,y:y-.45,z:0};p[b+3]={x,y:y-(open?.6:.1),z:0};}
 return p;
}
test('extended fingers open palm; folded fingers do not',()=>{assert.equal(isOpen(points(true)),true);assert.equal(isOpen(points(false)),false);});
test('right advances, left reverses, both and missing hands stop',()=>{
 const hand=(label:string)=>({label,score:.95,points:points(true)});
 assert.equal(readHands([hand('Right')],false,0).throttle,1);
 assert.equal(readHands([hand('Left')],false,0).throttle,-1);
 assert.equal(readHands([hand('Right'),hand('Left')],false,0).throttle,0);
 assert.equal(readHands([],false,0).throttle,0);
 assert.equal(readHands([hand('Right')],true,0).throttle,-1);
 assert.equal(readHands([{...hand('Right'),score:.4}],false,0).throttle,0);
});
test('two wrist tilt drives calibrated steering; one hand cannot steer',()=>{
 const a={label:'Left',score:.95,points:points(false,.25,.7)};
 const b={label:'Right',score:.95,points:points(false,.75,.45)};
 const r=readHands([a,b],false,0);assert.ok(r.steering>0);
 assert.equal(readHands([a,b],false,r.angle).steering,0);
 assert.equal(readHands([a],false,0).steering,0);
});
