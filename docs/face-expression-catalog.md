# Katalog mulut dan ekspresi — review wajah saja

## Gerakan tubuh dikunci

Gerakan tubuh yang disetujui tidak diubah. `docs/body-motion-lock.json` menyimpan SHA-256 jadwal 13 gerakan, geometri tubuh, hierarki lengan, desain cast, gambar pelvis/kaki/pinggang, dan penempatan produksi. `npm test` sekarang menolak perubahan pada bagian-bagian ini. Jangan memperbarui baseline tanpa persetujuan pengguna.

Komponen `FacialFeatures` tidak memiliki akses ke sudut lengan/kaki, root, atau timeline tubuh. `CharacterRig` menerima properti `face` secara terpisah. `ProportionCharacterRig` tetap menggambar tubuh yang sama lalu memasang fitur wajah di dalam pivot kepala yang sudah ada.

## Katalog serentak

Komposisi: `Face-Expression-Catalog`, 16 karakter, 24 fps, 60 frame per indeks, total 960 frame / 40 detik. Wajah ditampilkan close-up melalui crop komponen produksi yang sama, bukan karakter pengganti. `expressionIndex` memilih satu indeks bersama untuk semua karakter.

| Indeks | Mulai | Pengujian |
|---|---:|---|
| 00 | 0,0 s | Netral dan kedip |
| 01 | 2,5 s | Rest, MBP, A, E, O, U, FV, L |
| 02 | 5,0 s | Bicara netral |
| 03 | 7,5 s | Senang / senyum |
| 04 | 10,0 s | Tertawa |
| 05 | 12,5 s | Sedih |
| 06 | 15,0 s | Menangis dan air mata |
| 07 | 17,5 s | Marah |
| 08 | 20,0 s | Marah sambil bicara |
| 09 | 22,5 s | Takut / cemas |
| 10 | 25,0 s | Terkejut |
| 11 | 27,5 s | Curiga |
| 12 | 30,0 s | Lelah |
| 13 | 32,5 s | Malu |
| 14 | 35,0 s | Sedih sambil bicara |
| 15 | 37,5 s | Menangis sambil bicara |

`sampleFaceCatalog` adalah satu sampler bagi semua karakter. Intensitas ekspresi masuk/keluar bertahap. Alis, bukaan kelopak, senyum/cemberut, pipi, kedip dan air mata dipisah dari bentuk mulut, sehingga berbicara tidak menghapus emosi. Air mata berjalan mengikuti frame; tidak memakai waktu browser.

## Pemakaian produksi

```tsx
<CharacterRig design={design} frame={frame} fps={24} cue="hold"
  face={{emotion:'crying', intensity:1, viseme:'A', openness:.8,
    tearPhase:(frame%24)/24, blink:0}} />
```

Emosi: neutral, happy, laughing, sad, crying, angry, afraid, surprised, suspicious, tired, embarrassed.

Properti lama `actingPose.expression/mouth/blink` tetap dipetakan. Adegan `cue="talk"` tanpa pose mulut eksplisit memakai urutan demo fonem deterministik yang lebih beragam. Jika sudah ada cue mulut dari dialog, pemetaan lama tetap dihormati; properti `face` dapat menggantinya untuk kontrol yang lebih rinci.

**Batasan penting:** video katalog ini tanpa suara. Urutan fonem adalah demonstrasi animasi, bukan lip-sync hasil analisis rekaman, bukan forced alignment, dan bukan sinkronisasi dialog bahasa Indonesia yang sudah disahkan. Integrasi timecode viseme per ucapan masih perlu dilakukan saat dialog diproduksi. Pose tubuh, blocking adegan dan kontak dokumen tidak disentuh pada batch wajah ini.

## QA

- Hash lock tubuh lolos.
- Typecheck, validasi proyek, tes IK/FK, tes katalog tubuh, dan build lolos (hanya peringatan ukuran bundle Vite).
- 960 frame sampel wajah dirender ke SVG dalam tes: nilai finite, indeks deterministik, 11 set kanal emosi berbeda, 8 bentuk mulut, dan clip-path unik untuk 16 karakter.
- Katalog video 40 detik dirender dari komponen produksi. Sampel tiap indeks diperiksa; ini bukan pemeriksaan manual setiap frame atau persetujuan episode final.

Perintah: `npm run test:face`, `npm run render:face-catalog`. Sandbox render memerlukan `--browser-executable=/tmp/chromium` dan `LD_LIBRARY_PATH=/tmp/chromium-libs/lib:/tmp/chromium-libs/lib64`.
