# AGENTS.md: Sentix

## Sumber kebenaran (baca sebelum mengerjakan apa pun)
- PRD: ./PRD_Platform_Media_Monitoring___OSINT_Instansi.md (fungsi, data model, edge case)
- DESIGN.md: ./DESIGN.md (token, perilaku, state, aksesibilitas)
- Tampilan: ./design/stitch/. Satu folder per layar berisi code.html dan screen.png. Peta layar ke ID DESIGN.md ada di design/stitch/README.md. Ini sumber kebenaran TAMPILAN. design/stitch/_tokens/stitch-design-system.md hanya referensi; token resmi ada di DESIGN.md 3.7.
Bila Stitch dan DESIGN.md bertentangan: tampilan ikut Stitch, kecuali daftar Pengecualian di bawah; perilaku dan aksesibilitas ikut DESIGN.md. Catat setiap konflik di akhir tugas.

## Produk
Sentix: platform internal media monitoring dan OSINT untuk satu instansi (single-tenant, dua role: admin dan pimpinan). UI berbahasa Indonesia, rute URL berbahasa Inggris, angka format id-ID, waktu WIB.
Nama Sentix menggantikan placeholder Pantau Media di Stitch dan DESIGN.md. Simpan di src/lib/brand.ts (nama, tagline, inisial dan ikon logo); tampilkan di logo sidebar, halaman login, judul tab, dan metadata. Hanya teks nama yang berubah; ukuran, warna, dan tata letak tetap seperti Stitch. Logo PM dengan ikon radar adalah placeholder dan harus mudah diganti. Nama paket npm, folder, dan database: sentix.

## Stack
Next.js App Router + TypeScript strict, Tailwind v4 (dikompilasi saat build, bukan CDN), MySQL (Drizzle + mysql2), Playwright/Chromium, d3-cloud, d3 untuk grafik SVG, Manrope lokal via next/font/local, Vitest + Playwright Test. Ikon: Material Symbols Outlined dihost lokal (subset ikon yang dipakai di design/stitch), SVG inline dari Stitch disalin apa adanya. Tanpa CDN apa pun. Hal yang bukan dari PRD atau DESIGN.md diberi komentar ASUMSI.
Database: MySQL lokal lewat Laragon (8.0.30) saat pengembangan, MySQL 8.4 di produksi. Pakai hanya SQL yang valid di keduanya. Koneksi dari DATABASE_URL di .env.local. Tanpa Docker.

## Dilarang
LLM atau API AI/NLP berbayar; X API resmi; menyimpan isi penuh artikel, gambar, atau video (hanya judul, cuplikan, tautan); fitur v2 (peta, watchlist, alert, executive briefing, story clustering, framing); multi-tenant; aplikasi mobile; cakupan satker; TikTok dan Facebook.

## Aturan kerja
1. Kerjakan hanya cakupan prompt yang diberikan.
2. Jangan mengarang kolom, endpoint, atau teks UI yang tidak ada di PRD, DESIGN.md, atau Stitch. Bila perlu, beri label USULAN dan catat di akhir.
3. Jangan mengarang URL feed RSS, isi leksikon besar, atau bentuk respons platform sosial. Parser ditulis dari fixture nyata yang disediakan pemilik proyek; bila belum ada, beri TODO.
4. Item bertanda OQ dibuat sebagai konfigurasi (env atau satu berkas konstanta), bukan angka tersebar.
5. Kata sandi, token, dan kunci hanya dari env, tidak pernah di repo.
6. Tulis uji untuk setiap FR dan edge case yang disentuh.
7. Akhiri setiap tugas dengan: daftar asumsi, konflik Stitch vs DESIGN.md, dan hal yang belum selesai.

## Aturan UI
- Semua halaman (login, dashboard, admin, error) harus tampil identik dengan screen.png di design/stitch: tata letak, jarak, warna, ukuran font, radius, bayangan, teks. Jangan merancang ulang, merapikan, atau menambah elemen.
- code.html Stitch adalah sumber nilai (ukuran, warna, teks), bukan untuk disalin mentah. Konfigurasi Tailwind berbeda di tiap file, jadi ambil nilai akhirnya dan pindahkan ke token Tailwind (DESIGN.md 3.7) tanpa mengubah hasil visual.
- Yang tidak ada di HTML statis (interaksi, state memuat, kosong, galat, offline, fokus, ARIA, responsif) ditambahkan sesuai DESIGN.md.
- Screenshot desktop berlebar 1600 px; pakai viewport 1600 px untuk perbandingan desktop. Screenshot ponsel dan modal diperkecil, bandingkan secara visual.
- Gunakan data fixture dengan angka yang sama seperti Stitch (12.480, 38%, 41%, 21%) untuk uji tampilan.

## Pengecualian: ada di Stitch tetapi JANGAN ditiru
- Navigasi bawah di ponsel (Feed, Alerts, Radar, Metrik): ganti dengan tombol hamburger dan laci sesuai DESIGN.md 9.2. Tidak ada fitur alert di MVP.
- Skor Relevansi (misalnya 98%) pada kartu Konten terbaru di ponsel: hapus.
- Titik hijau WIB Aktif dan judul serba kapital di ponsel: tidak ada di DESIGN.md; pakai chip kesegaran dan huruf kapital hanya di awal kalimat.
- Pesan galat contoh di Status sistem yang menyebut api.x.com: sistem tidak memakai X API. Gunakan pesan dari adapter, misalnya Sesi X tidak valid sejak 09:10 WIB.
- Teks yang membungkus pada segmented periode, pill tanggal, dropdown Sumber: Semua, dan subjudul KPI di desktop adalah cacat render Stitch: pakai whitespace-nowrap dan tata letak yang tidak membungkus pada 1600 px.
- URL feed RSS, akun, angka, dan nama di Stitch adalah data contoh: jangan di-seed atau dipakai sebagai data nyata.
- Pantau Media menjadi Sentix (lihat Produk).

## Nilai default Open Question (konfigurasi)
MFA wajib untuk semua = flag, default aktif. Rentang kustom maksimal 90 hari. Cuplikan maksimal 500 karakter. Ambang kesegaran: berita 30/120 menit, sosial 60/180 menit. Retry maksimal 3 kali; status processing macet setelah 15 menit. Graf 60 node, bobot minimum edge 2. Timeout browser jarak jauh 5 menit. Keyakinan rendah bila confidence di bawah 0,4. Filter Kategori hanya menyaring Berita (kategori berasal dari RSS); konten sosial tidak ikut disaring dan dropdown memberi keterangan. Buat mudah diganti.