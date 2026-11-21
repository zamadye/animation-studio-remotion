export type EasingName='linear'|'easeOut'|'easeInOut';
export type MotionSpan={startFrame:number;durationFrames:number;easing?:EasingName;reducedMotion?:boolean};
const clamp01=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(value:number,name:EasingName='easeOut')=>{
 const x=clamp01(value);
 if(name==='linear')return x;
 if(name==='easeInOut')return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
 return 1-Math.pow(1-x,3);
};
/** Pure frame-addressable motion primitive. No ambient clock or browser animation. */
export const progressAt=(frame:number,span:MotionSpan)=>span.reducedMotion?1:ease((frame-span.startFrame)/Math.max(1,span.durationFrames),span.easing);
export const fadeAt=(frame:number,span:MotionSpan)=>progressAt(frame,span);
export const slideYAt=(frame:number,span:MotionSpan,distance:number)=>span.reducedMotion?0:(1-progressAt(frame,span))*distance;
export const scaleAt=(frame:number,span:MotionSpan,from:number,to=1)=>from+(to-from)*progressAt(frame,span);
export const revealWidthAt=(frame:number,span:MotionSpan)=>`${(progressAt(frame,span)*100).toFixed(3)}%`;
export const reducedMotionSettings={enabledByDefault:false,allowUserOptIn:true,whenEnabled:'replace animated entrance/gesture with settled pose; preserve shot changes and readable state'} as const;
