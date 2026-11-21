import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import episodesData from './data/episodes.json';
import type {Episode, AspectRatio} from './data/types';
import {OUTPUTS} from './data/types';
import {StoryFrame, getShotAtFrame} from './components/StoryFrame';
import './studio.css';

const episodes=episodesData as Episode[];
const Studio=()=>{
 const [id,setId]=useState(episodes[0].id); const [ratio,setRatio]=useState<AspectRatio>('vertical'); const [frame,setFrame]=useState(0); const [reducedMotion,setReducedMotion]=useState(false);
 const episode=episodes.find((e)=>e.id===id)!; const output=OUTPUTS[ratio]; const shot=getShotAtFrame(episode,frame); const playerRef=useRef<PlayerRef>(null);
 useEffect(()=>{const player=playerRef.current;if(!player)return;let lastSecond=-1;const update=({detail}:{detail:{frame:number}})=>{const second=Math.floor(detail.frame/30);if(second!==lastSecond){lastSecond=second;setFrame(detail.frame)}};player.addEventListener('frameupdate',update);return()=>player.removeEventListener('frameupdate',update)},[id,ratio]);
 const duration=90*30; const playerStyle=useMemo(()=>({width:'100%',maxHeight:'min(72vh,880px)',aspectRatio:`${output.width}/${output.height}`}),[output]);
 return <main className="studio-shell"><header className="topbar"><div className="brand"><div className="brand-mark">S</div><div><b>STUDIO SATIR</b><small>ANIMATION FRAMEWORK · v0.1</small></div></div><div className="status"><span className="dot"/> EDITABLE STORY SYSTEM <span className="divider">/</span> REMOTION</div></header>
 <section className="workspace"><aside className="sidebar"><div className="eyebrow">SERIES · 08 EPISODES</div><h1>Ruang cerita<br/>yang bergerak.</h1><p className="muted">Pilih naskah untuk melihat animatic kartun berbasis storyboard dengan rig vektor, properti, dan komposisi adegan yang bisa direframe.</p><div className="episode-list">{episodes.map(e=><button key={e.id} className={`episode ${id===e.id?'active':''}`} onClick={()=>{setId(e.id);setFrame(0)}}><span className="episode-num">{e.id}</span><span className="episode-title">{e.title}</span><span className="arrow">↗</span></button>)}</div><div className="sidebar-foot">CATATAN · semua cerita fiksi satir<br/><a href="/assets/character-sheets.svg" target="_blank" rel="noreferrer">BUKA CHARACTER SHEET ↗</a><br/>VO / musik / SFX final belum tersedia.</div></aside>
 <section className="stage"><div className="stage-head"><div><div className="eyebrow">PREVIEW / EPISODE {episode.id}</div><h2>{episode.title}</h2></div><div className="stage-actions"><label className="motion-toggle"><input type="checkbox" checked={reducedMotion} onChange={(e)=>setReducedMotion(e.target.checked)}/> Reduced motion</label><div className="ratio-controls">{(['vertical','square','landscape'] as AspectRatio[]).map(r=><button key={r} className={ratio===r?'selected':''} onClick={()=>{setRatio(r);setFrame(0)}}>{OUTPUTS[r].label}</button>)}</div></div></div>
 <div className="preview-wrap"><div className="preview"><Player key={`${id}-${ratio}`} ref={playerRef} component={StoryFrame} inputProps={{episode,ratio,reducedMotion}} durationInFrames={duration} compositionWidth={output.width} compositionHeight={output.height} fps={30} initialFrame={frame} style={playerStyle} controls clickToPlay acknowledgeRemotionLicense/></div></div>
 <div className="timeline-head"><span>SHOT {String(shot.number).padStart(2,'0')} / 06 · {shot.location}</span><span>{shot.start} — {shot.end} · 30 FPS</span></div><div className="timeline">{episode.shots.map(s=><button title={`${s.start} ${s.location}`} key={s.id} className={`timeline-shot ${s.id===shot.id?'current':''}`} style={{flex:s.endSeconds-s.startSeconds}} onClick={()=>{const f=s.startSeconds*30;setFrame(f);playerRef.current?.seekTo(f)}}><b>{String(s.number).padStart(2,'0')}</b><small>{s.location}</small></button>)}</div>
 <div className="metadata"><article><div className="eyebrow">PREMIS</div><p>{episode.premise}</p></article><article><div className="eyebrow">ADEGAN AKTIF</div><p>{shot.objective}</p></article><article><div className="eyebrow">MOTION NOTE</div><p>{shot.animation}</p></article></div>
 <div className="disclaimer">ANIMATIC / BUKAN HASIL PRODUKSI FINAL <span>Konten visual merupakan interpretasi grafis baru dari naskah.</span></div></section></section></main>
};

createRoot(document.getElementById('root')!).render(<Studio/>);
