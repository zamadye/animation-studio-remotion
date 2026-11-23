import React from 'react';
import { HeldProps } from '../props/HeldProps';
import { CharacterRig } from '../components/characters/CharacterRig';
import { actorTopForFloor } from '../engine/coordinates';
import { evaluateActor } from './evaluate';
import type { ActorDefinition, StorySceneDefinition } from './types';

export const StoryActor: React.FC<{
  scene: StorySceneDefinition;
  actor: ActorDefinition;
  frame: number;
  floorY: number;
  debug?: boolean;
}> = ({ scene, actor, frame, floorY, debug = false }) => {
  const state = evaluateActor(scene, actor, frame);
  if (!state.visible) {
    return null;
  }
  const scale = actor.scale ?? 1;
  const top = actorTopForFloor(actor.design, floorY, scale);
  return (
    <div
      data-story-actor={actor.id}
      style={{ position: 'absolute', left: state.x, top }}
    >
      <CharacterRig
        design={actor.design}
        frame={frame}
        fps={scene.fps}
        cue="hold"
        scale={scale}
        actingPose={state.pose}
        face={state.face}
        facing={state.facing}
        showSeat={actor.seat !== 'none'}
      />
      {actor.props && (
        <HeldProps
          design={actor.design}
          pose={state.pose}
          items={actor.props}
          frame={frame}
          scale={scale}
        />
      )}
      {debug && (
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: -50,
            fontSize: 19,
            color: state.speaking ? '#a84633' : '#456452',
            fontWeight: 700,
          }}
        >
          {actor.design.name} · {state.speaking ? 'BICARA' : 'DIAM'}
          <br />
          <span style={{ fontSize: 14 }}>
            {state.motion} · {state.face.emotion} · {state.face.viseme}
          </span>
        </div>
      )}
    </div>
  );
};
