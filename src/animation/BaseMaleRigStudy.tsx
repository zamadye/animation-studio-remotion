import React from 'react';
import {AbsoluteFill} from 'remotion';

/** First proportion-locked male base, built separately before any cast rollout.
 * Reference head height=100; body height=380; 3.8 heads total. */
const Figure:React.FC<{mode?:'color'|'silhouette'|'gray';pose?:'neutral'|'raised'|'step'|'sit'}>=({mode='color',pose='neutral'})=>{
 const shirt='#426d72',outline='#493b35',skin='#a96f50',shade='#34585e',highlight='#70918a';
 const walking=pose==='step',seated=pose==='sit';
 return <g transform={seated?'translate(0 0)':''} style={mode==='silhouette'?{filter:'brightness(0)'}:mode==='gray'?{filter:'grayscale(1)'}:{}} stroke={outline} strokeLinejoin="round" strokeLinecap="round">
  {/* Legs: matched 1:1 thigh/calf lengths, hip-rooted. */}
  {seated?<g>
   <path d="M246 296h42v164h-14V315h-28zM117 354h151v18H117zM128 372v91M255 372v91" fill="#987451" stroke="#76563c" strokeWidth="7"/>
   <path d="M139 354Q177 350 218 376L211 408Q176 418 141 397Z" fill="#414342" strokeWidth="8"/><path d="M190 401Q204 398 212 409L209 477L181 477L183 430Z" fill="#414342" strokeWidth="8"/><circle cx="198" cy="409" r="17" fill="#414342" strokeWidth="6"/><path d="M178 472q-9 7-11 16-1 7 8 9h65q8-3 5-10l-13-15z" fill="#343b3e" strokeWidth="7"/>
   <path d="M182 356Q218 350 258 378L250 410Q222 419 188 397Z" fill="#414342" strokeWidth="8"/><path d="M229 403Q243 400 251 411L246 477L218 477L220 432Z" fill="#414342" strokeWidth="8"/><circle cx="238" cy="411" r="17" fill="#414342" strokeWidth="6"/><path d="M214 472q-9 7-11 16-1 7 8 9h65q8-3 5-10l-13-15z" fill="#343b3e" strokeWidth="7"/>
  </g>:<g>
   <g transform={`rotate(${walking?10:0} 150 360)`}><path d="M150 360L145 457" fill="none" stroke={outline} strokeWidth="47"/><path d="M150 360L145 457" fill="none" stroke="#414342" strokeWidth="37"/><path d="M145 457L140 550" fill="none" stroke={outline} strokeWidth="39"/><path d="M145 457L140 550" fill="none" stroke="#414342" strokeWidth="30"/><path d="M129 475l14 4m-15 8 13 4" fill="none" stroke="#777a76" strokeWidth="3"/><path d="M140 543q-12 8-17 19-2 8 8 10h61q9-4 4-12l-17-17z" fill="#343b3e" strokeWidth="8"/><path d="M133 568h57" fill="none" stroke="#7d8582" strokeWidth="3"/></g>
   <g transform={`rotate(${walking?-8:0} 210 360)`}><path d="M210 360L215 457" fill="none" stroke={outline} strokeWidth="47"/><path d="M210 360L215 457" fill="none" stroke="#414342" strokeWidth="37"/><path d="M215 457L220 550" fill="none" stroke={outline} strokeWidth="39"/><path d="M215 457L220 550" fill="none" stroke="#414342" strokeWidth="30"/><path d="M209 475l14 4m-13 8 13 4" fill="none" stroke="#777a76" strokeWidth="3"/><path d="M220 543q-12 8-17 19-2 8 8 10h61q9-4 4-12l-17-17z" fill="#343b3e" strokeWidth="8"/><path d="M213 568h57" fill="none" stroke="#7d8582" strokeWidth="3"/></g>
  </g>}
  {/* Torso: shoulder width 160 (1.1x head width 145); waist 120 (0.75x shoulder). */}
  <path d="M100 188Q180 168 260 188L274 339Q236 368 180 368Q124 368 86 339Z" fill={shirt} strokeWidth="9"/>
  <g transform={pose==='raised'?'rotate(145 100 195)':''}><path d="M111 197Q98 207 93 238L86 276Q85 291 100 295L116 291L132 235Z" fill={outline} strokeWidth="4"/><path d="M111 198Q99 211 97 238L92 273Q92 283 102 286L113 283L128 232Z" fill={shirt} stroke="none"/>
  {/* Upper arm, elbow, forearm and mitten are separate articulated layers. */}<path d="M96 276L102 334" fill="none" stroke={outline} strokeWidth="34"/><path d="M96 276L102 334" fill="none" stroke={shirt} strokeWidth="25"/><path d="M102 333q-12 1-14 12-1 14 11 18 15 4 22-8l-2-13q-4-9-17-9z" fill={skin} strokeWidth="6"/></g>
  <g transform={walking?'rotate(-8 264 276)':''}><path d="M249 197Q262 207 267 238L274 276Q275 291 260 295L244 291L228 235Z" fill={outline} strokeWidth="4"/><path d="M249 198Q261 211 263 238L268 273Q268 283 258 286L247 283L232 232Z" fill={shirt} stroke="none"/><path d="M264 276L258 334" fill="none" stroke={outline} strokeWidth="34"/><path d="M264 276L258 334" fill="none" stroke={shirt} strokeWidth="25"/><path d="M258 333q12 1 14 12 1 14-11 18-15 4-22-8l2-13q4-9 17-9z" fill={skin} strokeWidth="6"/></g>
  {/* Rounded shoulder pivots preserve overlap when arms rotate. */}
  <circle cx="100" cy="198" r="12" fill={shirt} stroke={outline} strokeWidth="4"/><circle cx="260" cy="198" r="12" fill={shirt} stroke={outline} strokeWidth="4"/>
  {/* Shirt shape, collar, placket and restrained highlights. */}
  <path d="M143 190L180 218L163 240L138 204M217 190L180 218L197 240L222 204" fill={skin} strokeWidth="5"/>
  <path d="M180 218v132" fill="none" stroke="#c28b4b" strokeWidth="5"/><path d="M115 221v98M245 221v98" fill="none" stroke={highlight} strokeWidth="4"/>
  <path d="M123 258h41v48h-41z" fill="#527b7e" strokeWidth="4"/><path d="M128 267h30m-30 7h30" fill="none" stroke="#b9c6b4" strokeWidth="3"/>
  {/* Neck length 15; collar overlaps its base. */}
  <path d="M160 159v31q20 15 40 0v-31z" fill={skin} strokeWidth="6"/>
  {/* Head height exactly 100; slightly broad adult male jaw. */}
  <path d="M180 53Q234 53 239 99Q243 135 218 151Q201 164 180 164Q159 164 142 151Q117 135 121 99Q126 53 180 53Z" fill={skin} strokeWidth="8"/>
  <path d="M121 105Q113 58 164 45Q223 33 242 87L235 102Q214 81 188 82Q155 81 132 108L124 124Z" fill="#292824" strokeWidth="8"/>
  <path d="M139 105q17-9 31-1m20 0q15-8 31 1" fill="none" stroke="#292824" strokeWidth="6"/>
  <ellipse cx="155" cy="117" rx="5" ry="7" fill="#25282a" stroke="none"/><ellipse cx="207" cy="117" rx="5" ry="7" fill="#25282a" stroke="none"/>
  <path d="M180 116q-8 15 1 17M162 139q18 9 36 0" fill="none" stroke="#754b3d" strokeWidth="4"/>
  {/* Compact, unified outer contour rule; shirt interior detail stays lighter. */}
 </g>;
};
export const BaseMaleRigStudy:React.FC=()=>{
 const panels=[{title:'BASE · WARNA',mode:'color' as const,pose:'neutral' as const},{title:'SILUET HITAM',mode:'silhouette' as const,pose:'neutral' as const},{title:'GRAYSCALE',mode:'gray' as const,pose:'neutral' as const},{title:'UJI POSE · ANGKAT / LANGKAH / DUDUK',mode:'color' as const,pose:'step' as const}];
 return <AbsoluteFill style={{background:'#e9dfcc',fontFamily:'Arial,sans-serif',color:'#283138'}}>
  <div style={{position:'absolute',left:42,top:24,fontSize:32,fontWeight:900}}>BASE PRIA · PROPORSI TERKUNCI</div>
  <div style={{position:'absolute',left:44,top:62,fontSize:15,color:'#706452'}}>Target 3,8 kepala · tinggi 380 / kepala 100 · uji awal sebelum variasi cast</div>
  {panels.map((p,i)=>{const left=12+(i%2)*540,top=96+Math.floor(i/2)*900;return <React.Fragment key={p.title}>
   <div style={{position:'absolute',left,top,width:516,height:850,background:'#f2eadc',border:'4px solid #765a42',borderRadius:18,boxSizing:'border-box'}}/>
   <div style={{position:'absolute',left:left+24,top:top+20,fontSize:21,fontWeight:800}}>{p.title}</div>
   {i<3?<svg viewBox="0 0 360 620" width="360" height="620" style={{position:'absolute',left:left+78,top:top+100,transform:'scale(.88)',transformOrigin:'top left'}}><Figure mode={p.mode} pose={p.pose}/></svg>:<svg viewBox="0 0 520 580" width="492" height="580" style={{position:'absolute',left:left+10,top:top+120}}>
    {[{x:5,pose:'raised' as const,label:'TANGAN NAIK'},{x:180,pose:'step' as const,label:'LANGKAH'},{x:355,pose:'sit' as const,label:'DUDUK'}].map((v)=><g key={v.label} transform={`translate(${v.x} 0) scale(.43)`}><Figure mode="color" pose={v.pose}/><text x="180" y="1325" textAnchor="middle" fontSize="35" fontFamily="Arial" fontWeight="bold" fill="#554536">{v.label}</text></g>)}
   </svg>}
   <div style={{position:'absolute',left:left+24,top:top+790,fontSize:14,color:'#706452'}}>Darto · dewasa · detail kerja sederhana</div>
  </React.Fragment>;})}
 </AbsoluteFill>;
};
