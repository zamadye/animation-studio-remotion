import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { WorldStoryScene } from '../world/WorldStoryScene';
import { PropArt } from '../props/PropArt';
import { propSize, type HeldContent } from '../props/types';
import type { StorySceneDefinition } from '../story/types';
import { CinematicCamera } from '../camera/CinematicCamera';
import {
  evaluateInsertTransition,
  type CameraBeatImpulse,
  type CameraKeyframe,
} from '../engine/camera';
import { clamp01, lerp, springValue } from '../engine/math';

export type EpisodeShotMeta = {
  number: number;
  label: string;
  location: string;
  startFrame: number;
  endFrame: number;
  scene: StorySceneDefinition;
};

export type EpisodeDialogueLine = {
  id: string;
  speaker: string;
  label?: string;
  text: string;
  start: number;
  end: number;
  audio?: string;
};

export type EpisodeInsertCue = {
  id: string;
  startFrame: number;
  endFrame: number;
  content: HeldContent | ((frame: number) => HeldContent);
  stamp?: string;
  stampFrame?: number;
};

export type EpisodeSceneAudioTrack = {
  id: string;
  from: number;
  durationInFrames: number;
  src: string;
  volume?: number;
};

export type EpisodeShellProps = {
  episodeId: string;
  seriesLabel: string;
  title: string;
  statusBadge?: string;
  disclaimer: string;
  portrait?: boolean;
  shots: readonly EpisodeShotMeta[];
  lines: readonly EpisodeDialogueLine[];
  inserts?: readonly EpisodeInsertCue[];
  cameraKeyframes: readonly CameraKeyframe[];
  cameraImpulses?: readonly CameraBeatImpulse[];
  sceneAudioTracks?: readonly EpisodeSceneAudioTrack[];
  ambientAudio?: { src: string; volume: number };
  speakerLabels?: Record<string, string>;
  speakerColors?: Record<string, string>;
  endingQuote?: { startFrame: number; lines: readonly string[] };
  renderExtraStage?: (shotIndex: number, frame: number) => React.ReactNode;
};

export const EpisodeShell: React.FC<EpisodeShellProps> = ({
  episodeId,
  seriesLabel,
  title,
  statusBadge,
  disclaimer,
  portrait = false,
  shots,
  lines,
  inserts = [],
  cameraKeyframes,
  cameraImpulses = [],
  sceneAudioTracks = [],
  ambientAudio,
  speakerLabels = {},
  speakerColors = {},
  endingQuote,
  renderExtraStage,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rawIndex = shots.findIndex(
    (s) => f >= s.startFrame && f < s.endFrame,
  );
  const index = rawIndex >= 0 ? rawIndex : shots.length - 1;
  const activeShot = shots[index];
  const line = lines.find((l) => f >= l.start && f < l.end);

  const W = portrait ? 1080 : 1920;
  const H = portrait ? 1920 : 1080;

  const activeInsert = inserts.find(
    (ins) => f >= ins.startFrame && f < ins.endFrame,
  );
  const resolvedInsertContent = activeInsert
    ? typeof activeInsert.content === 'function'
      ? activeInsert.content(f)
      : activeInsert.content
    : null;
  const insertAnim = activeInsert
    ? evaluateInsertTransition(
        f,
        activeInsert.startFrame,
        activeInsert.endFrame,
        fps,
      )
    : null;
  const insertScale = resolvedInsertContent
    ? resolvedInsertContent.kind === 'phone'
      ? portrait
        ? 1.7
        : 1.22
      : portrait
        ? 1.29
        : 1.0
    : 1;
  const dims = resolvedInsertContent ? propSize(resolvedInsertContent) : null;

  const speakerDisplay = line
    ? (line.label ?? speakerLabels[line.speaker] ?? line.speaker)
    : '';
  const speakerAccent = line
    ? (speakerColors[line.speaker] ?? '#e1c58d')
    : '#e1c58d';
  const lineReveal = line ? clamp01((f - line.start) / 4) : 0;

  const stampSpring =
    activeInsert?.stamp && f >= (activeInsert.stampFrame ?? activeInsert.startFrame)
      ? springValue(
          f - (activeInsert.stampFrame ?? activeInsert.startFrame) + 1,
          fps,
          { stiffness: 320, damping: 16, mass: 1 },
        )
      : 0;

  const insertActiveBackdrop = Boolean(
    insertAnim?.visible && insertAnim.backdropOpacity > 0.35,
  );

  return (
    <AbsoluteFill
      style={{
        background: '#e8dfcb',
        color: '#293e36',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <CinematicCamera
        keyframes={cameraKeyframes}
        impulses={cameraImpulses}
        viewportWidth={W}
        viewportHeight={H}
        ambientBreath
      >
        <Sequence
          from={activeShot.startFrame}
          durationInFrames={activeShot.scene.duration}
          layout="none"
        >
          <WorldStoryScene
            episodeId={episodeId}
            location={activeShot.location}
            scene={activeShot.scene}
            audio={false}
          />
        </Sequence>
        {renderExtraStage?.(index, f)}
      </CinematicCamera>

      {portrait && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 310,
              background:
                'linear-gradient(180deg, #e8dfcb 48%, rgba(232,223,203,0) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 360,
              background:
                'linear-gradient(0deg, #e8dfcb 45%, rgba(232,223,203,0) 100%)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {activeInsert && resolvedInsertContent && dims && insertAnim?.visible && (
        <>
          <AbsoluteFill
            style={{
              background: 'radial-gradient(ellipse at center,#bbc7b5,#61766b)',
              opacity: insertAnim.backdropOpacity,
            }}
          />
          <AbsoluteFill
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: dims.width * insertScale,
                height: dims.height * insertScale,
                marginTop: portrait ? -40 : -80,
                opacity: insertAnim.opacity,
                transform: `translateY(${insertAnim.translateY}px) scale(${insertAnim.scale})`,
              }}
            >
              <div
                style={{
                  transform: `scale(${insertScale})`,
                  transformOrigin: '0 0',
                }}
              >
                <PropArt content={resolvedInsertContent} />
              </div>
            </div>
            {activeInsert.stamp && stampSpring > 0 && (
              <div
                style={{
                  position: 'absolute',
                  right: portrait ? 65 : 330,
                  top: portrait ? 1160 : 620,
                  color: '#a54e3b',
                  border: '7px solid #a54e3b',
                  padding: '12px 20px',
                  fontWeight: 900,
                  fontSize: portrait ? 42 : 50,
                  transform: `rotate(-12deg) scale(${lerp(1.45, 1, stampSpring)})`,
                  opacity: clamp01(stampSpring * 1.3),
                  background: '#fff7e7f2',
                }}
              >
                {activeInsert.stamp}
              </div>
            )}
          </AbsoluteFill>
        </>
      )}

      <div
        style={{
          position: 'absolute',
          top: portrait ? 65 : 26,
          left: portrait ? 55 : 35,
          right: portrait ? 55 : 35,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          gap: 30,
          color: insertActiveBackdrop ? '#f6efe0' : '#293e36',
        }}
      >
        <div>
          <div
            style={{
              fontSize: portrait ? 23 : 18,
              letterSpacing: 3,
              fontWeight: 700,
            }}
          >
            {seriesLabel}
          </div>
          <div
            style={{
              fontSize: portrait ? 43 : 29,
              fontWeight: 900,
              marginTop: 10,
            }}
          >
            {title}
          </div>
        </div>
        {!portrait && statusBadge && (
          <div
            style={{
              fontSize: 16,
              background: '#f9f0dce8',
              padding: '9px 14px',
              borderRadius: 6,
            }}
          >
            {statusBadge}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: portrait ? 55 : 35,
          top: portrait ? 230 : 122,
          fontSize: portrait ? 27 : 19,
          background: '#f4ecd9e6',
          padding: '9px 16px',
          borderRadius: 6,
        }}
      >
        {String(index + 1).padStart(2, '0')} / {activeShot.label}
      </div>

      {line && (
        <div
          style={{
            position: 'absolute',
            left: portrait ? 45 : 260,
            right: portrait ? 45 : 260,
            bottom: portrait ? 190 : 42,
            padding: portrait ? '25px 30px' : '17px 30px',
            background: '#243d36f2',
            borderLeft: `7px solid ${speakerAccent}`,
            borderRadius: 12,
            color: '#fff7e5',
            fontSize: portrait ? 39 : 30,
            lineHeight: 1.28,
            textAlign: 'center',
            opacity: lineReveal,
            transform: `translateY(${(1 - lineReveal) * 8}px)`,
          }}
        >
          <div
            style={{
              color: speakerAccent,
              fontWeight: 700,
              fontSize: portrait ? 28 : 22,
              marginBottom: 9,
            }}
          >
            {speakerDisplay}
          </div>
          {line.text.replace(/^\.\.\./, '…')}
        </div>
      )}

      {endingQuote && f > endingQuote.startFrame && !line && (
        <div
          style={{
            position: 'absolute',
            left: portrait ? 70 : 480,
            right: portrait ? 70 : 480,
            top: portrait ? 470 : 195,
            padding: 40,
            textAlign: 'center',
            fontSize: portrait ? 50 : 46,
            lineHeight: 1.3,
            fontWeight: 800,
            background: '#f6eddbed',
            borderRadius: 12,
          }}
        >
          {endingQuote.lines.map((qLine, qi) => (
            <React.Fragment key={qi}>
              {qi > 0 && <br />}
              {qLine}
            </React.Fragment>
          ))}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: portrait ? 62 : 10,
          left: 30,
          right: 30,
          textAlign: 'center',
          fontSize: portrait ? 21 : 15,
          color: insertActiveBackdrop ? '#dde5dc' : '#576457',
        }}
      >
        {disclaimer}
      </div>

      {lines
        .filter((l) => l.audio)
        .map((l) => (
          <Sequence
            key={l.id}
            from={l.start}
            durationInFrames={l.end - l.start}
            layout="none"
          >
            <Audio src={staticFile(l.audio!)} />
          </Sequence>
        ))}

      {sceneAudioTracks.map((t) => (
        <Sequence
          key={t.id}
          from={t.from}
          durationInFrames={t.durationInFrames}
          layout="none"
        >
          <Audio src={staticFile(t.src)} volume={t.volume ?? 1} />
        </Sequence>
      ))}

      {ambientAudio && (
        <Audio
          src={staticFile(ambientAudio.src)}
          volume={ambientAudio.volume}
        />
      )}
    </AbsoluteFill>
  );
};
