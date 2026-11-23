import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  evaluateCamera,
  type CameraBeatImpulse,
  type CameraKeyframe,
} from '../engine/camera';

export type CinematicCameraProps = {
  keyframes: readonly CameraKeyframe[];
  impulses?: readonly CameraBeatImpulse[];
  viewportWidth: number;
  viewportHeight: number;
  worldWidth?: number;
  worldHeight?: number;
  ambientBreath?: boolean;
  children: React.ReactNode;
};

/** Frame-addressable 2D camera rig with smooth damping, impulses, and edge clamping. */
export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  keyframes,
  impulses = [],
  viewportWidth,
  viewportHeight,
  worldWidth = 1920,
  worldHeight = 1080,
  ambientBreath = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = evaluateCamera(
    keyframes,
    frame,
    fps,
    {
      worldWidth,
      worldHeight,
      viewportWidth,
      viewportHeight,
      ambientBreath,
    },
    impulses,
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        transform: cam.tiltDeg ? `rotate(${cam.tiltDeg}deg)` : undefined,
        transformOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: worldWidth,
          height: worldHeight,
          left: cam.x,
          top: cam.y,
          transform: `scale(${cam.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>
    </div>
  );
};
