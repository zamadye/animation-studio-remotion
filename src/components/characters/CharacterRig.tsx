import React from 'react';
import {
  faceFromPose,
  sampleDemoSpeech,
  type FaceState,
} from '../../animation/faceRig';
import type { CharacterDesign } from './cast';
import type { ActingPose, MouthShape } from '../../animation/clips';
import { ProportionCharacterRig } from '../../animation/ProportionCharacterRig';
import { HandTargetDebug } from '../../animation/HandTarget';
import type { Vec2 } from '../../animation/TwoBoneIK';
import {
  RIG_SCALE,
  solveRigArm,
  rigGeometry,
  seatedRootDrop,
} from './rigGeometry';

export type ActingCue =
  | 'neutral'
  | 'talk'
  | 'concern'
  | 'surprise'
  | 'gesture'
  | 'hold'
  | 'frustrated'
  | 'relief'
  | 'stern'
  | 'delight'
  | 'walk'
  | 'walkTalk';

export type Viseme = MouthShape;

export type CharacterRigProps = {
  design: CharacterDesign;
  frame: number;
  fps: number;
  cue: ActingCue;
  scale?: number;
  gaze?: 'left' | 'right' | 'center' | 'down';
  reducedMotion?: boolean;
  actingPose?: ActingPose;
  leftHandTarget?: Vec2;
  rightHandTarget?: Vec2;
  showHandTargets?: boolean;
  showSeat?: boolean;
  face?: FaceState;
  facing?: 'front' | 'threeQuarterLeft' | 'threeQuarterRight';
};

/** Production entry point shared by StoryFrame, proof scenes and review sheets.
 * Public viewport and target coordinates remain 360x540 for existing staging. */
export const CharacterRig: React.FC<CharacterRigProps> = ({
  design,
  frame,
  fps,
  cue,
  scale = 1,
  gaze = 'center',
  reducedMotion = false,
  actingPose,
  leftHandTarget,
  rightHandTarget,
  showHandTargets = false,
  showSeat = false,
  face: faceOverride,
  facing = 'front',
}) => {
  const tick = reducedMotion ? 0 : Math.max(0, frame);
  const phase = (tick / Math.max(1, fps)) * Math.PI * 2;
  const walk = !reducedMotion && (cue === 'walk' || cue === 'walkTalk');
  const gesture =
    !reducedMotion && cue === 'gesture'
      ? Math.sin(Math.PI * Math.min(1, tick / 40))
      : 0;
  const talk = cue === 'talk' || cue === 'walkTalk';

  const defaultHeadTurn =
    facing === 'threeQuarterLeft'
      ? -0.55
      : facing === 'threeQuarterRight'
        ? 0.55
        : 0;
  const defaultBodyTurn =
    facing === 'threeQuarterLeft'
      ? -0.4
      : facing === 'threeQuarterRight'
        ? 0.4
        : 0;

  const pose: Partial<ActingPose> = {
    torsoLean: 0,
    headTilt: cue === 'concern' ? 4 : 0,
    gazeX: gaze === 'left' ? -4 : gaze === 'right' ? 4 : 0,
    gazeY: gaze === 'down' ? 5 : 0,
    blink: !reducedMotion && tick % 103 >= 73 && tick % 103 <= 75,
    mouth:
      cue === 'surprise'
        ? 'round'
        : cue === 'stern' || cue === 'concern'
          ? 'closed'
          : talk && !reducedMotion
            ? (['closed', 'open', 'round', 'wide'] as MouthShape[])[
                Math.floor(tick / 4) % 4
              ]
            : 'rest',
    hipLeft: walk ? 14 * Math.sin(phase) : 0,
    hipRight: walk ? -14 * Math.sin(phase) : 0,
    kneeLeft: walk ? 20 * Math.max(0, -Math.sin(phase)) : 0,
    kneeRight: walk ? 20 * Math.max(0, Math.sin(phase)) : 0,
    ...actingPose,
    headTurn: actingPose?.headTurn ?? defaultHeadTurn,
    bodyTurn: actingPose?.bodyTurn ?? defaultBodyTurn,
  };

  // @lock-start:body-adapter
  const seated = Math.max(0, Math.min(1, pose.seated ?? 0));
  const height = rigGeometry(design).height;
  const drop = seatedRootDrop(pose);
  // The chair stays fixed in world space while the pelvis lowers onto it.
  const seatY = 464;
  const swing = walk ? 10 * Math.sin(phase) : 0;
  const arms = {
    left: leftHandTarget
      ? solveRigArm(design, leftHandTarget, -1, pose.torsoLean)
      : {
          shoulder: 6 + (actingPose?.armLeft ?? swing),
          elbow: actingPose?.elbowLeft ?? 0,
          wrist: actingPose?.wristLeft ?? 0,
        },
    right: rightHandTarget
      ? solveRigArm(design, rightHandTarget, 1, pose.torsoLean)
      : {
          shoulder: -6 + (actingPose?.armRight ?? -swing - 65 * gesture),
          elbow: actingPose?.elbowRight ?? -45 * gesture,
          wrist: actingPose?.wristRight ?? 0,
        },
  };
  // @lock-end:body-adapter

  pose.gazeX =
    (pose.gazeX ?? 0) +
    (facing === 'threeQuarterLeft'
      ? -3
      : facing === 'threeQuarterRight'
        ? 3
        : 0);

  const face: FaceState = faceOverride
    ? { ...faceOverride, headTurn: faceOverride.headTurn ?? pose.headTurn }
    : {
        ...faceFromPose(pose),
        ...(!actingPose && talk && !reducedMotion
          ? sampleDemoSpeech(tick, fps)
          : {}),
        headTurn: pose.headTurn,
      };

  return (
    <svg
      aria-label={`${design.name}, character rig`}
      data-rig="proportion-v1"
      viewBox="0 0 360 540"
      width={360 * scale}
      height={540 * scale}
      style={{ overflow: 'visible' }}
    >
      {/* @lock-start:body-placement */}
      <ellipse cx="180" cy="507" rx="65" ry="9" fill="#20262b" opacity=".12" />
      {showSeat && seated > 0 && (
        <g
          aria-label="test chair"
          opacity={Math.min(1, seated * 3)}
          transform={`translate(27 20) scale(${RIG_SCALE}) translate(0 620) scale(1 ${height}) translate(0 -620)`}
          stroke="#75604b"
          strokeWidth="7"
          fill="#b99d73"
          strokeLinejoin="round"
        >
          <path
            d={`M123 ${seatY}V${seatY - 127}h19v127M135 ${seatY + 3}v${568 - seatY - 3}m130 ${seatY + 3}v${568 - seatY - 3}`}
            fill="none"
          />
          <path d={`M125 ${seatY - 5}h150v13H125Z`} />
        </g>
      )}
      <g
        transform={`translate(${actingPose?.rootX ?? 0} ${(actingPose?.rootY ?? 0) + RIG_SCALE * height * drop})`}
      >
        <g transform={`translate(27 20) scale(${RIG_SCALE})`}>
          <ProportionCharacterRig
            design={design}
            roleLabel={design.name}
            child={design.child}
            heightScale={design.heightScale}
            pose={pose}
            arms={arms}
            face={face}
            embedded
          />
        </g>
        {/* @lock-end:body-placement */}
        {leftHandTarget && (
          <HandTargetDebug
            target={leftHandTarget}
            label={
              arms.left && 'clamped' in arms.left && arms.left.clamped
                ? 'L unreachable'
                : 'L target'
            }
            color="#3596e6"
            visible={showHandTargets}
          />
        )}
        {rightHandTarget && (
          <HandTargetDebug
            target={rightHandTarget}
            label={
              arms.right && 'clamped' in arms.right && arms.right.clamped
                ? 'R unreachable'
                : 'R target'
            }
            color="#e64b43"
            visible={showHandTargets}
          />
        )}
      </g>
    </svg>
  );
};
