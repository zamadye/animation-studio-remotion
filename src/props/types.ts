export type PhoneContent={kind:'phone';mode?:'chat'|'call'|'bank'|'video';video?:{frame:number;openness:number};bank?:{label:string;amount:string;notices:readonly string[]};id:string;contact:string;messages:readonly {from:'them'|'me';lines:readonly string[]}[]};
export type LetterContent={kind:'letter';layout?:'letter'|'notebook';id:string;heading:string;number:string;lines:readonly string[];struckLines?:readonly number[];signatureLabel?:string;signature:string};
export type WalletContent={kind:'wallet';id:string};
export type LunchboxContent={kind:'lunchbox';id:string;open?:boolean};
export type HeldContent=PhoneContent|LetterContent|WalletContent|LunchboxContent;
export type HeldProp={content:HeldContent;hand:'left'|'right';start:number;end:number};
export const propSize=(p:HeldContent)=>p.kind==='lunchbox'?{width:480,height:300,scale:.2}:p.kind==='wallet'?{width:360,height:240,scale:.23}:p.kind==='phone'?{width:360,height:640,scale:.14}:{width:640,height:800,scale:.13};
/** A readable insert is deliberately short authored copy, not unrestricted chat history. */
export const validateContent=(p:HeldContent)=>{
 const check=(text:string,max:number)=>{if(!text.trim()||text.length>max)throw new Error(`${p.id}: text exceeds readable layout budget (${max})`);};
 check(p.id,60);if(p.kind==='wallet'||p.kind==='lunchbox')return p;
 if(p.kind==='phone'){
  check(p.contact,22);if(p.mode==='video'){if(!p.video)throw new Error('Video data missing');return p;}if(p.mode==='bank'){if(!p.bank)throw new Error('Bank screen data missing');check(p.bank.label,24);check(p.bank.amount,18);if(p.bank.notices.length>4)throw new Error('Too many bank notices');p.bank.notices.forEach(s=>check(s,28));return p;}if(!p.messages.length||p.messages.length>3)throw new Error(`${p.id}: use 1–3 messages`);
  for(const m of p.messages){if(!m.lines.length||m.lines.length>3)throw new Error(`${p.id}: use 1–3 lines per message`);m.lines.forEach(s=>check(s,22));}
 }else{check(p.heading,24);check(p.number,32);check(p.signature,26);if(p.signatureLabel)check(p.signatureLabel,28);if(!p.lines.length||p.lines.length>10)throw new Error(`${p.id}: use 1–10 letter lines`);p.lines.filter(s=>s.length>0).forEach(s=>check(s,34));}
 return p;
};

export const propTop=(p:HeldContent)=>p.kind==='lunchbox'?-24:p.kind==='wallet'?-24:p.kind==='phone'?-42:-55;
