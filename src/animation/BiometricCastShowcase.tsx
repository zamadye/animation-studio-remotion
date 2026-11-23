import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CharacterRig } from '../components/characters/CharacterRig';
import { characterRegistry } from '../components/characters/registry';
import { resolveCharacterBiometrics } from './faceRig';
import {
  bodyProportions,
  rigGeometry,
  RIG_SCALE,
} from '../components/characters/rigGeometry';
import { actorFootOffsetY } from '../engine/coordinates';
import { computeIdleLayer } from '../engine/pose';
import { actorBlinkAt } from '../engine/face';
import type { ActingPose } from './clips';

export const BIOMETRIC_SHOWCASE_FRAMES = 240;
export const BIOMETRIC_SHOWCASE_FPS = 24;

const AGE_LABELS = {
  child: 'Anak',
  young: 'Muda',
  adult: 'Dewasa',
  middle: 'Paruh baya',
  senior: 'Senior',
} as const;

const SHAPE_LABELS = {
  round: 'Bundar',
  oval: 'Oval',
  oblong: 'Lonjong',
  square: 'Kotak',
  heart: 'Hati',
  diamond: 'Berlian',
  pear: 'Pir',
} as const;

export const BiometricCastShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const closeup = frame >= 120;
  const local = frame % 120;
  const headTurn =
    local < 40
      ? -0.55 + (local / 40) * 0.55
      : local < 80
        ? ((local - 40) / 40) * 0.55
        : 0.55 - ((local - 80) / 40) * 1.1;

  const entries = Object.entries(characterRegistry);

  return (
    <AbsoluteFill
      style={{
        background: '#ede4d2',
        fontFamily: 'Arial, sans-serif',
        color: '#283138',
      }}
    >
      <div
        style={{
          margin: '18px 40px 6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 32 }}>
          BIOMETRIC CAST RIG V4 · 18 KARAKTER ANATOMI BERBEDA
        </h1>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#9c4e38' }}>
          {closeup
            ? 'CLOSE-UP WAJAH & EKSPRESI BIOMETRIK'
            : 'FULL BODY · PROPORSI, USIA, GENDER & SEPATU'}
        </span>
      </div>
      <p style={{ margin: '0 40px 10px', fontSize: 16, color: '#6b5e4c' }}>
        7 bentuk tengkorak (bundar, oval, lonjong, kotak, hati, berlian, pir) ·
        5 kelompok usia · variasi mata/alis/hidung/bibir/rambut · 24 fps · frame{' '}
        {frame}/{BIOMETRIC_SHOWCASE_FRAMES - 1}
      </p>

      {entries.map(([id, design], i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const cardW = 298;
        const cardH = 304;
        const left = 36 + col * 310;
        const top = 112 + row * 316;
        const bio = resolveCharacterBiometrics(design);
        const bp = bodyProportions(design);
        const idle = computeIdleLayer(
          id,
          frame,
          BIOMETRIC_SHOWCASE_FPS,
          0,
          bp.motionTempo,
          bp.postureSlouch,
        );
        const blink = actorBlinkAt(id, frame, BIOMETRIC_SHOWCASE_FPS);
        const floorY = 250;
        const scale = 0.44;
        const rigTop = floorY - actorFootOffsetY(design) * scale;
        const h = rigGeometry(design).height;
        const faceLocalY = 20 + RIG_SCALE * (620 + h * (116 - 620));
        const closeupMarginTop = Math.round(124 - faceLocalY * 1.32);
        const pose: ActingPose = {
          headTilt: idle.headTilt ?? 0,
          torsoLean: idle.torsoLean ?? 0,
          armLeft: 0,
          armRight: 0,
          elbowLeft: 0,
          elbowRight: 0,
          hipLeft: 0,
          hipRight: 0,
          kneeLeft: 0,
          kneeRight: 0,
          gazeX: headTurn * 4,
          gazeY: 0,
          rootX: 0,
          rootY: idle.rootY ?? 0,
          squash: 1,
          breath: idle.breath ?? 0,
          shoulderLift: idle.shoulderLift ?? 0,
          hairSwing: idle.hairSwing ?? 0,
          headTurn,
          bodyTurn: headTurn * 0.72,
          expression: 'neutral',
          mouth: 'rest',
          blink: blink > 0.5,
        };

        return (
          <div
            key={id}
            data-biometric-card={id}
            style={{
              position: 'absolute',
              left,
              top,
              width: cardW,
              height: cardH,
              background: '#f5eee0',
              borderRadius: 12,
              border: '1.5px solid #cbbca2',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 14px 4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid #dfd4bf',
              }}
            >
              <b style={{ fontSize: 19 }}>{design.name}</b>
              <span style={{ fontSize: 12, color: '#786954' }}>
                {SHAPE_LABELS[bio.face.faceShape]} ·{' '}
                {AGE_LABELS[bio.face.ageGroup]}
              </span>
            </div>

            {closeup ? (
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 32,
                  width: 262,
                  height: 232,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div style={{ marginTop: closeupMarginTop }}>
                  <CharacterRig
                    design={design}
                    frame={frame}
                    fps={BIOMETRIC_SHOWCASE_FPS}
                    cue="hold"
                    scale={1.32}
                    actingPose={pose}
                    face={{
                      emotion: i % 3 === 0 ? 'happy' : 'neutral',
                      intensity: 0.7,
                      viseme: 'rest',
                      blink,
                      headTurn,
                      gazeX: headTurn * 4,
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: 69,
                    top: rigTop,
                  }}
                >
                  <CharacterRig
                    design={design}
                    frame={frame}
                    fps={BIOMETRIC_SHOWCASE_FPS}
                    cue="hold"
                    scale={scale}
                    actingPose={pose}
                    face={{
                      emotion: 'neutral',
                      viseme: 'rest',
                      blink,
                      headTurn,
                      gazeX: headTurn * 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    top: floorY,
                    height: 1.5,
                    background: '#c4b496',
                  }}
                />
              </>
            )}

            <div
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: '#6b5e4c',
                textAlign: 'center',
                background: '#f5eee0e6',
                paddingTop: 3,
              }}
            >
              {bio.face.eyeShape} · {bio.face.noseShape} · {design.hairShape} ·{' '}
              {bp.footwear}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
