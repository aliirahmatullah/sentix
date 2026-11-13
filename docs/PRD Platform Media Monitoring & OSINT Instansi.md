# PRD: Platform Media Monitoring & OSINT Instansi

Versi: 1.1 (draft) | Status: OQ-1 sampai OQ-3 terjawab, OQ lain masih terbuka (bagian 10) | Pemilik: Product Management

Dasar: dokumen deskripsi sistem + jawaban klarifikasi. Semua hal yang tidak dinyatakan jelas ditandai **\[OQ-n\]** dan tidak diasumsikan.

---

## 1. Problem Statement

**Siapa yang dirugikan:** pimpinan satu instansi yang harus memantau opini publik dan mengambil keputusan, serta admin yang menyiapkan data untuknya.

**Masalah:**

- Pemberitaan tersebar di 12+ media online dan percakapan di X. Tidak ada satu tempat yang menyatukannya.
- Pemantauan manual lambat, tidak konsisten, dan tidak bisa menjawab pertanyaan dasar: isu apa yang naik, sentimennya ke arah mana, siapa aktor yang terkait.
- Layanan monitoring komersial dan API AI berbayar mahal. Mengirim data instansi ke pihak ketiga juga menimbulkan risiko kerahasiaan.
- Data publik yang dikumpulkan berisiko melanggar hak cipta dan UU PDP jika disimpan penuh tanpa batas retensi.

**Akibat:** keputusan diambil terlambat atau dengan gambaran parsial.

**Solusi:** platform internal yang mengagregasi berita dan X, menganalisis sentimen, kata kunci, dan jejaring aktor secara lokal (tanpa API AI berbayar), menyimpan data minimal, dan menyajikannya dalam dashboard untuk pimpinan.

---

## 2. Target User dan Persona

Sistem single-tenant (satu instansi), tepat 2 jenis user.

### Persona 1: Pimpinan (konsumen akhir)

- **Peran:** pengambil keputusan, memantau kondisi media.
- **Kebutuhan:** gambaran cepat dan dapat dipercaya tentang isu, sentimen, aktor, dan perbandingan berita vs X. Mampu menelusuri ke sumber asli.
- **Perilaku:** waktu terbatas, membuka dashboard singkat, tidak mengonfigurasi sistem.
- **Frustrasi:** data tidak terbaru, grafik tidak bisa ditelusuri ke artikel, sentimen yang tidak masuk akal.
- **Ukuran sukses baginya:** mengambil atau menyesuaikan keputusan berdasarkan data dashboard.

### Persona 2: Admin (operator)

- **Peran:** menjaga sistem berjalan dan data sehat.
- **Kebutuhan:** mengelola sumber RSS, kueri X, sesi login X, akun user, kamus alias, dan memantau status pipeline.
- **Perilaku:** teknis, bertanggung jawab atas uptime dan kepatuhan.
- **Frustrasi:** sesi X kedaluwarsa tanpa peringatan, job macet, tidak tahu penyebab data kosong.
- **Ukuran sukses baginya:** pipeline berjalan otomatis, kegagalan terlihat dan bisa dipulihkan tanpa akses database langsung.

---

## 3. Goals dan Non-Goals

### Goals (MVP)

1. Mengumpulkan artikel dari 12+ media RSS serta postingan X, Instagram, dan Threads secara otomatis dan terjadwal.
2. Menganalisis setiap artikel dan postingan secara lokal: kata kunci, sentimen (positive/neutral/negative), entitas (tokoh, organisasi, perusahaan, lokasi).
3. Menyajikan dashboard terfilter (waktu, kategori, sumber) dengan word cloud, rasio dan tren sentimen, serta graf jejaring aktor (SNA), semuanya dapat ditelusuri ke tautan asli.
4. Membatasi akses dengan autentikasi kuat, 2 role, dan audit log.
5. Mematuhi prinsip data minimization dan retensi data sosial 90 hari.
6. Nol biaya API AI/NLP berbayar dan nol biaya X API.

### Non-Goals (MVP)

- Tidak menyimpan isi penuh artikel.
- Tidak memakai LLM atau API AI komersial untuk analisis.
- Tidak menyediakan portal berita publik.
- Tidak mendukung multi-tenant.
- Tidak ada analisis geospasial, watchlist/alert, dossier, executive briefing otomatis, story clustering, atau framing analysis (semua v2).
- Tidak mengambil data dari TikTok dan Facebook pada MVP (masuk v2) **\[OQ-1\]**.
- Tidak memprediksi atau merekomendasikan keputusan. Sistem hanya menyajikan data.

---

## 4. User Stories

### Pimpinan

- Sebagai pimpinan, saya ingin melihat ringkasan sentimen berita dan X hari ini, 7 hari, dan 30 hari, supaya saya tahu arah opini publik saat ini.
- Sebagai pimpinan, saya ingin memfilter semua grafik dengan satu set filter (tanggal, kategori, sumber), supaya semua visual konsisten.
- Sebagai pimpinan, saya ingin mengklik kata di word cloud dan melihat artikel pendukungnya, supaya saya bisa memverifikasi isu sebelum bertindak.
- Sebagai pimpinan, saya ingin melihat graf hubungan antar tokoh dan organisasi serta mengklik garis relasinya untuk membaca artikel penghubungnya, supaya saya memahami siapa terkait dengan siapa.
- Sebagai pimpinan, saya ingin tiap data menampilkan sumber dan tautan asli, supaya saya bisa membaca beritanya langsung.
- Sebagai pimpinan, saya ingin tahu kapan data terakhir diperbarui, supaya saya tidak memutuskan berdasarkan data usang.

### Admin

- Sebagai admin, saya ingin menambah, menonaktifkan, dan memantau sumber RSS, supaya cakupan media terkendali.
- Sebagai admin, saya ingin mengatur kueri pemantauan X (keyword dan trending), supaya topik yang relevan terpantau.
- Sebagai admin, saya ingin login ke X lewat browser jarak jauh tanpa sistem menyimpan password, supaya sesi scraper bisa diperbarui dengan aman.
- Sebagai admin, saya ingin melihat status tiap cron job dan jumlah artikel gagal analisis, supaya masalah cepat terdeteksi.
- Sebagai admin, saya ingin mengelola kamus alias entitas, supaya "Jokowi" dan "Joko Widodo" dihitung sebagai satu entitas.
- Sebagai admin, saya ingin membuat dan menonaktifkan akun user serta mengaktifkan MFA, supaya akses terkontrol.
- Sebagai admin, saya ingin melihat audit log, supaya aksi sensitif dapat ditelusuri.

---

## 5. Daftar Fitur

### MVP

| # | Fitur |
| --- | --- |
| F1 | Ingestion RSS multi-sumber + normalisasi dan deduplikasi |
| F2 | Pipeline NLP lokal: pembersihan teks, kata kunci/n-gram, sentimen leksikon, NER + alias |
| F3 | Social Network Analysis (co-occurrence, node/edge, cache harian) |
| F4 | Monitoring X (scraper cookie/sesi, kueri keyword dan trending, checkpoint, retensi 90 hari, tombstone) |
| F5 | Remote session management X (`/admin/x-connection`) |
| F6 | Dashboard: filter terpadu, word cloud + drill-down, sentimen (rasio dan tren), graf SNA |
| F7 | Autentikasi, 2 role (pimpinan/admin), brute-force throttling, CSRF, audit log, MFA TOTP **\[OQ-4\]** |
| F8 | Cron pipeline + panel status operasional untuk admin |
| F9 | Maintenance: retensi data, bersih sesi kedaluwarsa, rotasi audit log |
| F10 | Monitoring Instagram dan Threads (Playwright headless browser + network interception) |

### v2

- Platform sosial lain: TikTok, Facebook (dan lainnya yang bisa diambil) **\[OQ-1\]**
- Watchlist dan early warning (spike detection) + webhook dengan proteksi SSRF
- Geospasial / peta interaktif
- Story clustering + embedding judul
- Analisis framing berita vs medsos (narrative correlations)
- Deteksi anomali dan intelligence alerts
- Dossier profil entitas
- Executive Briefing harian (Markdown)
- Portal berita publik (SSR) dan fallback RSS langsung
- Cakupan data per satker/unit: dibatalkan, tidak diperlukan (units, unit\_topics) **\[OQ-3\]**
- Estimasi biaya baca API X (tidak relevan jika tanpa API resmi)

### Nanti (belum dijadwalkan)

- Dukungan Twitter API v2 resmi sebagai fallback
- Multi-tenant / multi-instansi
- Aplikasi mobile
- Model NLP berbasis ML lokal untuk menggantikan leksikon

---

## 6. Functional Requirements MVP

### F1. Ingestion RSS

- FR1.1 Sistem mengambil feed dari daftar sumber aktif (target awal 12+: ANTARA, Tempo, Kompas, Detik, CNN, CNBC, RRI, Republika, Kumparan, dll.). Daftar final **\[OQ-5\]**.
- FR1.2 Parser menerima RSS 2.0 dan Atom, toleran terhadap field hilang atau format tidak baku.
- FR1.3 Normalisasi URL: hapus parameter pelacak (`utm_*` dan sejenisnya) sebelum disimpan.
- FR1.4 Deduplikasi dua lapis: unik pada `original_url` ternormalisasi, dan unik pada `content_fingerprint` (hash judul + ringkasan) untuk mencegah duplikat lintas kategori.
- FR1.5 Yang disimpan: judul, ringkasan/cuplikan, URL asli, sumber, kategori, waktu terbit. Isi penuh artikel tidak disimpan. Batas panjang cuplikan **\[OQ-13\]**.
- FR1.6 Artikel baru masuk dengan status analisis `pending`.
- FR1.7 Kegagalan satu feed tidak menghentikan feed lain. Kegagalan dicatat per sumber (waktu, penyebab) dan terlihat di panel admin.
- FR1.8 Admin dapat menambah, mengubah, dan menonaktifkan sumber.
- FR1.9 Penjadwalan: tiap 10-15 menit via `POST /api/cron/ingest` dengan Bearer token.

### F2. Pipeline NLP Lokal

- FR2.1 State machine analisis: `pending` -> `processing` -> `done` | `failed`.
- FR2.2 Pembersihan: hapus tag HTML, decode entitas HTML/XML, normalisasi Unicode NFKC, lowercase `id-ID`, buang stopword Bahasa Indonesia (kata hubung, kata ganti, angka).
- FR2.3 Kata kunci: ekstraksi kata bermakna dan frasa (n-gram) dengan bobot term. Versi extractor dicatat (`id-lexicon-v2`) agar hasil dapat diaudit dan dianalisis ulang.
- FR2.4 Sentimen leksikon, 3 kelas (positive/neutral/negative). Menangani negasi (tidak, bukan, tanpa) dan intensifier (sangat, makin, amat). Output: skor -1.0 s/d +1.0, confidence, dan jumlah kata cocok (hits).
- FR2.5 NER berbasis aturan dan kamus untuk Person, Organization, Company, Location. Deteksi berbasis jabatan/awalan (Presiden, Menteri, Kapolri, Panglima, Kepala Badan, dll.).
- FR2.6 Normalisasi alias entitas lewat kamus yang dapat dikelola admin (mis. Jokowi -> Joko Widodo, AS -> Amerika Serikat).
- FR2.7 Batch: `POST /api/cron/analyze?limit=100` tiap 5 menit. Memakai `GET_LOCK` agar tidak ada dua worker bersamaan.
- FR2.8 Artikel gagal diproses ditandai `failed` dan dicoba ulang setelah jeda 60 menit. Batas jumlah retry **\[OQ-18\]**.
- FR2.9 Teks sosial (X) diproses dengan pipeline yang sama.

### F3. SNA

- FR3.1 Dua entitas yang muncul dalam satu artikel/postingan membentuk satu edge. Bobot edge = jumlah kemunculan bersama.
- FR3.2 Hasil dikompilasi per tanggal ke `daily_sna_cache`. Dashboard membaca dari cache, bukan menghitung ulang real-time.
- FR3.3 Graf interaktif: node = tokoh/organisasi/perusahaan, garis = relasi. Klik node atau edge menampilkan artikel/postingan yang menghubungkan.
- FR3.4 Graf mengikuti filter global. Batas jumlah node yang ditampilkan agar tetap terbaca **\[OQ-19\]**.

### F4. Monitoring X

- FR4.1 Sumber data: scraper Playwright dengan sesi login (cookie `storage-state.json`). Tanpa X API berbayar.
- FR4.2 Mode kueri **keyword** (sintaks X, mis. `keamanan siber lang:id -is:retweet`) dan mode **trending** (topik Explore teratas Indonesia).
- FR4.3 Admin mengelola kueri (tambah, aktif/nonaktif).
- FR4.4 Checkpoint `last_since_id` per kueri agar run berikutnya hanya mengambil postingan baru.
- FR4.5 Data yang disimpan: akun, teks, waktu, tautan asli, metrik interaksi (likes, retweets, dll.). Menjalankan analisis NLP yang sama dengan F2.
- FR4.6 Retensi: teks mentah otomatis dihapus setelah 90 hari (`raw_expires_at`).
- FR4.7 Tombstone: jika postingan terdeteksi dihapus pemiliknya, status `tombstone` dicatat dan postingan hilang dari dashboard.
- FR4.8 Setiap run dicatat (`social_ingestion_runs`): waktu, jumlah diambil, status, error.
- FR4.9 Penjadwalan tiap 15-30 menit via `POST /api/cron/social/ingest`.
- FR4.10 Jika sesi tidak valid, run berhenti dengan status jelas dan admin melihat peringatan di panel. Kanal notifikasi selain panel **\[OQ-17\]**.
- FR4.11 Persetujuan legal instansi sudah ada. Risiko pemblokiran akun tetap ada (edge case 11) **\[OQ-2\]**.

### F5. Remote Session Management X

- FR5.1 Halaman `/admin/x-connection` (khusus admin) menjalankan Chromium virtual sementara di server, di-stream melalui Nginx.
- FR5.2 Admin login manual (termasuk CAPTCHA/2FA) di browser tersebut. Sistem menyimpan hanya file sesi, tidak pernah password.
- FR5.3 Sesi browser virtual berakhir otomatis setelah timeout. Batas waktu **\[OQ-20\]**.
- FR5.4 Halaman menampilkan status sesi (valid/tidak, terakhir diperbarui).
- FR5.5 File sesi dilindungi (izin file ketat) dan tidak dapat diunduh lewat web.

### F6. Dashboard

- FR6.1 **Filter global:** hari ini / 7 hari / 30 hari / rentang kustom; kategori; topik (pengurutan dan penyaringan berdasarkan topik dan hasil analisis, definisi topik OQ-25); sumber (berita, X, Instagram, Threads). Filter berlaku ke semua komponen.
- FR6.2 **Word cloud** (d3-cloud): ukuran proporsional frekuensi. Klik kata menampilkan maksimal 30 artikel pendukung tanpa mengubah filter global.
- FR6.3 **Sentimen:** grafik rasio (batang/donat) dan grafik garis tren harian.
- FR6.4 **SNA graph** sesuai FR3.3.
- FR6.5 Setiap item artikel/postingan menampilkan sumber, waktu, sentimen, dan tautan ke URL asli.
- FR6.6 Menampilkan waktu pembaruan data terakhir per sumber (berita dan X).
- FR6.7 Berita dan tiap platform sosial (X, Instagram, Threads) dapat dibedakan secara visual dan dapat difilter terpisah.
- FR6.8 Dashboard hanya diakses lewat VPN/LAN instansi.
- FR6.9 Target performa dashboard **\[OQ-7\]**.

### F7. Autentikasi dan Keamanan

- FR7.1 Dua role: `admin` dan `pimpinan`. Hanya admin yang mengakses konfigurasi (sumber, kueri X, user, alias, panel operasional, audit log). Pimpinan hanya-baca dan melihat seluruh data, tanpa pembatasan satker atau topik.
- FR7.2 Password di-hash dengan scrypt/PBKDF2/argon2.
- FR7.3 Sesi: cookie `httpOnly`, `SameSite=Lax`, `Secure`; token sesi disimpan ter-hash di database.
- FR7.4 MFA TOTP (RFC 6238). Wajib atau opsional **\[OQ-4\]**.
- FR7.5 Throttling login per IP dan per username; tiap upaya dicatat (`login_attempts`).
- FR7.6 Proteksi CSRF via header `Origin`/`Sec-Fetch-Site`.
- FR7.7 Audit log untuk aksi sensitif (tambah/hapus user, hapus data, ubah konfigurasi, koneksi X): aktor, aksi, target, IP, User-Agent.
- FR7.8 Endpoint cron hanya menerima Bearer token yang valid.
- FR7.9 Pemulihan akun admin jika password/MFA hilang **\[OQ-21\]**.

### F8. Cron dan Panel Operasional

| Job | Jadwal | Fungsi |
| --- | --- | --- |
| `/api/cron/ingest` | 10-15 menit | Ambil RSS |
| `/api/cron/analyze` | 5 menit | Analisis batch, ber-lock |
| `/api/cron/social/ingest` | 15-30 menit | Ambil X, Instagram, Threads |
| `/api/cron/social/maintenance` | harian | Hapus raw > 90 hari, bersihkan sesi kedaluwarsa, rotasi audit log > 365 hari |

- FR8.1 Job SNA harian menulis `daily_sna_cache`. Jadwal tepatnya **\[OQ-22\]**.
- FR8.2 Panel admin menampilkan per job: run terakhir, status, durasi, jumlah diproses, error terakhir; plus jumlah artikel per status analisis.
- FR8.3 Semua job idempoten: run ganda atau overlap tidak menghasilkan duplikasi.

### F9. Retensi dan Kepatuhan

- FR9.1 Hanya metadata, cuplikan, dan tautan asli yang disimpan.
- FR9.2 Postingan X: hapus teks mentah > 90 hari. Retensi metadata artikel berita **\[OQ-8\]**.
- FR9.3 Audit log dirotasi setelah 365 hari.

### F10. Monitoring Instagram dan Threads

- FR10.1 Metode: Playwright headless browser dengan network interception, yaitu menangkap respons jaringan (XHR/GraphQL) yang dimuat halaman, bukan hanya membaca DOM. Tanpa API berbayar.
- FR10.2 Data yang disimpan: akun, teks/caption, waktu, tautan asli, metrik interaksi yang tersedia. Gambar dan video tidak disimpan, hanya tautan.
- FR10.3 Memakai tabel `social_*` dengan kolom `platform`, pipeline NLP (F2), SNA (F3), retensi 90 hari, dan tombstone (FR4.6, FR4.7) yang sama dengan X.
- FR10.4 Admin mengelola target pemantauan per platform (tambah, aktif/nonaktif). Bentuk target: akun, hashtag, atau keyword **\[OQ-27\]**.
- FR10.5 Sesi login: **\[OQ-26\]**. Jika sesi dipakai, disimpan sebagai file sesi dan dikelola seperti F5, tanpa menyimpan password.
- FR10.6 Tiap run dicatat per platform di `social_ingestion_runs`. Kegagalan satu platform tidak menghentikan platform lain.
- FR10.7 Jika format respons platform berubah, run gagal terkontrol, tidak ada data parsial salah yang disimpan, dan admin melihat peringatan di panel. Pemeliharaan parser **\[OQ-28\]**.
- FR10.8 Jadwal mengikuti `POST /api/cron/social/ingest`. Interval **\[OQ-27\]**.
- FR10.9 Dashboard menampilkan platform sebagai sumber yang dapat difilter dan dibedakan (FR6.1, FR6.7).

---

## 7. Sketsa Data Model (MVP)

MySQL 8.4. Hanya tabel MVP. Field kunci saja.

**Berita**

- `sources`: id, name, feed\_url, category, is\_active, last\_fetched\_at, last\_error
- `articles`: id, source\_id, title, snippet, original\_url (unik, ternormalisasi), content\_fingerprint (unik), published\_at, category, analysis\_status
- `article_analyses`: article\_id, status, attempts, last\_error, next\_retry\_at, extractor\_version

**NLP**

- `article_keywords`: article\_id, term, weight, ngram\_size
- `article_sentiments`: article\_id, label, score, confidence, hits
- `article_entities`: article\_id, entity\_name (kanonik), type (person/org/company/location)
- `entity_aliases`: alias, canonical\_name, type
- `article_entity_edges`: article\_id, entity\_a, entity\_b
- `article_entity_runs`: id, run\_at, status
- `daily_sna_cache`: date, scope/filter key, payload (nodes, edges, bobot)

**X**

- `social_monitor_queries`: id, mode (keyword/trending), query, is\_active, last\_since\_id
- `social_accounts`: id, handle, display\_name
- `social_posts`: id, account\_id, external\_id, text, posted\_at, url, raw\_expires\_at, status (active/tombstone)
- `social_post_keywords`, `social_post_sentiments`: analog dengan versi artikel
- `social_interactions`: post\_id, likes, reposts, replies, captured\_at
- `social_compliance_tombstones`: post\_id, detected\_at, reason
- `social_ingestion_runs`: id, query\_id, started\_at, finished\_at, fetched\_count, status, error

**Keamanan**

- `users`: id, username, password\_hash, role (admin/pimpinan), mfa\_secret, is\_active
- `user_sessions`: id, user\_id, token\_hash, expires\_at
- `login_attempts`: id, username, ip, success, attempted\_at
- `audit_logs`: id, actor\_id, action, target, ip, user\_agent, created\_at

**Catatan:** `units`, `user_units`, `unit_topics` tidak dipakai karena cakupan satker tidak diperlukan **\[OQ-3\]**. Tabel social\_\* dipakai bersama oleh X, Instagram, dan Threads (kolom platform), lihat F10 dan **\[OQ-1\]**.

Kolom `platform` (x, instagram, threads) ditambahkan pada `social_accounts`, `social_posts`, `social_monitor_queries`, dan `social_ingestion_runs`. `external_id` unik per platform.

---

## 8. Edge Case dan Failure State

| # | Situasi | Perilaku yang dituntut |
| --- | --- | --- |
| 1 | Satu feed RSS timeout / XML rusak / berubah format | Feed itu dilewati, error dicatat, feed lain tetap jalan. Panel admin menandai sumber bermasalah. |
| 2 | Artikel yang sama muncul di beberapa kategori/feed | Hanya satu record (dedup URL dan fingerprint). |
| 3 | URL sama dengan parameter pelacak berbeda | Dianggap satu artikel setelah normalisasi. |
| 4 | Judul sama tapi isi berbeda (judul generik) | Fingerprint memakai judul + ringkasan. Kemungkinan salah gabung dicatat sebagai risiko. |
| 5 | Dua worker analisis berjalan bersamaan | `GET_LOCK` mencegah proses ganda. Worker kedua keluar tanpa error. |
| 6 | Worker mati saat artikel berstatus `processing` | Artikel yang macet melewati batas waktu dikembalikan ke `pending`. Batas waktu **\[OQ-18\]**. |
| 7 | Artikel gagal diproses berulang | Retry dengan jeda 60 menit. Setelah batas retry tetap `failed` dan terlihat di panel. |
| 8 | Teks kosong, sangat pendek, atau bukan Bahasa Indonesia | Disimpan, sentimen `neutral` dengan confidence rendah. Perlakuan untuk teks berbahasa Inggris **\[OQ-12\]**. |
| 9 | Sarkasme, bahasa gaul, singkatan di X | Leksikon tidak menangani. Diterima sebagai keterbatasan, akurasi diukur terpisah **\[OQ-6\]**. |
| 10 | Entitas ambigu (nama orang = nama tempat, alias bertabrakan) | Hasil mengikuti kamus. Konflik tidak diselesaikan otomatis. Admin memperbaiki lewat kamus. |
| 11 | Sesi X kedaluwarsa / diminta verifikasi ulang / akun dibatasi atau diblokir | Run berhenti, status jelas, admin diberi peringatan. Dashboard menampilkan "data X tidak diperbarui sejak ..." dan tidak menyajikan data lama seolah baru. |
| 12 | X mengubah struktur halaman sehingga scraper gagal | Run gagal dengan error tercatat. Tidak ada data parsial yang salah disimpan. |
| 13 | Rate limit / deteksi bot dari X | Backoff, run ditunda. Tidak mengulang agresif. |
| 14 | Postingan dihapus pemilik | Tombstone, hilang dari dashboard dan dari agregat berikutnya. |
| 15 | Raw post melewati 90 hari | Teks mentah dihapus. Agregat yang sudah dihitung tetap ada (konfirmasi dengan **\[OQ-8\]**). |
| 16 | Cron dipanggil tanpa/salah Bearer token | Ditolak (401), dicatat. |
| 17 | Brute-force login | Throttling per IP dan username. Pesan error tidak membocorkan apakah username ada. |
| 18 | Admin kehilangan perangkat MFA | Prosedur pemulihan **\[OQ-21\]**. |
| 19 | Database tidak tersedia | Dashboard menampilkan error jelas. Cron gagal tanpa kehilangan data yang sudah tersimpan. |
| 20 | Filter menghasilkan 0 data | Tampilan kosong yang eksplisit, bukan grafik rusak. |
| 21 | Data belum terisi (instalasi baru) | Dashboard menampilkan status "belum ada data", bukan error. |
| 22 | Chromium kehabisan memori di server | Job X gagal terkontrol dan tidak menjatuhkan database/dashboard. Batas sumber daya **\[OQ-23\]**. |
| 23 | Tautan asli artikel sudah mati | Metadata tetap tampil, tautan tidak diperbaiki. |

---

## 9. Success Metrics

Definisi "selesai" dari stakeholder: fitur berjalan, lolos uji, dan pimpinan berhasil memonitor atau mengambil keputusan. Angka target di bawah adalah **usulan, belum disetujui**. Tandai dan setujui sebelum dikunci.

### A. Kriteria selesai (gate rilis)

1. Seluruh fitur MVP (F1-F9) berjalan di lingkungan target dan lolos uji fungsional (semua FR terpenuhi) dan uji keamanan dasar (login throttling, CSRF, akses role, SSRF tidak relevan di MVP). Persyaratan pentest formal **\[OQ-24\]**.
2. Pipeline berjalan otomatis minimal 7 hari berturut-turut tanpa intervensi manual (usulan).
3. Pimpinan menyatakan data di dashboard dapat dipakai untuk memonitor (UAT tertulis).

### B. Metrik produk

| Metrik | Usulan target | Cara ukur |
| --- | --- | --- |
| Keputusan/tindakan pimpinan yang merujuk dashboard | min. 1 kasus terdokumentasi selama pilot (angka final **\[OQ-15\]**) | Catatan pimpinan/wawancara, log akses |
| Frekuensi penggunaan pimpinan | min. 1x per hari kerja selama pilot | Log sesi |
| Kesegaran data berita | ≥ 95% artikel muncul di dashboard < 30 menit sejak terbit di feed | Selisih `published_at` vs waktu analisis selesai |
| Kesegaran data X | run sukses ≥ 90% dari jadwal | `social_ingestion_runs` |
| Keberhasilan analisis | ≥ 99% artikel `done` (bukan `failed`) | `article_analyses` |
| Akurasi sentimen dan NER | target ditetapkan setelah dataset uji berlabel ada **\[OQ-6\]** | Evaluasi terhadap sampel berlabel manusia |
| Duplikasi | < 1% artikel duplikat pada sampel audit | Audit sampel |
| Performa dashboard | target ditetapkan setelah volume diketahui **\[OQ-7\]** | Pengukuran waktu muat |
| Biaya API berbayar | Rp0 | Tagihan |
| Kepatuhan retensi | 0 postingan X dengan raw text > 90 hari | Query audit |

---

## 10. Open Questions

| ID | Pertanyaan | Dampak |
| --- | --- | --- |
| OQ-1 | TERJAWAB. Instagram dan Threads masuk MVP (F10), diambil dengan Playwright headless browser + network interception. TikTok dan Facebook masuk v2. | Scope, tenggat, risiko |
| OQ-2 | TERJAWAB. Persetujuan legal instansi sudah ada dan akun yang dipakai milik instansi. Arti tidak perlu login: lihat OQ-26. | Kelayakan modul X |
| OQ-3 | TERJAWAB. Cakupan satker/unit tidak diperlukan. Pimpinan melihat semua data dan menyaring lewat pengurutan topik dan hasil analisis (definisi topik: OQ-25). | Data model, filter |
| OQ-4 | MFA TOTP wajib untuk semua user atau hanya admin atau opsional? | Alur login |
| OQ-5 | Daftar final sumber RSS, kategori, serta topik/kata kunci/tokoh yang menjadi fokus pemantauan. Siapa yang menetapkan? | Isi awal sistem, kueri X |
| OQ-6 | Target akurasi sentimen dan NER, dan siapa yang menyediakan dataset uji berlabel? Leksikon rule-based punya batas akurasi, apakah itu diterima? | Kriteria lolos uji |
| OQ-7 | Perkiraan volume: artikel/hari, postingan X/hari, dan target waktu muat dashboard. | Desain performa, kapasitas server |
| OQ-8 | Retensi metadata artikel berita dan agregat (word cloud, sentimen, SNA)? Hanya raw X 90 hari dan audit log 365 hari yang ditetapkan. | Storage, kepatuhan |
| OQ-9 | Apakah mode trending X (Explore Indonesia) diperlukan di MVP, atau cukup mode keyword? | Scope F4 |
| OQ-10 | Apakah pimpinan hanya memakai dashboard web? Perlu ekspor/cetak/PDF atau akses mobile? Executive Briefing dikirim dalam bentuk apa saat v2? | UX, scope |
| OQ-11 | Hosting: on-premise atau VPS, dan di mana remote browser login X ditempatkan, mengingat dashboard hanya via VPN/LAN sementara scraping butuh egress internet? | Arsitektur jaringan, keamanan |
| OQ-12 | Apakah berita/postingan berbahasa Inggris atau daerah ikut dianalisis atau diabaikan? | NLP |
| OQ-13 | Batas panjang cuplikan yang boleh disimpan demi hak cipta? | Kepatuhan |
| OQ-14 | Apakah admin juga bertindak sebagai analis (membaca dashboard), atau murni operator? | Hak akses |
| OQ-15 | Bagaimana "pimpinan mengambil keputusan" diukur dan berapa kasus yang cukup untuk dinyatakan berhasil? | Metrik sukses |
| OQ-16 | Berapa lama pilot sebelum rilis dinyatakan sukses? | Jadwal |
| OQ-17 | Kanal notifikasi ke admin saat sesi X mati atau job gagal (email, panel saja)? Webhook baru ada di v2. | Operasional |
| OQ-18 | Batas jumlah retry artikel gagal dan batas waktu status `processing` dianggap macet? | Pipeline |
| OQ-19 | Batas jumlah node graf SNA dan ambang minimum bobot edge yang ditampilkan? | UX, performa |
| OQ-20 | Batas waktu sesi browser jarak jauh dan kontrol akses ke halaman ini (IP allowlist)? | Keamanan |
| OQ-21 | Prosedur pemulihan akun admin (password/MFA hilang)? | Keamanan |
| OQ-22 | Jadwal job SNA harian dan apakah rekalkulasi historis diperlukan setelah kamus alias berubah? | Konsistensi data |
| OQ-23 | Batas sumber daya (CPU/RAM) untuk Chromium dan jumlah kueri X maksimum? Spek 4 vCPU/8 GB bersifat usulan, tidak mengikat. | Kapasitas |
| OQ-24 | Apakah ada syarat formal sebelum go-live (pentest, audit keamanan, persetujuan UU PDP/DPO)? | Gate rilis |
| OQ-25 | Bagaimana topik didefinisikan untuk pengurutan topik di dashboard: daftar kata kunci/tokoh per topik yang dikelola admin, kategori RSS, atau hasil ekstraksi kata kunci otomatis? Siapa menetapkan daftar topik? | Dashboard, data model |
| OQ-26 | Tidak perlu login artinya apa: pengambilan X, Instagram, dan Threads hanya data publik tanpa sesi login, atau maksud lain? F4 dan F5 mengasumsikan sesi login. Jika tanpa login, F5 dipertahankan atau dihapus, dan apakah cakupan data yang bisa diambil diterima lebih terbatas? | F4, F5, F10, kelengkapan data |
| OQ-27 | Instagram dan Threads: apa yang diambil (akun tertentu, hashtag, keyword, atau trending) dan berapa interval pengambilan? | F10, scope |
| OQ-28 | Network interception bergantung pada respons internal platform yang bisa berubah tanpa pemberitahuan. Siapa yang memelihara parser, dan berapa lama pemulihan yang dapat diterima saat format berubah? | Operasional, ketersediaan data |
