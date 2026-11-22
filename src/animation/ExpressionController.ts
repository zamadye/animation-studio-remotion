import type {ExpressionName,MouthShape} from './clips';
export type ExpressionControls={browAngle:number;eyeOpen:number;mouth:MouthShape;blush:number;gazeX:number;gazeY:number};
const map:Record<ExpressionName,Omit<ExpressionControls,'mouth'|'gazeX'|'gazeY'>>={
 neutral:{browAngle:0,eyeOpen:1,blush:0},confused:{browAngle:12,eyeOpen:1.15,blush:0},suspicious:{browAngle:-10,eyeOpen:.86,blush:0},frustrated:{browAngle:-16,eyeOpen:.94,blush:0},angry:{browAngle:-24,eyeOpen:1.02,blush:0},embarrassed:{browAngle:9,eyeOpen:.83,blush:.42},pleading:{browAngle:17,eyeOpen:1.13,blush:0},exhausted:{browAngle:8,eyeOpen:.65,blush:0},defeated:{browAngle:14,eyeOpen:.71,blush:0},surprised:{browAngle:18,eyeOpen:1.35,blush:0},thinking:{browAngle:8,eyeOpen:.98,blush:0},hopeful:{browAngle:5,eyeOpen:1.08,blush:.05},uncertain:{browAngle:14,eyeOpen:.9,blush:0},shocked:{browAngle:21,eyeOpen:1.45,blush:0},evaluating:{browAngle:7,eyeOpen:.9,blush:0},dismissive:{browAngle:-14,eyeOpen:.82,blush:0},
};
export const expressionControls=(expression:ExpressionName,mouth:MouthShape='rest',gazeX=0,gazeY=0):ExpressionControls=>({...map[expression],mouth,gazeX,gazeY});
