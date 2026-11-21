import React from 'react';
import {AbsoluteFill, Composition, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const Character: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const entrance = spring({frame, fps, config: {damping: 13, stiffness: 170}});
  const jump = frame >= 45 && frame < 65 ? Math.sin(((frame - 45) / 20) * Math.PI) * 90 : 0;
  const blink = frame % 100 >= 40 && frame % 100 <= 43;
  const eyeHeight = blink ? 3 : 22;
  return <div style={{position: 'absolute', left: 320, top: 620, width: 440, height: 750,
    transform: `translateY(${(1 - entrance) * 350 - jump}px)`, transformOrigin: 'center bottom'}}>
    <svg viewBox="0 0 440 750" width="440" height="750">
      <ellipse cx="220" cy="700" rx="145" ry="30" fill="#000" opacity="0.12" />
      <rect x="120" y="330" width="200" height="280" rx="95" fill="#51b7cc" stroke="#26344a" strokeWidth="13" />
      <path d="M155 575 L140 680 M285 575 L300 680" stroke="#26344a" strokeWidth="36" strokeLinecap="round" />
      <circle cx="220" cy="240" r="180" fill="#ffd59a" stroke="#26344a" strokeWidth="13" />
      <ellipse cx="160" cy="225" rx="18" ry={eyeHeight} fill="#26344a" />
      <ellipse cx="280" cy="225" rx="18" ry={eyeHeight} fill="#26344a" />
      <path d={frame >= 45 && frame < 105 ? 'M190 310 Q220 370 250 310' : 'M175 310 Q220 345 265 310'} fill="none" stroke="#26344a" strokeWidth="12" strokeLinecap="round" />
    </svg>
  </div>;
};

export const CartoonGag: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleScale = interpolate(frame, [0, 8, 16], [0.6, 1.12, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return <AbsoluteFill style={{backgroundColor:'#fff2ce', overflow:'hidden'}}>
    <div style={{position:'absolute',top:130,width:'100%',textAlign:'center',fontSize:84,fontWeight:900,
      fontFamily:'sans-serif',color:'#26344a',transform:`scale(${titleScale})`}}>JANGAN DIPENCET!</div>
    <Character frame={frame} fps={fps}/>
    <div style={{position:'absolute',bottom:0,width:'100%',height:280,backgroundColor:'#e6ba83'}} />
  </AbsoluteFill>;
};

export const CartoonComposition: React.FC = () => <Composition id="CartoonGag" component={CartoonGag} durationInFrames={150} fps={30} width={1080} height={1920}/>;
