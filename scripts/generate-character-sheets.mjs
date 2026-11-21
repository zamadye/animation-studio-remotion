import fs from 'node:fs';
const cast=[
 ['01','Darto','Petugas','#a96f50','#426d72','#292824','#d5a27e','#4b5966','buruh harian / petugas layanan'],
 ['02','Nina','HR','#c98765','#a6b6aa','#332725','#d8ad8f','#394d57','lulusan baru / perekrut'],
 ['03','Pria','Influencer','#aa735a','#4c7180','#332d29','#d8a182','#9a5548','warga / pemburu engagement'],
 ['04','Ibu Sari','Bendahara','#b97759','#536f68','#352825','#d5a180','#7f6554','penjahit / pengurus sekolah'],
 ['05','Mira','Humas','#a96f52','#637a65','#302824','#d8a488','#526a79','pedagang / juru bicara'],
 ['06','Ayah','Dini','#c18a68','#566a78','#302927','#d09a78','#9e6a67','ayah / anak'],
 ['07','Pak Beni','Koordinator','#a96e50','#607466','#302824','#d1a081','#4f6574','warga / petugas lapangan'],
 ['08','Rika','Manajer','#bc8062','#765d69','#342724','#d8a587','#536878','kasir / pengelola minimarket'],
];
const esc=(s)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
function bust(x,y,skin,cloth,hair,expression,scale=0.53){
 const mouth={neutral:'M-9 18 Q0 26 9 18',talk:'M-10 17 Q0 31 10 17',concern:'M-10 23 Q0 14 10 23',surprise:'M-4 16 Q0 31 4 16',frustrated:'M-9 23 Q0 16 9 23',relief:'M-9 18 Q0 23 9 18'}[expression];
 return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-25 55 Q0 43 25 55 L33 105 L-34 105Z" fill="${cloth}" stroke="#20262b" stroke-width="4"/><path d="M-13 48v14h26V48" fill="${skin}" stroke="#20262b" stroke-width="3"/><ellipse cx="0" cy="8" rx="28" ry="34" fill="${skin}" stroke="#20262b" stroke-width="4"/><path d="M-28 2 Q-26-28 2-27 Q27-26 29 1 Q10-12-4-7 Q-15-5-26 13Z" fill="${hair}" stroke="#20262b" stroke-width="3"/><circle cx="-9" cy="8" r="2.5"/><circle cx="9" cy="8" r="2.5"/><path d="${mouth}" transform="translate(0 5)" fill="none" stroke="#613e38" stroke-width="3" stroke-linecap="round"/><text x="0" y="128" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="17" fill="#20262b">${expression}</text></g>`;
}
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1840" viewBox="0 0 1600 1840"><rect width="1600" height="1840" fill="#f3eee4"/><text x="72" y="66" font-family="Arial,sans-serif" font-size="34" font-weight="800" fill="#20262b">STUDIO SATIR · CHARACTER &amp; EXPRESSION SHEET</text><text x="74" y="99" font-family="monospace" font-size="13" letter-spacing="2" fill="#77756e">ORIGINAL VECTOR CONCEPTS · SIX ACTING KEYS · V0.2</text>`;
const expressions=['neutral','talk','concern','surprise','frustrated','relief'];
cast.forEach((c,i)=>{
 const y=125+i*210;
 svg+=`<rect x="64" y="${y}" width="1472" height="198" rx="8" fill="#fffdf8" stroke="#d9d1c5" stroke-width="2"/><rect x="64" y="${y}" width="10" height="198" fill="#b64d37"/><text x="92" y="${y+35}" font-family="monospace" font-size="15" font-weight="700" fill="#b64d37">EP ${c[0]}</text><text x="92" y="${y+69}" font-family="Arial,sans-serif" font-size="22" font-weight="800" fill="#20262b">${esc(c[1])}</text><text x="92" y="${y+92}" font-family="Arial,sans-serif" font-size="12" fill="#77756e">${esc(c[8])}</text><text x="92" y="${y+145}" font-family="monospace" font-size="10" letter-spacing="1" fill="#77756e">HERO</text><text x="480" y="${y+28}" font-family="monospace" font-size="11" letter-spacing="1" fill="#77756e">EXPRESSION / VISUAL ACTING — NOT PHONEME-SYNCED</text>`;
 expressions.forEach((exp,j)=>{svg+=bust(490+j*72,y+53,c[3],c[4],c[5],exp,.46)});
 svg+=`<text x="966" y="${y+35}" font-family="Arial,sans-serif" font-size="20" font-weight="800" fill="#20262b">${esc(c[2])}</text><text x="966" y="${y+57}" font-family="monospace" font-size="10" fill="#77756e">COUNTERPART</text>${bust(1010,y+63,c[6],c[7],c[5],'neutral',.58)}<text x="1100" y="${y+101}" font-family="monospace" font-size="10" letter-spacing="1" fill="#77756e">PALETTE</text><rect x="1100" y="${y+115}" width="24" height="18" rx="3" fill="${c[3]}"/><rect x="1129" y="${y+115}" width="24" height="18" rx="3" fill="${c[4]}"/><rect x="1158" y="${y+115}" width="24" height="18" rx="3" fill="${c[5]}"/><text x="1190" y="${y+129}" font-family="monospace" font-size="10" fill="#77756e">SKIN / WARDROBE / HAIR</text><text x="1100" y="${y+160}" font-family="Arial,sans-serif" font-size="12" fill="#4f5e5a">Pose: listen · gesture · hold</text>`;
});
svg+=`<text x="72" y="1815" font-family="monospace" font-size="12" fill="#77756e">CONCEPT ASSET — production model approval, additional cast, turnarounds and timing remain open.</text></svg>`;
fs.mkdirSync('public/assets',{recursive:true});fs.writeFileSync('public/assets/character-sheets.svg',svg);console.log('Generated eight model rows / six expression keys each.');
