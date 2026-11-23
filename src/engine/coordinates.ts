import type { CharacterDesign } from '../components/characters/cast';
import type { ActingPose } from '../animation/clips';
import {
  RIG_SCALE,
  rigGeometry,
  seatedRootDrop,
} from '../components/characters/rigGeometry';
import { handSocket } from '../props/handSocket';

const rotateAround = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  deg: number,
) => {
  const a = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return {
    x: cx + dx * Math.cos(a) - dy * Math.sin(a),
    y: cy + dx * Math.sin(a) + dy * Math.cos(a),
  };
};

/** Vertical offset from CharacterRig SVG top to the character's floor anchor. */
export const actorFootOffsetY = (design: CharacterDesign): number =>
  20 + RIG_SCALE * (620 + rigGeometry(design).height * (568 - 620));

/** Top CSS position so the character's soles rest precisely on `floorY`. */
export const actorTopForFloor = (
  design: CharacterDesign,
  floorY: number,
  scale = 1,
): number => floorY - actorFootOffsetY(design) * scale;

/** World-space center of the character's head (used for camera framing & gaze). */
export const actorHeadWorldPos = (
  design: CharacterDesign,
  actorX: number,
  floorY: number,
  scale: number,
  pose: Partial<ActingPose> = {},
): { x: number; y: number } => {
  const { height } = rigGeometry(design);
  const headFromNeck = rotateAround(180, 105, 180, 178, pose.headTilt ?? 0);
  const headFromWaist = rotateAround(
    headFromNeck.x,
    headFromNeck.y,
    180,
    350,
    pose.torsoLean ?? 0,
  );
  const localX = (pose.rootX ?? 0) + 27 + RIG_SCALE * headFromWaist.x;
  const localY =
    (pose.rootY ?? 0) +
    RIG_SCALE * height * seatedRootDrop(pose) +
    20 +
    RIG_SCALE * (620 + height * (headFromWaist.y - 620));
  return {
    x: actorX + localX * scale,
    y: actorTopForFloor(design, floorY, scale) + localY * scale,
  };
};

/** World-space position of the character's left or right hand socket. */
export const handWorldPos = (
  design: CharacterDesign,
  actorX: number,
  floorY: number,
  scale: number,
  pose: Partial<ActingPose>,
  hand: 'left' | 'right',
): { x: number; y: number } => {
  const socket = handSocket(design, pose, hand);
  return {
    x: actorX + socket.x * scale,
    y: actorTopForFloor(design, floorY, scale) + socket.y * scale,
  };
};
