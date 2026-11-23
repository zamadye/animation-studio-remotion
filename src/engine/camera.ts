import {
  applyEasing,
  clamp,
  clamp01,
  lerp,
  springValue,
  type EasingCurve,
} from './math';

export type CameraKeyframe = {
  frame: number;
  focusX: number;
  focusY: number;
  zoom: number;
  tiltDeg?: number;
  transitionFrames?: number;
  easing?: EasingCurve;
};

export type CameraBeatImpulse = {
  frame: number;
  zoomBoost?: number;
  shakePx?: number;
  durationFrames?: number;
};

export type CameraViewportConfig = {
  worldWidth: number;
  worldHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  ambientBreath?: boolean;
};

export type EvaluatedCamera = {
  x: number;
  y: number;
  zoom: number;
  tiltDeg: number;
  focusX: number;
  focusY: number;
};

/** Evaluates damped keyframe camera state with optional beat impulses and world clamping. */
export const evaluateCamera = (
  keyframes: readonly CameraKeyframe[],
  frame: number,
  fps: number,
  config: CameraViewportConfig,
  impulses: readonly CameraBeatImpulse[] = [],
): EvaluatedCamera => {
  const fallback: CameraKeyframe = {
    frame: 0,
    focusX: config.worldWidth / 2,
    focusY: config.worldHeight / 2,
    zoom: 1,
    tiltDeg: 0,
  };
  const sorted = keyframes.length ? keyframes : [fallback];

  let prev = sorted[0];
  let curr = sorted[0];
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].frame <= frame) {
      prev = i > 0 ? sorted[i - 1] : sorted[0];
      curr = sorted[i];
    } else {
      break;
    }
  }

  const trans = Math.max(0, curr.transitionFrames ?? 12);
  const rawProgress = trans === 0 ? 1 : clamp01((frame - curr.frame) / trans);
  const t = applyEasing(rawProgress, curr.easing ?? 'easeInOutCubic');

  let focusX = lerp(prev.focusX, curr.focusX, t);
  let focusY = lerp(prev.focusY, curr.focusY, t);
  let zoom = lerp(prev.zoom, curr.zoom, t);
  let tiltDeg = lerp(prev.tiltDeg ?? 0, curr.tiltDeg ?? 0, t);

  if (config.ambientBreath) {
    const breathPhase = (frame / Math.max(1, fps)) * ((Math.PI * 2) / 6.5);
    zoom += 0.006 * Math.sin(breathPhase);
    focusY += 3 * Math.cos(breathPhase * 0.7);
  }

  for (const imp of impulses) {
    const local = frame - imp.frame;
    const dur = Math.max(6, imp.durationFrames ?? 16);
    if (local >= 0 && local < dur) {
      const env = Math.sin((local / dur) * Math.PI);
      const decay = 1 - local / dur;
      if (imp.zoomBoost) {
        zoom += imp.zoomBoost * env;
      }
      if (imp.shakePx) {
        focusX += imp.shakePx * decay * Math.sin(local * 1.9);
        focusY += imp.shakePx * 0.7 * decay * Math.cos(local * 2.4);
      }
    }
  }

  const scaledW = config.worldWidth * zoom;
  const scaledH = config.worldHeight * zoom;
  let x = config.viewportWidth / 2 - focusX * zoom;
  let y = config.viewportHeight / 2 - focusY * zoom;

  if (scaledW >= config.viewportWidth) {
    x = clamp(x, config.viewportWidth - scaledW, 0);
  } else {
    x = (config.viewportWidth - scaledW) / 2;
  }
  if (scaledH >= config.viewportHeight) {
    y = clamp(y, config.viewportHeight - scaledH, 0);
  }

  return { x, y, zoom, tiltDeg, focusX, focusY };
};

export type InsertTransitionState = {
  visible: boolean;
  opacity: number;
  scale: number;
  translateY: number;
  backdropOpacity: number;
};

/** Spring entrance and smooth ease-out exit for readable document/phone inserts. */
export const evaluateInsertTransition = (
  frame: number,
  startFrame: number,
  endFrame: number,
  fps: number,
): InsertTransitionState => {
  if (frame < startFrame || frame >= endFrame) {
    return {
      visible: false,
      opacity: 0,
      scale: 0.94,
      translateY: 28,
      backdropOpacity: 0,
    };
  }
  const into = frame - startFrame;
  const out = endFrame - frame;
  const exitFrames = 6;
  const enterSpring = springValue(into + 1, fps, {
    stiffness: 240,
    damping: 20,
    mass: 1,
  });
  const enterAlpha = clamp01(into / 5);
  const exitAlpha = out < exitFrames ? clamp01(out / exitFrames) : 1;
  const opacity = Math.min(enterAlpha, exitAlpha);
  const scale =
    out < exitFrames
      ? lerp(0.95, 1, exitAlpha)
      : lerp(0.9, 1, enterSpring);
  const translateY =
    out < exitFrames
      ? lerp(22, 0, exitAlpha)
      : (1 - enterSpring) * 28;
  return {
    visible: true,
    opacity,
    scale,
    translateY,
    backdropOpacity: opacity,
  };
};

export type DialogueFocusLine = {
  speaker: string;
  start: number;
  end: number;
};

/** Generates damped camera keyframes from dialogue turns + per-speaker framing presets. */
export const buildSpeakerCameraKeyframes = (
  lines: readonly DialogueFocusLine[],
  speakerFocus: Record<
    string,
    { focusX: number; focusY: number; zoom: number; tiltDeg?: number }
  >,
  establishingFocus: {
    focusX: number;
    focusY: number;
    zoom: number;
    tiltDeg?: number;
  },
  transitionFrames = 12,
): CameraKeyframe[] => {
  const frames: CameraKeyframe[] = [
    { frame: 0, ...establishingFocus, transitionFrames: 0 },
  ];
  for (const line of lines) {
    const preset = speakerFocus[line.speaker] ?? establishingFocus;
    frames.push({
      frame: line.start,
      ...preset,
      transitionFrames,
      easing: 'easeInOutCubic',
    });
  }
  return frames;
};
