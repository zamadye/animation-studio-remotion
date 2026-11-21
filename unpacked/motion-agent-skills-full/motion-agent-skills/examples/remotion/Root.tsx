import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AnimatedHeadline} from './AnimatedHeadline';

const Root: React.FC = () => <Composition
  id="Headline"
  component={AnimatedHeadline}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{title: 'A system under pressure', accent: '#7dd3fc'}}
/>;

registerRoot(Root);
