# AGENTS.md: Platform Media Monitoring & OSINT Instansi

## Sumber kebenaran (baca sebelum mengerjakan apa pun)
- PRD: ./PRD_Platform_Media_Monitoring___OSINT_Instansi.md (fungsi, data model, edge case)
- DESIGN.md: ./DESIGN.md (token, perilaku, state, aksesibilitas)
- Desain visual: ./design/stitch/ (screenshot dan HTML per layar). Ini sumber kebenaran TAMPILAN.
Bila Stitch dan DESIGN.md bertentangan: tampilan ikut Stitch, perilaku dan aksesibilitas ikut DESIGN.md. Catat setiap konflik di akhir tugas.

## Produk
Platform internal media monitoring dan OSINT untuk satu instansi (single-tenant, dua role: admin dan pimpinan). UI berbahasa Indonesia, rute URL berbahasa Inggris, angka format id-ID, waktu WIB.

## Stack
Next.js App Router + TypeScript strict, Tailwind v4, MySQL 8.4 (Drizzle + mysql2), Playwright/Chromium, d3-cloud, d3 untuk grafik SVG, Lucide, Manrope lokal via next/font/local, Vitest + Playwright Test. Hal yang bukan dari PRD atau DESIGN.md diberi komentar ASUMSI.

## Dilarang
LLM atau API AI/NLP berbayar; X API resmi; menyimpan isi penuh artikel, gambar, atau video (hanya judul, cuplikan, tautan); fitur v2 (peta, watchlist, alert, executive briefing, story clustering, framing); multi-tenant; aplikasi mobile; cakupan satker; TikTok dan Facebook.

## Aturan kerja
1. Kerjakan hanya cakupan prompt yang diberikan.
2. Jangan mengarang kolom, endpoint, atau teks UI yang tidak ada di PRD, DESIGN.md, atau Stitch. Bila perlu, beri label USULAN dan catat di akhir.
3. Item bertanda OQ dibuat sebagai konfigurasi (env atau satu berkas konstanta), bukan angka tersebar. Default: MFA wajib (flag); rentang kustom maks 90 hari; cuplikan maks 500 karakter; ambang kesegaran berita 30/120 menit dan sosial 60/180 menit; retry maks 3 dan processing macet setelah 15 menit; graf 60 node dan bobot minimum edge 2; timeout browser jarak jauh 5 menit; keyakinan rendah bila confidence < 0,4.
4. Filter Kategori hanya menyaring Berita (kategori berasal dari RSS); konten sosial tidak ikut disaring dan dropdown memberi keterangan. Buat mudah diganti.
5. Jangan mengarang URL feed RSS atau bentuk respons platform sosial. Parser ditulis dari fixture nyata yang disediakan pemilik proyek; bila belum ada, beri TODO.
6. Frontend: tampilan harus identik dengan screenshot Stitch. Pindahkan nilai hardcode ke token Tailwind (DESIGN.md 3.7) tanpa mengubah hasil visual. Jangan merancang ulang atau menambah elemen.
7. Kata sandi, token, dan kunci hanya dari env, tidak pernah di repo.
8. Tulis uji untuk setiap FR dan edge case yang disentuh.
9. Akhiri setiap tugas dengan: daftar asumsi, konflik Stitch vs DESIGN.md, dan hal yang belum selesai.