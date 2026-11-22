import React from 'react';
import {SceneStage} from './SceneStage';
export const SceneGraph:React.FC<{children:React.ReactNode;foreground?:React.ReactNode;debug?:boolean}>=({children,foreground,debug=false})=><SceneStage debug={debug} foreground={foreground}>{children}</SceneStage>;
