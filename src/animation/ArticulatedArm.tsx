import React from 'react';
import { ARM_UPPER, ARM_LOWER } from '../components/characters/rigGeometry';

export type ArmPose = { shoulder: number; elbow: number; wrist?: number };
export type SleeveStyle = 'long' | 'rolled' | 'short';

const INK = '#3d302a';

/** Anatomically tapered arm segments preserving exact shoulder -> elbow -> wrist
 * joint pivots and fixed segment lengths. */
export const ArticulatedArm: React.FC<{
  x: number;
  y: number;
  side: -1 | 1;
  shirt: string;
  skin: string;
  pose?: ArmPose;
  shaded?: boolean;
  thickness?: number;
  handScale?: number;
  sleeveStyle?: SleeveStyle;
}> = ({
  x,
  y,
  side,
  shirt,
  skin,
  pose = { shoulder: side * -6, elbow: 0 },
  shaded = false,
  thickness = 1,
  handScale = 1,
  sleeveStyle = 'long',
}) => {
  const uTop = 13.5 * thickness;
  const uElbow = 10.4 * thickness;
  const uMid = uTop * 0.56 + uElbow * 0.44 + 0.8 * thickness;
  const fElbow = 10.2 * thickness;
  const fBelly = 10.8 * thickness;
  const fWrist = 7.1 * thickness;

  const upperPath = `M${-uTop} 0Q${-uMid} ${ARM_UPPER * 0.42} ${-uElbow} ${ARM_UPPER}L${uElbow} ${ARM_UPPER}Q${uMid} ${ARM_UPPER * 0.42} ${uTop} 0Q0 -8 ${-uTop} 0Z`;
  const upperShade = `M${side < 0 ? -uTop : uTop * 0.15} 2Q${side < 0 ? -uMid : uMid * 0.65} ${ARM_UPPER * 0.42} ${side < 0 ? -uElbow : uElbow * 0.15} ${ARM_UPPER}L${side < 0 ? -uElbow * 0.15 : uElbow} ${ARM_UPPER}Q${side < 0 ? -uMid * 0.35 : uMid} ${ARM_UPPER * 0.42} ${side < 0 ? -uTop * 0.25 : uTop} 1Z`;

  const shortCutY = 46;
  const shortCutHalf = (uTop * 0.4 + uElbow * 0.6) + 1.2 * thickness;
  const shortSleevePath = `M${-uTop - 0.8} 0Q${-uMid - 1} ${shortCutY * 0.52} ${-shortCutHalf} ${shortCutY}Q0 ${shortCutY + 4} ${shortCutHalf} ${shortCutY}Q${uMid + 1} ${shortCutY * 0.52} ${uTop + 0.8} 0Q0 -8 ${-uTop - 0.8} 0Z`;

  const forePath = `M${-fElbow} -2Q${-fBelly} ${ARM_LOWER * 0.28} ${-fWrist} ${ARM_LOWER - 2}L${fWrist} ${ARM_LOWER - 2}Q${fBelly} ${ARM_LOWER * 0.28} ${fElbow} -2Z`;
  const foreShade = `M${side < 0 ? -fElbow : 0} -1Q${side < 0 ? -fBelly : fBelly * 0.65} ${ARM_LOWER * 0.28} ${side < 0 ? -fWrist : 0} ${ARM_LOWER - 2}L${side < 0 ? -fWrist * 0.1 : fWrist} ${ARM_LOWER - 2}Q${side < 0 ? -fBelly * 0.3 : fBelly} ${ARM_LOWER * 0.28} ${side < 0 ? -fElbow * 0.2 : fElbow} -1Z`;

  const rollY = 16;
  const rollHalf = fElbow + 1.4 * thickness;
  const rolledCuffPath = `M${-fElbow - 1} -3L${-rollHalf} ${rollY}Q0 ${rollY + 4.5} ${rollHalf} ${rollY}L${fElbow + 1} -3Q0 -7 ${-fElbow - 1} -3Z`;

  const elbowCapFill = sleeveStyle === 'short' ? skin : shirt;
  const forearmFill = sleeveStyle === 'long' ? shirt : skin;

  return (
    <g
      data-joint="shoulder"
      transform={`translate(${x} ${y}) rotate(${pose.shoulder})`}
    >
      {/* Upper arm */}
      {sleeveStyle === 'short' ? (
        <>
          <path
            d={upperPath}
            fill={skin}
            stroke={INK}
            strokeWidth="4.0"
            strokeLinejoin="round"
          />
          <path d={upperShade} fill="rgba(46,32,26,0.11)" stroke="none" />
          <path
            d={shortSleevePath}
            fill={shirt}
            stroke={INK}
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d={`M${-shortCutHalf + 1.5} ${shortCutY - 3}Q0 ${shortCutY + 0.5} ${shortCutHalf - 1.5} ${shortCutY - 3}`}
            fill="none"
            stroke="rgba(46,32,26,0.35)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d={upperPath}
            fill={shirt}
            stroke={INK}
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path d={upperShade} fill="rgba(28,22,18,0.12)" stroke="none" />
        </>
      )}
      {shaded && (
        <path d={upperPath} fill="rgba(28,22,18,0.16)" stroke="none" />
      )}

      {/* Elbow & forearm */}
      <g
        data-joint="elbow"
        transform={`translate(0 ${ARM_UPPER}) rotate(${pose.elbow})`}
      >
        <path
          d={forePath}
          fill={forearmFill}
          stroke={INK}
          strokeWidth="3.8"
          strokeLinejoin="round"
        />
        <path d={foreShade} fill="rgba(28,22,18,0.11)" stroke="none" />

        {sleeveStyle === 'long' && (
          <>
            <circle r={uElbow * 0.88} fill={elbowCapFill} stroke="none" />
            <path
              d={`M${-fWrist + 1} ${ARM_LOWER - 9}Q0 ${ARM_LOWER - 7.5} ${fWrist - 1} ${ARM_LOWER - 9}`}
              fill="none"
              stroke={INK}
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <circle
              cx={side * (fWrist - 3.2)}
              cy={ARM_LOWER - 5.5}
              r="1.2"
              fill="#e4d6b8"
              stroke={INK}
              strokeWidth="0.9"
            />
          </>
        )}

        {sleeveStyle === 'rolled' && (
          <>
            <path
              d={`M${-rollHalf + 2} ${rollY + 2}Q0 ${rollY + 6.5} ${rollHalf - 2} ${rollY + 2}L${rollHalf - 2.5} ${rollY + 5}Q0 ${rollY + 9} ${-rollHalf + 2.5} ${rollY + 5}Z`}
              fill="rgba(46,32,26,0.18)"
              stroke="none"
            />
            <path
              d={rolledCuffPath}
              fill={shirt}
              stroke={INK}
              strokeWidth="3.4"
              strokeLinejoin="round"
            />
            <path
              d={`M${-fElbow} ${rollY - 4.5}Q0 ${rollY - 0.5} ${fElbow} ${rollY - 4.5}`}
              fill="none"
              stroke="rgba(255,244,224,0.22)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d={`M${-fElbow * 0.45} 22q${fElbow * 0.45} 2.5 ${fElbow * 0.9} 0`}
              fill="none"
              stroke="rgba(61,48,42,0.32)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </>
        )}

        {sleeveStyle === 'short' && (
          <>
            <circle r={uElbow * 0.88} fill={skin} stroke="none" />
            <path
              d={`M${-fElbow * 0.45} 4q${fElbow * 0.45} 2.5 ${fElbow * 0.9} 0`}
              fill="none"
              stroke="rgba(61,48,42,0.34)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}

        {shaded && (
          <path d={forePath} fill="rgba(28,22,18,0.16)" stroke="none" />
        )}

        {/* Sculpted articulated hand preserving socket at (0, 12) */}
        <g
          data-joint="wrist"
          transform={`translate(0 ${ARM_LOWER}) rotate(${pose.wrist ?? 0}) scale(${side * handScale} ${handScale})`}
        >
          <path
            d="M-7.5 -2L6.5 -2Q11.5 1.5 11.5 10L11 21.5Q10.2 26.5 7.5 27Q6.2 27 5.5 24L4.8 28.5Q3.4 30.2 1.6 29.2L1 24.5L0.2 28.5Q-1.6 29.5 -3.4 27.5L-5.5 21.5Q-8 21 -9.5 16L-12.6 10.5Q-13.2 5.2 -9.4 4.2L-5.8 9.2Z"
            fill={skin}
            stroke={INK}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M-6 2L5 2Q8 7 8 15L4 23Q-1 22 -5 16Z"
            fill="rgba(61,48,42,0.09)"
            stroke="none"
          />
          <path
            d="M-4.2 9.5Q0.8 13.2 6.2 11.5M1.2 18.5v5.5M5.2 17.5v6.2"
            fill="none"
            stroke="rgba(61,48,42,0.45)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      </g>
    </g>
  );
};
