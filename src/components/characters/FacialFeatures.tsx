import React from 'react';
import {
  clampFace,
  DEFAULT_FACE_BIOMETRICS,
  faceChannels,
  type FaceBiometrics,
  type FaceState,
} from '../../animation/faceRig';

const r1 = (n: number) => Math.round(n * 10) / 10;

const renderNose = (
  shape: FaceBiometrics['noseShape'],
  cx: number,
  noseDir: number,
  noseY: number,
) => {
  const shade = 'rgba(104,62,46,0.20)';
  const highlight = 'rgba(255,246,232,0.28)';
  const ink = '#6a4437';

  switch (shape) {
    case 'button':
      return (
        <g>
          <path
            d={`M${cx} ${noseY + 5}q${6 * noseDir} 6 ${2 * noseDir} 11q${-5 * noseDir} 1 ${-6 * noseDir} -3Z`}
            fill={shade}
            stroke="none"
          />
          <path
            d={`M${cx - 0.5 * noseDir} ${noseY + 4}l${1.2 * noseDir} 7`}
            fill="none"
            stroke={highlight}
            strokeWidth="1.5"
          />
          <path
            d={`M${cx + noseDir} ${noseY + 7}q${4.5 * noseDir} 7 ${-1.5 * noseDir} 9`}
            fill="none"
            stroke={ink}
            strokeWidth="2.4"
          />
        </g>
      );
    case 'broad':
      return (
        <g>
          <path
            d={`M${cx} ${noseY - 1}l${-5 * noseDir} 17q${6.5 * noseDir} 4.5 ${12 * noseDir} 0l${-4 * noseDir} -16Z`}
            fill={shade}
            stroke="none"
          />
          <path
            d={`M${cx - noseDir} ${noseY + 1}l${-2 * noseDir} 12`}
            fill="none"
            stroke={highlight}
            strokeWidth="1.6"
          />
          <path
            d={`M${cx} ${noseY}q${-3 * noseDir} 12 ${-5 * noseDir} 16q${7 * noseDir} 4 ${12 * noseDir} 0`}
            fill="none"
            stroke={ink}
            strokeWidth="2.7"
          />
          <path
            d={`M${cx - 6} ${noseY + 15}q2-2.8 4.2 0M${cx + 2.5} ${noseY + 15}q2-2.8 4.2 0`}
            fill="none"
            stroke={ink}
            strokeWidth="1.9"
            opacity="0.68"
          />
        </g>
      );
    case 'aquiline':
      return (
        <g>
          <path
            d={`M${cx} ${noseY - 2}l${-5.5 * noseDir} 12q${-1 * noseDir} 6 ${5.5 * noseDir} 7l${2 * noseDir} -18Z`}
            fill={shade}
            stroke="none"
          />
          <path
            d={`M${cx - 0.6 * noseDir} ${noseY}l${-2.5 * noseDir} 11`}
            fill="none"
            stroke={highlight}
            strokeWidth="1.6"
          />
          <path
            d={`M${cx} ${noseY - 2}l${-5 * noseDir} 12q${-2 * noseDir} 5 ${4 * noseDir} 7`}
            fill="none"
            stroke={ink}
            strokeWidth="2.7"
          />
        </g>
      );
    case 'soft':
      return (
        <g>
          <path
            d={`M${cx} ${noseY + 2}q${-5.5 * noseDir} 10 0 14q${3.5 * noseDir} -1 ${3 * noseDir} -7Z`}
            fill={shade}
            stroke="none"
          />
          <path
            d={`M${cx - 0.5 * noseDir} ${noseY + 3}l${-1.2 * noseDir} 10`}
            fill="none"
            stroke={highlight}
            strokeWidth="1.5"
          />
          <path
            d={`M${cx} ${noseY + 3}q${-4.8 * noseDir} 11 ${noseDir} 13`}
            fill="none"
            stroke={ink}
            strokeWidth="2.3"
          />
        </g>
      );
    case 'straight':
    default:
      return (
        <g>
          <path
            d={`M${cx} ${noseY - 1}l${-4 * noseDir} 16q${3.5 * noseDir} 3.2 ${6.5 * noseDir} 1.5l${-1 * noseDir} -17Z`}
            fill={shade}
            stroke="none"
          />
          <path
            d={`M${cx - 0.5 * noseDir} ${noseY + 1}l${-1.2 * noseDir} 12`}
            fill="none"
            stroke={highlight}
            strokeWidth="1.6"
          />
          <path
            d={`M${cx} ${noseY}l${-3 * noseDir} 15q${3 * noseDir} 3 ${5.2 * noseDir} 1.8`}
            fill="none"
            stroke={ink}
            strokeWidth="2.6"
          />
        </g>
      );
  }
};

/** Tapered eyebrow polygon: fuller at inner glabella, tapering toward outer temple. */
const buildBrowPolygon = (
  cx: number,
  browY: number,
  innerY: number,
  outerY: number,
  arch: number,
  sideSign: -1 | 1,
  halfHeight: number,
): string => {
  const innerX = cx - sideSign * 14.5;
  const midX = cx + sideSign * 1.5;
  const outerX = cx + sideSign * 16.5;
  const yi = browY + innerY;
  const ym = browY + arch + (innerY + outerY) * 0.5;
  const yo = browY + outerY;
  const innerTop = yi - halfHeight;
  const innerBot = yi + halfHeight * 0.72;
  const midTop = ym - halfHeight * 0.85;
  const midBot = ym + halfHeight * 0.52;
  const tipHalf = Math.max(0.7, halfHeight * 0.25);

  return [
    `M${r1(innerX)} ${r1(innerTop)}`,
    `Q${r1(midX)} ${r1(midTop)} ${r1(outerX)} ${r1(yo - tipHalf)}`,
    `L${r1(outerX + sideSign * 1.2)} ${r1(yo + tipHalf * 0.5)}`,
    `Q${r1(midX)} ${r1(midBot)} ${r1(innerX)} ${r1(innerBot)}`,
    'Z',
  ].join('');
};

const STUBBLE_FLECKS: readonly [number, number][] = [
  [-24, 1],
  [-18, 5],
  [-11, 8],
  [-4, 10],
  [4, 10],
  [11, 8],
  [18, 5],
  [24, 1],
  [-15, 13],
  [-7, 15],
  [0, 16],
  [7, 15],
  [15, 13],
  [-21, -2],
  [21, -2],
];

/** Face-only geometry with unique biometric features. No body/motion clip access. */
export const FacialFeatures: React.FC<{
  face: FaceState;
  hair: string;
  biometrics?: FaceBiometrics;
  skin?: string;
}> = ({ face, hair, biometrics, skin = '#b98262' }) => {
  const mouthId = `mouth-${React.useId().replace(/:/g, '')}`;
  const bio = biometrics ?? DEFAULT_FACE_BIOMETRICS;
  const c = faceChannels(face);
  const v = face.viseme ?? 'rest';
  const speaking = v !== 'rest';
  const cry = face.emotion === 'crying';
  const headTurn = Math.max(-1, Math.min(1, face.headTurn ?? 0));
  const faceShiftX = headTurn * 9.5;
  const jawDrop = face.jawDrop ?? 0;

  const isChild = bio.ageGroup === 'child';
  const eyeCenterY = isChild ? 119 : 115;
  const eyeHalfSpan = 26 * bio.eyeSpacing * (1 - Math.abs(headTurn) * 0.12);
  const eyeLeftX = 180 - eyeHalfSpan;
  const eyeRightX = 180 + eyeHalfSpan;

  const eyeShapeWidthMul =
    bio.eyeShape === 'almond'
      ? 1.08
      : bio.eyeShape === 'narrow'
        ? 1.12
        : bio.eyeShape === 'wide'
          ? 1.15
          : 0.98;
  const eyeShapeHeightMul =
    bio.eyeShape === 'round'
      ? 1.14
      : bio.eyeShape === 'wide'
        ? 1.24
        : bio.eyeShape === 'narrow'
          ? 0.68
          : bio.eyeShape === 'hooded'
            ? 0.86
            : 0.96;

  const browHalfHeight =
    bio.browStyle === 'bushy'
      ? 4.1
      : bio.browStyle === 'thick'
        ? 3.5
        : bio.browStyle === 'thin'
          ? 1.6
          : bio.browStyle === 'soft'
            ? 2.1
            : bio.browStyle === 'arched'
              ? 2.2
              : 2.7;
  const browArch =
    bio.browStyle === 'arched'
      ? -6.5
      : bio.browStyle === 'soft'
        ? -4
        : bio.browStyle === 'straight'
          ? -1
          : -3;
  const browY = isChild ? 105 : 101;
  const browColor = (bio.grayHair ?? 0) > 0.45 ? '#6d665f' : hair;

  const defaultOpen =
    face.emotion === 'surprised'
      ? 12
      : face.emotion === 'afraid'
        ? 8
        : face.emotion === 'laughing'
          ? 12
          : cry
            ? 8
            : 0;
  const shape = {
    rest: [19, defaultOpen],
    A: [19, 13],
    E: [25, 6],
    O: [10, 13],
    U: [7, 8],
    MBP: [19, 0.3],
    FV: [18, 3],
    L: [17, 9],
  }[v];
  const lipWidthMul =
    bio.lipStyle === 'wide'
      ? 1.14
      : bio.lipStyle === 'thin'
        ? 0.9
        : bio.lipStyle === 'full'
          ? 0.96
          : 1;
  const width = shape[0] * lipWidthMul;
  const opening =
    shape[1] *
    (speaking ? clampFace(face.openness ?? 1) : clampFace(face.intensity ?? 1));
  const smile = c.smile;
  const cy = (isChild ? 142 : 141) + bio.chinLength * 0.25 + jawDrop * 0.35;
  const corner = cy - 3 * smile;
  const upper = cy - opening * 0.45;
  const lower = cy + opening * 0.85 + smile * 3;
  const mouth = `M${180 - width} ${corner}Q180 ${upper} ${180 + width} ${corner}Q180 ${lower} ${180 - width} ${corner}Z`;

  const eyeRy = Math.max(0.2, 7 * c.eye * bio.eyeScale * eyeShapeHeightMul);
  const narrow = c.eye < 0.2;
  const noseDir = headTurn < -0.15 ? 1 : -1;
  const noseX = 180 + headTurn * 3;
  const noseY = isChild ? 117 : 114;

  const hairTone = (bio.grayHair ?? 0) > 0.4 ? '#6e6760' : hair;
  const lipLineColor = bio.lipColor ?? '#6d4438';
  const lipThickness =
    bio.lipStyle === 'full' ? 2.9 : bio.lipStyle === 'thin' ? 2.1 : 2.5;
  const lipShade = bio.lipColor ?? '#bd7064';

  return (
    <g
      data-rig="face-v1"
      data-emotion={face.emotion}
      data-face-shape={bio.faceShape}
      strokeLinecap="round"
      strokeLinejoin="round"
      transform={`translate(${faceShiftX} 0)`}
    >
      {/* Cheek blush */}
      <g opacity={c.blush} fill="#bc6659" stroke="none">
        <ellipse cx={eyeLeftX - 10} cy={eyeCenterY + 17} rx="12" ry="6" />
        <ellipse cx={eyeRightX + 10} cy={eyeCenterY + 17} rx="12" ry="6" />
      </g>

      {/* Age lines: forehead & nasolabial */}
      {bio.wrinkles >= 0.42 && (
        <g
          fill="none"
          stroke="#6b4a3d"
          strokeWidth="1.4"
          opacity={(bio.wrinkles - 0.3) * 0.46}
        >
          <path d="M159 84q21-3.5 42 0" />
          {bio.wrinkles >= 0.68 && <path d="M165 90q15-2.5 30 0" />}
        </g>
      )}
      {bio.wrinkles >= 0.25 && (
        <g
          fill="none"
          stroke="#6b4a3d"
          strokeWidth="1.5"
          opacity={bio.wrinkles * 0.36}
        >
          <path d={`M160 ${noseY + 18}q-7 11-7 21`} />
          <path d={`M200 ${noseY + 18}q7 11 7 21`} />
        </g>
      )}

      {/* Freckles / moles */}
      {bio.frecklesOrMoles === 'freckles' && (
        <g fill="#8c5942" stroke="none" opacity="0.55">
          {[
            [144, 129],
            [151, 132],
            [147, 135],
            [216, 129],
            [209, 132],
            [213, 135],
          ].map(([fx, fy], idx) => (
            <circle key={idx} cx={fx} cy={fy} r="1.4" />
          ))}
        </g>
      )}
      {bio.frecklesOrMoles === 'mole-left' && (
        <circle cx="152" cy="137" r="2.0" fill="#4f352b" stroke="none" />
      )}
      {bio.frecklesOrMoles === 'mole-right' && (
        <circle cx="209" cy="136" r="2.0" fill="#4f352b" stroke="none" />
      )}

      {/* Tapered sculpted eyebrows */}
      <g>
        <path
          d={buildBrowPolygon(
            eyeLeftX,
            browY,
            c.inner,
            c.outer,
            browArch,
            -1,
            browHalfHeight,
          )}
          fill={browColor}
          stroke="#2d231e"
          strokeWidth="0.9"
        />
        <path
          d={buildBrowPolygon(
            eyeRightX,
            browY,
            c.inner,
            c.outer,
            browArch,
            1,
            browHalfHeight,
          )}
          fill={browColor}
          stroke="#2d231e"
          strokeWidth="0.9"
        />
        {bio.browStyle === 'bushy' && (bio.grayHair ?? 0) > 0.3 && (
          <path
            d={`M${eyeLeftX - 10} ${browY + c.outer - 1}l9-1M${eyeRightX + 1} ${browY + c.inner - 1}l9 1`}
            fill="none"
            stroke="#c9c0b2"
            strokeWidth="1.8"
            opacity="0.7"
          />
        )}
      </g>

      {/* Eyes with upper crease, ivory sclera, lid shadow, chestnut iris, pupil & lash line */}
      <g transform={`translate(${face.gazeX ?? 0} ${face.gazeY ?? 0})`}>
        {([eyeLeftX, eyeRightX] as const).map((x, i) => {
          const farFactor =
            (i === 0 && headTurn < 0) || (i === 1 && headTurn > 0)
              ? 1 - Math.abs(headTurn) * 0.22
              : 1 - Math.abs(headTurn) * 0.05;
          const pupilRx =
            (face.emotion === 'afraid' ? 4.1 : 5.1) *
            bio.eyeScale *
            (bio.eyeShape === 'wide' ? 1.1 : 1) *
            farFactor;
          const scleraRx =
            (face.emotion === 'afraid' || face.emotion === 'surprised'
              ? 10.5
              : 9.0) *
            bio.eyeScale *
            eyeShapeWidthMul *
            farFactor;
          const scleraRy =
            face.emotion === 'afraid' || face.emotion === 'surprised'
              ? eyeRy + 2.8
              : Math.max(2.6, eyeRy + 1.5);
          const sideSign = i === 0 ? -1 : 1;
          const irisRy = Math.min(scleraRy * 0.94, eyeRy * 1.04);

          return narrow ? (
            <path
              key={x}
              d={
                face.emotion === 'laughing'
                  ? `M${x - 8} ${eyeCenterY + 1}q8-9 16 0`
                  : cry
                    ? `M${x - 8} ${eyeCenterY - 1}l8 4 8-4`
                    : `M${x - 7} ${eyeCenterY}h14`
              }
              fill="none"
              stroke="#29201c"
              strokeWidth="3.2"
            />
          ) : (
            <g key={x}>
              {/* Upper-eyelid crease */}
              <path
                d={`M${r1(x - scleraRx * 0.86)} ${r1(eyeCenterY - scleraRy - 2.4)}Q${r1(x)} ${r1(eyeCenterY - scleraRy - 5.0)} ${r1(x + scleraRx * 0.86)} ${r1(eyeCenterY - scleraRy - 2.2)}`}
                fill="none"
                stroke="#6b483a"
                strokeWidth="1.3"
                opacity="0.52"
              />
              {/* Ivory sclera */}
              <ellipse
                cx={x}
                cy={eyeCenterY}
                rx={scleraRx}
                ry={scleraRy}
                fill="#f8f2e4"
                stroke="#4a3931"
                strokeWidth={
                  face.emotion === 'afraid' || face.emotion === 'surprised'
                    ? 1.7
                    : 1.05
                }
              />
              {/* Warm chestnut iris + darker pupil core */}
              <ellipse
                cx={x}
                cy={eyeCenterY}
                rx={pupilRx * 1.12}
                ry={irisRy}
                fill="#432c21"
                stroke="none"
              />
              <ellipse
                cx={x}
                cy={eyeCenterY}
                rx={pupilRx * 0.62}
                ry={irisRy * 0.62}
                fill="#1a1514"
                stroke="none"
              />
              {/* Upper-lid shadow crescent inside top of sclera */}
              <path
                d={`M${r1(x - scleraRx * 0.95)} ${r1(eyeCenterY - scleraRy * 0.16)}A${r1(scleraRx)} ${r1(scleraRy)} 0 0 1 ${r1(x + scleraRx * 0.95)} ${r1(eyeCenterY - scleraRy * 0.16)}Q${r1(x)} ${r1(eyeCenterY - scleraRy * 0.54)} ${r1(x - scleraRx * 0.95)} ${r1(eyeCenterY - scleraRy * 0.16)}Z`}
                fill="rgba(68,49,40,0.20)"
                stroke="none"
              />
              {c.eye > 0.45 && (
                <>
                  <circle
                    cx={x + 1.6 * farFactor}
                    cy={eyeCenterY - 2.6 - Math.max(0, c.eye - 1) * 2.2}
                    r={isChild ? 1.9 : 1.45}
                    fill="#fffaf0"
                    stroke="none"
                  />
                  <circle
                    cx={x - 1.3 * farFactor}
                    cy={eyeCenterY + 2.1}
                    r="0.8"
                    fill="#fffaf0"
                    opacity="0.72"
                    stroke="none"
                  />
                </>
              )}
              {(bio.eyeShape === 'hooded' ||
                face.emotion === 'tired' ||
                face.emotion === 'suspicious') && (
                <path
                  d={`M${r1(x - scleraRx)} ${r1(eyeCenterY - scleraRy * 0.42)}Q${r1(x)} ${r1(eyeCenterY - scleraRy * 0.08)} ${r1(x + scleraRx)} ${r1(eyeCenterY - scleraRy * 0.42)}`}
                  fill={skin}
                  opacity={bio.eyeShape === 'hooded' ? 0.56 : 0.36}
                  stroke="#5b493f"
                  strokeWidth="1.8"
                />
              )}
              {/* Sculpted upper lash-line arc & lower lash accent */}
              <path
                d={`M${r1(x - scleraRx * 1.04)} ${r1(eyeCenterY - scleraRy * 0.08)}A${r1(scleraRx * 1.04)} ${r1(scleraRy * 1.04)} 0 0 1 ${r1(x + scleraRx * 1.04)} ${r1(eyeCenterY - scleraRy * 0.08)}`}
                fill="none"
                stroke="#29201c"
                strokeWidth={bio.eyelashes ? 3.1 : 2.5}
              />
              <path
                d={`M${r1(x - scleraRx * 0.65)} ${r1(eyeCenterY + scleraRy * 0.96)}Q${r1(x)} ${r1(eyeCenterY + scleraRy * 1.06)} ${r1(x + scleraRx * 0.65)} ${r1(eyeCenterY + scleraRy * 0.96)}`}
                fill="none"
                stroke="#4a3931"
                strokeWidth="1.0"
                opacity="0.35"
              />
              {bio.eyelashes && (
                <path
                  d={`M${r1(x + sideSign * (scleraRx - 0.5))} ${r1(eyeCenterY - scleraRy * 0.25)}q${sideSign * 4.5} -2.8 ${sideSign * 6.5} -5M${r1(x + sideSign * (scleraRx - 2))} ${r1(eyeCenterY + 0.8)}q${sideSign * 3.8} -1 ${sideSign * 5.2} -2.8`}
                  fill="none"
                  stroke="#29201c"
                  strokeWidth="1.9"
                />
              )}
              {(bio.eyeBags ?? 0) > 0.1 && (
                <path
                  d={`M${r1(x - scleraRx * 0.72)} ${r1(eyeCenterY + scleraRy + 3)}q${r1(scleraRx * 0.72)} 3.2 ${r1(scleraRx * 1.44)} 0`}
                  fill="none"
                  stroke="#6d4b3f"
                  strokeWidth="1.5"
                  opacity={(bio.eyeBags ?? 0) * 0.45}
                />
              )}
              {bio.wrinkles >= 0.58 && (
                <path
                  d={`M${r1(x + sideSign * (scleraRx + 2))} ${eyeCenterY}l${sideSign * 5} -2m${-sideSign * 5} 3l${sideSign * 5} 2`}
                  fill="none"
                  stroke="#6b4a3d"
                  strokeWidth="1.3"
                  opacity={(bio.wrinkles - 0.4) * 0.52}
                />
              )}
              {face.emotion === 'angry' && (
                <path
                  d={
                    i === 0
                      ? `M${x - 9} ${eyeCenterY - 6}l17 4`
                      : `M${x - 8} ${eyeCenterY - 2}l17-4`
                  }
                  stroke="#3d302a"
                  strokeWidth="2.6"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* Sculpted Nose */}
      {renderNose(bio.noseShape, noseX, noseDir, noseY)}

      {/* Facial hair: stubble / beard behind mouth or mustache */}
      {bio.facialHair === 'stubble' && (
        <g stroke="none">
          <path
            d={`M${180 - 33 * Math.min(1.02, bio.jawWidth)} ${cy - 4}Q180 ${cy + 27 + bio.chinLength * 0.6} ${180 + 33 * Math.min(1.02, bio.jawWidth)} ${cy - 4}Q180 ${cy + 14} ${180 - 33 * Math.min(1.02, bio.jawWidth)} ${cy - 4}Z`}
            fill="#2d2623"
            opacity="0.16"
          />
          <g fill="#2b221e" opacity="0.26">
            {STUBBLE_FLECKS.map(([dx, dy], idx) => (
              <circle
                key={idx}
                cx={180 + dx * Math.min(1, bio.jawWidth)}
                cy={cy + dy + bio.chinLength * 0.25}
                r="0.85"
              />
            ))}
          </g>
        </g>
      )}
      {bio.facialHair === 'short-beard' && (
        <path
          d={`M${180 - 42 * bio.jawWidth} ${cy - 10}Q${180 - 34 * bio.jawWidth} ${cy + 25 + bio.chinLength} 180 ${cy + 27 + bio.chinLength}Q${180 + 34 * bio.jawWidth} ${cy + 25 + bio.chinLength} ${180 + 42 * bio.jawWidth} ${cy - 10}L${180 + 30 * bio.jawWidth} ${cy + 5}Q180 ${cy + 16} ${180 - 30 * bio.jawWidth} ${cy + 5}Z`}
          fill={hairTone}
          stroke="#3d302a"
          strokeWidth="2.3"
        />
      )}
      {bio.facialHair === 'goatee' && (
        <path
          d={`M169 ${cy + 7}Q180 ${cy + 24 + bio.chinLength * 0.5} 191 ${cy + 7}Q180 ${cy + 13} 169 ${cy + 7}Z`}
          fill={hairTone}
          stroke="#3d302a"
          strokeWidth="2.0"
        />
      )}

      {/* Expressive lips & mouth */}
      {opening < 0.7 ? (
        <g>
          {/* Subtle upper Cupid's bow & lower-lip tint */}
          <path
            d={`M${180 - width * 0.78} ${cy}Q${180 - width * 0.28} ${cy - 4.2} 180 ${cy - 2.2}Q${180 + width * 0.28} ${cy - 4.2} ${180 + width * 0.78} ${cy}Q180 ${cy + smile * 7} ${180 - width * 0.78} ${cy}Z`}
            fill={lipShade}
            opacity="0.32"
            stroke="none"
          />
          <path
            d={`M${180 - width * 0.76} ${cy}Q180 ${cy + (bio.lipStyle === 'full' ? 6.5 : 4.5) + smile * 6.5} ${180 + width * 0.76} ${cy}`}
            fill={lipShade}
            opacity={bio.lipStyle === 'full' ? 0.56 : 0.36}
            stroke="none"
          />
          <path
            d={`M${180 - width} ${cy}Q180 ${cy + smile * 10} ${180 + width} ${cy}`}
            fill="none"
            stroke={lipLineColor}
            strokeWidth={lipThickness}
          />
        </g>
      ) : (
        <>
          <defs>
            <clipPath id={mouthId}>
              <path d={mouth} />
            </clipPath>
          </defs>
          <path
            d={mouth}
            fill="#57332f"
            stroke={lipLineColor}
            strokeWidth={lipThickness}
          />
          <g clipPath={`url(#${mouthId})`} stroke="none">
            {(v === 'E' ||
              v === 'FV' ||
              face.emotion === 'laughing' ||
              face.emotion === 'angry') && (
              <path
                d={`M150 ${cy - 5}h60v${v === 'FV' ? 8 : 6}h-60Z`}
                fill="#f5e7ce"
              />
            )}
            {(v === 'A' ||
              v === 'L' ||
              cry ||
              face.emotion === 'laughing') && (
              <ellipse
                cx="180"
                cy={v === 'L' ? cy + 2 : lower + 1}
                rx={v === 'L' ? 7 : 12}
                ry="5"
                fill="#ca8077"
              />
            )}
          </g>
        </>
      )}

      {(bio.facialHair === 'mustache' || bio.facialHair === 'short-beard') && (
        <path
          d={`M180 ${cy - 8}q-10-4-19 2 8 4 19 1 11 3 19-1-9-6-19-2Z`}
          fill={hairTone}
          stroke="#3d302a"
          strokeWidth="2.1"
        />
      )}

      {/* Subtle under-lip chin shadow */}
      <path
        d={`M172 ${cy + 12.5 + opening * 0.14 + jawDrop * 0.2}q8 3.2 16 0`}
        fill="none"
        stroke="rgba(104,62,46,0.34)"
        strokeWidth="1.9"
      />

      {c.tears > 0 && (
        <g opacity={c.tears} stroke="#5e98a7" strokeWidth="1.6" fill="#a4d5dc">
          {[eyeLeftX - 5, eyeRightX + 5].map((x, i) => {
            const t = ((face.tearPhase ?? 0) + i * 0.33) % 1;
            const y = eyeCenterY + 8 + t * 24;
            return (
              <g key={x}>
                <path
                  d={`M${x} ${eyeCenterY + 6}q${i ? -3 : 3} 12 0 27`}
                  fill="none"
                  strokeWidth="3.5"
                  opacity="0.75"
                />
                <path d={`M${x} ${y - 5}q-6 7-4 10 4 5 8 0 2-3-4-10Z`} />
              </g>
            );
          })}
        </g>
      )}

      {face.emotion === 'afraid' && (
        <path
          d="M228 101q-7 10-3 13 5 4 8-1 2-3-5-12Z"
          fill="#b1d5d5"
          stroke="#6496a0"
          strokeWidth="1.5"
          opacity={clampFace(face.intensity ?? 1)}
        />
      )}
    </g>
  );
};
