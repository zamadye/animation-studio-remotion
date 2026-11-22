import type {ActingPose, ExpressionName} from './clips';
export type EmotionState='hopeful'|'uncertain'|'shocked'|'frustrated'|'defeated'|'evaluating'|'dismissive'|'neutral';
const states:Record<EmotionState,Partial<ActingPose>>={
 hopeful:{expression:'hopeful',headTilt:-2,gazeY:-1,mouth:'wide'},uncertain:{expression:'uncertain',headTilt:-3,gazeY:2,mouth:'closed'},
 shocked:{expression:'shocked',headTilt:-7,gazeY:-3,mouth:'round'},frustrated:{expression:'frustrated',headTilt:3,gazeY:0,mouth:'open'},
 defeated:{expression:'defeated',headTilt:11,gazeY:12,mouth:'closed'},evaluating:{expression:'evaluating',headTilt:8,gazeY:10,mouth:'closed'},
 dismissive:{expression:'dismissive',headTilt:3,gazeY:-4,mouth:'closed'},neutral:{expression:'neutral',headTilt:0,gazeY:0,mouth:'rest'},
};
export const expressionFor=(state:EmotionState)=>states[state];
export const emotionName=(state:EmotionState):ExpressionName=>states[state].expression as ExpressionName;
