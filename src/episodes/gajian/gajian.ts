import {
  EXPRESSIVE_PERFORMANCE,
  character,
  hold,
  perform,
  walkTo,
} from '../../story/compose';
import {
  bothArms,
  idle,
  leanLeft,
  leanRight,
  rightArm,
  seatedGesture,
  seatedLean,
  sitDown,
} from '../../story/motions';
import { validateStoryScene } from '../../story/evaluate';
import type { SpeechCue, StorySceneDefinition } from '../../story/types';
import type { LetterContent, PhoneContent } from '../../props/types';
import gajianTimelineData from './gajian-timeline.json';

export type GajianTimelineLine = {
  id: string;
  speaker: 'raka' | 'nisa';
  text: string;
  start: number;
  end: number;
  visemes: SpeechCue['visemes'];
};

export type GajianTimelineScene = {
  id: string;
  title: string;
  audio: string;
  alignmentMode: string;
  startFrame: number;
  audioFrames: number;
  durationFrames: number;
  lines: GajianTimelineLine[];
};

export type GajianTimeline = {
  id: string;
  title: string;
  location: string;
  fps: number;
  totalFrames: number;
  scenes: GajianTimelineScene[];
};

export const gajianTimeline = gajianTimelineData as GajianTimeline;
export const GAJIAN_FPS = gajianTimeline.fps;
export const GAJIAN_TOTAL_FRAMES = gajianTimeline.totalFrames;

export const gajianPhone: PhoneContent = {
  kind: 'phone',
  mode: 'chat',
  id: 'hp-gajian-raka',
  contact: 'M-Banking · Raka',
  messages: [
    { from: 'them', lines: ['Gaji masuk: +3.200rb', 'Potongan: -850rb'] },
    { from: 'them', lines: ['Tagihan: -420rb', 'Sisa: Rp1.930.000'] },
    { from: 'me', lines: ['Biaya rumah: 1.950rb'] },
  ],
};

export const budgetNote: LetterContent = {
  kind: 'letter',
  id: 'catatan-hitungan-raka',
  headerTag: 'CATATAN RUMAH TANGGA',
  heading: 'HITUNGAN TANGGAL 1',
  number: 'Gaji bersih: Rp1.930.000',
  lines: [
    'Kontrakan          : Rp1.000.000',
    'Listrik & air      : Rp  250.000',
    'Belanja dapur      : Rp  700.000',
    'Kirim ke Ibu       : Rp  500.000',
    '',
    'Total kebutuhan    : Rp2.450.000',
    'Selisih bulan ini  : -Rp 520.000',
  ],
  signatureLabel: 'Dihitung bersama,',
  signature: 'Raka & Nisa',
};

const buildSpeechCues = (scene: GajianTimelineScene): SpeechCue[] =>
  scene.lines.map((l) => ({
    id: l.id,
    speaker: l.speaker,
    start: l.start,
    end: l.end,
    text: l.text,
    visemes: l.visemes,
    alignment: 'audio-energy-text-estimate',
  }));

const scene1Data = gajianTimeline.scenes[0];
const scene2Data = gajianTimeline.scenes[1];
const scene3Data = gajianTimeline.scenes[2];

const scene1 = validateStoryScene({
  id: `gajian-${scene1Data.id}`,
  fps: GAJIAN_FPS,
  duration: scene1Data.durationFrames,
  performance: EXPRESSIVE_PERFORMANCE,
  actors: [
    character({
      id: 'raka',
      x: 520,
      scale: 1.05,
      facing: 'threeQuarterRight',
      duration: scene1Data.durationFrames,
      motions: [
        perform(rightArm, 0, 62),
        perform(leanLeft, 115, 70),
        perform(leanRight, 205, 70),
        perform(bothArms, 592, 82),
        perform(idle, 674, scene1Data.durationFrames - 674),
      ],
      emotions: [
        { start: 0, end: 115, emotion: 'happy' },
        { start: 115, end: 205, emotion: 'neutral' },
        { start: 205, end: 289, emotion: 'surprised' },
        { start: 289, end: 387, emotion: 'happy' },
        { start: 387, end: 592, emotion: 'afraid' },
        { start: 592, end: 705, emotion: 'embarrassed' },
        { start: 705, end: scene1Data.durationFrames, emotion: 'surprised' },
      ],
      props: [hold(gajianPhone, 'right', 0, scene1Data.durationFrames)],
    }),
    character({
      id: 'nisa',
      x: 1120,
      scale: 1.05,
      facing: 'threeQuarterLeft',
      enter: 235,
      exit: scene1Data.durationFrames,
      duration: scene1Data.durationFrames,
      paths: [walkTo(1420, 1120, 235, 287, 1.05)],
      motions: [
        perform(rightArm, 387, 78),
        perform(bothArms, 705, 76),
        perform(idle, 781, scene1Data.durationFrames - 781),
      ],
      emotions: [
        { start: 0, end: 387, emotion: 'happy' },
        { start: 387, end: 592, emotion: 'neutral' },
        { start: 592, end: 705, emotion: 'suspicious' },
        { start: 705, end: scene1Data.durationFrames, emotion: 'angry' },
      ],
    }),
  ],
  speech: buildSpeechCues(scene1Data),
});

const scene2 = validateStoryScene({
  id: `gajian-${scene2Data.id}`,
  fps: GAJIAN_FPS,
  duration: scene2Data.durationFrames,
  performance: EXPRESSIVE_PERFORMANCE,
  actors: [
    character({
      id: 'raka',
      x: 520,
      scale: 1.05,
      facing: 'threeQuarterRight',
      duration: scene2Data.durationFrames,
      motions: [
        perform(bothArms, 96, 72),
        perform(leanLeft, 259, 68),
        perform(leanLeft, 404, 52),
        perform(idle, 456, scene2Data.durationFrames - 456),
      ],
      emotions: [
        { start: 0, end: 96, emotion: 'afraid' },
        { start: 96, end: 259, emotion: 'sad' },
        { start: 259, end: 429, emotion: 'embarrassed' },
        { start: 429, end: scene2Data.durationFrames, emotion: 'sad' },
      ],
    }),
    character({
      id: 'nisa',
      x: 1120,
      scale: 1.05,
      facing: 'threeQuarterLeft',
      duration: scene2Data.durationFrames,
      motions: [
        perform(rightArm, 2, 72),
        perform(leanLeft, 232, 34),
        perform(rightArm, 429, 86),
        perform(idle, 515, scene2Data.durationFrames - 515),
      ],
      emotions: [
        { start: 0, end: 259, emotion: 'angry' },
        { start: 259, end: 356, emotion: 'surprised' },
        { start: 356, end: 429, emotion: 'suspicious' },
        { start: 429, end: scene2Data.durationFrames, emotion: 'sad' },
      ],
    }),
  ],
  speech: buildSpeechCues(scene2Data),
});

const scene3 = validateStoryScene({
  id: `gajian-${scene3Data.id}`,
  fps: GAJIAN_FPS,
  duration: scene3Data.durationFrames,
  performance: EXPRESSIVE_PERFORMANCE,
  actors: [
    character({
      id: 'raka',
      x: 520,
      scale: 1.05,
      facing: 'threeQuarterRight',
      duration: scene3Data.durationFrames,
      motions: [
        perform(sitDown, 0, 56),
        perform(seatedLean, 56, 80),
        perform(seatedGesture, 384, 92),
        perform(seatedLean, 647, 74),
      ],
      emotions: [
        { start: 0, end: 220, emotion: 'tired' },
        { start: 220, end: 384, emotion: 'sad' },
        { start: 384, end: 593, emotion: 'neutral' },
        { start: 593, end: 717, emotion: 'happy' },
        { start: 717, end: scene3Data.durationFrames, emotion: 'surprised' },
      ],
      props: [hold(budgetNote, 'right', 0, scene3Data.durationFrames)],
    }),
    character({
      id: 'nisa',
      x: 1120,
      scale: 1.05,
      facing: 'threeQuarterLeft',
      duration: scene3Data.durationFrames,
      motions: [
        perform(sitDown, 0, 56),
        perform(seatedGesture, 98, 86),
        perform(seatedLean, 525, 80),
        perform(seatedGesture, 717, 74),
      ],
      emotions: [
        { start: 0, end: 321, emotion: 'sad' },
        { start: 321, end: 525, emotion: 'tired' },
        { start: 525, end: 647, emotion: 'neutral' },
        { start: 647, end: 717, emotion: 'suspicious' },
        { start: 717, end: scene3Data.durationFrames, emotion: 'tired' },
      ],
    }),
  ],
  speech: buildSpeechCues(scene3Data),
});

export const gajianScenes: readonly StorySceneDefinition[] = [
  scene1,
  scene2,
  scene3,
];

export const gajianAllLines = gajianTimeline.scenes.flatMap((s) =>
  s.lines.map((l) => ({
    ...l,
    sceneId: s.id,
    absStart: s.startFrame + l.start,
    absEnd: s.startFrame + l.end,
  })),
);
