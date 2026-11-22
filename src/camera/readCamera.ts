export type ReadCamera={pushStart:number;insertStart:number;returnStart:number};
export const readCameraAt=(camera:ReadCamera,duration:number,frame:number)=>{
 const {pushStart:a,insertStart:b,returnStart:c}=camera;
 if(![a,b,c].every(Number.isInteger)||!(0<=a&&a<b&&b<c&&c<duration))throw new Error('Invalid read-camera timing');
 const t=Math.max(0,Math.min(1,(frame-a)/(b-a))),ease=t*t*(3-2*t);
 return {insert:frame>=b&&frame<c,progress:frame>=c?0:ease,phase:frame>=c?'return':frame>=b?'insert':frame>=a?'push':'wide'} as const;
};
