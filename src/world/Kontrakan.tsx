import React from 'react';
/** Native 1080x1920 set. Camera always covers this entire portrait canvas. */
export const Kontrakan:React.FC=()=> <svg data-native-world="kontrakan" width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
 <rect width="1080" height="1920" fill="#e6d6b7"/><path d="M0 80h1080v34H0Z" fill="#ad9471"/>
 <rect y="1380" width="1080" height="540" fill="#bda582"/>
 <g stroke="#927b5f" strokeWidth="2" opacity=".45">{Array.from({length:8},(_,i)=><path key={i} d={`M0 ${1435+i*68}h1080`}/>)}{[0,180,360,540,720,900,1080].map(x=><path key={x} d={`M${x} 1380L${540+(x-540)*2} 1920`}/>)}</g>
 <path d="M0 1380h1080" stroke="#927a5c" strokeWidth="12"/>
 <rect x="65" y="340" width="390" height="590" rx="4" fill="#a6bbb1" stroke="#6b6754" strokeWidth="15"/>
 <path d="M75 760q180-150 370-20v180H75Z" fill="#7b9988"/><path d="M75 660h370M260 350v570" stroke="#746e59" strokeWidth="12"/>
 <path d="M40 310h440M70 320q80 180 45 630h-60Zm380 0q-80 180-45 630h60Z" fill="#b88364" stroke="#8e6651" strokeWidth="10"/>
 <path d="M660 300h360v1100H660Z" fill="#a08460" stroke="#756146" strokeWidth="13"/><path d="M690 345h300v445H690Zm0 490h300v490H690Z" fill="#b79b73" stroke="#8d7352" strokeWidth="7"/><circle cx="960" cy="835" r="13" fill="#dfc899"/>
 <g transform="translate(550 150)"><path d="M0-150v165" stroke="#695d49" strokeWidth="6"/><path d="M-95 70h190L55 5H-55Z" fill="#7e8f78" stroke="#5d6958" strokeWidth="7"/><ellipse cy="75" rx="60" ry="9" fill="#f7e4af"/></g>
 <rect x="495" y="650" width="115" height="170" fill="#f2e7cc" stroke="#9a8b6d" strokeWidth="5"/><path d="M495 683h115" stroke="#a35f4b" strokeWidth="28"/><text x="552" y="759" textAnchor="middle" fontFamily="Arial" fontSize="52" fill="#715f4c">1</text>
 <path d="M30 1300q15-70 90-70h805q80 0 105 70v270H30Z" fill="#80917b" stroke="#5e6f5c" strokeWidth="10"/>
 <path d="M55 1410h950v140H55Z" fill="#9ba78e" stroke="#6c7c65" strokeWidth="9"/><path d="M550 1250v160M80 1570v70m900-70v70" stroke="#6c745b" strokeWidth="12"/>
 <path d="M32 1290h72v250H32Zm945 0h66v250h-66Z" fill="#74866f" stroke="#596d57" strokeWidth="7"/>
 <g transform="translate(40 1080)"><path d="M0 180h120l-18 115H20Z" fill="#ab7152" stroke="#79583e" strokeWidth="6"/><path d="M60 180V15m0 95Q-5 85 0 30q55 0 60 80m0 40q90-20 75-80-60 0-75 80" fill="#75906a" stroke="#5f7756" strokeWidth="7"/></g>
 <path d="M1020 1120l-28 90 32 24-13 68M145 190l25 100" stroke="#b9a27e" strokeWidth="5" fill="none"/>
 </svg>;
