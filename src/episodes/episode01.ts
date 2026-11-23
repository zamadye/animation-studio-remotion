import {
  EXPRESSIVE_PERFORMANCE,
  character,
  hold,
  perform,
  walkTo,
} from '../story/compose';
import {
  bothArms,
  idle,
  leanLeft,
  leanRight,
  rightArm,
} from '../story/motions';
import { validateStoryScene } from '../story/evaluate';
import type { EmotionCue, SpeechCue } from '../story/types';
import type { LetterContent, PhoneContent } from '../props/types';
import timelineData from './ep01-timeline.json';

export type EpisodeLine = {
  id: string;
  shot: number;
  speaker: string;
  text: string;
  start: number;
  end: number;
  audio: string;
  visemes: SpeechCue['visemes'];
};

export const episodeLines = timelineData as EpisodeLine[];

export const application: LetterContent = {
  kind: 'letter',
  id: 'map-permohonan',
  heading: 'PERMOHONAN BANTUAN',
  number: 'Pemohon: Darto',
  lines: [
    'Pekerjaan: buruh harian',
    '',
    'Tiga hari dapur tidak ngebul.',
    '',
    'Kendaraan: motor tua',
    'Dipakai untuk mencari kerja.',
  ],
  signatureLabel: 'Pemohon,',
  signature: 'Darto',
};

export const rejection: LetterContent = {
  kind: 'letter',
  id: 'hasil-pemeriksaan',
  heading: 'BELUM MEMENUHI SYARAT',
  number: 'Hasil pemeriksaan berkas',
  lines: [
    'Pemohon: Darto',
    '',
    'Kepemilikan aset: MOTOR',
    '',
    'Status permohonan: DITUNDA',
    '',
    'Catatan:',
    'Masih memiliki kendaraan.',
  ],
  signature: 'Petugas pelayanan',
};

export const receipt: LetterContent = {
  kind: 'letter',
  id: 'bukti-jual-motor',
  heading: 'MOTOR SUDAH DIJUAL',
  number: 'Catatan Darto',
  lines: [
    'Motor tua dilepas.',
    '',
    'Uangnya untuk membeli beras.',
    '',
    'Sekarang mencari kerja',
    'harus berjalan kaki.',
  ],
  signatureLabel: 'Pemohon,',
  signature: 'Darto',
};

export const call: PhoneContent = {
  kind: 'phone',
  mode: 'call',
  id: 'telepon-anak',
  contact: 'Anak · telepon',
  messages: [
    { from: 'them', lines: ['Pak, hari ini kita', 'makan apa?'] },
    { from: 'me', lines: ['Bapak usahakan, Nak.'] },
  ],
};

export const savings: LetterContent = {
  kind: 'letter',
  id: 'uang-simpanan',
  heading: 'DIANGGAP SIMPANAN',
  number: 'Uang hasil penjualan motor',
  lines: [
    'Tujuan: membeli beras.',
    '',
    'Motor sudah tidak ada.',
    'Pekerjaan ikut hilang.',
    '',
    'Namun uang untuk makan',
    'dianggap sebagai simpanan.',
  ],
  signatureLabel: 'Ringkasan fiksi,',
  signature: 'Catatan cerita · fiksi',
};

export const shotTimes = [0, 12, 26, 40, 56, 72, 90].map((s) => s * 24);
export const shotLocations = [
  'Kantor pelayanan',
  'Meja petugas',
  'Pinggir jalan',
  'Kantor pelayanan',
  'Kantor pelayanan',
  'Teras kantor',
];
export const shotLabels = [
  'Permohonan',
  'Punya aset',
  'Motor dilepas',
  'Dianggap simpanan',
  'Bukti usaha',
  'Tidak tertinggal?',
];

const dartoEmotions = (shotIdx: number, duration: number): EmotionCue[] => {
  switch (shotIdx) {
    case 0:
      return [
        { start: 0, end: 145, emotion: 'sad' },
        { start: 145, end: duration, emotion: 'tired' },
      ];
    case 1:
      return [
        { start: 0, end: 105, emotion: 'surprised' },
        { start: 105, end: 220, emotion: 'sad' },
        { start: 220, end: duration, emotion: 'angry' },
      ];
    case 2:
      return [
        { start: 0, end: 165, emotion: 'tired' },
        { start: 165, end: duration, emotion: 'sad' },
      ];
    case 3:
      return [
        { start: 0, end: 165, emotion: 'surprised' },
        { start: 165, end: 295, emotion: 'angry' },
        { start: 295, end: duration, emotion: 'sad' },
      ];
    case 4:
      return [
        { start: 0, end: 150, emotion: 'tired' },
        { start: 150, end: 270, emotion: 'angry' },
        { start: 270, end: duration, emotion: 'sad' },
      ];
    default:
      return [
        { start: 0, end: 145, emotion: 'sad' },
        { start: 145, end: 325, emotion: 'crying' },
        { start: 325, end: duration, emotion: 'tired' },
      ];
  }
};

const petugasEmotions = (shotIdx: number, duration: number): EmotionCue[] => {
  switch (shotIdx) {
    case 0:
      return [
        { start: 0, end: 110, emotion: 'neutral' },
        { start: 110, end: 210, emotion: 'suspicious' },
        { start: 210, end: duration, emotion: 'neutral' },
      ];
    case 1:
      return [
        { start: 0, end: 120, emotion: 'suspicious' },
        { start: 120, end: 240, emotion: 'angry' },
        { start: 240, end: duration, emotion: 'neutral' },
      ];
    case 3:
      return [
        { start: 0, end: 140, emotion: 'neutral' },
        { start: 140, end: duration, emotion: 'suspicious' },
      ];
    default:
      return [
        { start: 0, end: 245, emotion: 'suspicious' },
        { start: 245, end: duration, emotion: 'neutral' },
      ];
  }
};

export const episodeScenes = shotLocations.map((_, index) => {
  const start = shotTimes[index];
  const end = shotTimes[index + 1];
  const duration = end - start;
  const lines = episodeLines.filter((l) => l.shot === index + 1);
  const soloShot = index === 2 || index === 5;
  const dartoX = soloShot ? 760 : 430;

  const dartoMotions =
    index === 0
      ? [perform(rightArm, 24, 66), perform(idle, 90, duration - 90)]
      : index === 1
        ? [
            perform(rightArm, 96, 68),
            perform(leanRight, 190, 64),
            perform(idle, 254, duration - 254),
          ]
        : index === 2
          ? [
              perform(leanRight, 20, 64),
              perform(rightArm, 110, 70),
              perform(idle, 180, duration - 180),
            ]
          : index === 3
            ? [
                perform(bothArms, 55, 72),
                perform(leanLeft, 175, 65),
                perform(idle, 240, duration - 240),
              ]
            : index === 4
              ? [
                  perform(rightArm, 36, 70),
                  perform(bothArms, 180, 72),
                  perform(idle, 252, duration - 252),
                ]
              : [
                  perform(rightArm, 10, 68),
                  perform(leanLeft, 150, 75),
                  perform(idle, 225, duration - 225),
                ];

  const actors = [
    character({
      id: 'darto',
      x: dartoX,
      scale: 1.05,
      facing: 'threeQuarterRight',
      duration,
      motions: dartoMotions,
      paths: index === 0 ? [walkTo(340, 430, 0, 24, 1.05)] : [],
      emotions: dartoEmotions(index, duration),
      props:
        index === 0
          ? [hold(application, 'right', 0, duration)]
          : index === 2
            ? [hold(receipt, 'right', 0, duration)]
            : index === 5
              ? [hold(call, 'right', 0, duration)]
              : [],
    }),
  ];

  if (!soloShot) {
    const petugasMotions =
      index === 0
        ? [perform(leanLeft, 118, 62), perform(idle, 180, duration - 180)]
        : index === 1
          ? [
              perform(rightArm, 18, 64),
              perform(leanLeft, 160, 60),
              perform(idle, 220, duration - 220),
            ]
          : index === 3
            ? [perform(rightArm, 24, 65), perform(idle, 89, duration - 89)]
            : [perform(leanLeft, 24, 60), perform(idle, 84, duration - 84)];

    actors.push(
      character({
        id: 'petugas',
        x: 1110,
        scale: 1.05,
        facing: 'threeQuarterLeft',
        duration,
        motions: petugasMotions,
        emotions: petugasEmotions(index, duration),
      }),
    );
  }

  return validateStoryScene({
    id: `episode01-shot-${index + 1}`,
    fps: 24,
    duration,
    performance: EXPRESSIVE_PERFORMANCE,
    actors,
    speech: lines
      .filter((l) => ['DARTO', 'PETUGAS'].includes(l.speaker))
      .map((l) => ({
        id: l.id,
        speaker: l.speaker === 'DARTO' ? 'darto' : 'petugas',
        start: l.start - start,
        end: l.end - start,
        text: l.text,
        audio: l.audio,
        alignment: 'audio-energy-text-estimate',
        visemes: l.visemes,
      })),
  });
});
