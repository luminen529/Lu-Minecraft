import { describe,expect,it } from 'vitest'
import { generatedBlock, hashSeed, terrainHeight, World } from './world'
import { validateWorld } from './storage'
describe('world generation',()=>{it('is deterministic',()=>{const s=hashSeed('island');expect(terrainHeight(20,20,s)).toBe(terrainHeight(20,20,s));expect(generatedBlock(20,terrainHeight(20,20,s),20,s)).toBe(1)});it('tracks only differences',()=>{const w=new World(7);const base=w.get(2,2,2);w.set(2,2,2,9);expect(w.get(2,2,2)).toBe(9);w.set(2,2,2,base);expect(Object.keys(w.changes)).toHaveLength(0)})})
describe('save validation',()=>{it('accepts a valid save',()=>expect(validateWorld({version:1,seed:1,size:{x:64,y:32,z:64},player:{x:1,y:2,z:3},changes:{'1,2,3':4}}).seed).toBe(1));it('rejects invalid blocks',()=>expect(()=>validateWorld({version:1,seed:1,player:{x:1,y:2,z:3},changes:{'99,2,3':4}})).toThrow())})
