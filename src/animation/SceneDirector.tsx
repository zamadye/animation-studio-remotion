import React from 'react';
import {CameraRig} from './CameraRig';
import {SceneStage} from './SceneStage';
import type {ProofShot} from './ShotTimeline';
export const SceneDirector:React.FC<{shot:ProofShot;localFrame:number;children:React.ReactNode}>=({shot,localFrame,children})=><CameraRig shot={shot.camera} frame={localFrame}><SceneStage>{children}</SceneStage></CameraRig>;
