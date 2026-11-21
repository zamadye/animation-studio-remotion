export type TemplateId='CARTOON-STAGE-DIALOGUE'|'CARTOON-EVIDENCE-INSERT'|'CARTOON-MESSAGE-POV';
export type CharacterProfile={name:string;role:string};
export type Shot={
 id:string;number:number;start:string;end:string;location:string;
 objective:string;dialogue:string;camera:string;animation:string;audio:string;
 startSeconds:number;endSeconds:number;templateId:TemplateId;characters:string[];poses:string[];
};
export type Episode={id:string;title:string;format:string;premise:string;theme:string;editorialNote:string;source:string;shots:Shot[];characters:CharacterProfile[];productionNotes:string[]};
export type AspectRatio='vertical'|'square'|'landscape';
export const OUTPUTS={
 vertical:{width:1080,height:1920,label:'9:16'},
 square:{width:1080,height:1080,label:'1:1'},
 landscape:{width:1920,height:1080,label:'16:9'},
} as const;
