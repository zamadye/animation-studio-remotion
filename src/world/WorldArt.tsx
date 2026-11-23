import React from 'react';
import type {WorldLocation} from './registry';
const ink='#665346';
const Sign:React.FC<{x:number;y:number;w:number;text:string;color?:string}>=({x,y,w,text,color='#496b67'})=><g><rect x={x} y={y} width={w} height="64" rx="7" fill={color}/><text x={x+w/2} y={y+42} fill="#f5ead1" stroke="none" fontFamily="Arial" fontWeight="700" fontSize="25" textAnchor="middle" letterSpacing="3">{text}</text></g>;
const Window:React.FC<{x:number;y:number;w?:number;h?:number;night?:boolean}>=({x,y,w=280,h=300,night=false})=><g><rect x={x-10} y={y-10} width={w+20} height={h+20} fill="#c1ac8d"/><rect x={x} y={y} width={w} height={h} fill={night?'#536675':'#b4c9bd'}/><path d={`M${x} ${y+h*.8}q${w*.25}-${h*.3} ${w*.5} 0t${w*.5} 0`} fill="#849c89" stroke="none"/><path d={`M${x+w/2} ${y}v${h}M${x} ${y+h/2}h${w}`} fill="none" strokeWidth="9"/><path d={`M${x+20} ${y+20}l${w*.35} 0-${w*.35} ${h*.6}Z`} fill="#eee8d1" opacity=".25" stroke="none"/><rect x={x-20} y={y+h} width={w+40} height="14" fill="#917b5f"/></g>;
const Plant:React.FC<{x:number;y:number;s?:number}>=({x,y,s=1})=><g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 10v-150m0 100q-90-5-94-66 65-10 94 66m0-43q80-10 85-73-65-12-85 73m0 49q65 20 96-22-58-39-96 22" fill="#637c5a" stroke="#4e6651" strokeWidth="6"/><path d="M-62 0H62L47 105H-45Z" fill="#b97859"/><path d="M-53 20h106" fill="none" stroke="#d39a70" strokeWidth="5"/></g>;
const Door:React.FC<{x:number;y:number;label?:string}>=({x,y,label='RUANG STAF'})=><g><rect x={x-12} y={y-12} width="228" height="512" fill="#8c765b"/><rect x={x} y={y} width="204" height="500" fill="#a89b7f"/><rect x={x+22} y={y+35} width="160" height="175" fill="#acbfb2"/><path d={`M${x+164} ${y+270}h22`} stroke="#5a655c" strokeWidth="10"/><rect x={x+18} y={y+234} width="168" height="40" fill="#e4d9bc"/><text x={x+102} y={y+260} textAnchor="middle" fontSize="17" stroke="none" fill={ink} fontFamily="Arial">{label}</text></g>;
const Clock:React.FC<{x:number;y:number}>=({x,y})=><g><circle cx={x} cy={y} r="43" fill="#f2e8cf" strokeWidth="7"/><path d={`M${x} ${y-28}v28l21 11`} fill="none" strokeWidth="5"/>{[0,1,2,3].map(i=><path key={i} transform={`rotate(${i*90} ${x} ${y})`} d={`M${x} ${y-34}v7`} strokeWidth="3"/>)}</g>;
const Shelf:React.FC<{x:number;y:number;shop?:boolean}>=({x,y,shop=false})=><g><rect x={x} y={y} width="330" height="390" fill={shop?'#c6bba1':'#9c896b'}/>{[0,1,2].map(r=><g key={r}>{Array.from({length:shop?7:4},(_,c)=><g key={c} transform={`translate(${x+18+c*(shop?43:75)} ${y+24+r*119})`}><rect width={shop?31:62} height={shop?73:84} rx={shop?5:1} fill={['#8b6658','#6f8a78','#c6a15b','#7c8b91'][(c+r)%4]} strokeWidth="2"/><rect x="5" y="25" width={shop?21:51} height="25" fill="#e3d7b6" stroke="none"/>{!shop&&<path d="M10 12h38m-38 7h25" stroke="#d7caab" strokeWidth="3"/>}</g>)}<path d={`M${x} ${y+119+r*119}h330`} strokeWidth="12"/></g>)}</g>;
const Desk:React.FC<{x:number;y:number;cashier?:boolean}>=({x,y,cashier=false})=><g><ellipse cx={x+215} cy={y+225} rx="270" ry="23" fill="#4c4336" opacity=".12" stroke="none"/><rect x={x+12} y={y+8} width="418" height="205" fill={cashier?'#617a70':'#a58965'}/><rect x={x} y={y} width="445" height="24" rx="4" fill="#725a43"/><path d={`M${x+35} ${y+65}h358M${x+35} ${y+130}h358`} stroke="#8d7357" strokeWidth="3"/><rect x={x+275} y={y-113} width="130" height="95" rx="5" fill="#455653"/><rect x={x+284} y={y-103} width="112" height="75" fill="#9fb5a9"/><path d={`M${x+338} ${y-18}v17m-24 0h48`} strokeWidth="8"/><path d={`M${x+35} ${y-6}l14-40h92l12 40Z`} fill="#e5d9b9"/>{cashier?<><rect x={x+170} y={y-38} width="55" height="36" fill="#886c57"/><path d={`M${x+195} ${y-38}v-35h28`} fill="none" strokeWidth="8"/></>:<><rect x={x+174} y={y-35} width="43" height="31" fill="#9a5343"/><path d={`M${x+186} ${y-35}v-20h17v20`} fill="#ae9670"/></>}</g>;
const Buildings:React.FC<{night:boolean}>=({night})=><g>{[0,1,2,3,4,5].map(i=><g key={i}><path d={`M${i*360-50} 620V${300+i%3*48}h340v${320-i%3*48}`} fill={['#b4bca5','#baab8d','#a0b5ad'][i%3]}/><path d={`M${i*360-60} ${300+i%3*48}l170-95 180 95Z`} fill={i%2?'#90745d':'#a48160'}/>{[0,1,2].map(j=><rect key={j} x={i*360+j*94-10} y={350+i%3*48} width="55" height="96" fill={night?'#d8ba79':'#6d8b83'}/>)}</g>)}</g>;

/** Deterministic vector textures and separately renderable scene planes. */
export const WorldArt:React.FC<{world:WorldLocation;layer?:'background'|'foreground'|'all';debug?:boolean}>=({world,layer='all',debug=false})=>{
 const id=React.useId().replace(/:/g,''),f=world.family;
 const outdoor=['drain','bridge','flood','street','busstop','schoolgate','service-exterior','shop-exterior'].includes(f);
 const wall=world.episodeId==='02'?'#d9e0d8':world.episodeId==='08'?'#e7ddc7':'#e5d9c3';
 const corridor=world.location==='Koridor kantor';
 const foregroundDesk=f==='service'||(f==='office'&&!corridor)||f==='school'||f==='community'||f==='shop';
 const fg=<g stroke={ink} strokeWidth="4">{foregroundDesk&&<Desk x={1160} y={f==='shop'?745:705} cashier={f==='shop'}/>} {outdoor?<path d="M1780 1050q-25-90-45-75m45 75q8-120 35-135m-35 135q30-70 55-60" fill="none" stroke="#68795a" strokeWidth="9"/>:<Plant x={1810} y={965} s={.68}/>}<path d="M0 1050h1920" stroke="#78684f" opacity=".3"/></g>;
 return <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${world.location}, episode ${world.episodeId}`}>
  <defs><pattern id={`${id}-paper`} width="43" height="37" patternUnits="userSpaceOnUse"><path d="M2 6h7m18 15h4M10 33h3" stroke="#776447" strokeWidth="1" opacity=".1"/></pattern><pattern id={`${id}-tiles`} width="120" height="76" patternUnits="userSpaceOnUse"><rect width="120" height="76" fill="none" stroke="#86765c" strokeWidth="2" opacity=".15"/></pattern></defs>
  {layer!=='foreground'&&<g stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
   <rect width="1920" height="1080" fill={outdoor?(world.night?'#546979':'#cbd6c5'):wall} stroke="none"/>
   {outdoor?<>
    <circle cx="1560" cy="150" r="66" fill={world.night?'#e7dfb8':'#ead5a0'} stroke="none" opacity=".9"/>
    <path d="M-80 210q150-64 300 0t300 0m750-10q160-60 300 0t400 0" fill="none" stroke="#e7e4cd" strokeWidth="30" opacity=".3"/>
    {f==='bridge'?<><path d="M0 570Q300 140 690 520Q1120 50 1600 500L1920 300V800H0Z" fill="#9eb59a" stroke="none"/><path d="M0 640Q400 340 880 600Q1480 240 1920 620V800H0Z" fill="#809d83" stroke="none"/></>:<Buildings night={world.night}/>}<rect y="620" width="1920" height="460" fill={f==='flood'?'#789b94':'#ab9f86'} stroke="none"/>
    <path d="M0 705h1920M0 745h1920" stroke="#7c806b" strokeWidth="8"/>
    {[0,1,2,3].map(i=><g key={i} transform={`translate(${140+i*540} 545)`}><path d="M0 120V-150" stroke="#766d51" strokeWidth="15"/><path d="M-90-30q-60-80 5-120-5-95 80-80 85-70 110 15 100 5 67 86 69 82-48 108Z" fill="#7d9674" stroke="#647f66"/></g>)}
    <path d="M50 15v680m0-600h1820v610" fill="none" stroke="#716f5c" strokeWidth="13"/><path d="M50 95q800 170 1820 0" fill="none" stroke="#686a5c" strokeWidth="3"/>
   </>:<>
    <rect y="610" width="1920" height="120" fill="#c4b799" stroke="none"/><path d="M0 610h1920M0 730h1920" stroke="#a38e6f" strokeWidth="7"/>
    <rect y="735" width="1920" height="345" fill="#bdab8c" stroke="none"/><path d="M0 870h1920M0 1015h1920M960 735L300 1080M960 735l660 345M470 735L0 1080m1450-345 470 345" stroke="#9b8c72" strokeWidth="2" opacity=".5"/>
    <Window x={140} y={185} night={world.night}/><path d="M150 503l530 232H150Z" fill="#f5e9c8" opacity=".14" stroke="none"/>
    <path d="M0 80h1920m-1650 0v-80m1380 80v-80" stroke="#b4a68a" strokeWidth="5"/>
    <rect x="785" y="100" width="350" height="22" rx="11" fill="#f0e7cd" stroke="#b5a58a"/><Plant x={90} y={750} s={.65}/>
   </>}
   {(f==='service'||f==='office')&&!corridor&&<>
    <Sign x={650} y={185} w={620} text={f==='service'?(world.location==='Kantor kecamatan'?'KANTOR KECAMATAN':'PELAYANAN WARGA'):world.location==='Kantor lain'?'KANTOR • REKRUTMEN':'RUANG WAWANCARA'}/><Clock x={1440} y={230}/>
    <Door x={1570} y={235} label={f==='service'?'ARSIP':'RUANG HR'}/><Shelf x={1150} y={340}/>
    <rect x="560" y="330" width="320" height="220" fill="#c2ad87"/><rect x="577" y="347" width="286" height="186" fill="#ebe2ca"/>
    {[0,1,2].map(i=><g key={i}><rect x={595+i*82} y="365" width="65" height="92" fill={i===1?'#ceb57e':'#d2d9c7'} strokeWidth="2"/><path d={`M${603+i*82} 385h48m-48 14h35m-35 14h43`} stroke="#998d72" strokeWidth="3"/></g>)}
    <path d="M480 690h370v35H480Z" fill="#8b7860"/>{(f==='service'?[510,650,790]:[540,735]).map(x=><g key={x}><rect x={x} y="591" width="95" height="85" rx="12" fill="#7f9585"/><path d={`M${x} 676h95v18h-95m10 18v55m75-55v55`} fill="none" strokeWidth="8"/></g>)}
    {f==='service'&&<><Sign x={1270} y={596} w={160} text="LOKET 01" color="#8a6e4c"/><path d="M920 772v65m155-65v65m-155-56h155" stroke="#8e7e61" strokeWidth="10"/></>}
   </>}
   {corridor&&<><Sign x={650} y={150} w={640} text="KORIDOR • RUANG HR →"/>{[650,1000,1350].map((x,i)=><Door key={x} x={x} y={235} label={['HR','WAWANCARA','RUANG RAPAT'][i]}/>)}<path d="M460 720h1040" stroke="#bba88a" strokeWidth="12"/><Clock x={480} y={220}/></>}
   {(f==='school'||f==='classroom')&&<>
    <Sign x={620} y={180} w={680} text={f==='school'?(world.location.toLowerCase().includes('loket')?'LOKET • ADMINISTRASI SEKOLAH':'SEKOLAH • AULA'):'RUANG BELAJAR'}/>
    <rect x="650" y="300" width="550" height="250" fill="#a58a61"/><rect x="667" y="317" width="516" height="216" fill="#55746a"/>
    <path d="M710 365h370m-370 40h300m-300 40h340m-340 40h210" stroke="#d6d6b5" strokeWidth="4" opacity=".7"/>
    <Door x={1570} y={235} label="TATA USAHA"/><Clock x={1430} y={215}/><path d="M1375 300v340" stroke="#7c6951" strokeWidth="8"/><path d="M1380 300h110v63h-110Z" fill="#a45f50"/><path d="M1380 363h110v63h-110Z" fill="#eee4ca"/>
    {f==='school'?<><rect x="500" y="650" width="390" height="30" fill="#927951"/><path d="M530 680v90m325-90v90" strokeWidth="12"/></>:<>{[0,1,2].map(i=><g key={i}><rect x={500+i*380} y="670" width="280" height="24" fill="#ad8f60"/><path d={`M${520+i*380} 694v95m235-95v95`} strokeWidth="10"/></g>)}</>}
   </>}
   {f==='home'&&<>
    <Sign x={710} y={185} w={470} text={world.episodeId==='06'?'RUMAH KELUARGA':world.location==='Kontrakan'?'KONTRAKAN • TANGGAL 1':'RUMAH WARGA'} color={world.location==='Kontrakan'?'#5c786f':'#947650'}/>
    <path d="M600 610q-60-70-95 0v130h490V610q-50-70-85 0Z" fill="#8a9b7b"/><rect x="545" y="535" width="178" height="152" rx="24" fill="#9ea98b"/><rect x="735" y="535" width="178" height="152" rx="24" fill="#9ea98b"/><rect x="565" y="570" width="85" height="70" rx="8" fill="#c6ab7b"/>
    <rect x="1190" y="510" width="370" height="205" fill="#8d7555"/><rect x="1220" y="350" width="290" height="160" rx="8" fill="#4b5d59"/><rect x="1235" y="365" width="260" height="126" fill="#92aaa0"/>
    <path d="M1030 390v320m-75-300h150l-28-90h-94Z" fill="#d8bd84" strokeWidth="6"/><Clock x={1440} y={220}/>
    <rect x="605" y="315" width="150" height="120" fill="#a48861"/><rect x="620" y="330" width="120" height="90" fill="#c9c6a9"/><path d="M640 400q38-70 80 0" fill="#8b9c82"/>
    <path d="M1030 745h-520l-85 190h690Z" fill="#b68a65" opacity=".7"/><path d="M555 778h435m-470 32h470" stroke="#d5b590" strokeWidth="5"/>
    {world.location==='Kontrakan'&&<>
      <rect x="1590" y="255" width="125" height="155" rx="6" fill="#fff7e3"/><rect x="1590" y="255" width="125" height="42" rx="4" fill="#b25742"/><text x="1652" y="284" textAnchor="middle" fill="#fff6e2" stroke="none" fontFamily="Arial" fontWeight="700" fontSize="20">TGL</text><text x="1652" y="372" textAnchor="middle" fill="#3a4542" stroke="none" fontFamily="Arial" fontWeight="900" fontSize="64">1</text>
      <rect x="750" y="705" width="260" height="18" rx="4" fill="#8e6c4e"/><path d="M775 723v95m210-95v95" stroke="#6f533a" strokeWidth="10"/><rect x="835" y="675" width="38" height="30" rx="5" fill="#e8ddc2"/><ellipse cx="920" cy="700" rx="34" ry="8" fill="#f3ebd6"/>
    </>}
    {world.location==='Meja makan'&&<Desk x={1120} y={715}/>}
   </>}
   {(f==='shop'||f==='stockroom')&&<>
    <Sign x={590} y={185} w={760} text={f==='shop'?'MINIMARKET • HARGA HARI INI':'GUDANG • STOK BARANG'} color="#5c7768"/>
    <Shelf x={540} y={320} shop/><Shelf x={920} y={320} shop/><Shelf x={1310} y={320} shop/>
    {f==='shop'?<><Sign x={1460} y={230} w={260} text="KASIR" color="#a16b4b"/><rect x="520" y="730" width="190" height="36" fill="#caa162"/><text x="615" y="756" textAnchor="middle" stroke="none" fill="#493d32" fontSize="22">PROMO</text></>:<>{[0,1,2,3].map(i=><g key={i}><rect x={480+i*250} y={690-i%2*60} width="210" height={100+i%2*60} fill={i%2?'#b89763':'#c2a475'}/><path d={`M${585+i*250} ${690-i%2*60}v${100+i%2*60}`} stroke="#dfc598" strokeWidth="18"/><path d={`M${500+i*250} 740h55m-55 10h40`} stroke="#8c7553" strokeWidth="3"/></g>)}</>}
   </>}
   {f==='community'&&<><Sign x={650} y={190} w={640} text={world.location.includes('Posko')?'POSKO PENGEMBANG':'BALAI WARGA'}/><Door x={1570} y={235}/><rect x="620" y="320" width="520" height="260" fill="#c5b28c"/><path d="M650 350h460v190H650Z" fill="#c9d1b6"/><path d="M660 485l110-100 100 70 120-90 100 100" fill="none" stroke="#82997f" strokeWidth="16"/></>}
   {(f==='drain'||f==='street')&&<>
    <Sign x={1120} y={460} w={400} text={f==='drain'?'GANG MELATI':'JALAN LINGKUNGAN'}/><path d="M0 930h1920v150H0Z" fill="#797966"/>
    {f==='drain'&&<><path d="M0 945l1920-45v140L0 1080Z" fill="#55796c"/><path d="M0 945l1920-45m-1920 180 1920-40" stroke="#aaa78a" strokeWidth="18"/>{[0,1,2,3,4].map(i=><path key={i} d={`M${140+i*380} ${982-i*7}h140m-100 22h85`} fill="none" stroke="#9cb3a0" strokeWidth="3"/>)}<path d="M1310 910l75-75 32 75m-78-42h66" fill="#cba45d"/><path d="M1385 850v30m0 11v3" strokeWidth="5"/></>}
    <path d="M400 670h340v25H400m20 0v80m300-80v80" fill="#927b58" strokeWidth="8"/>
   </>}
   {f==='flood'&&<>
    <path d="M150 535h480v210H150Z" fill="#a58f6b"/><path d="M110 540l280-150 280 150Z" fill="#8b7864"/><rect x="200" y="580" width="120" height="110" fill="#6f8a7e"/><rect x="395" y="575" width="115" height="170" fill="#806d57"/>
    <path d="M660 580q200 45 400 0" fill="none" strokeWidth="3"/>{[0,1,2,3].map(i=><path key={i} d={`M${685+i*80} 590h56l-5 85h-46Z`} fill={['#bb9272','#859c8c','#d1bc8e','#8c8e91'][i]} strokeWidth="2"/>)}
    <path d="M1070 350h850v390h-850Z" fill="#b8b599"/><path d="M1070 380h850m-850 60h850m-850 60h850m-850 60h850m-850 60h850" stroke="#a09e84" strokeWidth="3"/>
    <Sign x={1200} y={430} w={550} text="KOMPLEKS • AKSES TERBATAS" color="#7d8168"/>
    <path d="M0 780q320-35 640 0t640 0t640 0v300H0Z" fill="#7d9f94" stroke="none"/>
    {Array.from({length:12},(_,i)=><path key={i} d={`M${(i*173)%1800} ${815+Math.floor(i/4)*90}q55-13 110 0m-50 20h90`} fill="none" stroke="#b0c4ab" strokeWidth="3" opacity=".8"/>)}
    <path d="M260 970l170-70 200 44-160 75Z" fill="#8d7753"/><path d="M295 966l140-44 150 30" fill="none" stroke="#b19b71" strokeWidth="4"/>
    <rect x="780" y="704" width="120" height="155" fill="#d2b67d"/><path d="M810 710v140m60-140v140" stroke="#947e5d" strokeWidth="5"/>
   </>}
   {f==='bridge'&&<>
    <path d="M0 780h1920v300H0Z" fill="#78968a"/><path d="M0 835q400-35 800 0t1120 0m-1800 130q600-38 1500 0" fill="none" stroke="#b0c1a5" strokeWidth="5"/>
    <path d="M180 780h1550v180H180Z" fill="#927e5a"/>{Array.from({length:18},(_,i)=><g key={i}><path d={`M${200+i*85} 780v180`} stroke="#6d634d" strokeWidth="4"/><path d={`M${212+i*85} 800v130`} stroke="#b09b70" strokeWidth="2"/></g>)}
    <path d="M920 783l-25 68 63 105 55-52-36-50 45-72" fill="#647c6d"/>
    {[220,530,840,1150,1460,1710].map(x=><path key={x} d={`M${x} 780V630m0 150v185`} stroke="#796b4c" strokeWidth="15"/>)}<path d="M220 640h1490m-1490 55h1490" stroke="#998154" strokeWidth="12"/>
    <Sign x={1230} y={486} w={450} text="HATI-HATI • JEMBATAN RUSAK" color="#a27b49"/>
   </>}
   {f==='busstop'&&<>
    <path d="M420 440h1050v330H420Z" fill="#9eb4a5" opacity=".7"/><path d="M400 440h1100l-80-100H480Z" fill="#789284"/>
    <path d="M455 440v350m990-350v350m-945-80h840v30H500m30 0v60m775-60v60" fill="#aa9672" strokeWidth="12"/><Sign x={650} y={362} w={570} text="HALTE • ANGKUTAN KOTA"/>
    <rect x="1200" y="480" width="160" height="170" fill="#d3caab"/><path d="M1220 510h120m-120 26h90m-90 26h110m-110 26h90" stroke="#9d947c" strokeWidth="4"/>
    <path d="M0 930h1920v150H0Z" fill="#838572"/><path d="M0 1020h1920" stroke="#d6c7a1" strokeWidth="7" strokeDasharray="100 70"/>
   </>}
   {(f==='schoolgate'||f==='service-exterior'||f==='shop-exterior')&&<>
    <path d="M460 300h1110v440H460Z" fill="#d7c9aa"/><path d="M400 310l610-200 620 200Z" fill="#9e7959"/>
    {[580,910,1240].map(x=><Window key={x} x={x} y={390} w={160} h={210}/>)}
    <Sign x={670} y={240} w={650} text={f==='schoolgate'?'SEKOLAH • GERBANG UTAMA':f==='shop-exterior'?'MINIMARKET • BUKA SETIAP HARI':'KANTOR PELAYANAN WARGA'}/>
    <path d="M0 770h450v-40H0m1470 0h450v40h-450" fill="#b7ad8c" strokeWidth="18"/><path d="M450 730v-180h-50v220m1070-40V550h50v220" strokeWidth="10" fill="#c2b18d"/>
    <path d="M460 740h510m90 0h410" stroke="#8c8971" strokeWidth="14"/>
   </>}
   {f==='shop-exterior'&&<>
    <rect x="465" y="340" width="1100" height="395" fill="#c6cbb5"/>
    <rect x="530" y="430" width="850" height="305" fill="#9ab8ab"/><path d="M530 600h850m-500-170v305m170-305v305" stroke="#6f8174" strokeWidth="10"/>
    <path d="M470 340h1090l-35 95H495Z" fill="#6b8b79"/>{Array.from({length:10},(_,i)=><path key={i} d={`M${500+i*102} 345h48l-8 86h-50Z`} fill="#ded5b5" stroke="none"/>)}
    <rect x="1400" y="500" width="120" height="235" fill="#c6a16a"/><text x="1460" y="550" textAnchor="middle" fontSize="20" fill="#564b3d" stroke="none">PROMO</text><path d="M1420 580h80m-80 25h60m-60 25h75" stroke="#8d7956" strokeWidth="4"/>
   </>}
   <rect width="1920" height="1080" fill={`url(#${id}-paper)`} stroke="none"/>
   {!outdoor&&<rect y="735" width="1920" height="345" fill={`url(#${id}-tiles)`} stroke="none"/>}
   {world.night&&<rect width="1920" height="1080" fill="#273b53" opacity=".18" stroke="none"/>}
  </g>}
  {layer!=='background'&&fg}
  {debug&&<g fill="none" stroke="#bb644c" strokeWidth="3" fontFamily="Arial"><path d={`M0 ${world.floorY}h1920`} strokeDasharray="15 12"/>{world.actorZones.map(z=><g key={z.id}><ellipse cx={z.x} cy={z.y} rx="120" ry="28"/><path d={`M${z.x} ${z.y}v-260`} strokeDasharray="9 9"/><text x={z.x} y={z.y+65} textAnchor="middle" fill="#8d4b3e" stroke="none" fontSize="22">{z.id}</text></g>)}<circle cx={world.interaction.x} cy={world.interaction.y} r="20"/><text x={world.interaction.x} y={world.interaction.y-34} textAnchor="middle" fontSize="21" fill="#8d4b3e" stroke="none">INTERAKSI (draft)</text></g>}
 </svg>;
};

export {Desk as WorldDesk,Plant as WorldPlant,Window as WorldWindow,Sign as WorldSign};
