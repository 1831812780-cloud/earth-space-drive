export type Point = { x: number; y: number; z: number };
export type Hand = { points: Point[]; label: string; score: number };
const distance = (a: Point, b: Point) => Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
export function isOpen(points: Point[]) {
 if(points.length!==21) return false;
 let straight = 0;
 for (const base of [5,9,13,17]) {
  const a=points[base], b=points[base+1], c=points[base+3];
  const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z;
  const vx=c.x-b.x,vy=c.y-b.y,vz=c.z-b.z;
  const cosine=(ux*vx+uy*vy+uz*vz)/(Math.hypot(ux,uy,uz)*Math.hypot(vx,vy,vz)+1e-8);
  if(cosine>0.72 && distance(c,points[0])>distance(b,points[0])*1.12) straight++;
 }
 return straight===4;
}
export function readHands(hands: Hand[], swap: boolean, neutral: number | null) {
 const valid=hands.filter(h=>h.score>0.65 && h.points.length===21);
 let left=false,right=false;
 for(const h of valid) {
  const label=swap ? (h.label==='Left'?'Right':'Left') : h.label;
  if(isOpen(h.points)) { if(label==='Left') left=true; else right=true; }
 }
 let angle: number | null=null;
 if(valid.length===2) {
  const [a,b]=valid.map(h=>h.points[0]).sort((a,b)=>a.x-b.x);
  if(b.x-a.x>0.12) angle=-Math.atan2(b.y-a.y,b.x-a.x);
 }
 const steering=angle===null?0:Math.max(-1,Math.min(1,((angle-(neutral??angle)))*(180/Math.PI)/32));
 return { steering: Math.abs(steering)<0.08?0:steering, throttle: left===right?0:right?1:-1, angle, count:valid.length, left, right };
}
