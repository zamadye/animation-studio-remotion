import React from 'react';
import type { CameraBeatImpulse, CameraKeyframe } from '../../engine/camera';
import {
  EpisodeShell,
  type EpisodeDialogueLine,
  type EpisodeInsertCue,
  type EpisodeSceneAudioTrack,
  type EpisodeShotMeta,
} from '../EpisodeShell';
import {
  budgetNote,
  gajianAllLines,
  gajianPhone,
  gajianScenes,
  gajianTimeline,
} from './gajian';

const SHOTS: EpisodeShotMeta[] = gajianTimeline.scenes.map((s, idx) => ({
  number: idx + 1,
  label: s.title,
  location: gajianTimeline.location,
  startFrame: s.startFrame,
  endFrame: s.startFrame + s.durationFrames,
  scene: gajianScenes[idx],
}));

const LINES: EpisodeDialogueLine[] = gajianAllLines.map((l) => ({
  id: l.id,
  speaker: l.speaker,
  text: l.text,
  start: l.absStart,
  end: l.absEnd,
}));

const SCENE_AUDIO: EpisodeSceneAudioTrack[] = gajianTimeline.scenes.map((s) => ({
  id: `audio-${s.id}`,
  from: s.startFrame,
  durationInFrames: s.durationFrames,
  src: s.audio,
  volume: 1,
}));

const INSERTS: EpisodeInsertCue[] = [
  {
    id: 'insert-gajian-phone',
    startFrame: 120,
    endFrame: 276,
    content: gajianPhone,
  },
  {
    id: 'insert-budget-note',
    startFrame: gajianTimeline.scenes[2].startFrame + 14,
    endFrame: gajianTimeline.scenes[2].startFrame + 140,
    content: budgetNote,
    stamp: 'MINUS',
    stampFrame: gajianTimeline.scenes[2].startFrame + 56,
  },
];

const buildGajianCameraKeyframes = (portrait: boolean): CameraKeyframe[] => {
  const frames: CameraKeyframe[] = [];
  for (let i = 0; i < gajianTimeline.scenes.length; i++) {
    const s = gajianTimeline.scenes[i];
    frames.push({
      frame: s.startFrame,
      focusX: i === 0 ? 690 : 940,
      focusY: 540,
      zoom: portrait ? (i === 0 ? 1.12 : 0.96) : 1.0,
      transitionFrames: 0,
    });
    if (i === 0) {
      frames.push({
        frame: 245,
        focusX: 1180,
        focusY: 530,
        zoom: portrait ? 1.18 : 1.06,
        transitionFrames: 16,
        easing: 'easeInOutCubic',
      });
    }
    for (const l of s.lines) {
      const absStart = s.startFrame + l.start;
      const isPunchline =
        l.id === 'gajian-gajian-10' ||
        l.id === 'gajian-hitungan-terakhir-10';
      if (isPunchline) {
        frames.push({
          frame: absStart,
          focusX: 960,
          focusY: 520,
          zoom: portrait ? 1.04 : 1.08,
          transitionFrames: 8,
          easing: 'easeOutBack',
        });
      } else {
        frames.push({
          frame: absStart,
          focusX: l.speaker === 'raka' ? 685 : 1265,
          focusY: 525,
          zoom: portrait ? 1.32 : 1.14,
          transitionFrames: 11,
          easing: 'easeInOutCubic',
        });
      }
    }
  }
  return frames;
};

const IMPULSES: CameraBeatImpulse[] = [
  { frame: 706, zoomBoost: 0.045, shakePx: 5, durationFrames: 14 },
  {
    frame: gajianTimeline.scenes[2].startFrame + 56,
    zoomBoost: 0.04,
    shakePx: 6,
    durationFrames: 14,
  },
  {
    frame: gajianTimeline.scenes[2].startFrame + 718,
    zoomBoost: 0.035,
    shakePx: 3,
    durationFrames: 16,
  },
];

export const GajianEpisode: React.FC<{ portrait?: boolean }> = ({
  portrait = false,
}) => {
  const cameraKeyframes = React.useMemo(
    () => buildGajianCameraKeyframes(portrait),
    [portrait],
  );

  return (
    <EpisodeShell
      episodeId="gajian"
      seriesLabel="SATIR KELUARGA · EPISODE SPESIAL"
      title={gajianTimeline.title}
      statusBadge="DUA SUARA ELEVENLABS · RIG V2 + DAMPED CAMERA"
      disclaimer={`Fiksi satir rumah tangga · Raka & Nisa${portrait ? ' · Portrait 9:16' : ''}`}
      portrait={portrait}
      shots={SHOTS}
      lines={LINES}
      inserts={INSERTS}
      cameraKeyframes={cameraKeyframes}
      cameraImpulses={IMPULSES}
      sceneAudioTracks={SCENE_AUDIO}
      speakerLabels={{ raka: 'Raka', nisa: 'Nisa' }}
      speakerColors={{ raka: '#e1c58d', nisa: '#f0b8a8' }}
    />
  );
};
