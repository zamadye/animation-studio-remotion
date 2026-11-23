import React from 'react';
import type { CameraBeatImpulse, CameraKeyframe } from '../engine/camera';
import {
  EpisodeShell,
  type EpisodeInsertCue,
  type EpisodeShotMeta,
} from './EpisodeShell';
import {
  application,
  call,
  episodeLines,
  episodeScenes,
  receipt,
  rejection,
  savings,
  shotLabels,
  shotLocations,
  shotTimes,
} from './episode01';

const Motorcycle: React.FC = () => (
  <svg
    width="580"
    height="290"
    viewBox="0 0 580 290"
    style={{ position: 'absolute', left: 420, top: 660 }}
    aria-label="Motor tua milik Darto"
  >
    <g stroke="#493b35" strokeWidth="12" strokeLinejoin="round">
      <circle cx="100" cy="205" r="60" fill="#353f42" />
      <circle cx="455" cy="205" r="60" fill="#353f42" />
      <circle cx="100" cy="205" r="27" fill="#a7aaa1" />
      <circle cx="455" cy="205" r="27" fill="#a7aaa1" />
      <path
        d="M100 205l87-121h130l138 121H290l-103-121m130 0-27 121"
        fill="none"
      />
      <path d="M149 85h170l40 47H170Z" fill="#668475" />
      <ellipse cx="270" cy="174" rx="47" ry="33" fill="#7f8b85" />
      <circle cx="414" cy="73" r="18" fill="#eedeb0" />
      <path d="M150 70h160" strokeWidth="25" />
      <path d="M455 205l-69-157h-52m61 8h40" fill="none" />
      <path d="M25 148h110m252-8h118" fill="none" />
    </g>
  </svg>
);

const buildCameraKeyframes = (portrait: boolean): CameraKeyframe[] => {
  const frames: CameraKeyframe[] = [];
  for (let i = 0; i < 6; i++) {
    const start = shotTimes[i];
    const end = shotTimes[i + 1];
    const solo = i === 2 || i === 5;
    frames.push({
      frame: start,
      focusX: solo ? 910 : 960,
      focusY: 540,
      zoom: portrait ? 0.96 : 1,
      transitionFrames: 0,
    });
    const shotLines = episodeLines.filter(
      (l) => l.start >= start && l.start < end,
    );
    for (const l of shotLines) {
      const focusX =
        l.speaker === 'PETUGAS'
          ? 1285
          : l.speaker === 'DARTO'
            ? solo
              ? 940
              : 625
            : 960;
      const zoom = portrait
        ? ['DARTO', 'PETUGAS'].includes(l.speaker)
          ? 1.32
          : 0.96
        : !solo
          ? 1.12
          : 1.04;
      frames.push({
        frame: l.start,
        focusX,
        focusY: 525,
        zoom,
        transitionFrames: 11,
        easing: 'easeInOutCubic',
      });
    }
  }
  return frames;
};

const IMPULSES: CameraBeatImpulse[] = [
  { frame: 372, zoomBoost: 0.045, shakePx: 7, durationFrames: 14 },
  { frame: 1580, zoomBoost: 0.03, shakePx: 3, durationFrames: 14 },
];

const INSERTS: EpisodeInsertCue[] = [
  { id: 'insert-app', startFrame: 202, endFrame: 288, content: application },
  {
    id: 'insert-rej',
    startFrame: 370,
    endFrame: 547,
    content: rejection,
    stamp: 'DITUNDA',
    stampFrame: 372,
  },
  { id: 'insert-rec', startFrame: 802, endFrame: 960, content: receipt },
  { id: 'insert-sav', startFrame: 1210, endFrame: 1325, content: savings },
  {
    id: 'insert-call',
    startFrame: 1753,
    endFrame: 1932,
    content: (f) =>
      f < 1822 ? { ...call, messages: call.messages.slice(0, 1) } : call,
  },
];

const SHOTS: EpisodeShotMeta[] = shotLocations.map((location, i) => ({
  number: i + 1,
  label: shotLabels[i],
  location,
  startFrame: shotTimes[i],
  endFrame: shotTimes[i + 1],
  scene: episodeScenes[i],
}));

export const Episode01Review: React.FC<{ portrait?: boolean }> = ({
  portrait = false,
}) => {
  const cameraKeyframes = React.useMemo(
    () => buildCameraKeyframes(portrait),
    [portrait],
  );

  return (
    <EpisodeShell
      episodeId="01"
      seriesLabel="SATIR KEHIDUPAN · EPISODE 01"
      title="Orang Miskin Dilarang Miskin"
      statusBadge="VERSI REVIEW · RIG V2 + DAMPED CAMERA"
      disclaimer={`Fiksi satir · bukan gambaran prosedur resmi${portrait ? ' · Versi review' : ''}`}
      portrait={portrait}
      shots={SHOTS}
      lines={episodeLines}
      inserts={INSERTS}
      cameraKeyframes={cameraKeyframes}
      cameraImpulses={IMPULSES}
      ambientAudio={{ src: 'audio/ep01-roomtone-synthetic.wav', volume: 0.15 }}
      speakerLabels={{
        'ANAK (telepon)': 'Anak · melalui telepon',
        PEMBELI: 'Pembeli · dari luar layar',
        'PENGERAS SUARA': 'Pengeras suara',
        DARTO: 'Darto',
        PETUGAS: 'Petugas',
      }}
      speakerColors={{
        DARTO: '#e1c58d',
        PETUGAS: '#9bc4b6',
        'ANAK (telepon)': '#f0c7b4',
        PEMBELI: '#c7d3bf',
        'PENGERAS SUARA': '#e69f8a',
      }}
      endingQuote={{
        startFrame: 84 * 24,
        lines: ['“Tidak ada warga', 'yang tertinggal.”'],
      }}
      renderExtraStage={(shotIndex) =>
        shotIndex === 2 ? <Motorcycle /> : null
      }
    />
  );
};
