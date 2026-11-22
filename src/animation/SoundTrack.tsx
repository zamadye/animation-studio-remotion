import React from 'react';
import {Audio,Sequence,staticFile} from 'remotion';
export const SoundTrack:React.FC=()=> <>
 <Sequence from={0} durationInFrames={192}><Audio src={staticFile('audio/proof-darto-01.mp3')} volume={1}/></Sequence>
 <Sequence from={192} durationInFrames={52}><Audio src={staticFile('audio/proof-petugas-01.mp3')} volume={1}/></Sequence>
 <Sequence from={244} durationInFrames={131}><Audio src={staticFile('audio/proof-darto-02.mp3')} volume={1}/></Sequence>
</>;
