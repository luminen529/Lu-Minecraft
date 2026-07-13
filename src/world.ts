export const SIZE = 64, HEIGHT = 32, CHUNK = 16
export const BLOCKS = ['air','grass','dirt','stone','sand','wood','leaves','brick','chalk','coral'] as const
export type Block = number
export type ChangeMap = Record<string, Block>

export function hashSeed(text: string) { let h = 2166136261; for (let i=0;i<text.length;i++) h=Math.imul(h^text.charCodeAt(i),16777619); return h>>>0 }
function noise2(x:number,z:number,seed:number) { let n=Math.imul(x,374761393)+Math.imul(z,668265263)+Math.imul(seed,1442695041); n=Math.imul(n^(n>>>13),1274126177); return ((n^(n>>>16))>>>0)/4294967295 }
function smooth(x:number,z:number,s:number,scale:number) { const fx=x/scale,fz=z/scale,x0=Math.floor(fx),z0=Math.floor(fz),tx=fx-x0,tz=fz-z0; const q=(a:number,b:number)=>noise2(a,b,s); const u=tx*tx*(3-2*tx),v=tz*tz*(3-2*tz); return (q(x0,z0)*(1-u)+q(x0+1,z0)*u)*(1-v)+(q(x0,z0+1)*(1-u)+q(x0+1,z0+1)*u)*v }
export function terrainHeight(x:number,z:number,seed:number) { const edge=Math.min(x,z,SIZE-1-x,SIZE-1-z); const island=Math.min(1,edge/7); return Math.max(4,Math.min(22,Math.floor(7+island*(smooth(x,z,seed,14)*7+smooth(x,z,seed+91,5)*3)))) }
function treeAt(x:number,z:number,seed:number){const h=terrainHeight(x,z,seed);return h>8&&x>3&&z>3&&x<SIZE-4&&z<SIZE-4&&noise2(x,z,seed+404)>.965}
export function generatedBlock(x:number,y:number,z:number,seed:number):Block { if(x<0||z<0||x>=SIZE||z>=SIZE||y<0||y>=HEIGHT)return 0; const h=terrainHeight(x,z,seed); if(y>h){if(treeAt(x,z,seed)&&y<=h+3)return 5;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const tx=x+dx,tz=z+dz,th=terrainHeight(tx,tz,seed);if(treeAt(tx,tz,seed)&&y>=th+3&&y<=th+5&&Math.abs(dx)+Math.abs(dz)+(y===th+5?1:0)<=3)return 6}return 0} if(y===0)return 3; if(y===h)return h<=7?4:1; if(y>=h-3)return h<=7?4:2; return 3 }
export class World {
  seed:number; changes:ChangeMap
  constructor(seed:number,changes:ChangeMap={}) { this.seed=seed; this.changes={...changes} }
  key(x:number,y:number,z:number){return `${x},${y},${z}`}
  get(x:number,y:number,z:number){const k=this.key(x,y,z); return k in this.changes?this.changes[k]:generatedBlock(x,y,z,this.seed)}
  set(x:number,y:number,z:number,b:Block){if(x<0||z<0||x>=SIZE||z>=SIZE||y<0||y>=HEIGHT)return false; const k=this.key(x,y,z),base=generatedBlock(x,y,z,this.seed); if(b===base)delete this.changes[k];else this.changes[k]=b;return true}
  spawn(){const x=SIZE>>1,z=SIZE>>1;return {x:x+.5,y:terrainHeight(x,z,this.seed)+2.7,z:z+.5}}
}
