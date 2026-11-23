import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CharacterRig } from '../components/characters/CharacterRig';
import { cast } from '../components/characters/cast';
import { actorFootOffsetY } from '../engine/coordinates';
import {
  sampleRigCatalog,
  MOTION_FRAMES,
  MOTION_FPS,
} from './rigMotionCatalog';

export const FullRigCatalog: React.FC<{ motionIndex?: number }> = ({
  motionIndex,
}) => {
  const frame = useCurrentFrame();
  const sample = sampleRigCatalog(frame, motionIndex);
  return (
    <AbsoluteFill
      style={{
        background: '#e9dfcc',
        fontFamily: 'Arial,sans-serif',
        color: '#283138',
      }}
    >
      <h1 style={{ margin: '22px 40px 6px', fontSize: 34 }}>
        KATALOG RIG · 16 KARAKTER · SATU INDEKS GERAKAN
      </h1>
      <div
        style={{
          margin: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        <span>{sample.label}</span>
        <span>{String(sample.index + 1).padStart(2, '0')} / 13</span>
      </div>
      <p style={{ margin: '8px 40px', fontSize: 17 }}>
        Frame lokal {frame % MOTION_FRAMES} / {MOTION_FRAMES - 1} · {MOTION_FPS}{' '}
        fps · kiri/kanan = sisi karakter · preview rig frontal, bukan episode
        final
      </p>
      {Object.entries(cast)
        .flatMap(([ep, pair]) =>
          [pair.hero, pair.foil].map((design, j) => ({
            design,
            id: `${ep}-${j}`,
          })),
        )
        .map(({ design, id }, i) => {
          const floor = 0.6 * actorFootOffsetY(design);
          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                left: 28 + (i % 8) * 236,
                top: 155 + Math.floor(i / 8) * 438,
                width: 224,
                height: 416,
                background: '#f2eadc',
                borderRadius: 12,
                border: '1px solid #c8b99f',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 21,
                }}
              >
                {design.name}
              </div>
              <div style={{ position: 'absolute', top: 47, left: 4 }}>
                <CharacterRig
                  design={design}
                  frame={frame}
                  fps={MOTION_FPS}
                  cue="hold"
                  scale={0.6}
                  actingPose={sample.pose}
                  showSeat
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 47 + floor + 1,
                  left: 15,
                  right: 12,
                  height: 1,
                  background: '#bba98b',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 13,
                  left: 10,
                  fontSize: 14,
                  color: '#71634f',
                }}
              >
                {design.child ? 'Anak' : 'Dewasa'} · indeks{' '}
                {String(sample.index).padStart(2, '0')} · frame{' '}
                {frame % MOTION_FRAMES}
              </div>
            </div>
          );
        })}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 40,
          right: 40,
          fontSize: 17,
          color: '#71634f',
        }}
      >
        Bahu → siku → pergelangan · pelvis → paha → lutut → ankle · pinggang →
        torso → leher · kostum mengikuti rig bersama
      </div>
    </AbsoluteFill>
  );
};
