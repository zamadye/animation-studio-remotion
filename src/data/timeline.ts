import type {Shot} from './types';
export type DialogueBeat={index:number;count:number;speaker:string;text:string;startFrame:number;durationFrames:number};
/** Evenly spaces authored dialogue lines across their parent shot solely for silent animatic preview; it is not VO alignment. */
export const dialogueBeatAt=(shot:Shot,localFrame:number,fps:number):DialogueBeat=>{
 const lines=(shot.dialogue??'').split('\n').map(x=>x.trim()).filter(Boolean);
 const safeLines=lines.length?lines:['Jeda dramatis.'];
 const durationFrames=Math.max(1,Math.round((shot.endSeconds-shot.startSeconds)*fps));
 const perLine=Math.max(1,durationFrames/safeLines.length);
 const index=Math.min(safeLines.length-1,Math.floor(Math.max(0,localFrame)/perLine));
 const raw=safeLines[index];const split=raw.match(/^([^:]{1,55}):\s*(.*)$/);
 return {index,count:safeLines.length,speaker:split?.[1]??'',text:split?.[2]??raw,startFrame:Math.floor(index*perLine),durationFrames:Math.ceil(perLine)};
};
