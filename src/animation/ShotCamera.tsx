import React from 'react';
import {CameraRig, type CameraShot} from './CameraRig';
export const ShotCamera:React.FC<{shot:CameraShot;frame:number;children:React.ReactNode}>=({shot,frame,children})=><CameraRig shot={shot} frame={frame}>{children}</CameraRig>;
