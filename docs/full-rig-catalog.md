# Katalog rig serentak — 16 karakter

Semua karakter memakai satu sampler `sampleRigCatalog(frame, motionIndex?)` di `src/animation/rigMotionCatalog.ts`. Tidak ada timeline per karakter. Komposisi `Full-Rig-Catalog` memanggil komponen produksi `CharacterRig`.

24 fps, 60 frame / 2,5 detik per indeks. Total 780 frame / 32,5 detik.

| Indeks | Mulai | Gerakan |
|---|---:|---|
| 00 | 0,0 s | Netral / semua pivot |
| 01 | 2,5 s | Bahu–siku lengan kiri |
| 02 | 5,0 s | Bahu–siku lengan kanan |
| 03 | 7,5 s | Kedua lengan dan pergelangan |
| 04 | 10,0 s | Panggul–lutut–ankle kiri |
| 05 | 12,5 s | Panggul–lutut–ankle kanan |
| 06 | 15,0 s | Langkah bergantian / march in place |
| 07 | 17,5 s | Pinggang condong kiri |
| 08 | 20,0 s | Pinggang condong kanan |
| 09 | 22,5 s | Turun duduk |
| 10 | 25,0 s | Duduk, pinggang maju–pulih |
| 11 | 27,5 s | Duduk, kedua lengan |
| 12 | 30,0 s | Berdiri kembali |

Kiri/kanan adalah sisi karakter. Indeks mesin tersedia di `docs/rig-motion-index.json`. Properti komposisi `motionIndex` dapat diisi 0–12 untuk menampilkan satu bagian; render frame 0–59 untuk satu siklus bagian tersebut.

## Implementasi

- Kedua lengan: bahu → siku → pergelangan, dengan `wristLeft/Right` pada ActingPose.
- Kedua kaki: panggul → paha → lutut → betis → ankle; panjang ruas memakai konstanta bersama renderer dan tes.
- Ankle default mengimbangi rotasi paha/lutut sehingga sepatu datar; `ankleLeft/Right` dapat menggantinya.
- `seated` (0–1) mengatur posisi hip kiri/kanan. Penurunan pelvis dihitung dari endpoint kaki agar telapak tetap pada lantai selama duduk/berdiri, termasuk Dini.
- Pelvis overlap menutup sambungan torso–paha saat pinggang berputar. Rok mengikuti posisi lutut saat duduk.
- Kursi uji opsional (`showSeat`) menyesuaikan tinggi pelvis/lantai. Ini bukan perubahan dekorasi episode.

## Pengujian

`npm test`: validasi proyek, 96 round-trip IK/FK lengan, dan 24.960 pemeriksaan panjang kaki/endpoint duduk pada seluruh frame, semua desain, kedua kaki. Batas antarindeks diuji tanpa lompatan nilai pose. Typecheck dan build juga lolos; build hanya memberi peringatan ukuran bundle.

## Batasan

Ini uji rig frontal 2D. Pose duduk memproyeksikan paha ke samping agar lutut dan kursi dapat diperiksa, bukan tubuh profil/3D penuh. Langkah adalah march in place, bukan locomotion foot-lock. Blocking episode, retarget clip lama, kontak dokumen, secondary motion tas/kain, dan seluruh benturan tangan–paha belum disahkan. Katalog bukan persetujuan episode final.

## Perintah

`npm run typecheck`, `npm test`, `npm run build`, `npm run render:rig-catalog`.

Sandbox: tambahkan `--browser-executable=/tmp/chromium` dan set `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64` untuk render.

## Pemeriksaan visual batch ini

Video awal diperiksa pada sampel tengah semua 13 indeks, dengan pembesaran Darto, Petugas (rok), Dini (anak), dan Rika (apron), ditambah lembar seluruh karakter untuk lengan kiri, kaki kiri, duduk dan pinggang saat duduk. Pemisahan kaki duduk dan shading kaki jauh dirapikan. Kursi uji kemudian dikunci pada tinggi tetap agar tidak mengikuti pelvis selama transisi. Hasil akhir dirender ulang; PDF indeks dibuat dari video hasil akhir. Inspeksi sampel bukan pemeriksaan manual setiap frame.
