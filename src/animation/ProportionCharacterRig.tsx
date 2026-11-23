import React from 'react';
import { FacialFeatures } from '../components/characters/FacialFeatures';
import {
  buildHeadContour,
  faceFromPose,
  resolveCharacterBiometrics,
  type FaceState,
  type FootwearStyle,
  type HairStyle,
  type HeadContour,
} from './faceRig';
import { ArticulatedArm, type ArmPose, type SleeveStyle } from './ArticulatedArm';
import type { ActingPose } from './clips';
import {
  bodyProportions,
  rigGeometry,
  legGeometry,
  LEG_UPPER,
  LEG_LOWER,
} from '../components/characters/rigGeometry';
import type { CharacterDesign } from '../components/characters/cast';
import { CharacterCostume } from '../components/characters/costumes';

const stroke = '#3d302a';

const Footwear: React.FC<{
  style: FootwearStyle;
  skin: string;
  ankleTone?: string;
}> = ({ style, skin, ankleTone }) => {
  const bareAnkle = ankleTone ?? skin;
  switch (style) {
    case 'boots':
      return (
        <g>
          <path
            d="M126 530h32v14l19 10q9 4 4 12h-59q-9-2-7-10l11-12z"
            fill="#4e3d32"
            strokeWidth="4.2"
          />
          <path
            d="M121 562h57v4.5h-57Z"
            fill="#312721"
            strokeWidth="2.4"
          />
          <path
            d="M148 536h8m-8 5.5h8m-7 5.5h9"
            stroke="#c9b496"
            strokeWidth="2.0"
          />
          <path
            d="M132 553q16-2 32 3"
            fill="none"
            stroke="rgba(255,244,226,0.18)"
            strokeWidth="1.6"
          />
        </g>
      );
    case 'flats':
      return (
        <g>
          <path
            d="M131 540h22v12h-22z"
            fill={bareAnkle}
            strokeWidth="3.2"
          />
          <path
            d="M123 549q11 7 29 4l27 7q7 3 3 8h-61q-8-2-6-9z"
            fill="#29262a"
            strokeWidth="4.0"
          />
          <path d="M123 565h12v3h-12Z" fill="#1d1b1e" strokeWidth="1.8" />
          <path
            d="M150 556q12 2 22 5"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
        </g>
      );
    case 'sneakers':
      return (
        <g>
          <path
            d="M127 540l19-2 12 10 22 7q9 4 4 11h-63q-8-3-6-11z"
            fill="#47666b"
            strokeWidth="4.2"
          />
          <path d="M119 561h63v5.5h-63z" fill="#eee6d3" strokeWidth="2.8" />
          <path d="M143 547l10 8M147 544l9 7" stroke="#ece2ca" strokeWidth="2.2" />
        </g>
      );
    case 'school':
      return (
        <g>
          <path d="M130 526h24v20h-24z" fill="#f3ecdb" strokeWidth="3.4" />
          <path
            d="M124 543h28l22 10q8 4 4 12h-58q-8-3-6-11z"
            fill="#28292c"
            strokeWidth="4.0"
          />
          <path d="M134 548h16" stroke="#c9bfab" strokeWidth="2.2" />
        </g>
      );
    case 'loafers':
    default:
      return (
        <g>
          <path
            d="M126 539h26l14 11 16 6q8 4 4 11h-61q-9-2-7-10z"
            fill="#34383b"
            strokeWidth="4.2"
          />
          <path d="M123 564h58" stroke="#7e8582" strokeWidth="2.4" />
          <path d="M141 549h14" stroke="#6d7172" strokeWidth="2.2" />
        </g>
      );
  }
};

const BackHairLayer: React.FC<{
  style: HairStyle;
  hair: string;
  accent: string;
  headGeo: HeadContour;
  hairSwing: number;
  headTurn: number;
}> = ({ style, hair, accent, headGeo, hairSwing, headTurn }) => {
  const { crownY, cheekY, chinY, halfWidth } = headGeo.landmarks;
  if (style === 'bob') {
    return (
      <path
        d={`M${180 - halfWidth - 6} ${crownY + 34}Q${180 - halfWidth - 13} ${chinY - 4} ${180 - halfWidth + 6} ${chinY + 12}L${180 + halfWidth - 6} ${chinY + 12}Q${180 + halfWidth + 13} ${chinY - 4} ${180 + halfWidth + 6} ${crownY + 34}Z`}
        fill={hair}
        strokeWidth="4.4"
      />
    );
  }
  if (style === 'ponytail') {
    const side = headTurn > 0.2 ? -1 : 1;
    const px = 180 + side * (halfWidth - 4);
    const py = crownY + 26;
    return (
      <g transform={`rotate(${hairSwing * 0.9} ${px} ${py})`}>
        <path
          d={`M${px} ${py}q${side * 34} 6 ${side * 36} 54-14 26-${side * 24} 20-12-30 ${-side * 12} -74Z`}
          fill={hair}
          strokeWidth="4.4"
        />
        <circle cx={px + side * 4} cy={py + 4} r="6.0" fill={accent} strokeWidth="2.8" />
      </g>
    );
  }
  if (style === 'pigtails') {
    return (
      <g>
        {([-1, 1] as const).map((side) => {
          const px = 180 + side * (halfWidth + 2);
          const py = cheekY - 10;
          return (
            <g key={side} transform={`rotate(${hairSwing * 0.8} ${px} ${py})`}>
              <path
                d={`M${px} ${py}q${side * 24} 8 ${side * 20} 44-10 18-${side * 18} 8z`}
                fill={hair}
                strokeWidth="4.2"
              />
              <circle cx={px} cy={py} r="6.0" fill={accent} strokeWidth="2.6" />
            </g>
          );
        })}
      </g>
    );
  }
  if (style === 'bun') {
    const side = headTurn < -0.15 ? -1 : 1;
    return (
      <g>
        <circle
          cx={180 + side * (halfWidth * 0.64) - headTurn * 10}
          cy={chinY - 22}
          r="19"
          fill={hair}
          strokeWidth="4.3"
        />
        <path
          d={`M${180 + side * (halfWidth * 0.52) - headTurn * 10} ${chinY - 31}q10 5 8 16`}
          fill="none"
          stroke="rgba(255,246,228,0.16)"
          strokeWidth="2.0"
        />
      </g>
    );
  }
  if (style === 'low-bun') {
    return (
      <circle
        cx={180 - headTurn * 18 + (headTurn >= 0 ? 40 : -40)}
        cy={chinY - 12}
        r="20"
        fill={hair}
        strokeWidth="4.3"
      />
    );
  }
  return null;
};

const FrontHairLayer: React.FC<{
  style: HairStyle;
  hair: string;
  accent: string;
  headGeo: HeadContour;
  hairSwing: number;
  headTurn: number;
  grayHair: number;
}> = ({ style, hair, accent, headGeo, hairSwing, headTurn, grayHair }) => {
  const { crownY, templeY, cheekY, chinY, halfWidth } = headGeo.landmarks;
  const lx = 180 - halfWidth;
  const rx = 180 + halfWidth;
  const showGray = grayHair > 0.25;

  if (style === 'hijab') {
    return (
      <g>
        {/* Outer hijab hood contour */}
        <path
          d={`M${lx - 5} ${cheekY + 14}Q${lx - 9} ${crownY - 11} 180 ${crownY - 13}Q${rx + 9} ${crownY - 11} ${rx + 5} ${cheekY + 14}L${rx + 7} ${chinY - 6}Q${rx - 18} ${chinY + 10} 180 ${chinY + 10}Q${lx + 18} ${chinY + 10} ${lx - 7} ${chinY - 6}Z`}
          fill="none"
          stroke={stroke}
          strokeWidth="4.8"
        />
        {/* Underscarf & upper crown drape */}
        <path
          d={`M${lx - 4} ${cheekY}Q${lx - 6} ${crownY - 9} 180 ${crownY - 12}Q${rx + 6} ${crownY - 9} ${rx + 4} ${cheekY}Q${180 + halfWidth * 0.65} ${crownY + 30} 180 ${crownY + 30}Q${180 - halfWidth * 0.65} ${crownY + 30} ${lx - 4} ${cheekY}Z`}
          fill={hair}
          strokeWidth="4.4"
        />
        <path
          d={`M${lx + 4} ${templeY - 8}Q180 ${crownY + 26} ${rx - 4} ${templeY - 8}Q180 ${crownY + 33} ${lx + 4} ${templeY - 8}Z`}
          fill="rgba(26,18,14,0.22)"
          stroke="none"
        />
        {/* Face-framing shawl folds & draped shoulder veil */}
        <path
          d={`M${lx - 2} ${cheekY - 2}Q${lx - 6} ${chinY - 20} ${lx + 10} ${chinY}Q${180 - halfWidth * 0.4} ${chinY + 15} 180 ${chinY + 16}Q${180 + halfWidth * 0.4} ${chinY + 15} ${rx - 10} ${chinY}Q${rx + 6} ${chinY - 20} ${rx + 2} ${cheekY - 2}Q${rx - 5} ${chinY - 22} 180 ${chinY + 2}Q${lx + 5} ${chinY - 22} ${lx - 2} ${cheekY - 2}Z`}
          fill={hair}
          strokeWidth="4.0"
        />
        <path
          d={`M136 ${chinY}Q158 ${chinY + 25} 180 ${chinY + 28}Q202 ${chinY + 25} 224 ${chinY}L214 ${chinY + 40 + Math.abs(hairSwing) * 0.5}Q180 ${chinY + 50 + Math.abs(hairSwing) * 0.5} 146 ${chinY + 40 + Math.abs(hairSwing) * 0.5}Z`}
          fill={hair}
          strokeWidth="4.2"
          transform={`rotate(${hairSwing * 0.4} 180 ${chinY})`}
        />
        <path
          d={`M150 ${chinY + 14}q28 16 58 6M156 ${chinY + 26}q24 12 46 3`}
          fill="none"
          stroke="rgba(255,244,228,0.16)"
          strokeWidth="1.8"
        />
      </g>
    );
  }

  if (style === 'cap') {
    return (
      <>
        <path
          d={`M${lx + 2} ${templeY + 14}Q${lx - 2} ${crownY - 9} 180 ${crownY - 11}Q${rx + 2} ${crownY - 9} ${rx - 2} ${templeY + 14}Q180 ${templeY - 4} ${lx + 2} ${templeY + 14}Z`}
          fill={hair}
          strokeWidth="4.6"
        />
        <path
          d={`M${lx + 1} ${templeY + 9}q${halfWidth} -18 ${halfWidth * 2} 0v13q${-halfWidth} -14 ${-halfWidth * 2} 2z`}
          fill={accent}
          strokeWidth="3.6"
        />
      </>
    );
  }

  if (style === 'curly') {
    return (
      <g
        fill={hair}
        strokeWidth="4.2"
        transform={`rotate(${hairSwing * 0.5} 180 ${crownY + 22})`}
      >
        <circle cx={180 - halfWidth * 0.68} cy={crownY + 20} r="22" />
        <circle cx={180 - halfWidth * 0.22} cy={crownY + 3} r="25" />
        <circle cx={180 + halfWidth * 0.28} cy={crownY + 2} r="24" />
        <circle cx={180 + halfWidth * 0.7} cy={crownY + 22} r="21" />
      </g>
    );
  }

  if (style === 'receding') {
    return (
      <g>
        <path
          d={`M${lx + 1} ${templeY + 20}C${lx - 2} ${crownY + 14} ${180 - halfWidth * 0.52} ${crownY - 4} 180 ${crownY - 4}C${180 + halfWidth * 0.52} ${crownY - 4} ${rx + 2} ${crownY + 14} ${rx - 1} ${templeY + 20}L${rx - 8} ${templeY + 18}Q${rx - 10} ${templeY - 4} ${180 + halfWidth * 0.42} ${crownY + 15}Q180 ${crownY + 7} ${180 - halfWidth * 0.42} ${crownY + 15}Q${lx + 10} ${templeY - 4} ${lx + 8} ${templeY + 18}Z`}
          fill={hair}
          strokeWidth="4.0"
        />
        {showGray && (
          <path
            d={`M${lx + 5} ${templeY + 6}v13M${rx - 5} ${templeY + 6}v13`}
            stroke="#c5bdb1"
            strokeWidth="3.0"
          />
        )}
      </g>
    );
  }

  if (style === 'crop') {
    return (
      <g>
        {/* Subtle forehead cast shadow below hair fringe */}
        <path
          d={`M${lx + 10} ${templeY + 6}q${halfWidth * 0.85} -12 ${halfWidth * 1.7} 0`}
          fill="none"
          stroke="rgba(61,48,42,0.16)"
          strokeWidth="4"
        />
        {/* Messy layered short cropped hair with temple wisps */}
        <path
          d={`M${lx + 1} ${templeY + 16}Q${lx - 6} ${crownY + 4} ${lx + 10} ${crownY - 6}l14-10 15 4 17-9 15 6 17-8 13 8Q${rx + 6} ${crownY + 2} ${rx - 1} ${templeY + 16}L${rx - 8} ${templeY + 7}l-13-11-15 9-14-10-16 9-14-8-14 11Z`}
          fill={hair}
          strokeWidth="4.4"
        />
        <path
          d={`M${lx + 18} ${crownY + 10}q${halfWidth * 0.55} -10 ${halfWidth * 1.05} -1`}
          fill="none"
          stroke="rgba(255,246,228,0.15)"
          strokeWidth="2.4"
        />
        <path
          d={`M${lx + 3} ${templeY + 14}l-2 12M${rx - 3} ${templeY + 14}l2 12`}
          fill="none"
          stroke={hair}
          strokeWidth="3.2"
        />
      </g>
    );
  }

  if (style === 'textured') {
    return (
      <g>
        <path
          d={`M${lx + 2} ${templeY + 18}Q${lx - 5} ${crownY - 4} 180 ${crownY - 14}Q${rx + 6} ${crownY - 4} ${rx - 2} ${templeY + 16}Q${rx - 16} ${templeY + 2} ${180 + 18} ${templeY + 12}l-14-13-16 14-16-12-16 14Z`}
          fill={hair}
          strokeWidth="4.5"
        />
        <path
          d={`M${lx + 22} ${crownY + 8}q${halfWidth * 0.5} -11 ${halfWidth * 1.0} 0`}
          fill="none"
          stroke="rgba(255,246,228,0.16)"
          strokeWidth="2.4"
        />
      </g>
    );
  }

  if (style === 'parted') {
    const partX = 180 + (headTurn < 0 ? 18 : -18);
    return (
      <g>
        <path
          d={`M${lx + 1} ${templeY + 18}Q${lx - 4} ${crownY - 8} 180 ${crownY - 11}Q${rx + 4} ${crownY - 8} ${rx - 1} ${templeY + 16}Q${180 + 18} ${crownY + 34} ${partX} ${crownY + 18}Q${180 - 24} ${crownY + 32} ${lx + 1} ${templeY + 18}Z`}
          fill={hair}
          strokeWidth="4.5"
        />
        {showGray && (
          <path
            d={`M${lx + 4} ${templeY + 8}l8 12M${rx - 4} ${templeY + 8}l-8 12`}
            stroke="#c5bdb1"
            strokeWidth="2.8"
          />
        )}
      </g>
    );
  }

  if (style === 'bun') {
    const partX = 180 + headTurn * 8;
    return (
      <g>
        <path
          d={`M${lx + 1} ${templeY + 16}Q${lx - 4} ${crownY - 7} 180 ${crownY - 10}Q${rx + 4} ${crownY - 7} ${rx - 1} ${templeY + 16}Q${180 + 22} ${crownY + 30} ${partX} ${crownY + 19}Q${180 - 22} ${crownY + 30} ${lx + 1} ${templeY + 16}Z`}
          fill={hair}
          strokeWidth="4.4"
        />
        {/* Sleek part gloss arc */}
        <path
          d={`M${lx + 14} ${crownY + 11}q16 -10 34 -7M${rx - 14} ${crownY + 11}q-16 -10 -34 -7`}
          fill="none"
          stroke="rgba(255,246,228,0.18)"
          strokeWidth="2.2"
        />
        {/* Delicate cheek framing wisps */}
        <path
          d={`M${lx + 5} ${templeY + 14}q-6 18 3 32M${rx - 5} ${templeY + 14}q6 18 -3 32`}
          fill="none"
          stroke={hair}
          strokeWidth="2.0"
        />
      </g>
    );
  }

  return (
    <g>
      <path
        d={`M${lx + 1} ${templeY + 18}Q${lx - 5} ${crownY - 8} 180 ${crownY - 11}Q${rx + 5} ${crownY - 8} ${rx - 1} ${templeY + 14}L${rx - 8} ${templeY + 22}Q180 ${crownY + 34} ${lx + 8} ${templeY + 24}Z`}
        fill={hair}
        strokeWidth="4.5"
      />
      <path
        d={`M${lx + 20} ${crownY + 10}q${halfWidth * 0.55} -9 ${halfWidth * 1.1} 0`}
        fill="none"
        stroke="rgba(255,246,228,0.15)"
        strokeWidth="2.2"
      />
      {showGray && (
        <path
          d={`M${lx + 5} ${templeY + 6}q8 10 6 18M${rx - 5} ${templeY + 6}q-8 10-6 18`}
          fill="none"
          stroke="#c5bdb1"
          strokeWidth="2.8"
        />
      )}
    </g>
  );
};

export const ProportionCharacterRig: React.FC<{
  design: CharacterDesign;
  roleLabel: string;
  child?: boolean;
  heightScale?: number;
  embedded?: boolean;
  face?: FaceState;
  pose?: Partial<ActingPose>;
  arms?: { left?: ArmPose; right?: ArmPose };
}> = ({
  design,
  roleLabel,
  child = design.child ?? false,
  heightScale = design.heightScale ?? 1,
  embedded = false,
  face,
  pose = {},
  arms,
}) => {
  const uid = React.useId().replace(/:/g, '');
  const headClipId = `head-clip-${uid}`;
  const torsoClipId = `torso-clip-${uid}`;

  const seated = Math.max(0, Math.min(1, pose.seated ?? 0));
  const headScale = child ? 1.12 : 0.91;
  const skin = design.skin;
  const shirt = design.outfit;
  const { shoulder, waist } = rigGeometry(design);
  const bio = resolveCharacterBiometrics(design);
  const bp = bodyProportions(design);

  const breath = pose.breath ?? 0;
  const shoulderLift = pose.shoulderLift ?? 0;
  const bodyTurn = Math.max(-1, Math.min(1, pose.bodyTurn ?? 0));
  const headTurn = Math.max(-1, Math.min(1, face?.headTurn ?? pose.headTurn ?? 0));
  const hairSwing = pose.hairSwing ?? 0;
  const squash = Math.max(0.8, Math.min(1.25, pose.squash ?? 1));
  const invSqrtSquash = 1 / Math.sqrt(squash);

  const chestExpand = breath * 2.2;
  const shoulderLeft = 180 - shoulder / 2 - chestExpand;
  const shoulderRight = 180 + shoulder / 2 + chestExpand;
  const waistLeft = 180 - waist / 2;
  const waistRight = 180 + waist / 2;
  const hipLeftX = 180 - bp.hipWidth / 2;
  const hipRightX = 180 + bp.hipWidth / 2;

  const armOffset = bodyTurn * 6;
  const farLeft = bodyTurn > 0.15;
  const farRight = bodyTurn < -0.15;

  const sleeveStyle: SleeveStyle =
    design.costume === 'workwear' &&
    design.presentation === 'masculine' &&
    design.name !== 'Raka'
      ? 'rolled'
      : child
        ? 'short'
        : 'long';

  const leftArmEl = (
    <ArticulatedArm
      key="left-arm"
      x={shoulderLeft + 12 + armOffset}
      y={200 + shoulderLift}
      side={-1}
      shirt={shirt}
      skin={skin}
      pose={arms?.left}
      shaded={farLeft}
      thickness={bp.limbThickness}
      handScale={bp.handScale}
      sleeveStyle={sleeveStyle}
    />
  );
  const rightArmEl = (
    <ArticulatedArm
      key="right-arm"
      x={shoulderRight - 12 + armOffset}
      y={200 + shoulderLift}
      side={1}
      shirt={shirt}
      skin={skin}
      pose={arms?.right}
      shaded={farRight}
      thickness={bp.limbThickness}
      handScale={bp.handScale}
      sleeveStyle={sleeveStyle}
    />
  );

  const headGeo = buildHeadContour(bio.face, headTurn);
  const resolvedFace: FaceState = {
    ...(face ?? faceFromPose(pose)),
    headTurn,
    jawDrop: face?.jawDrop ?? pose.jawDrop ?? 0,
  };

  const leftEarScale = headTurn > 0.1 ? 1 : Math.max(0.25, 1 + headTurn * 0.75);
  const rightEarScale = headTurn < -0.1 ? 1 : Math.max(0.25, 1 - headTurn * 0.75);

  const neckHalf = bp.neckWidth / 2;
  const trapLeftX = 180 - neckHalf - 6;
  const trapRightX = 180 + neckHalf + 6;
  const fem = design.presentation === 'feminine';
  const waistNip = fem ? 7 : 3;
  const bellyShift = bp.bellyCurve * (bodyTurn >= 0 ? 1 : -1) * 0.4;
  const torsoPath = `M${trapLeftX} ${177 + shoulderLift * 0.3}L180 181L${trapRightX} ${177 + shoulderLift * 0.3}Q${shoulderRight - 8} ${183 + shoulderLift * 0.35} ${shoulderRight} ${191 + shoulderLift * 0.4}Q${shoulderRight - waistNip} 265 ${waistRight + bp.bellyCurve * 0.5 + bellyShift} 339Q180 ${354 + bp.bellyCurve * 0.4} ${waistLeft - bp.bellyCurve * 0.5 + bellyShift} 339Q${shoulderLeft + waistNip} 265 ${shoulderLeft} ${191 + shoulderLift * 0.4}Q${shoulderLeft + 8} ${183 + shoulderLift * 0.35} ${trapLeftX} ${177 + shoulderLift * 0.3}Z`;

  const scaledChinY = 165 + headScale * (headGeo.landmarks.chinY - 165);
  const neckTopY = Math.min(188 - 31 * bp.neckLength, scaledChinY - 10);

  const isSkirt = design.lowerGarment === 'skirt';
  const isHijabSkirt = isSkirt && design.hairShape === 'hijab';
  const skirtColor = design.lowerGarmentColor ?? '#473c42';
  const stockingTone =
    design.costume === 'service-uniform' ? '#9c8578' : skin;

  const thighTopHalf = 19.5 * bp.limbThickness;
  const thighKneeHalf = 14.5 * bp.limbThickness;
  const calfKneeHalf = 13.5 * bp.limbThickness;
  const calfAnkleHalf = 9.2 * bp.limbThickness;

  return (
    <svg
      viewBox="0 -40 360 660"
      x={embedded ? 0 : undefined}
      y={embedded ? -40 : undefined}
      width={embedded ? 360 : 260}
      height={embedded ? 660 : 448}
      style={{ overflow: 'visible' }}
      role="img"
      aria-label={`${design.name}, ${roleLabel}`}
    >
      <defs>
        <clipPath id={headClipId}>
          <path d={headGeo.path} />
        </clipPath>
        <clipPath id={torsoClipId}>
          <path d={torsoPath} />
        </clipPath>
      </defs>
      {/* @lock-start:body-drawing */}
      <g
        transform={`translate(0 620) scale(1 ${child ? 0.82 * heightScale : heightScale}) translate(0 -620) translate(180 568) scale(${invSqrtSquash} ${squash}) translate(-180 -568)`}
        stroke={stroke}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {([-1, 1] as const).map((side) => {
          const hip = (side < 0 ? pose.hipLeft : pose.hipRight) ?? 0;
          const knee = (side < 0 ? pose.kneeLeft : pose.kneeRight) ?? 0;
          const {
            root: { x },
          } = legGeometry(side, hip, knee, seated);
          const ankle = (side < 0 ? pose.ankleLeft : pose.ankleRight) ?? -hip - knee;
          const pants = design.lowerGarmentColor ?? '#414342';
          const isBackLeg =
            (side < 0 && (seated > 0 || bodyTurn > 0.2)) ||
            (side > 0 && bodyTurn < -0.2);
          const thighFill = isSkirt
            ? skirtColor
            : isBackLeg && seated > 0
              ? '#353b3e'
              : pants;
          const calfFill = isSkirt
            ? isHijabSkirt
              ? '#322d30'
              : stockingTone
            : isBackLeg && seated > 0
              ? '#353b3e'
              : pants;

          const thighPath = `M${x - thighTopHalf} 348Q${x - thighTopHalf - 1} ${350 + LEG_UPPER * 0.45} ${x - thighKneeHalf} ${350 + LEG_UPPER}L${x + thighKneeHalf} ${350 + LEG_UPPER}Q${x + thighTopHalf + 1} ${350 + LEG_UPPER * 0.45} ${x + thighTopHalf} 348Z`;
          const calfPath = `M${x - calfKneeHalf} ${350 + LEG_UPPER - 3}Q${x - calfKneeHalf - 1.5} ${350 + LEG_UPPER + LEG_LOWER * 0.34} ${x - calfAnkleHalf} 546L${x + calfAnkleHalf} 546Q${x + calfKneeHalf + 1.5} ${350 + LEG_UPPER + LEG_LOWER * 0.34} ${x + calfKneeHalf} ${350 + LEG_UPPER - 3}Z`;

          return (
            <g
              key={side}
              data-joint="hip"
              transform={`rotate(${hip} ${x} 350)`}
            >
              <path d={thighPath} fill={thighFill} strokeWidth="4.2" />
              {isBackLeg && (
                <path d={thighPath} fill="rgba(26,22,20,0.16)" stroke="none" />
              )}
              {!isSkirt && (
                <path
                  d={`M${x - thighKneeHalf * 0.55} ${348 + LEG_UPPER}h${thighKneeHalf * 1.1}`}
                  fill="none"
                  stroke="rgba(26,22,20,0.32)"
                  strokeWidth="1.6"
                />
              )}
              <g
                data-joint="knee"
                transform={`rotate(${knee} ${x} ${350 + LEG_UPPER})`}
              >
                <path d={calfPath} fill={calfFill} strokeWidth="4.0" />
                {isBackLeg && (
                  <path d={calfPath} fill="rgba(26,22,20,0.16)" stroke="none" />
                )}
                <circle
                  cx={x}
                  cy={350 + LEG_UPPER}
                  r={calfKneeHalf * 0.92}
                  fill={calfFill}
                  stroke="none"
                />
                <g
                  data-joint="ankle"
                  transform={`rotate(${ankle} ${x} 548) translate(${x - 141} 0)`}
                >
                  <Footwear
                    style={bp.footwear}
                    skin={skin}
                    ankleTone={isSkirt && !isHijabSkirt ? stockingTone : skin}
                  />
                </g>
              </g>
            </g>
          );
        })}

        {/* Sculpted pelvis responding to hipRatio */}
        <path
          data-joint="pelvis"
          d={`M${hipLeftX - 7} 331Q180 324 ${hipRightX + 7} 331L${hipRightX + 9} 361Q180 372 ${hipLeftX - 9} 361Z`}
          fill={design.lowerGarmentColor ?? '#414342'}
          strokeWidth="4.2"
        />
        {!isSkirt && (
          <path
            d={`M180 ${335}v24q-4 4 -8 4`}
            fill="none"
            stroke="rgba(26,22,20,0.35)"
            strokeWidth="1.6"
          />
        )}

        {isSkirt &&
          (() => {
            const left = legGeometry(-1, pose.hipLeft, pose.kneeLeft, seated).knee;
            const right = legGeometry(1, pose.hipRight, pose.kneeRight, seated).knee;
            const dropY = isHijabSkirt ? 82 : 16;
            const skirtPath = `M${hipLeftX - 5} 336L${hipRightX + 5} 336L${right.x + (isHijabSkirt ? 24 : 17)} ${right.y + dropY}Q${(left.x + right.x) / 2} ${(left.y + right.y) / 2 + dropY + 12} ${left.x - (isHijabSkirt ? 24 : 17)} ${left.y + dropY}Z`;
            return (
              <g>
                <path
                  d={skirtPath}
                  fill={skirtColor}
                  strokeWidth="4.4"
                />
                <path
                  d={`M${hipLeftX - 4} 342Q180 347 ${hipRightX + 4} 342`}
                  fill="none"
                  stroke="rgba(26,22,20,0.38)"
                  strokeWidth="1.8"
                />
                <path
                  d={`M${180 - 10} 352q-4 36 -8 ${dropY + 58}M${180 + 12} 352q4 36 8 ${dropY + 58}`}
                  fill="none"
                  stroke="rgba(26,22,20,0.28)"
                  strokeWidth="1.6"
                />
              </g>
            );
          })()}

        <g data-joint="waist" transform={`rotate(${pose.torsoLean ?? 0} 180 350)`}>
          {farLeft && leftArmEl}
          {farRight && rightArmEl}

          <path d={torsoPath} fill={shirt} strokeWidth="4.8" />
          <g clipPath={`url(#${torsoClipId})`} stroke="none">
            <path
              d={
                bodyTurn < -0.15
                  ? `M${shoulderRight - 22} ${182 + shoulderLift * 0.4}L${shoulderRight + 8} ${182 + shoulderLift * 0.4}L${waistRight + bp.bellyCurve * 0.3 + 8} 345L${waistRight - 20} 345Z`
                  : `M${shoulderLeft - 8} ${182 + shoulderLift * 0.4}L${shoulderLeft + 22} ${182 + shoulderLift * 0.4}L${waistLeft + 20} 345L${waistLeft - bp.bellyCurve * 0.3 - 8} 345Z`
              }
              fill="rgba(32,26,22,0.13)"
            />
            <path
              d={
                bodyTurn < -0.15
                  ? `M${shoulderLeft - 4} ${186 + shoulderLift * 0.4}L${shoulderLeft + 10} ${186 + shoulderLift * 0.4}L${waistLeft + 8} 345L${waistLeft - 4} 345Z`
                  : `M${shoulderRight - 10} ${186 + shoulderLift * 0.4}L${shoulderRight + 4} ${186 + shoulderLift * 0.4}L${waistRight + 4} 345L${waistRight - 8} 345Z`
              }
              fill="rgba(255,246,228,0.10)"
            />
          </g>

          <CharacterCostume
            roleLabel={roleLabel}
            design={design}
            bodyTurn={bodyTurn}
          />

          {!farLeft && leftArmEl}
          {!farRight && rightArmEl}

          {/* Anatomical tapered neck with seamless collar join & chin shadow */}
          <path
            d={`M${180 - neckHalf * 0.92} ${neckTopY}L${180 - neckHalf} 187q${neckHalf} 10 ${neckHalf * 2} 0L${180 + neckHalf * 0.92} ${neckTopY}Z`}
            fill={skin}
            stroke="none"
          />
          <path
            d={`M${180 - neckHalf * 0.92} ${neckTopY}L${180 - neckHalf} 184M${180 + neckHalf * 0.92} ${neckTopY}L${180 + neckHalf} 184`}
            fill="none"
            strokeWidth="3.8"
          />
          <path
            d={`M${180 - neckHalf + 2} ${neckTopY + 1}q${neckHalf - 2} 10 ${neckHalf * 2 - 4} 0v10q${-(neckHalf - 2)} 8 ${-(neckHalf * 2 - 4)} 0z`}
            fill="rgba(61,48,42,0.19)"
            stroke="none"
          />
          {/* @lock-end:body-drawing */}

          <g
            data-joint="neck"
            transform={`rotate(${pose.headTilt ?? 0} 180 178) translate(180 165) scale(${headScale}) translate(-180 -165)`}
          >
            <BackHairLayer
              style={design.hairShape}
              hair={design.hair}
              accent={design.accent}
              headGeo={headGeo}
              hairSwing={hairSwing}
              headTurn={headTurn}
            />

            {leftEarScale > 0.3 && (
              <g>
                <ellipse
                  cx={headGeo.landmarks.earLeftX}
                  cy={headGeo.landmarks.earY}
                  rx={6.2 * leftEarScale}
                  ry="10.5"
                  fill={skin}
                  strokeWidth="3.6"
                />
                <path
                  d={`M${headGeo.landmarks.earLeftX - 0.8} ${headGeo.landmarks.earY - 4}q3.2 4 0 8`}
                  fill="none"
                  stroke="#7d5343"
                  strokeWidth="1.6"
                />
              </g>
            )}
            {rightEarScale > 0.3 && (
              <g>
                <ellipse
                  cx={headGeo.landmarks.earRightX}
                  cy={headGeo.landmarks.earY}
                  rx={6.2 * rightEarScale}
                  ry="10.5"
                  fill={skin}
                  strokeWidth="3.6"
                />
                <path
                  d={`M${headGeo.landmarks.earRightX + 0.8} ${headGeo.landmarks.earY - 4}q-3.2 4 0 8`}
                  fill="none"
                  stroke="#7d5343"
                  strokeWidth="1.6"
                />
              </g>
            )}

            {/* Biometric skull contour + clipped 3/4 shade & rim light */}
            <path d={headGeo.path} fill={skin} strokeWidth="4.6" />
            <g clipPath={`url(#${headClipId})`} stroke="none">
              <path d={headGeo.shadePath} fill="rgba(61,48,42,0.12)" />
              <path d={headGeo.highlightPath} fill="rgba(255,244,226,0.14)" />
            </g>

            <FrontHairLayer
              style={design.hairShape}
              hair={design.hair}
              accent={design.accent}
              headGeo={headGeo}
              hairSwing={hairSwing}
              headTurn={headTurn}
              grayHair={bio.face.grayHair ?? 0}
            />

            <FacialFeatures
              face={resolvedFace}
              hair={design.hair}
              biometrics={bio.face}
              skin={skin}
            />

            {design.glasses && (
              <g
                fill="none"
                stroke="#383f42"
                strokeWidth="3.2"
                transform={`translate(${headTurn * 11} 0)`}
              >
                <rect x="136" y="101" width="36" height="29" rx="8" />
                <rect x="189" y="101" width="36" height="29" rx="8" />
                <path d="M172 110h17" />
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
};
