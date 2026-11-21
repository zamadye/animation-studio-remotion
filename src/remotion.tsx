import React from 'react';
import {Composition} from 'remotion';
import episodes from './data/episodes.json';
import type {Episode, AspectRatio} from './data/types';
import {OUTPUTS} from './data/types';
import {StoryFrame} from './components/StoryFrame';
const data = episodes as Episode[];
const ratios: AspectRatio[] = ['vertical','square','landscape'];
export const RemotionRoot: React.FC = () => <>
  {data.flatMap((episode) => ratios.map((ratio) => {
    const out = OUTPUTS[ratio];
    return <Composition key={`${episode.id}-${ratio}`} id={`Episode-${episode.id}-${ratio}`} component={StoryFrame}
      durationInFrames={90*30} fps={30} width={out.width} height={out.height}
      defaultProps={{episode, ratio, reducedMotion:false}} />;
  }))}
</>;
