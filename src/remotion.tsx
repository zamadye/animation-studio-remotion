import React from 'react';
import { Composition } from 'remotion';
import episodes from './data/episodes.json';
import type { Episode, AspectRatio } from './data/types';
import { OUTPUTS } from './data/types';
import { StoryFrame } from './components/StoryFrame';
import { Episode01Review } from './episodes/Episode01Review';
import { GajianEpisode } from './episodes/gajian/GajianEpisode';
import { GAJIAN_FPS, GAJIAN_TOTAL_FRAMES } from './episodes/gajian/gajian';
import { PropCameraProof } from './props/PropCameraProof';
import { ProofScene, PROOF_DURATION } from './animation/ProofScene';
import { CharacterVariationSheet } from './animation/CharacterVariationSheet';
import { BaseMaleRigStudy } from './animation/BaseMaleRigStudy';
import { ProportionLineup } from './animation/ProportionLineup';
import { WorldDialogueProof } from './story/examples/WorldDialogueProof';
import { WorldScaleCheck } from './world/WorldScaleCheck';
import { WorldCatalog, WORLD_PAGE_FRAMES } from './world/WorldCatalog';
import { TwoCharacterSyncCheck } from './story/examples/TwoCharacterSyncCheck';
import { FaceExpressionCatalog } from './animation/FaceExpressionCatalog';
import { FACE_DURATION, FACE_FPS } from './animation/faceCatalog';
import { FullRigCatalog } from './animation/FullRigCatalog';
import { CATALOG_DURATION, MOTION_FPS } from './animation/rigMotionCatalog';
import {
  BiometricCastShowcase,
  BIOMETRIC_SHOWCASE_FPS,
  BIOMETRIC_SHOWCASE_FRAMES,
} from './animation/BiometricCastShowcase';
import { CharacterIntegrationCheck } from './animation/CharacterIntegrationCheck';
import { ArmRigStudy } from './animation/ArmRigStudy';

const data = episodes as Episode[];
const ratios: AspectRatio[] = ['vertical', 'square', 'landscape'];

export const RemotionRoot: React.FC = () => (
  <>
    {data.flatMap((episode) =>
      ratios.map((ratio) => {
        const out = OUTPUTS[ratio];
        return (
          <Composition
            key={`${episode.id}-${ratio}`}
            id={`Episode-${episode.id}-${ratio}`}
            component={StoryFrame}
            durationInFrames={90 * 30}
            fps={30}
            width={out.width}
            height={out.height}
            defaultProps={{ episode, ratio, reducedMotion: false }}
          />
        );
      }),
    )}
    <Composition
      id="Proof-01-Opening-Scene"
      component={ProofScene}
      durationInFrames={PROOF_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="Character-Variation-Concepts-1"
      component={CharacterVariationSheet}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ page: 0 }}
    />
    <Composition
      id="Character-Variation-Concepts-2"
      component={CharacterVariationSheet}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ page: 1 }}
    />
    <Composition
      id="Episode01-Complete-Review"
      component={Episode01Review}
      durationInFrames={2160}
      fps={24}
      width={1080}
      height={1920}
      defaultProps={{ portrait: true }}
    />
    <Composition
      id="Episode01-Complete-Landscape"
      component={Episode01Review}
      durationInFrames={2160}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="Gajian-Complete-Review"
      component={GajianEpisode}
      durationInFrames={GAJIAN_TOTAL_FRAMES}
      fps={GAJIAN_FPS}
      width={1080}
      height={1920}
      defaultProps={{ portrait: true }}
    />
    <Composition
      id="Gajian-Complete-Landscape"
      component={GajianEpisode}
      durationInFrames={GAJIAN_TOTAL_FRAMES}
      fps={GAJIAN_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Held-Prop-Camera-Proof"
      component={PropCameraProof}
      durationInFrames={624}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="World-Dialogue-Proof"
      component={WorldDialogueProof}
      durationInFrames={288}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="World-Character-Scale-Check"
      component={WorldScaleCheck}
      durationInFrames={1}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="World-Location-Atlas"
      component={WorldCatalog}
      defaultProps={{ atlas: true }}
      durationInFrames={41}
      fps={1}
      width={1920}
      height={1080}
    />
    <Composition
      id="World-Design-Catalog"
      component={WorldCatalog}
      durationInFrames={WORLD_PAGE_FRAMES * 8}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="Two-Character-Sync-Check"
      component={TwoCharacterSyncCheck}
      durationInFrames={432}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="Face-Expression-Catalog"
      component={FaceExpressionCatalog}
      durationInFrames={FACE_DURATION}
      fps={FACE_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Full-Rig-Catalog"
      component={FullRigCatalog}
      durationInFrames={CATALOG_DURATION}
      fps={MOTION_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Biometric-Cast-Showcase"
      component={BiometricCastShowcase}
      durationInFrames={BIOMETRIC_SHOWCASE_FRAMES}
      fps={BIOMETRIC_SHOWCASE_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Character-Integration-Check"
      component={CharacterIntegrationCheck}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Character-Arm-Rig-1"
      component={ProportionLineup}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ page: 0, rigStudy: true }}
    />
    <Composition
      id="Character-Arm-Rig-2"
      component={ProportionLineup}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ page: 1, rigStudy: true }}
    />
    <Composition
      id="Arm-Rig-Study"
      component={ArmRigStudy}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={800}
    />
    <Composition
      id="Base-Male-Rig-Study"
      component={BaseMaleRigStudy}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="Proportion-Lineup-1"
      component={ProportionLineup}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ page: 0 }}
    />
    <Composition
      id="Proportion-Lineup-2"
      component={ProportionLineup}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ page: 1 }}
    />
  </>
);
