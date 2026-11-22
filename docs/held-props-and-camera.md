# Properti genggam + kamera baca — panduan plug-and-play

## Batch ini

Dua properti SVG: HP/chat bergaya aplikasi pesan hijau (contoh fiktif, bukan integrasi WhatsApp) dan surat undangan. Satu data isi dipakai untuk benda di tangan dan insert baca. Ini fondasi authoring berbasis kode/data, belum editor drag-and-drop.

Proof `Held-Prop-Camera-Proof`: 1920×1080, 24 fps, 26 detik, tanpa audio. Bagian HP 12 detik, surat 14 detik. Setiap bagian: shot lebar dan gerakan lengan terkunci → push-in ke benda yang terpasang di tangan → cut insert baca → kembali ke shot lebar. Pergantian HP ke surat adalah cut antar-dua contoh, BUKAN animasi mengubah HP menjadi kertas.

## Susunan modul

- `src/story/compose.ts`: `character`, `perform`, `hold` untuk merakit pemeran, gerakan, ekspresi dan benda.
- `src/story/motions.ts`: gerakan bernama dari katalog yang sudah dikunci, bukan kurva baru.
- `src/story/StoryActor.tsx`: rig tubuh/wajah lalu lapisan aksesori opsional.
- `src/props/types.ts`: isi HP/surat dan interval pegangan bertipe.
- `src/props/PropArt.tsx`: SVG yang sama pada shot lebar dan insert; teks tetap SVG text, bukan gambar teks generatif.
- `src/props/HeldProps.tsx`: lapisan properti + grip ibu jari aksesori, mengikuti hierarki shoulder → elbow → wrist yang terkunci.
- `src/props/handSocket.ts`: posisi telapak berdasarkan forward kinematics, termasuk lean, root offset, tinggi karakter dan seated root drop.
- `src/camera/readCamera.ts`: jadwal wide/push/insert/return deterministik.
- `src/camera/PropReadShot.tsx`: renderer shot properti dengan lokasi world, pemeran dan benda eksplisit.
- `src/story/examples/plugAndPlay.ts`: contoh komposisi mandiri yang ikut diuji.

## Contoh merakit karakter, gerakan, ekspresi dan HP

Contoh berikut setara pola yang dipakai proof. Jalankan di composition 1920×1080, 24 fps; import path disesuaikan lokasi file.

```tsx
import {character, perform, hold} from '../story/compose';
import {march, rightArm, idle} from '../story/motions';
import {validateStoryScene} from '../story/evaluate';
import {PropReadShot} from '../camera/PropReadShot';
import type {PhoneContent} from '../props';

const hp: PhoneContent = {
  kind: 'phone', id: 'hp-ibu', contact: 'Ibu',
  messages: [
    {from: 'them', lines: ['Sudah sampai, Nak?']},
    {from: 'me', lines: ['Sudah, Bu.']},
  ],
};
const scene = validateStoryScene({
  id: 'contoh', fps: 24, duration: 288,
  actors: [character({
    id: 'darto', x: 650, scale: 1.15, duration: 288,
    motions: [
      perform(march, 0, 48),
      perform(rightArm, 48, 48),
      perform(idle, 96, 192),
    ],
    expression: 'happy',
    props: [hold(hp, 'right', 0, 288)],
  })],
  speech: [],
});

<PropReadShot
  episodeId="02" location="Ruang wawancara"
  scene={scene} actorId="darto" propId="hp-ibu"
  camera={{pushStart: 96, insertStart: 132, returnStart: 264}}
/>
```

Untuk mengganti karakter, ganti `id` menjadi ID registry misalnya `nina` atau `petugas`. Untuk mengganti gerakan, ganti argumen `perform`; untuk emosi, ganti `expression`. Untuk emosi yang berubah sepanjang adegan, gunakan `ActorDefinition.emotions` seperti pada sistem story sebelumnya. Semua pemeran harus ditulis eksplisit; helper tidak menambahkan pemeran lain.

`march` adalah siklus jalan DI TEMPAT yang sudah disetujui, bukan navigasi atau kaki terkunci pada jalur dunia. Memilih gerakan tidak otomatis membuat lintasan perpindahan karakter.

## Mengganti HP dengan surat

```ts
import type {LetterContent} from '../props';
const surat: LetterContent = {
  kind: 'letter', id: 'surat-hr',
  heading: 'UNDANGAN WAWANCARA',
  number: 'Nomor: 014/HR/XI/2026',
  lines: [
    'Kepada Bapak Darto,', '',
    'Mohon hadir untuk wawancara:',
    'Senin, 23 November 2026',
    'Pukul 09.00 WITA',
    'Ruang HR, lantai 1.', '',
    'Bawa KTP dan surat lamaran.',
  ],
  signature: 'Rina · Bagian HR',
};
// props: [hold(surat, 'right', 0, duration)]
// Camera propId must match 'surat-hr'.
```

## Aturan keterbacaan

- Isi chat: 1–3 pesan, tiap pesan 1–3 baris, maksimal 22 karakter per baris. Nama kontak maksimal 22 karakter.
- Surat: judul maksimal 24 karakter, isi 1–10 baris, maksimal 34 karakter per baris. Baris kosong memisahkan paragraf.
- Batas di atas adalah guard sederhana, bukan pengukuran lebar glyph otomatis; teks baru tetap harus diperiksa visual. Huruf W lebar, font dan bahasa lain bisa membutuhkan pemenggalan berbeda.
- Proof HP menahan insert selama 7 detik, surat selama 9 detik. Teks chat sekitar 30 px dan isi surat sekitar 29 px pada video 1080p.
- Insert adalah cut editorial ke tampilan baca penuh, bukan klaim pembesaran kamera 3D atau over-the-shoulder. Shot lebar menunjukkan benda memang dipegang; insert sengaja menyembunyikan tangan agar isi tidak terhalang.
- Render ini hanya landscape. Format vertical/square butuh camera layout tersendiri dan pemeriksaan keterbacaan di layar target.

## Kontak tangan dan batas dukungan

Properti mengikuti posisi tangan, bukan menggerakkan atau mengganti pose tubuh. Pada pergelangan, aksesori mengompensasi rotasi bahu/siku agar bidang baca tegak relatif torso; tubuh dan pergelangan asli tetap tidak diedit. Lapisan grip ibu jari hanya aksesori untuk menutup tepi benda. Ini pegangan datar 2D, belum simulasi jari, perspektif 3D atau genggaman khusus tiap jenis benda.

Kedua tangan didukung secara attachment; penempatan kiri menggeser benda ke sisi luar tanpa membalik teks. Tes numerik mencakup semua 16 desain, 13 gerakan dan dua tangan. Review video batch ini hanya memeriksa Darto/tangan kanan dengan HP dan surat. Properti tidak otomatis menghindari wajah, badan, meja atau properti lain pada semua pose; blocking baru wajib direview.

Tidak ada pickup, release, serah-terima antar-karakter, sentuhan jari ke layar, scrolling atau physical collision. Dua benda pada tangan yang sama dengan interval bertumpuk ditolak. ID benda harus unik per pemeran. Kamera menolak benda yang tidak dipasang pada pemeran target/absen selama push dan insert.

## QA

- SHA lock tubuh tetap lulus; baseline tidak diregenerasi.
- 24.960 sampel socket FK: 16 karakter × 13 gerakan × 60 frame × 2 tangan; semua finite dan mengikuti root translation.
- 1.664 sampel dibandingkan dengan perkalian matriks transform SVG independen, termasuk pose seated/lean dan tinggi karakter.
- SVG properti, grip overlay, visibility akhir interval, isi data identik, reject teks terlalu panjang, interval pegangan invalid, dua benda pada tangan sama dan batas shot kamera diuji.
- `plugAndPlayScene` diuji memakai indeks gerakan resmi 6, 2, 0.
- Typecheck, full test suite, build dan pemeriksaan visual render dilaporkan setelah render selesai.

Render: `npm run render:held-props`.
Sandbox: tambahkan `-- --browser-executable=/tmp/chromium --quiet` dan environment `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64`.

### Hasil akhir batch

Typecheck, `npm test` (termasuk `test:props`), build dan `git diff --check` lulus. Build hanya memberi peringatan ukuran bundle yang sudah ada. Render H.264 624 frame / 26 detik selesai. Preview full-resolution chat dan surat diperiksa untuk isi, pemenggalan baris dan ukuran teks. Review gerakan/pegangan memakai 10 crop frame: awal, angkat lengan, turunkan lengan dan kembali lebar, masing-masing HP dan surat. Tidak terlihat lepasnya benda dari grip pada sampel tersebut.

Review awal menemukan origin transform kamera salah sehingga target bergeser saat push. `transformOrigin` diperbaiki ke `0 0`, frame push diperiksa ulang dan video beserta PDF diregenerasi dari render terkoreksi. Halaman PDF memuat wide/push/insert untuk masing-masing benda. Pemeriksaan ini bukan klaim semua kemungkinan pose/karakter telah direview visual.
