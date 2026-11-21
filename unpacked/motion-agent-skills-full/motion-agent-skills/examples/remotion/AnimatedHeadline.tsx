import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {title: string; accent?: string};

export const AnimatedHeadline: React.FC<Props> = ({title, accent = '#7dd3fc'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame, fps, config: {damping: 200, stiffness: 120}});
  const y = interpolate(appear, [0, 1], [64, 0]);
  const opacity = interpolate(frame, [0, Math.round(0.35 * fps)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  return <AbsoluteFill style={{backgroundColor: '#0b1020', justifyContent: 'center', padding: '8%'}}>
    <div style={{color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 800,
      fontSize: 96, lineHeight: 1.06, transform: `translateY(${y}px)`, opacity}}>
      <span style={{color: accent}}>● </span>{title}
    </div>
  </AbsoluteFill>;
};
