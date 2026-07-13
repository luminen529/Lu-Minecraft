import { BLOCKS, ChangeMap, HEIGHT, SIZE } from './world'
export const SAVE_KEY='block-bloom-world-v1', VERSION=1
export interface WorldSave {version:1;seed:number;size:{x:number;y:number;z:number};player:{x:number;y:number;z:number};changes:ChangeMap}
export function validateWorld(v:unknown):WorldSave { const o=v as Partial<WorldSave>; if(!o||o.version!==VERSION||!Number.isInteger(o.seed)||!o.player||!o.changes||typeof o.changes!=='object')throw new Error('지원하지 않거나 손상된 월드 파일입니다.'); const p=o.player; if(![p.x,p.y,p.z].every(Number.isFinite))throw new Error('플레이어 위치가 올바르지 않습니다.'); for(const [k,b] of Object.entries(o.changes)){const a=k.split(',').map(Number);if(a.length!==3||!a.every(Number.isInteger)||a[0]<0||a[0]>=SIZE||a[1]<0||a[1]>=HEIGHT||a[2]<0||a[2]>=SIZE||!Number.isInteger(b)||b<0||b>=BLOCKS.length)throw new Error(`잘못된 블록 데이터: ${k}`)} return o as WorldSave }
export function saveWorld(data:WorldSave){localStorage.setItem(SAVE_KEY,JSON.stringify(data))}
export function loadWorld(){const raw=localStorage.getItem(SAVE_KEY);return raw?validateWorld(JSON.parse(raw)):null}
export function resetWorld(){localStorage.removeItem(SAVE_KEY)}
export function exportWorld(data:WorldSave){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`block-bloom-${data.seed}.json`;a.click();URL.revokeObjectURL(a.href)}
export async function importWorld(file:File){return validateWorld(JSON.parse(await file.text()))}
