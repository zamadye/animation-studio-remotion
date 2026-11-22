# Struktur cerita: karakter, gerakan, ekspresi, dan dialog

## Jalur produksi tunggal

`StoryScene → StoryActor → CharacterRig → ProportionCharacterRig → ArticulatedArm + FacialFeatures`

Katalog adalah alat review, bukan komponen yang dimasukkan ke dunia cerita. Dunia cerita memakai renderer yang sama dengan katalog. Jadwal 13 gerakan dan geometri tubuh yang disetujui tetap dikunci; baseline hash tidak diubah.

### Folder

- `src/components/characters/registry.ts`: ID stabil dan named export desain (`darto`, `petugas`, `nina`, `rika`, dan lainnya).
- `src/story/motions.ts`: named export aksi (`march`, `sitDown`, `seatedLean`, `seatedGesture`, `standUp`, dll.), menunjuk sampler katalog yang sudah disetujui tanpa menulis ulang kurva.
- `src/story/types.ts`: kontrak data cast adegan, track tubuh, track emosi, ucapan dan viseme.
- `src/story/evaluate.ts`: evaluasi semua track pada satu frame. Tidak memakai waktu browser.
- `src/story/StoryActor.tsx`: satu karakter mandiri; menggabungkan pose tubuh, emosi dan mulut sebelum memanggil `CharacterRig`.
- `src/story/StoryScene.tsx`: hanya me-render `scene.actors`, plus audio yang direferensikan scene. Tidak pernah me-render seluruh registry atau katalog.
- `src/story/examples/twoCharacterSync.ts`: contoh adegan dua karakter dengan daftar aksi dan dua ucapan audio yang sudah tersedia.
- `src/story/examples/syncSpeech.json`: cue viseme relatif terhadap awal masing-masing ucapan, dengan metode estimasi dinyatakan eksplisit.

## Memilih dua karakter saja

```tsx
import {darto, petugas} from '../components/characters/registry';
import {sitDown, seatedGesture, standUp} from './motions';
import {StoryScene, validateStoryScene} from './index';

const scene = validateStoryScene({
  id: 'contoh-dua-orang', fps: 24, duration: 240,
  actors: [
    {id:'darto', design:darto, x:430, body:[
      {start:0, duration:60, motion:sitDown},
      {start:60, duration:120, motion:seatedGesture},
      {start:180, duration:60, motion:standUp},
    ], emotions:[{start:60, end:180, emotion:'sad'}]},
    {id:'petugas', design:petugas, x:1110, body:[]},
  ],
  speech: [],
});
// Di dalam Composition dengan fps=24:
// <StoryScene scene={scene} floorY={900} />
```

Hanya Darto dan Petugas yang menjadi instance. Menghapus Petugas dan cue bicaranya menghasilkan satu karakter; tidak ada fallback karakter tambahan. Renderer mendukung lebih dari dua bila memang dicantumkan. `enter`/`exit` opsional mengatur kapan karakter ada di panggung. Karakter individual bisa dirender lewat `StoryActor`, atau `CharacterRig` untuk kontrol tingkat rendah.

Registry saat ini mengimpor seluruh metadata desain JSON yang kecil. Ini jaminan **instance adegan**, bukan klaim lazy-loading/tree-shaking file metadata per karakter. Named import aksi memilih aksi yang dijadwalkan; sampler geometri tetap dibagi bersama, bukan diduplikasi per karakter.

## Menyatukan tubuh dan wajah

Semua waktu menggunakan integer frame dalam clock `scene.fps`. Body cue ditulis berurutan, tanpa overlap. Sampel aksi dipetakan ke 60 frame gerakan yang disetujui; durasi cue boleh memperlambat/mempercepat gerakan yang sama. Pose akhir ditahan sampai aksi berikutnya: selesai turun duduk tidak otomatis berdiri ketika dialog berhenti.

Emosi adalah track independen: misalnya `crying` tetap menangis walaupun sedang mendengar lawan bicara. Mulut bicara berasal dari ucapan milik ID karakter itu saja. Karakter lain tidak ikut menggerakkan mulut untuk berbicara. Ekspresi intrinsik (misalnya mulut tertawa atau terkejut) tetap dapat membuka mulut meskipun tidak ada ucapan.

Ucapan dapat berisi:

```ts
{
  id:'baris-1', speaker:'darto', start:180, end:240,
  text:'Contoh dialog.', audio:'audio/baris-1.mp3',
  alignment:'authored',
  visemes:[
    {start:0,end:6,viseme:'MBP'},
    {start:6,end:16,viseme:'A',openness:.8},
    {start:16,end:24,viseme:'E'},
    // interval kosong = rest; semua frame di sini relatif ke awal ucapan
  ],
}
```

`audio` harus file nyata di `public/`. Audio dan mulut dimulai dari `start` yang sama. Batas akhir bersifat eksklusif. `StoryScene` menolak fps komposisi yang berbeda dari clock adegan, ID duplikat, pembicara di luar cast, overlap aksi tubuh, ucapan di luar masa hadir karakter, atau interval viseme tidak valid.

## Status sinkronisasi

Contoh `Two-Character-Sync-Check` berdurasi 18 detik / 432 frame, 24 fps. Ia menggabungkan langkah di tempat, gestur, duduk, bicara sambil duduk, reaksi marah/menangis dan berdiri, hanya untuk Darto + Petugas. Dua MP3 dialog yang sudah ada dipakai ulang, bukan rekaman baru.

`build-sync-speech.py` mengukur energi audio tiap frame untuk menutup mulut pada keheningan dan memperkirakan bentuk fonem dari teks. Ini **estimasi energi + teks, bukan forced alignment atau lip-sync fonem presisi**. Timing start/stop audio dan gating mulut diuji; cue viseme presisi masih perlu authored/aligned dan review sebelum episode final. Script Python ini opsional untuk membangun contoh, bukan dependency renderer browser.

Jalur lama `StoryFrame` juga diberi jembatan emosi dan mulut per pembicara. Karena dialog animatic lama belum semua memiliki audio aligned, jalur tersebut memakai estimasi teks dan tetap berlabel dialog belum direkam. Resolver legacy masih dapat menyimpulkan cast dari naskah; untuk kontrol cast eksplisit tanpa inference gunakan API `StoryScene` di atas.

Langkah yang dipakai adalah march in place yang disetujui, belum locomotion berpindah dunia dengan foot-lock. Blocking/camera proof lama dan kontak dokumen belum disahkan. Tidak ada episode penuh 90 detik yang dirender pada batch ini.

## Tes dan perintah

`npm test`: body lock, IK/FK, katalog tubuh/wajah, serta tes sinkronisasi 432 frame. Tes memastikan hanya dua/satu instance dipasang, pendengar tidak memiliki viseme bicara, duduk dan sedih tidak hilang saat bicara, audio tersedia, dan scene invalid ditolak. Typecheck dan build juga dijalankan.

`npm run render:sync-check` merender contoh. Sandbox menambahkan `--browser-executable=/tmp/chromium` dan `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64`.

### QA render batch ini

Sampel video frame 24, 150, 210, 300, 345, dan 400 diperiksa secara visual: langkah di tempat, transisi duduk, bicara sambil duduk, reaksi lawan bicara, menangis saat mendengar, dan bangkit. Dekode audio MP4 juga diperiksa: sinyal audio berada di interval ucapan yang dijadwalkan dengan toleransi tepi satu frame AAC. Ini tidak membuktikan ketepatan fonem atau penilaian naturalness melalui pendengaran; lip-sync presisi tetap belum disahkan. Video mengandung dua ucapan dari aset dialog yang sudah tersedia, bukan dialog baru atau episode lengkap.
