import React from 'react';
import {AbsoluteFill} from 'remotion';
import {WorldStage} from './WorldStage';
import {StoryScene} from '../story/StoryScene';
import {twoCharacterSync} from '../story/examples/twoCharacterSync';
/** Composition is a single frame: approved characters in the new world,
 * no new body animation or changes to the locked rig. */
export const WorldScaleCheck:React.FC=()=> <AbsoluteFill>
 <WorldStage episodeId="01" location="Kantor pelayanan"><StoryScene scene={twoCharacterSync} floorY={900} audio={false}/></WorldStage>
 <div style={{position:'absolute',left:30,top:20,padding:'12px 20px',background:'#f2eadce8',border:'2px solid #b4a181',fontFamily:'Arial',color:'#283138',borderRadius:8}}><b style={{fontSize:27}}>UJI SKALA WORLD + KARAKTER</b><div style={{fontSize:18,marginTop:6}}>Darto + Petugas · occlusion meja depan · draft, belum kontak dokumen</div></div>
 </AbsoluteFill>;
