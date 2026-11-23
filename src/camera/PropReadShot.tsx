import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { readCameraAt, type ReadCamera } from './readCamera';
import { resolveWorld } from '../world/registry';
import { WorldStoryScene } from '../world/WorldStoryScene';
import type { StorySceneDefinition } from '../story/types';
import { evaluateActor } from '../story/evaluate';
import { handWorldPos } from '../engine/coordinates';
import { PropArt } from '../props/PropArt';
import { propSize } from '../props/types';

/** Wide -> motivated push toward the actual attached object -> readable insert -> wide.
 * Insert is an editorial cut using the SAME object/content, not fake enlarged text in world space. */
export const PropReadShot: React.FC<{
  episodeId: string;
  location: string;
  scene: StorySceneDefinition;
  actorId: string;
  propId: string;
  camera: ReadCamera;
}> = ({ episodeId, location, scene, actorId, propId, camera }) => {
  const frame = useCurrentFrame();
  const actor = scene.actors.find((a) => a.id === actorId);
  if (!actor) {
    throw new Error('Camera actor not in explicit cast');
  }
  const prop = actor.props?.find((p) => p.content.id === propId);
  if (!prop) {
    throw new Error('Camera prop not attached to actor');
  }
  const shot = readCameraAt(camera, scene.duration, frame);
  if (prop.start > camera.pushStart || prop.end < camera.returnStart) {
    throw new Error('Camera targets an absent prop');
  }
  const state = evaluateActor(scene, actor, frame);
  const scale = actor.scale ?? 1;
  const floorY = resolveWorld(episodeId, location).floorY;
  const { x, y } = handWorldPos(
    actor.design,
    state.x,
    floorY,
    scale,
    state.pose,
    prop.hand,
  );
  const zoom = 1 + shot.progress * 1.6;
  const tx = (960 - x) * shot.progress;
  const ty = (540 - y) * shot.progress;
  const insert = shot.insert;
  const size = propSize(prop.content);
  const readScale = prop.content.kind === 'phone' ? 1.38 : 1.12;

  return (
    <AbsoluteFill style={{ background: '#e6deca', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${tx}px,${ty}px) translate(${x}px,${y}px) scale(${zoom}) translate(${-x}px,${-y}px)`,
        }}
      >
        <WorldStoryScene
          episodeId={episodeId}
          location={location}
          scene={scene}
          audio={false}
        />
      </AbsoluteFill>
      {insert && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse at center,#b7c5b3,#5d7469)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: size.width * readScale,
              height: size.height * readScale,
              position: 'relative',
            }}
          >
            <div
              style={{
                transform: `scale(${readScale})`,
                transformOrigin: 'top left',
              }}
            >
              <PropArt content={prop.content} />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 75,
              bottom: 65,
              color: '#f3ecdc',
              fontFamily: 'Arial',
              fontSize: 20,
            }}
          >
            INSERT · {prop.content.kind === 'phone' ? 'LAYAR HP' : 'ISI SURAT'}
            <br />
            Isi sama dengan benda di tangan
          </div>
        </AbsoluteFill>
      )}
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 22,
          padding: '12px 20px',
          borderRadius: 7,
          background: '#f4ecdded',
          fontFamily: 'Arial',
          color: '#283c34',
        }}
      >
        <b style={{ fontSize: 23 }}>
          PROPERTI GENGGAM ·{' '}
          {prop.content.kind === 'phone' ? 'HP / CHAT' : 'SURAT'}
        </b>
        <div style={{ fontSize: 17, marginTop: 5 }}>
          {insert
            ? 'Close-up baca'
            : frame >= camera.returnStart
              ? 'Kembali ke karakter'
              : frame >= camera.pushStart
                ? 'Kamera mendekati benda'
                : 'Shot lebar · benda mengikuti tangan'}{' '}
          · proof, bukan episode final
        </div>
      </div>
    </AbsoluteFill>
  );
};
