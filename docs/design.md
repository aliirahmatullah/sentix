# DESIGN.md: Platform Media Monitoring & OSINT Instansi

Versi 1.0 (draft) | Dasar: PRD v1.1 | Referensi visual: screenshot dashboard "Shopeers" (dilampirkan) | Font: Manrope

> Dokumen ini adalah sumber kebenaran desain sebelum kode ditulis. Setiap keputusan diberi alasan. Hal yang bergantung pada Open Question PRD ditandai **[OQ-n]** dan diberi perilaku sementara, bukan diasumsikan diam-diam. Nilai yang diusulkan oleh desain (bukan oleh PRD) ditandai **[USULAN]**.

---

## 0. Ringkasan keputusan besar

| # | Keputusan | Alasan singkat |
| --- | --- | --- |
| 1 | Tema terang saja untuk MVP. Token dibuat semantik agar mode gelap bisa ditambah nanti. | Referensi terang. Pimpinan membuka dashboard singkat di meja dan ruang rapat. Mode gelap menambah biaya uji kontras dua kali lipat tanpa kebutuhan di PRD. |
| 2 | Manrope, satu keluarga untuk semua teks, di-host sendiri. | Dashboard hanya bisa diakses lewat VPN/LAN (FR6.8), jadi CDN font eksternal bisa gagal dimuat. |
| 3 | Elemen khas produk ini: **Panel Sumber Pendukung** (Evidence Drawer) dan **indikator kesegaran data** yang selalu terlihat. | Dua frustrasi utama pimpinan di PRD: grafik tidak bisa ditelusuri, dan data usang. Keduanya dijawab oleh satu pola komponen yang konsisten di semua grafik. |
| 4 | Warna punya empat tugas yang tidak boleh tercampur: aksi (biru), sentimen, identitas sumber, status sistem. | Dashboard ini memuat banyak kategori data. Tanpa disiplin warna, pembaca tidak bisa membedakan "biru = ini bisa diklik" dari "biru = Berita". |
| 5 | Perubahan angka (delta) ditampilkan netral, bukan hijau/merah. | PRD melarang sistem merekomendasikan atau menilai keputusan. Hijau untuk "naik" menyiratkan "baik", padahal kenaikan konten negatif bukan hal baik. |
| 6 | Bahasa antarmuka: Indonesia, huruf kecil kalimat (sentence case), kalimat aktif. Rute URL tetap bahasa Inggris. | Pengguna instansi Indonesia. Rute Inggris menjaga konsistensi dengan rute PRD (`/admin/x-connection`, `/api/cron/...`). |

### Bagaimana referensi Shopeers dipakai (dan tidak dipakai)

Referensi adalah produk e-commerce. Strukturnya dipakai, isinya tidak. Setiap elemen diputuskan secara eksplisit.

| Elemen di referensi | Keputusan | Pemakaian di produk ini |
| --- | --- | --- |
| Sidebar putih, item aktif berlatar biru muda dengan garis aksen di tepi kiri | **Dipakai** | Navigasi utama. Isi menu berbeda (bagian 6.1). |
| Kartu gradasi navy "Upgrade to Premium" di dasar sidebar | **Diadaptasi** | Slot yang sama dipakai untuk kartu **Kesegaran data**. Satu-satunya gradasi di seluruh UI. |
| Kolom pencarian "Search anything ⌘K" | **Dibuang** | Tidak ada FR pencarian di PRD. Jangan membangun fitur tanpa kebutuhan. |
| Pill rentang tanggal + "Last 30 days" | **Dipakai** | Menjadi filter global (FR6.1). |
| Tombol "Add widget" | **Dibuang** | Pimpinan "tidak mengonfigurasi sistem" (Persona 1). Dashboard memiliki tata letak tetap. |
| Tombol "Export" | **Ditunda** | Ekspor/cetak belum diputuskan **[OQ-10]**. Tidak dirender di MVP. Slot di kanan filter bar dicadangkan. |
| Empat kartu KPI dengan pill delta | **Dipakai**, warna delta diubah | Keputusan #5. |
| Grafik garis "Total Profit" dengan garis putus-putus periode lalu dan tooltip | **Dipakai** | Tren sentimen. |
| Tiga tile bergaris warna (Retailers / Distributors / Wholesalers) | **Diadaptasi** | Empat tile sumber: Berita, X, Instagram, Threads, ditambah status kesegaran. |
| Gauge setengah lingkaran bergaris-garis | **Diadaptasi** | Rasio sentimen (PRD mengizinkan batang/donat). |
| Bar chart "Most Day Active" (batang aktif biru, lainnya abu) | **Gaya dipakai** | Aturan gaya semua bar chart dan daftar peringkat: non-aktif abu, aktif biru. |
| Kartu "AI Assistant" | **Dibuang** | Non-goal PRD: tanpa LLM/API AI komersial. |
| Tabel "Best Selling Products" | **Diadaptasi** | Tabel "Konten terbaru". |
| Ikon outline tipis, avatar, lonceng | **Dipakai sebagian** | Ikon Lucide stroke 1,5 px. Lonceng hanya untuk admin. Tombol tema dibuang (keputusan #1). |
| Modal sisi kanan "Add Widget" (radius besar, tombol tutup bulat) | **Dipakai** | Menjadi bentuk dasar Panel Sumber Pendukung. |

---

## 1. Design principles: 3 aturan wajib

### Prinsip 1. Setiap angka punya jalan pulang ke sumbernya

Pimpinan tidak akan bertindak berdasarkan grafik yang tidak bisa diperiksa. PRD menyebut ini langsung: "grafik tidak bisa ditelusuri ke artikel".

Aturan yang bisa diuji:

1. Setiap elemen data yang menampilkan agregat bisa diklik atau difokuskan keyboard dan membuka **Panel Sumber Pendukung**: kata di awan kata, node dan garis di graf, titik di grafik tren, baris di gauge, tile sumber, baris KPI.
2. Panel memuat maksimal 30 item (FR6.2). Tiap item selalu menampilkan sumber, waktu, sentimen, dan tombol "Buka sumber asli" (FR6.5).
3. Membuka panel **tidak mengubah filter global**. Panel menampilkan penanda tetap "Filter dashboard tidak berubah" (FR6.2).
4. Tidak ada angka tanpa periode dan cakupan. Setiap kartu menampilkan subjudul yang menyatakan periode dan sumber yang dihitung.
5. Tautan asli yang sudah mati tidak disembunyikan. Metadata tetap tampil (edge case 23).

Uji lulus: dari angka mana pun di dashboard, pimpinan sampai ke halaman artikel asli dalam **2 klik** (klik elemen data, klik "Buka sumber asli").

### Prinsip 2. Kesegaran dan keterbatasan data harus terlihat, tidak boleh disembunyikan

Frustrasi pimpinan: "data tidak terbaru" dan "sentimen yang tidak masuk akal". Produk ini lebih baik tampak kurang rapi daripada tampak lebih yakin dari kenyataannya.

1. Kesegaran per sumber (Berita, X, Instagram, Threads) terlihat di setiap halaman: chip di top bar dan kartu di sidebar (FR6.6).
2. Data basi tidak pernah tampil seolah baru (edge case 11). Sumber yang terlambat atau gagal mengubah tile-nya dan memunculkan banner berisi waktu data terakhir.
3. Tiga kondisi "tidak ada isi" dibedakan secara visual dan dalam kata: **belum ada data** (instalasi baru, edge 21), **filter tidak menghasilkan data** (edge 20), **gagal memuat** (edge 19). Ketiganya tidak boleh memakai tampilan yang sama.
4. Keterbatasan analisis dinyatakan. Konten berkeyakinan rendah diberi penanda "Keyakinan rendah" (FR2.4). Ada penjelasan singkat "Cara membaca data" yang menyebut sentimen memakai leksikon dan tidak mengenali sarkasme (edge 9).
5. Bahasa antarmuka bersifat deskriptif. Tidak ada kata "sebaiknya", "perlu segera", atau ikon peringatan pada data sentimen (non-goal: tidak merekomendasikan keputusan).

Uji lulus: pimpinan bisa menjawab "kapan data terakhir masuk, dari sumber mana?" tanpa menggulir dan tanpa membuka menu.

### Prinsip 3. Satu filter mengatur semuanya, dan layar terbaca dalam 10 detik

1. Satu set filter global (periode, kategori, topik, sumber) berlaku ke semua komponen di halaman (FR6.1). Tidak ada kartu yang memiliki filter periode sendiri.
2. Filter disimpan di URL (query string). Tautan dashboard yang dibagikan ke sesama pengguna memuat tampilan yang sama, dan tombol Kembali browser berfungsi sebagaimana mestinya.
3. Above the fold pada layar 1440×900 menjawab tiga pertanyaan pimpinan: arah sentimen, volume, dan kapan data terakhir diperbarui.
4. Pimpinan tidak melihat satu pun kontrol konfigurasi. Kontrol itu tidak dinonaktifkan, tetapi memang tidak ada di antarmukanya (Persona 1: tidak mengonfigurasi sistem).
5. Layar admin memakai bahasa visual yang sama tetapi lebih padat. Setiap aksi destruktif memerlukan konfirmasi dan tercatat di audit log (FR7.7).

Uji lulus: orang yang belum pernah melihat dashboard, diberi 10 detik, bisa menyebut sentimen dominan, jumlah konten, dan waktu pembaruan terakhir.

---

## 2. Visual direction

### Mood: "ruang kendali yang tenang"

Terang, lapang, dan bicara pelan. Produk OSINT hampir selalu tampil gelap dengan hijau neon atau merah menyala, dan itu sengaja ditolak di sini. Alasannya:

- Audiensnya pimpinan instansi, bukan analis SOC yang duduk delapan jam di depan layar. Mereka membuka dashboard singkat dan perlu merasa **tenang dan yakin**, bukan terancam.
- Isi datanya sensitif (opini publik tentang instansi). Antarmuka yang berteriak membuat data negatif tampak lebih genting daripada artinya dan melanggar Prinsip 2 poin 5.
- Referensi yang dipilih pengguna adalah dashboard terang, kartu putih, dan biru, yang secara alami mendukung arah ini.

### Satu hal yang dibuat berani

Disiplin pada jalur bukti. Tidak ada efek visual besar. Yang menonjol adalah **Panel Sumber Pendukung** yang muncul identik dari semua grafik, dan **kartu Kesegaran data** bergradasi navy di sidebar. Semua elemen lain tenang.

### Empat tugas warna (tidak boleh tercampur)

| Tugas | Warna | Dipakai untuk | Tidak dipakai untuk |
| --- | --- | --- | --- |
| Aksi dan seleksi | Biru `#2457E6` | Tombol utama, item nav aktif, fokus, elemen terpilih, batang aktif | Data apa pun |
| Sentimen | Hijau, abu-slate, koral | Chip sentimen, seri grafik sentimen | Status sistem pada komponen yang sama |
| Identitas sumber | Biru (Berita), tinta (X), magenta (Instagram), ungu (Threads) | Chip sumber dan tile sumber | Seri grafik sentimen |
| Status sistem | Hijau/amber/merah dengan ikon dan label | Kesegaran data, job, banner | Data sentimen |

Hijau dan merah muncul di dua tugas (sentimen dan status). Pembedanya **bentuk**: sentimen selalu berupa ikon wajah, batang, atau garis di area data. Status selalu berupa titik/ikon bulat atau segitiga plus label di banner, chip status, atau tile kesegaran. Keduanya tidak pernah ditempatkan di komponen yang sama.

### Referensi

Satu-satunya referensi visual yang mengikat adalah screenshot dashboard yang dilampirkan: kartu putih di atas kanvas abu kebiruan, radius besar, bayangan sangat halus, biru kerajaan sebagai aksen tunggal, ikon outline tipis, tipografi geometris bersih. Tidak ada referensi lain yang diklaim.

### Yang dihindari

- Tema gelap neon "hacker", peta ancaman, radar, dan ikon perisai.
- Merah menyala untuk sentimen negatif. Koral yang lebih redam, selalu disertai ikon dan label.
- Gradasi dekoratif di kartu atau latar. Satu-satunya gradasi: kartu Kesegaran data.
- Glassmorphism, bola/orb AI, ilustrasi 3D, emoji di antarmuka.
- Label huruf kapital semua. Semua label memakai huruf kapital kalimat.
- Semua kartu berbentuk identik dengan radius sama. Radius bertingkat (bagian 3.4).
- Pie chart dengan lebih dari 3 irisan. Awan kata berputar. Animasi masuk di tiap kartu.
- Fitur v2 yang bocor ke MVP: peta geospasial, watchlist, alert, executive briefing.

### Gerak (motion)

- Gerak hanya sebagai respons terhadap tindakan: panel masuk dari kanan (240 ms), node graf menyorot tetangganya (120 ms), angka KPI melintas-memudar saat filter berubah (150 ms).
- Satu momen terorkestrasi: saat halaman pertama dimuat, skeleton berganti konten dengan fade 200 ms. Tidak ada animasi masuk per kartu.
- `prefers-reduced-motion: reduce` mematikan semua transisi gerak (fade tetap boleh).

### Suara dan istilah

| Konsep PRD | Istilah di UI |
| --- | --- |
| Word cloud | **Kata kunci** (subjudul: "Ukuran kata menunjukkan frekuensi") |
| SNA | **Jejaring aktor** |
| Evidence drill-down | **Sumber pendukung** |
| Pimpinan | Tidak pernah ditampilkan sebagai label peran di UI pimpinan |
| Sentimen | **Positif / Netral / Negatif** |
| Tombstone | Tidak terlihat oleh pengguna (konten hilang dari dashboard) |
| `failed` | **Gagal dianalisis** |

Aturan penulisan: kata kerja aktif ("Buka sumber asli", bukan "Lihat"), nama aksi sama di seluruh alur (tombol "Simpan sesi" menghasilkan toast "Sesi disimpan"), pesan galat menyatakan apa yang terjadi dan apa yang bisa dilakukan, tanpa permintaan maaf berlebihan.

---

## 3. Design tokens

### 3.1 Palet warna

Semua rasio kontras di bawah dihitung dengan rumus WCAG 2.2 (luminansi relatif) pada nilai hex persisnya.

**Netral (slate kebiruan)**

| Token | Hex | Peran | Kontras |
| --- | --- | --- | --- |
| `canvas` | `#F3F5F9` | Latar halaman | n/a |
| `surface` | `#FFFFFF` | Kartu, panel, modal | n/a |
| `surface-sunken` | `#F7F8FB` | Latar tile, area input non-fokus, header tabel | n/a |
| `border-subtle` | `#E6E9F0` | Garis kartu, pemisah baris | dekoratif |
| `border-control` | `#8C95A8` | Batas input, checkbox, toggle | 3,01:1 di atas putih |
| `ink-900` | `#0F1729` | Teks utama, angka KPI | 17,87:1 putih · 16,38:1 canvas |
| `ink-700` | `#3B4559` | Teks isi, nama kolom | 9,63:1 putih |
| `ink-600` | `#566075` | Teks sekunder, subjudul kartu | 6,31:1 putih · 5,79:1 canvas |
| `ink-500` | `#6B7488` | Teks tersier (waktu, keterangan) | 4,69:1 putih. **Hanya di atas putih.** Di canvas hanya 4,30:1 sehingga dilarang |
| `ink-400` | `#98A0B3` | Placeholder dekoratif, ikon nonaktif | 2,62:1. Tidak boleh membawa informasi |

**Primer (biru kerajaan, diambil dari referensi)**

| Token | Hex | Peran | Kontras |
| --- | --- | --- | --- |
| `primary-50` | `#EEF3FF` | Latar item nav aktif, baris terpilih | `primary-700` di atasnya 7,06:1 |
| `primary-100` | `#DCE6FF` | Hover item nav, chip terpilih | `primary-700` di atasnya 6,28:1 |
| `primary-200` | `#BCD0FF` | Batas elemen terpilih | dekoratif |
| `primary-600` | `#2457E6` | Tombol utama, tautan, fokus, batang aktif | 5,86:1 dengan teks putih |
| `primary-700` | `#1B45C2` | Hover/pressed tombol utama, teks biru di tint | 7,85:1 dengan teks putih |
| `primary-800` | `#17368F` | Awal gradasi kartu Kesegaran data | 10,71:1 dengan putih |
| `primary-900` | `#10245F` | Akhir gradasi | 14,59:1 dengan putih |

Gradasi kartu Kesegaran data: `linear-gradient(165deg, #1B45C2 0%, #10245F 100%)`. Teks putih di atasnya minimal 7,85:1.

**Sentimen**

| Sentimen | Fill grafik | Teks | Tint chip | Kontras |
| --- | --- | --- | --- | --- |
| Positif | `#1FA463` | `#0B7A47` | `#E5F6EC` | Fill 3,21:1 di putih. Teks 5,40:1 putih · 4,81:1 di tint |
| Netral | `#8A94A8` | `#4A5568` | `#EAEEF4` | Fill 3,05:1. Teks 7,53:1 putih · 6,46:1 di tint |
| Negatif | `#E5484D` | `#C2262E` | `#FDECEC` | Fill 3,91:1. Teks 5,82:1 putih · 5,09:1 di tint |

Pilihan netral = abu-slate, bukan kuning, karena netral artinya "tidak ada kecenderungan", bukan "waspada". Kuning disimpan untuk status sistem.

**Peringatan bahwa warna sentimen saja tidak cukup:** luminansi fill positif dan negatif hampir sama (rasio antar keduanya 1,22:1). Pembaca buta warna merah-hijau tidak bisa membedakannya dari warna. Karena itu aturan wajib: **sentimen selalu disertai ikon wajah (senyum / datar / sedih) dan label teks**, urutan seri tetap (Positif, Netral, Negatif), dan segmen batang bertumpuk dipisahkan garis putih 2 px.

**Status sistem**

| Status | Fill | Teks | Tint | Kontras |
| --- | --- | --- | --- | --- |
| Terkini / sehat | `#1FA463` | `#0B7A47` | `#E5F6EC` | sama dengan Positif |
| Terlambat / peringatan | `#F59E0B` | `#9A5B00` | `#FFF3DC` | Teks 5,43:1 putih · 4,94:1 di tint |
| Tidak diperbarui / gagal | `#E5484D` | `#C2262E` | `#FDECEC` | sama dengan Negatif |
| Belum ada data / nonaktif | `#8A94A8` | `#4A5568` | `#EAEEF4` | sama dengan Netral |

Status selalu memakai ikon berbentuk berbeda: lingkaran-centang (terkini), jam (terlambat), segitiga-seru (gagal), lingkaran-garis (belum ada).

**Identitas sumber**

| Sumber | Warna | Kontras di putih | Bentuk ikon pendamping |
| --- | --- | --- | --- |
| Berita | `#2457E6` | 5,86:1 | Lembar koran |
| X | `#1B2130` | 16,07:1 | Logo X |
| Instagram | `#C2308C` | 5,13:1 | Logo kamera |
| Threads | `#7440F5` | 5,53:1 | Logo @ |

Aturan: warna sumber hanya muncul pada chip sumber, tile sumber, dan grafik perbandingan antar sumber. Identitas sumber **selalu** dibawa ikon dan nama, bukan warna saja. Pada grafik yang memakai warna sentimen, sumber dibedakan lewat facet atau label, bukan warna.

**Jejaring aktor (tipe entitas)**

| Tipe | Warna | Bentuk node |
| --- | --- | --- |
| Tokoh (person) | `#2457E6` | Lingkaran |
| Organisasi | `#E08A00` | Persegi membulat |
| Perusahaan | `#0F8B8D` | Belah ketupat |
| Lokasi | `#7C8599` | Segitiga |

Warna dan bentuk membawa informasi yang sama. Garis (edge) default `#C5CBD9`, tebal sebanding bobot (1 sampai 6 px), terpilih `#2457E6`.

**Ambang kesegaran data [USULAN]** (PRD hanya menetapkan interval ingest, jadi angka ini perlu disetujui **[OQ-17]**):

| Sumber | Terkini | Terlambat (amber) | Tidak diperbarui (merah) |
| --- | --- | --- | --- |
| Berita (ingest 10 sampai 15 mnt, target < 30 mnt) | ≤ 30 mnt | 30 sampai 120 mnt | > 120 mnt |
| X, Instagram, Threads (ingest 15 sampai 30 mnt) | ≤ 60 mnt | 60 sampai 180 mnt | > 180 mnt atau sesi tidak valid |

### 3.2 Tipografi: Manrope

**Mengapa Manrope cocok untuk produk ini**

1. **Angka adalah isi utama dashboard.** Bentuk angka Manrope bersih dan terbuka sehingga `3`, `5`, `8` dan `6`, `9` tidak mudah tertukar pada ukuran 12 sampai 13 px di tabel dan sumbu grafik.
2. **Satu keluarga, rentang bobot lebar** (200 sampai 800, font variabel). Satu keluarga bisa membawa angka KPI (800) sampai keterangan kecil (500) tanpa memadukan dua font. Hierarki dibuat dari bobot dan ukuran, bukan dari font tambahan.
3. **Geometri modern yang ramah.** Cocok dengan kartu berradius besar di referensi. Tidak sedingin font terminal dan tidak seformal serif birokrasi, sesuai mood "tenang dan dapat dipercaya".
4. **Lisensi SIL OFL**, boleh di-host sendiri (penting untuk jaringan VPN/LAN).

**Catatan jujur:** Manrope cukup lebar. Kata bahasa Indonesia sering panjang ("pemberitaan", "memperhatikan"), sehingga ukuran dasar dipatok 14 px (bukan 15 atau 16) dan judul pakai `text-wrap: balance`. Dukungan angka tabular (`tnum`) harus diverifikasi pada berkas font yang dipakai saat implementasi. Bila tidak tersedia, kolom angka dirata-kanan dan diberi lebar tetap.

**Hosting:** unduh font variabel, subset Latin + Latin Extended, simpan lokal (`next/font/local`). `font-display: swap`.

**Fallback:** `"Manrope", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

**Skala tipografi** (rasio sekitar 1,2; ukuran dalam px):

| Token | Ukuran / tinggi baris | Bobot | Dipakai untuk |
| --- | --- | --- | --- |
| `text-xs` | 12 / 16 | 500 | Label sumbu grafik, waktu, keterangan. Ukuran terkecil yang diizinkan |
| `text-sm` | 13 / 20 | 500 | Isi tabel, chip, teks sekunder |
| `text-base` | 14 / 22 | 400 (isi) · 500 (label UI) | Teks dasar |
| `text-md` | 16 / 24 | 600 | Judul kartu, nama item di panel |
| `title-lg` | 20 / 28 | 700 | Judul panel dan modal |
| `title-xl` | 24 / 32 | 700 | Judul halaman. Tracking −0,01em |
| `kpi-md` | 28 / 36 | 700 | Nilai KPI |
| `kpi-lg` | 36 / 44 | 800 | Angka tengah gauge. Tracking −0,02em |

Aturan:
- Angka selalu `font-variant-numeric: tabular-nums` bila tersedia.
- **Format angka lokal id-ID:** titik untuk ribuan, koma untuk desimal (`12.480`, `38,2%`). Tanggal: `12 Nov 2026`. Jam: 24 jam dengan zona **WIB** pada waktu absolut (`09:42 WIB`).
- Panjang baris maksimal 64 karakter untuk teks penjelasan.
- Judul item berita dibatasi 2 baris (`line-clamp`). Teks media sosial 3 baris.
- Input pada mobile berukuran 16 px agar iOS tidak memperbesar halaman.
- Tidak ada huruf kapital semua. Tidak ada font monospace.

### 3.3 Skala spacing

Grid dasar 4 px.

| Token | Nilai | Pemakaian khas |
| --- | --- | --- |
| `space-1` | 4 | Jarak ikon ke teks kecil |
| `space-2` | 8 | Jarak antar chip, ikon ke label |
| `space-3` | 12 | Padding chip dan tile, jarak dalam grup kontrol |
| `space-4` | 16 | Judul kartu ke isi, padding kartu rapat |
| `space-5` | 20 | **Padding kartu standar**, gap grid kartu |
| `space-6` | 24 | Padding konten halaman (desktop) |
| `space-8` | 32 | Jarak antar bagian di halaman admin |
| `space-10` | 40 | Padding kartu login |
| `space-12` | 48 | Jarak besar, ruang state kosong |
| `space-16` | 64 | Padding vertikal state layar penuh |

Struktur tata letak:

| Elemen | Nilai |
| --- | --- |
| Sidebar | 240 (lebar), 72 (rail ikon) |
| Top bar | 64 tinggi |
| Baris judul + filter | 72 tinggi, lengket (sticky) di bawah top bar |
| Lebar konten maksimum | 1600 |
| Grid | 12 kolom, gap 20 |
| Padding konten | 24 (≥1024) · 20 (640 sampai 1023) · 16 (<640) |
| Tinggi baris tabel | 52 (isi 2 baris), 44 (isi 1 baris) |
| Target sentuh minimum | 36 (desktop), 44 (layar sentuh) |
| Lebar Panel Sumber Pendukung | 480 (≥1024), 100% (<1024) |

### 3.4 Radius (bertingkat, bukan satu nilai untuk semua)

| Token | px | Dipakai untuk |
| --- | --- | --- |
| `radius-xs` | 6 | Badge kecil, checkbox, tag entitas |
| `radius-sm` | 10 | Tombol, input, item nav, tile sumber |
| `radius-md` | 14 | Segmented control, dropdown, panel dalam kartu, baris terpilih |
| `radius-lg` | 20 | **Kartu** (sama dengan nuansa referensi) |
| `radius-xl` | 28 | Panel Sumber Pendukung, modal, kartu login |
| `radius-full` | 999 | Chip sentimen/sumber/delta, pill filter, tombol ikon bulat |

### 3.5 Bayangan dan elevasi

Bayangan dibuat dengan tinta kebiruan `rgb(15 23 41)`, bukan hitam murni, agar menyatu dengan kanvas.

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `shadow-card` | `0 1px 2px rgb(15 23 41 / .04), 0 2px 8px -2px rgb(15 23 41 / .04)` plus garis 1 px `border-subtle` | Semua kartu (elevasi 1) |
| `shadow-raised` | `0 4px 12px -2px rgb(15 23 41 / .08)` | Tile/baris yang di-hover |
| `shadow-pop` | `0 12px 32px -8px rgb(15 23 41 / .16), 0 2px 6px rgb(15 23 41 / .06)` | Dropdown, popover, tooltip |
| `shadow-drawer` | `-16px 0 48px -12px rgb(15 23 41 / .22)` | Panel Sumber Pendukung |
| `shadow-modal` | `0 24px 64px -16px rgb(15 23 41 / .30)` | Modal |
| `scrim` | `rgb(15 23 41 / .40)` | Latar gelap di belakang panel dan modal (seperti referensi) |
| `focus-ring` | `0 0 0 2px #FFFFFF, 0 0 0 4px #2457E6` | Fokus keyboard, 5,86:1 terhadap putih |

Urutan z-index: filter bar 20, sidebar mobile 30, scrim 40, panel dan modal 50, toast 60, tooltip 70.

### 3.6 Token gerak

| Token | Nilai |
| --- | --- |
| `duration-fast` | 120 ms |
| `duration-base` | 200 ms |
| `duration-slow` | 320 ms |
| `ease-out` | `cubic-bezier(.2, .8, .2, 1)` |

### 3.7 Implementasi token (Tailwind v4)

```css
@import "tailwindcss";

@theme {
  --font-sans: "Manrope", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --color-canvas: #F3F5F9;
  --color-surface: #FFFFFF;
  --color-sunken: #F7F8FB;
  --color-line: #E6E9F0;
  --color-control: #8C95A8;
  --color-ink-900: #0F1729;
  --color-ink-700: #3B4559;
  --color-ink-600: #566075;
  --color-ink-500: #6B7488;
  --color-ink-400: #98A0B3;

  --color-primary-50: #EEF3FF;
  --color-primary-100: #DCE6FF;
  --color-primary-200: #BCD0FF;
  --color-primary-600: #2457E6;
  --color-primary-700: #1B45C2;
  --color-primary-800: #17368F;
  --color-primary-900: #10245F;

  --color-pos: #1FA463;   --color-pos-text: #0B7A47;   --color-pos-tint: #E5F6EC;
  --color-neu: #8A94A8;   --color-neu-text: #4A5568;   --color-neu-tint: #EAEEF4;
  --color-neg: #E5484D;   --color-neg-text: #C2262E;   --color-neg-tint: #FDECEC;
  --color-warn: #F59E0B;  --color-warn-text: #9A5B00;  --color-warn-tint: #FFF3DC;

  --color-src-news: #2457E6;
  --color-src-x: #1B2130;
  --color-src-instagram: #C2308C;
  --color-src-threads: #7440F5;

  --radius-xs: 6px;  --radius-sm: 10px;  --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 28px;

  --shadow-card: 0 1px 2px rgb(15 23 41 / .04), 0 2px 8px -2px rgb(15 23 41 / .04);
  --shadow-raised: 0 4px 12px -2px rgb(15 23 41 / .08);
  --shadow-pop: 0 12px 32px -8px rgb(15 23 41 / .16), 0 2px 6px rgb(15 23 41 / .06);
  --shadow-drawer: -16px 0 48px -12px rgb(15 23 41 / .22);
  --shadow-modal: 0 24px 64px -16px rgb(15 23 41 / .30);

  --text-xs: 12px;  --text-xs--line-height: 16px;
  --text-sm: 13px;  --text-sm--line-height: 20px;
  --text-base: 14px; --text-base--line-height: 22px;
  --text-md: 16px;  --text-md--line-height: 24px;

  --ease-out: cubic-bezier(.2, .8, .2, 1);
}
```

Pustaka grafik tidak dikunci oleh dokumen ini. Syaratnya: render SVG, elemen data dapat difokus keyboard, mendukung tooltip kustom, dan sumbu mengikuti format id-ID. Untuk graf jejaring, SVG cukup sampai sekitar 150 node. Di atas itu pindah ke Canvas dengan lapisan aksesibilitas terpisah **[OQ-19]**.

---

## 4. Screen inventory

Rute URL memakai bahasa Inggris. Label UI memakai bahasa Indonesia. "P" = pimpinan, "A" = admin.

### 4.1 Akses

| ID | Screen | Rute | Peran | Tujuan | Rujukan PRD |
| --- | --- | --- | --- | --- | --- |
| A1 | Masuk | `/login` | Semua | Autentikasi dengan nama pengguna dan kata sandi. Tidak membocorkan apakah nama pengguna ada | F7, edge 17 |
| A2 | Verifikasi MFA | `/login/mfa` | Semua | Memasukkan kode TOTP 6 digit | FR7.4 **[OQ-4]** |
| A3 | Pendaftaran MFA | `/login/mfa/setup` | Semua | Pemindaian QR dan konfirmasi kode pertama, tampil bila MFA diwajibkan dan belum terdaftar | FR7.4 **[OQ-4]** |
| A4 | Bantuan akses | `/login/help` | Semua | Halaman statis: apa yang dilakukan bila kata sandi atau perangkat MFA hilang. Isi final menunggu prosedur pemulihan | edge 18 **[OQ-21]** |

### 4.2 Pemantauan (pimpinan dan admin)

| ID | Screen | Rute | Peran | Tujuan | Rujukan PRD |
| --- | --- | --- | --- | --- | --- |
| D1 | Dashboard | `/` | P, A | Gambaran cepat: volume, sentimen, tren, kata kunci, jejaring aktor, konten terbaru, kesegaran data | F6, semua story Pimpinan |
| D2 | Jejaring aktor (layar penuh) | `/network` | P, A | Menjelajahi graf hubungan dengan ruang yang cukup. Memakai filter global yang sama | F3, FR6.4 |
| D3 | Panel Sumber Pendukung | overlay di D1/D2 (`?ref=…` agar dapat dibagikan) | P, A | Daftar maksimal 30 item pendukung dari elemen data yang diklik | FR6.2, FR3.3, FR6.5 |
| D4 | Cara membaca data | panel samping, dibuka dari sidebar | P, A | Menjelaskan sumber data, cara sentimen dihitung, batasnya, dan retensi | Prinsip 2 |

Catatan: admin ikut melihat D1 dan D2 (kebutuhan memeriksa hasil perbaikan). Apakah admin juga berperan sebagai analis belum diputuskan **[OQ-14]**. Bila diputuskan "murni operator", cukup menyembunyikan dua item nav.

### 4.3 Administrasi (hanya admin)

| ID | Screen | Rute | Tujuan | Rujukan PRD |
| --- | --- | --- | --- | --- |
| M1 | Status sistem | `/admin` | Beranda admin. Peringatan aktif, status tiap job, jumlah artikel per status analisis, sumber bermasalah | F8, FR8.2, FR1.7 |
| M2 | Sumber RSS | `/admin/sources` | Menambah, mengubah, menonaktifkan sumber. Melihat error per sumber | FR1.1, FR1.7, FR1.8 |
| M3 | Pemantauan media sosial | `/admin/social` | Kelola kueri X (keyword/trending) dan target Instagram/Threads. Melihat riwayat run | FR4.3, FR10.4, FR4.8 **[OQ-9, OQ-27]** |
| M4 | Koneksi X | `/admin/x-connection` | Login manual ke X lewat browser jarak jauh dan menyimpan sesi tanpa menyimpan kata sandi | F5 **[OQ-20, OQ-26]** |
| M5 | Kamus alias | `/admin/aliases` | Memetakan alias ke nama kanonik entitas | FR2.6 **[OQ-22]** |
| M6 | Pengguna dan keamanan | `/admin/users` | Membuat dan menonaktifkan akun, mengelola MFA | F7 |
| M7 | Audit log | `/admin/audit-log` | Menelusuri aksi sensitif. Hanya baca | FR7.7, FR9.3 |
| M8 | Topik (bersyarat) | `/admin/topics` | Mengelola daftar topik bila topik diputuskan sebagai daftar kata kunci/tokoh buatan admin | **[OQ-25]** |

M8 hanya dibangun bila OQ-25 menjawab "dikelola admin". Bila topik berasal dari kategori RSS atau ekstraksi otomatis, M8 dihapus dan filter Topik di D1 mengikuti sumbernya.

### 4.4 Sistem

| ID | Screen | Tujuan |
| --- | --- | --- |
| S1 | 403 Tidak berhak | Pimpinan membuka rute admin. Menjelaskan tanpa menyalahkan dan mengarahkan balik ke Dashboard |
| S2 | 404 Tidak ditemukan | Rute atau tautan panel sudah tidak valid |
| S3 | 500 Gangguan server | Kegagalan tak terduga. Menampilkan kode rujukan dan waktu untuk dilaporkan ke admin |
| S4 | Sesi akan berakhir | Modal dua menit sebelum sesi habis dengan tombol "Perpanjang sesi" |

---

## 5. User flow

Notasi: **P** = pimpinan, **A** = admin, **Sis** = respons sistem. Setiap alur memuat jalur gagal.

### J1. Pimpinan membaca ringkasan harian (alur inti)

Pemicu: pimpinan membuka tautan dashboard di sela jadwal.

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | P membuka `/` | Belum ada sesi, alihkan ke `/login`. Tidak ada data yang tampil sebelum login |
| 2 | P mengisi nama pengguna dan kata sandi, menekan "Masuk" | Tombol menjadi loading. Bila benar dan MFA aktif, alihkan ke `/login/mfa` |
| 3 | P memasukkan kode 6 digit | Verifikasi otomatis saat digit ke-6 terisi. Berhasil: alihkan ke `/` |
| 4 | P tiba di Dashboard | Filter default: **7 hari**, semua sumber. Skeleton, lalu konten |
| 5 | P membaca: chip kesegaran di top bar, empat KPI, tren sentimen, gauge | Selesai dalam 10 detik (Prinsip 3) |
| 6 | P mengganti periode ke "Hari ini" | Semua kartu menyegarkan angka, URL berubah, pembaca layar mendapat pengumuman ringkas |

Jalur gagal:
- Kredensial salah: "Nama pengguna atau kata sandi tidak cocok." Pesan yang sama untuk semua kasus (edge 17).
- Terlalu banyak percobaan: tombol dinonaktifkan dengan hitung mundur. Pesan yang sama berlaku untuk nama pengguna yang tidak ada.
- Kode MFA salah: pesan galat di bawah kolom kode, fokus tetap di kolom.
- Sesi berakhir di tengah membaca: modal S4, lalu halaman masuk dengan tujuan semula tersimpan.

**Default 7 hari** dipilih karena "hari ini" sering terlalu sedikit data pada pagi hari dan 30 hari terlalu lambat menunjukkan arah. Pilihan terakhir tidak disimpan lintas sesi, agar setiap pembukaan dimulai dari titik acuan yang sama.

### J2. Pimpinan menelusuri sebuah isu dari kata kunci

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | P mengklik kata "anggaran" di kartu Kata kunci | Kata terpilih (cincin biru), kata lain meredup 40% |
| 2 | | Panel Sumber Pendukung masuk dari kanan. Judul: **Kata "anggaran"**. Subjudul: "214 item · menampilkan 30 terbaru". Penanda: "Filter dashboard tidak berubah" |
| 3 | P membaca daftar | Kata "anggaran" dicetak tebal pada cuplikan. Setiap item memuat sumber, waktu, sentimen, tautan |
| 4 | (opsional) P menyaring di dalam panel: chip Positif / Netral / Negatif, urutan Terbaru / Sentimen | Hanya mengubah isi panel. Filter dashboard tidak berubah |
| 5 | P menekan "Buka sumber asli" pada satu item | Tab baru ke URL asli (`rel="noopener noreferrer"`) |
| 6 | P menekan Esc atau tombol tutup | Panel menutup. Fokus kembali ke kata "anggaran". Dashboard tidak berubah |

Jalur gagal:
- Panel gagal memuat: state galat di dalam panel dengan "Coba lagi". Dashboard di belakangnya tetap utuh.
- Lebih dari 30 item: catatan di akhir daftar "Menampilkan 30 dari 214 item. Persempit periode atau sumber di dashboard untuk melihat sisanya."
- Tautan asli sudah mati: catatan sekali di dasar panel "Jika tautan tidak terbuka, artikel mungkin sudah dihapus penerbit." Metadata tetap tampil (edge 23).

### J3. Pimpinan menelusuri hubungan antar aktor

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | P menekan "Buka layar penuh" di kartu Jejaring aktor | Pindah ke `/network` dengan filter yang sama (terbawa di URL) |
| 2 | P menunjuk sebuah node | Tooltip: nama, tipe, "42 kemunculan" |
| 3 | P mengklik node | Node dan tetangganya menonjol, lainnya meredup. Panel terbuka: **Aktor: [nama]**, berisi item yang memuat aktor itu |
| 4 | P mengklik sebuah garis | Garis menonjol. Panel terbuka: **[A] dan [B]**, "14 artikel bersama", daftar item penghubung (FR3.3) |
| 5 | P menggeser "Bobot minimum hubungan" bila graf terlalu padat | Graf menyaring garis lemah. Nilai default dan batas node menunggu **[OQ-19]** |
| 6 | (alternatif keyboard dan pembaca layar) P menekan "Lihat sebagai tabel" | Tabel hubungan A, B, bobot; setiap baris membuka panel yang sama |

Jalur gagal:
- Filter tidak menghasilkan hubungan: state kosong dengan "Atur ulang filter".
- **Cache SNA belum dihitung untuk tanggal terpilih.** Graf dibaca dari cache harian (FR3.2), jadi "Hari ini" bisa belum ada. Kartu menampilkan "Jejaring dihitung harian. Data terbaru: 11 Nov 2026" dan memakai tanggal terbaru yang tersedia, bukan menampilkan graf kosong yang menyesatkan **[OQ-22]**.

### J4. Pimpinan membandingkan Berita dengan media sosial dan memeriksa kesegaran

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | P melihat empat tile sumber di bawah grafik tren | Tiap tile: jumlah, porsi, dan kesegaran ("4 mnt lalu") |
| 2 | P membuka filter Sumber dan membuang Berita | Semua kartu dihitung ulang tanpa Berita. Tile Berita meredup dengan label "Tidak dipilih di filter" |
| 3 | P mengklik tile X | Panel memuat item X sesuai filter |
| 4 | Tile X berstatus Terlambat, P mengklik chip kesegarannya | Popover: "Pembaruan terakhir 09:10 WIB. Jadwal pengambilan tiap 15 sampai 30 menit. Jika berlanjut, hubungi admin." |

Jalur gagal: bila sesi X tidak valid, banner di atas dashboard menyatakan "Data X belum diperbarui sejak 09:10 WIB. Angka X menunjukkan data sampai saat itu." Angka lama tetap ditampilkan dengan stempel waktunya (edge 11).

### J5. Admin memantau pipeline dan memulihkan kegagalan

Landing admin setelah login adalah `/admin`, bukan Dashboard. Alasannya: Persona 2 paling frustrasi karena "tidak tahu penyebab data kosong", jadi hal pertama yang ia lihat adalah kesehatan sistem **[OQ-14]**.

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | A masuk (dengan MFA bila wajib) | Alihkan ke `/admin` |
| 2 | A melihat banner peringatan teratas, misalnya "Job pengambilan media sosial gagal" | Banner menyebut penyebab singkat dan tombol aksi |
| 3 | A membaca tabel job. Baris bermasalah berlatar tint merah dan ikon segitiga | Kolom: job, jadwal, run terakhir, status, durasi, diproses, error terakhir |
| 4 | A membuka "Lihat penyebab" | Baris meluas: pesan galat, waktu, jumlah percobaan, tautan ke halaman terkait (sumber, koneksi X) |
| 5 | A menekan "Jalankan sekarang" **[USULAN: perlu endpoint admin]** | Dialog konfirmasi. Setelah dikonfirmasi: toast "Job dijalankan" dan status baris menjadi "Berjalan" |
| 6 | Job selesai | Status menjadi "Sukses". Banner hilang. Tindakan tercatat di audit log |

Jalur gagal: job sedang dipegang proses lain (`GET_LOCK`, edge 5): "Job ini sedang berjalan. Tunggu sampai selesai, lalu coba lagi." Bukan sebagai galat merah, melainkan info netral.

### J6. Admin memperbarui sesi login X

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | A menekan "Perbarui sesi X" di banner (atau membuka M4) | Halaman `/admin/x-connection`. Menampilkan status sesi saat ini |
| 2 | A membaca catatan keamanan lalu menekan "Mulai sesi login" | Status "Menyiapkan browser..." sambil Chromium dinyalakan |
| 3 | | Bingkai browser jarak jauh muncul dengan hitung mundur batas waktu **[OQ-20]** |
| 4 | A login manual di dalam bingkai, termasuk CAPTCHA atau 2FA | Kata sandi tidak pernah disimpan sistem (FR5.2) |
| 5 | A menekan "Selesai dan simpan sesi" | Sistem memeriksa sesi valid, menyimpan berkas sesi, menutup browser |
| 6 | | Status menjadi "Valid · diperbarui 09:55 WIB". Toast "Sesi disimpan". Audit log mencatat |

Jalur gagal:
- Batas waktu habis: "Sesi login berakhir otomatis. Mulai lagi bila belum selesai."
- Sesi belum valid saat disimpan: "Sesi belum valid. Pastikan Anda sudah masuk ke akun X, lalu simpan lagi."
- Chromium kehabisan memori (edge 22): "Browser jarak jauh tidak bisa dijalankan sekarang. Dashboard dan data yang tersimpan tidak terpengaruh."
- Akses dari IP tidak diizinkan **[OQ-20]**: halaman 403.

### J7. Admin mengelola kamus alias

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | A membuka `/admin/aliases` dan menekan "Tambah alias" | Baris isian muncul di atas tabel |
| 2 | A mengisi Alias "Jokowi", Nama kanonik "Joko Widodo", Tipe "Tokoh", lalu "Simpan" | Validasi |
| 3 | | Berhasil: toast "Alias disimpan". Catatan di bawahnya: "Berlaku untuk analisis berikutnya." |

Jalur gagal: alias bentrok dengan pemetaan lain: galat inline "Alias 'AS' sudah dipetakan ke 'Amerika Serikat'. Ubah pemetaan yang ada atau pakai alias lain." Sistem tidak menyelesaikan bentrokan otomatis (edge 10). Bila rekalkulasi historis diputuskan perlu, tampil tombol "Hitung ulang data lama" **[OQ-22]**.

### J8. Admin membuat pengguna dan mengatur MFA

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | A membuka `/admin/users`, "Tambah pengguna" | Modal |
| 2 | A mengisi nama pengguna, peran (Pimpinan / Admin), "Wajibkan MFA", dan membuat kata sandi sementara | Kata sandi sementara ditampilkan **sekali** dengan tombol "Salin" |
| 3 | A menekan "Buat pengguna" | Baris baru, status "Menunggu pendaftaran MFA" bila MFA diwajibkan |
| 4 | Pengguna baru masuk pertama kali | Diarahkan ke A3 untuk memindai QR dan memasukkan kode pertama |
| 5 | (nanti) A menekan "Nonaktifkan" pada sebuah pengguna | Dialog: "Pengguna ini tidak akan bisa masuk dan sesinya langsung diakhiri." Setelah konfirmasi: toast dan baris berstatus Nonaktif |

Semua langkah mencatat audit (FR7.7). Default "Wajibkan MFA" mengikuti keputusan **[OQ-4]**. Kewajiban ganti kata sandi sementara saat login pertama adalah **[USULAN]**.

### J9. Admin menambah sumber RSS atau target pemantauan

| # | Langkah | Respons sistem |
| --- | --- | --- |
| 1 | A membuka `/admin/sources`, "Tambah sumber" | Modal: nama, URL feed, kategori |
| 2 | A menekan "Uji feed" **[USULAN]** | Berhasil: "Ditemukan 20 artikel. Contoh: [judul]". Gagal: "Feed tidak bisa dibaca: format XML rusak." (edge 1) |
| 3 | A menekan "Simpan" | Sumber aktif dengan status "Menunggu data pertama". Pengambilan pertama pada jadwal berikutnya (maksimal 15 menit) |
| 4 | Media sosial: A membuka `/admin/social`, memilih tab platform, "Tambah target" | X: pilih mode Keyword atau Trending dan isi kueri dengan petunjuk sintaks. Instagram/Threads: jenis target **[OQ-27]** |

---

## 6. Layout per screen

Simbol di wireframe hanya penanda. Ikon sebenarnya memakai Lucide stroke 1,5 px. Ukuran dalam px.

### 6.1 Shell aplikasi (semua screen setelah login)

```
┌────────────┬──────────────────────────────────────────────────────────────────────────┐
│ ◆ [Produk] │ ☰  ✓ Semua sumber terkini · diperbarui 09:42 WIB            🔔    (AS) ▾ │ 64
│            ├──────────────────────────────────────────────────────────────────────────┤
│ ▌Dashboard │  (halaman: judul + filter bar, lengket)                                  │ 72
│  Jejaring  ├──────────────────────────────────────────────────────────────────────────┤
│  aktor     │                                                                          │
│ ────────── │                       area konten (maks 1600)                            │
│ Administr. │                                                                          │
│  Status    │                                                                          │
│  Sumber... │                                                                          │
│            │                                                                          │
│ ┌────────┐ │                                                                          │
│ │Kesegar.│ │                                                                          │
│ └────────┘ │                                                                          │
│  Cara baca │                                                                          │
└────────────┴──────────────────────────────────────────────────────────────────────────┘
   240 px
```

**Sidebar (240 px, putih, garis kanan `border-subtle`)**
- Atas: logo dan nama produk. Nama kerja belum diputuskan, pakai placeholder.
- Item nav tinggi 40, ikon 20, label 14/500. **Aktif:** latar `primary-50`, teks `primary-700` bobot 600, garis aksen 3 px `primary-600` di tepi kiri. **Hover:** latar `sunken`. Fokus: `focus-ring`.
- Grup pimpinan: Dashboard, Jejaring aktor.
- Grup admin (hanya admin; pemisah garis tipis dan judul grup "Administrasi", 12/600 `ink-500`): Status sistem, Sumber RSS, Media sosial, Koneksi X, Kamus alias, Pengguna, Audit log, (Topik bila **[OQ-25]**).
- Bawah: **kartu Kesegaran data** (gradasi navy, `radius-lg`, padding 16) berisi empat baris sumber: ikon status, nama, waktu relatif. Teks putih (7,85:1) dan `#DCE6FF` (6,28:1) di atas ujung gradasi paling terang. Warna ikon status di atas navy: terkini `#7EE0A9` (4,90:1), terlambat `#FFD27A` (5,51:1), gagal `#FF9A9E` (3,87:1, memenuhi 3:1 untuk ikon). Tautan "Lihat detail" membuka popover kesegaran. Di bawahnya item "Cara membaca data" (membuka D4).
- Rail 72 px (tablet): hanya ikon, label muncul sebagai tooltip, kartu Kesegaran menjadi tiga titik status bertumpuk.

**Top bar (64 px, putih, garis bawah `border-subtle`)**
- Kiri: tombol sidebar (hamburger di mobile), lalu **chip kesegaran ringkas**: "Semua sumber terkini · diperbarui 09:42 WIB". Bila ada sumber terlambat, chip menjadi amber "1 sumber terlambat" dan bisa diklik untuk rincian. Letaknya sengaja di top bar agar terlihat di semua halaman (Prinsip 2).
- Kanan: lonceng (**hanya admin**, memuat peringatan sistem yang juga ada di M1 **[OQ-17]**), avatar dengan menu: nama pengguna, peran, "Keluar".

**Baris judul dan filter bar (72 px, lengket di bawah top bar, latar `canvas`)**
- Kiri: judul halaman (`title-xl`) dan di bawahnya subjudul `text-sm` `ink-600`.
- Kanan (hanya di D1 dan D2): kontrol filter global (lihat 6.2). Bila halaman tidak memakai filter (halaman admin), area kanan memuat tombol aksi utama halaman.

### 6.2 D1. Dashboard

**Aksi utama:** menelusuri. Dashboard tidak punya tombol utama karena pimpinan hanya membaca. Aksi utamanya adalah mengklik elemen data untuk membuka Panel Sumber Pendukung.

```
┌────────────┬──────────────────────────────────────────────────────────────────────────┐
│  (sidebar) │ Dashboard      (Hari ini│7 hari│30 hari│Kustom)  [Kategori ▾]            │
│            │ 6–12 Nov 2026  [Topik ▾] [Sumber: Semua ▾]  Atur ulang                   │
│            ├──────────────────────────────────────────────────────────────────────────┤
│            │ ┌ Total konten ┐ ┌ Sentimen positif ┐ ┌ Sentimen negatif ┐ ┌ Aktor     ┐ │
│            │ │ 12.480 ↑4,9% │ │ 38%   ↑2,1 poin  │ │ 21%   ↓1,3 poin  │ │ teratas   │ │
│            │ │ vs 11.902    │ │ 4.742 konten     │ │ 2.620 konten     │ │ Nama 312x │ │
│            │ └──────────────┘ └──────────────────┘ └──────────────────┘ └───────────┘ │
│            │ ┌ Tren sentimen ─────────────────────────────┐ ┌ Rasio sentimen ───────┐ │
│            │ │ Persentase konten per hari  ─Pos ─Net ─Neg │ │        ╭‑‑‑‑‑‑‑╮      │ │
│            │ │   (grafik garis, tooltip, titik dapat      │ │      ╱ tick gauge ╲   │ │
│            │ │    diklik)                                 │ │      Netral 41%        │ │
│            │ │ ┌Berita──┐┌X──────┐┌Instagram┐┌Threads─┐    │ │ ☺ Positif 38%  4.742  │ │
│            │ │ │ 8.120  ││ 3.012 ││ 902     ││ 446    │    │ │ – Netral  41%  5.118  │ │
│            │ │ │ ▬▬▬▬▬▬ ││ ▬▬▬   ││ ▬       ││ ▬      │    │ │ ☹ Negatif 21%  2.620  │ │
│            │ │ │✓ 4 mnt ││◷ 1j 2m││✓ 22 mnt ││✓ 18 mnt│    │ │ Keyakinan rendah: 14% │ │
│            │ │ └────────┘└───────┘└─────────┘└────────┘    │ └───────────────────────┘ │
│            │ └────────────────────────────────────────────┘                           │
│            │ ┌ Kata kunci ────────────────┐ ┌ Jejaring aktor ───────────────────────┐   │
│            │ │ awan kata   [Awan│Daftar]  │ │ graf        [Tabel] [Buka layar penuh]│   │
│            │ └────────────────────────────┘ └───────────────────────────────────────┘   │
│            │ ┌ Konten terbaru ─────────────────────────────────────────────────────┐   │
│            │ │ Sumber │ Judul / cuplikan │ Sentimen │ Waktu │ Tautan               │   │
│            │ └─────────────────────────────────────────────────────────────────────┘   │
└────────────┴──────────────────────────────────────────────────────────────────────────┘
```

**Penempatan (grid 12 kolom, gap 20)**

| Zona | Kolom | Tinggi | Isi |
| --- | --- | --- | --- |
| KPI | 3 + 3 + 3 + 3 | 128 | Empat kartu KPI |
| Tren sentimen + tile sumber | 8 | 440 | Grafik garis (tinggi 260) dan empat tile sumber di dasar kartu |
| Rasio sentimen | 4 | 440 | Gauge dan tiga baris legenda |
| Kata kunci | 5 | 420 | Awan kata atau daftar peringkat |
| Jejaring aktor | 7 | 420 | Graf pratinjau |
| Konten terbaru | 12 | 8 baris | Tabel |

**Hierarki baca (urutan yang disengaja):** (1) chip kesegaran di top bar, (2) KPI, (3) tren sentimen, (4) rasio sentimen, (5) kata kunci, (6) jejaring, (7) konten terbaru. Pada 1440×900, butir 1 sampai 4 berada above the fold.

**Filter bar (global, FR6.1)**

| Kontrol | Bentuk | Perilaku |
| --- | --- | --- |
| Periode | Segmented control: Hari ini · 7 hari · 30 hari · Kustom. Di sebelahnya label rentang tanggal seperti pill referensi | "Kustom" membuka kalender rentang. Batas rentang maksimum **[OQ-7]** |
| Kategori | Dropdown multi-pilih | Daftar dari kategori RSS. Default: semua |
| Topik | Dropdown multi-pilih | Sumber daftar menunggu **[OQ-25]** |
| Sumber | Dropdown multi-pilih dengan ikon platform: Berita, X, Instagram, Threads | Default: semua. Menyaring tiap platform terpisah (FR6.7) |
| Atur ulang | Tombol teks | Muncul hanya bila filter berbeda dari default |

Setiap perubahan langsung berlaku tanpa tombol "Terapkan", karena dashboard ini hanya membaca dan perubahan murah. Filter bar tetap menempel di atas saat halaman digulir.

**Kartu KPI**

| Kartu | Nilai | Pendamping |
| --- | --- | --- |
| Total konten | Jumlah berita + postingan sesuai filter | Pill delta vs periode sebelumnya dengan panjang sama |
| Sentimen positif | Persentase dari total (ikon senyum) | Pill delta dalam poin persentase, dan jumlah konten |
| Sentimen negatif | Persentase dari total (ikon sedih) | Sama |
| Aktor paling sering muncul | Nama kanonik (teks, 20/700, maks 2 baris) | Jumlah kemunculan, dengan ikon tipe entitas |

Pill delta bersifat **netral**: latar `neu-tint`, teks `ink-700`, panah naik/turun. Tidak hijau, tidak merah (keputusan #5). Nilai periode sebelumnya tampil sebagai teks pendamping "vs 11.902". Seluruh kartu dapat diklik dan membuka panel yang bersesuaian (kecuali "Aktor teratas" yang membuka panel untuk aktor itu).

**Tren sentimen**
- Judul "Tren sentimen". Subjudul "Persentase konten per hari · [periode] · [sumber]".
- Tiga garis (Positif, Netral, Negatif), tebal 2 px, titik hanya muncul saat hover/fokus. Legenda berupa tombol toggle dengan ikon wajah.
- Opsi "Bandingkan dengan periode sebelumnya" (default mati): garis putus-putus tipis, seperti pada referensi.
- Tooltip mengikuti referensi: tanggal, tiga nilai (persen dan jumlah), ditempatkan agar tidak keluar kartu.
- Mengklik titik membuka panel untuk tanggal dan sentimen itu.
- Sumbu: tanggal berformat `12 Nov`, persen `0 sampai 100`. Garis kisi horizontal `border-subtle`.

**Tile sumber (di dasar kartu tren)**
- Empat tile `radius-sm`, latar `sunken`. Isi: ikon+nama sumber, jumlah (`kpi-md` dikecilkan ke 20/700), batang porsi 4 px (isi warna sumber, trek `border-subtle`), baris kesegaran (ikon status + waktu relatif).
- Diklik membuka panel semua item sumber itu.
- Sumber yang dikeluarkan filter: tile 50% opasitas, teks "Tidak dipilih di filter", tidak dapat diklik.

**Rasio sentimen**
- Gauge setengah lingkaran dari garis-garis pendek (sekitar 60), segmen berwarna sebanding porsi, urutan Positif, Netral, Negatif dari kiri ke kanan. Ini adaptasi gauge referensi.
- Tengah gauge: porsi terbesar, misalnya "Netral" (12/500) dan "41%" (`kpi-lg`). Menampilkan kelas dominan secara apa adanya, bukan selalu "positif".
- Di bawah: tiga baris legenda (ikon wajah, label, persen, jumlah). Setiap baris dapat diklik.
- Di dasar: "Keyakinan rendah: 14% konten" dengan ikon info yang membuka penjelasan (Prinsip 2 poin 4).

**Kata kunci**
- Awan kata (d3-cloud) sampai 60 kata. Ukuran 13 sampai 44 px sebanding frekuensi. **Rotasi 0° saja** agar terbaca. Lima kata teratas berwarna `primary-600`, sisanya `ink-700`. Hover/fokus: kata menyala biru, lainnya meredup 40%.
- Tombol "Awan | Daftar": Daftar menampilkan 20 kata teratas sebagai batang horizontal (gaya referensi: abu, aktif biru) dan menjadi alternatif aksesibel.
- Keterangan: "Menampilkan 60 dari 3.412 kata."
- Klik kata membuka panel (maksimal 30 artikel), tanpa mengubah filter.

**Jejaring aktor**
- Graf berarah gaya (force-directed), node sesuai tipe (bentuk + warna), ukuran node sebanding jumlah kemunculan, tebal garis sebanding bobot.
- Kontrol: zoom (+ − pas-layar), "Tabel" (alternatif aksesibel), "Buka layar penuh".
- Legenda tipe entitas di sudut kiri bawah.
- Keterangan: "Dihitung harian · data terbaru 11 Nov 2026" (FR3.2).
- Batas node default **[USULAN]** 60 node, bobot minimum edge 2, mengikuti **[OQ-19]**.

**Konten terbaru**
- Kolom: Sumber (chip), Judul/cuplikan (2 baris), Sentimen (chip), Waktu (relatif, tooltip absolut), Tautan (tombol ikon "Buka sumber asli").
- Delapan baris. Tautan "Lihat 30 terbaru" membuka Panel Sumber Pendukung.
- Tabel ini memakai komponen `ItemRow` yang sama dengan panel. Tidak ada FR yang memintanya secara eksplisit, jadi bila ruang atau waktu terbatas, kartu ini dapat dihapus tanpa mengubah satu pun FR.

### 6.3 D2. Jejaring aktor (layar penuh)

**Aksi utama:** menjelajahi dan menelusuri. Tidak ada tombol utama.

```
┌────────────┬──────────────────────────────────────────────────────────────────────────┐
│  (sidebar) │ Jejaring aktor     (filter bar yang sama dengan Dashboard)               │
│            ├───────────────────────────────────────────────────────────────┬──────────┤
│            │ ┌ Graf ─────────────────────────────────────────────────────┐ │ Legenda  │
│            │ │                                                           │ │ ● Tokoh  │
│            │ │                  (kanvas SVG 100% × 640)                  │ │ ■ Organ. │
│            │ │                                                           │ │ ◆ Perus. │
│            │ │ [+][−][pas]                                               │ │ ▲ Lokasi │
│            │ └───────────────────────────────────────────────────────────┘ │ Bobot    │
│            │  Dihitung harian · data terbaru 11 Nov 2026   [Lihat tabel]   │ min: 2   │
└────────────┴───────────────────────────────────────────────────────────────┴──────────┘
```

- Kanvas memakai sisa lebar halaman dan tinggi minimal 640. Panel kontrol kanan 200 px (legenda, slider "Bobot minimum hubungan", penghitung "Menampilkan 58 dari 214 aktor").
- Node dengan bobot tertinggi diberi label permanen. Label node lain muncul saat hover/fokus agar graf tidak penuh teks.
- Klik node atau garis membuka Panel Sumber Pendukung di kanan, menutupi panel kontrol sementara.

### 6.4 D3. Panel Sumber Pendukung (Evidence Drawer)

Elemen khas produk. Bentuknya mengikuti modal sisi kanan referensi: `radius-xl` di sisi kiri, tombol tutup bulat, scrim abu di belakang.

```
┌───────────────────────────────────────────┐
│ Kata "anggaran"                      (✕)  │  title-lg
│ 214 item · menampilkan 30 terbaru         │  text-sm, ink-600
│ [i] Filter dashboard tidak berubah        │  chip netral
│ Urutkan [Terbaru ▾]  [Positif][Netral][Negatif]   chip filter lokal
├───────────────────────────────────────────┤
│ [news] Kompas · 12 Nov 09:31 WIB          │
│ Judul berita yang panjang bisa dua baris, │
│ kata **anggaran** dicetak tebal           │
│ ☺ Positif              Buka sumber asli ↗ │
├───────────────────────────────────────────┤
│ [x] @akun · 12 Nov 09:12 WIB              │
│ Teks postingan sampai tiga baris ...      │
│ – Netral · Keyakinan rendah    Buka ... ↗ │
├───────────────────────────────────────────┤
│ ...                                       │
│ Menampilkan 30 dari 214 item. Persempit   │
│ periode atau sumber di dashboard.         │
│ Jika tautan tidak terbuka, artikel        │
│ mungkin sudah dihapus penerbit.           │
└───────────────────────────────────────────┘
   480 px (≥1024) · layar penuh (<1024)
```

- Header lengket. Hanya daftar yang menggulir.
- Pilihan "Urutkan" dan chip sentimen bersifat lokal terhadap panel dan tidak mengubah filter dashboard.
- Dialog modal: fokus dikunci di dalam, Esc menutup, klik scrim menutup, fokus kembali ke elemen pemicu.
- Bentuk judul tergantung pemicu: Kata "…", Aktor: …, "A dan B", Sentimen negatif · 10 Nov, Sumber: X, Tile/KPI terkait.

### 6.5 D4. Cara membaca data

Panel samping serupa D3, hanya teks. Isinya empat bagian pendek: **Sumber data** (RSS 12+ media, X, Instagram, Threads, kapan diperbarui), **Cara sentimen dihitung** (leksikon, tidak menangkap sarkasme dan bahasa gaul, keyakinan rendah ditandai), **Cara jejaring dibentuk** (dua aktor dalam satu konten = satu hubungan, dihitung harian), **Penyimpanan** (isi penuh artikel tidak disimpan, teks media sosial dihapus setelah 90 hari, ringkasan agregat tetap ada **[OQ-8]**).

### 6.6 A1 sampai A3. Masuk, MFA, pendaftaran MFA

```
┌──────────────────────────────────────────────────────────────┐
│                       (kanvas #F3F5F9)                       │
│                 ┌──────────────────────────┐                 │
│                 │ ◆ [Produk]               │                 │
│                 │ Masuk                    │  radius-xl      │
│                 │ Nama pengguna [_______]  │  padding 40     │
│                 │ Kata sandi    [____ (o)] │  lebar 420      │
│                 │ [        Masuk        ]  │                 │
│                 │ Lupa akses? Lihat bantuan│                 │
│                 └──────────────────────────┘                 │
│          Akses hanya melalui jaringan instansi (VPN/LAN)     │
└──────────────────────────────────────────────────────────────┘
```

- Satu kartu di tengah kanvas polos. Tanpa ilustrasi atau gradasi. Satu tombol utama selebar kartu.
- Tombol mata pada kata sandi (`aria-pressed`). Tidak memblokir paste.
- A2: enam kotak digit terpisah, fokus otomatis, `autocomplete="one-time-code"`, `inputmode="numeric"`. Tautan "Gunakan perangkat lain" mengarah ke A4.
- A3: dua kolom (QR di kiri, langkah di kanan) dengan kolom kode untuk konfirmasi. Kunci rahasia dalam teks tersedia sebagai alternatif QR.

### 6.7 Pola halaman admin (M1 sampai M8)

Semua halaman admin mengikuti satu pola agar cepat dipelajari:

```
┌────────────┬──────────────────────────────────────────────────────────────────────────┐
│  (sidebar) │ Judul halaman                                    [ Aksi utama halaman ]  │
│            │ Subjudul satu kalimat                                                    │
│            ├──────────────────────────────────────────────────────────────────────────┤
│            │ [Banner peringatan bila ada]                                             │
│            │ ┌ Kartu konten ───────────────────────────────────────────────────────┐ │
│            │ │ Toolbar: [Cari…]  [Filter ▾]                                        │ │
│            │ │ Tabel                                                               │ │
│            │ │ Pagination                                                          │ │
│            │ └─────────────────────────────────────────────────────────────────────┘ │
└────────────┴──────────────────────────────────────────────────────────────────────────┘
```

Satu tombol utama (biru) per halaman, di kanan judul.

| Screen | Aksi utama | Isi kartu |
| --- | --- | --- |
| M1 Status sistem | "Jalankan ulang job gagal" **[USULAN]**, bukan tombol permanen. Muncul hanya bila ada job gagal | Lihat di bawah |
| M2 Sumber RSS | Tambah sumber | Tabel: nama, URL feed (dipotong, tombol salin), kategori, toggle aktif, pembaruan terakhir, status/error, menu aksi |
| M3 Media sosial | Tambah target | Tab X · Instagram · Threads. Tabel target: mode/jenis, kueri, toggle aktif, run terakhir (waktu, jumlah, status). Di bawahnya riwayat run dalam bagian yang dapat dilipat |
| M4 Koneksi X | Mulai sesi login | Lihat di bawah |
| M5 Kamus alias | Tambah alias | Tabel: alias, nama kanonik, tipe (tag entitas), menu aksi. Kolom cari di toolbar |
| M6 Pengguna | Tambah pengguna | Tabel: nama pengguna, peran, MFA (Aktif / Menunggu / Tidak), status, login terakhir, menu aksi |
| M7 Audit log | (tidak ada, hanya baca) | Toolbar: aktor, aksi, rentang tanggal. Tabel: waktu, aktor, aksi, target, IP, User-Agent (dipotong, tooltip lengkap). Catatan: "Log dirotasi setelah 365 hari." |

**M1. Status sistem**

```
│ Status sistem                                                                         │
│ ┌ Peringatan ─────────────────────────────────────────────────────────────────────┐   │
│ │ ⚠ Sesi X tidak valid sejak 09:10 WIB. Data X tidak diperbarui.   [Perbarui sesi] │   │
│ └─────────────────────────────────────────────────────────────────────────────────┘   │
│ ┌ Job terjadwal ──────────────────────────────────────────────────────────────────┐   │
│ │ Job              Jadwal    Run terakhir  Status    Durasi  Diproses  Error      │   │
│ │ Ambil RSS        10–15 m   09:40         ✓ Sukses  14 dtk  86        –          │   │
│ │ Analisis batch   5 m       09:40         ✓ Sukses  41 dtk  100       –          │   │
│ │ Ambil sosmed     15–30 m   09:10         ⚠ Gagal   3 dtk   0         Lihat ▾    │   │
│ │ Pemeliharaan     Harian    02:00         ✓ Sukses  8 dtk   –         –          │   │
│ └─────────────────────────────────────────────────────────────────────────────────┘   │
│ ┌ Status analisis ─────────────────────────┐ ┌ Sumber bermasalah ─────────────────┐   │
│ │ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ▬ ▬  Selesai 12.340     │ │ Detik: XML rusak (09:30)           │   │
│ │ Menunggu 96 · Diproses 12 · Gagal 32     │ │ Kumparan: timeout (09:30)          │   │
│ └──────────────────────────────────────────┘ └────────────────────────────────────┘   │
```

Hierarki: peringatan, job, status analisis, sumber bermasalah. Admin harus tahu apa yang rusak sebelum membaca angka. Jumlah "Gagal dianalisis" menjadi tautan ke daftar artikel gagal. Tabel job memakai ikon bentuk berbeda per status (bukan hanya warna).

**M4. Koneksi X**

```
│ Koneksi X                                                                             │
│ ┌ Status sesi ────────────────────────────┐ ┌ Cara kerja dan keamanan ───────────────┐ │
│ │ ⚠ Tidak valid                           │ │ Anda login langsung di browser jarak   │ │
│ │ Terakhir diperbarui 10 Nov 2026 14:20   │ │ jauh. Kata sandi tidak disimpan.       │ │
│ │ [ Mulai sesi login ]                    │ │ Hanya berkas sesi yang disimpan dan    │ │
│ └─────────────────────────────────────────┘ │ tidak bisa diunduh lewat web.          │ │
│ ┌ Browser jarak jauh ─────────────────────────────────────── Berakhir dalam 04:32 ─┐ │ │
│ │                    (bingkai stream 16:10, lebar penuh)                          │ │ │
│ └ [Batalkan] ───────────────────────────────────────── [ Selesai dan simpan sesi ] ┘ │ │
```

- Bingkai browser memiliki tepi `border-strong` dan label "Browser jarak jauh" agar jelas bahwa isi di dalamnya bukan bagian dari aplikasi.
- Hitung mundur berubah amber pada 60 detik terakhir (disertai ikon jam).
- Pada layar < 1024, halaman menampilkan "Gunakan layar yang lebih besar untuk login X" dan menyembunyikan tombol mulai (CAPTCHA dan 2FA tidak praktis di layar kecil).
- Bila **[OQ-26]** memutuskan Instagram/Threads juga butuh sesi login, halaman ini menjadi tab X · Instagram · Threads dengan pola yang sama.

---

## 7. Component library

Setiap komponen reusable beserta variant dan state. State minimum yang berlaku untuk semua kontrol interaktif: **default, hover, fokus, aktif/ditekan, dinonaktifkan**, kecuali disebut lain.

### 7.1 Fondasi

| Komponen | Variant | State tambahan dan catatan |
| --- | --- | --- |
| **Button** | `primary` (isi `primary-600`, teks putih), `secondary` (putih, garis `border-subtle`, teks `ink-900`), `ghost` (tanpa latar), `destructive` (isi `neg-text`, teks putih). Ukuran `sm` 32, `md` 40, `lg` 48. Radius `radius-sm` | `loading` (spinner menggantikan ikon, lebar tetap, `aria-busy`). Hover `primary-700`. Nonaktif: latar `neu-tint`, teks `ink-500` |
| **IconButton** | `plain`, `round` (bulat, seperti tombol tutup referensi) | Wajib `aria-label`. Area sentuh minimal 36 (44 di layar sentuh) |
| **TextField** | Teks, kata sandi (dengan tombol mata), pencarian | Fokus: garis `primary-600` plus `focus-ring`. Galat: garis `neg-text`, ikon, pesan di bawah dengan `aria-describedby`. Batas input memakai `border-control` |
| **OtpField** | 6 kotak | Isi otomatis maju, backspace mundur, galat menggoyang pelan satu kali (dihapus saat reduced motion) |
| **Select / MultiSelect** | Tunggal, multi dengan ikon platform | Terbuka, memuat, kosong ("Tidak ada pilihan"). Multi menampilkan ringkasan "3 dari 4" |
| **Segmented** | Periode (4 opsi) | Opsi aktif: latar `primary-600`, teks putih. Navigasi panah. `role="radiogroup"` |
| **DateRangePicker** | Kalender rentang di popover | Rentang tidak valid, rentang melebihi batas maksimum. Hari dalam bahasa Indonesia, minggu mulai Senin |
| **Checkbox / Switch** | Checkbox untuk multi-pilih, Switch untuk aktif/nonaktif | Indeterminate untuk "sebagian". Switch memakai `border-control` dan label teks "Aktif/Nonaktif" |
| **Tabs** | Garis bawah | Aktif: garis 2 px `primary-600`. Panah kiri/kanan antar tab |
| **Tooltip** | Teks singkat | Muncul saat hover dan fokus, tertutup dengan Esc, tidak memuat tautan |
| **Popover** | Kesegaran, penjelasan "Keyakinan rendah" | Fokus masuk ke dalam. Esc menutup |
| **Modal** | Konfirmasi, formulir | `radius-xl`, scrim, fokus terkunci, judul `aria-labelledby`. Dialog destruktif: tombol default adalah "Batal" |
| **Toast** | Sukses, info, galat | Muncul di kanan bawah, 5 detik (galat tidak hilang otomatis). `role="status"` (galat: `role="alert"`) |
| **Banner** | Info, peringatan, galat, sukses | Ikon, pesan, satu aksi opsional, tombol tutup bila bukan galat sistem. Selalu ikon + teks |
| **Skeleton** | Bentuk mengikuti komponen (kartu, baris, grafik) | Kilap pelan 1,2 detik, mati saat reduced motion |
| **Avatar + menu** | Inisial | Menu: nama pengguna, peran, Keluar |
| **NavItem** | Normal, aktif, rail (ikon saja) | Lihat 6.1 |

### 7.2 Penanda data

| Komponen | Variant | Aturan |
| --- | --- | --- |
| **SentimentChip** | Positif (ikon senyum), Netral (ikon datar), Negatif (ikon sedih). Ukuran `sm`, `md`. Tambahan: sufiks "Keyakinan rendah" | Pill: tint + teks + ikon. Nilai skor mentah tidak ditampilkan di chip. Skor tampil di tooltip: "Skor −0,42 · keyakinan 0,38" |
| **SourceChip** | Berita, X, Instagram, Threads. Opsional menyertakan nama media ("Kompas") | Ikon berwarna sumber + nama. Selalu ada teks |
| **FreshnessIndicator** | `terkini` (ikon lingkaran-centang), `terlambat` (jam), `tidak diperbarui` (segitiga-seru), `belum ada data` (lingkaran-garis). Bentuk: titik+teks, chip, baris di kartu sidebar | Selalu ikon + teks + waktu relatif. Tooltip memuat waktu absolut WIB |
| **DeltaPill** | Naik, turun, tetap | **Netral**: `neu-tint`. Panah arah saja. Teks "+4,9%" atau "−1,3 poin" |
| **EntityTag** | Tokoh, Organisasi, Perusahaan, Lokasi | Bentuk kecil sesuai tipe + nama, warna sesuai palet entitas |
| **StatusChip** (admin) | Sukses, Berjalan, Gagal, Menunggu, Nonaktif | Ikon + label. "Berjalan" memakai spinner kecil |

### 7.3 Komponen data (inti produk)

| Komponen | Variant | State dan catatan |
| --- | --- | --- |
| **KpiCard** | Angka, teks (aktor teratas) | `loading` (skeleton), `kosong` (angka "0", persen "–"), `galat kartu` (ikon + "Coba lagi"), `interaktif` (hover `shadow-raised`, fokus, ditekan). Selalu memuat label, nilai, pendamping |
| **TrendChart** | Garis 3 seri, + garis pembanding | `loading`, `kosong`, `galat`, `hover/fokus titik` (tooltip), `seri dimatikan`, `tampilan tabel`. Satu tab stop; panah kiri/kanan berpindah titik |
| **SentimentGauge** | Setengah lingkaran dengan legenda | `loading`, `kosong` (gauge abu penuh, teks "Belum ada data untuk filter ini"), `baris legenda interaktif`. Alternatif: batang bertumpuk horizontal pada layar sempit |
| **SourceTile** | Normal, terlambat, tidak diperbarui, belum ada data, disaring | Lihat 6.2. Disaring = tidak dapat diklik, `aria-disabled` |
| **WordCloud** | Awan, daftar | `loading`, `kosong`, `kata terfokus`, `kata terpilih`, `terlalu sedikit data` (di bawah 10 kata: otomatis beralih ke daftar). Roving tabindex |
| **NetworkGraph** | Pratinjau (kartu), layar penuh | `loading` (kerangka lingkaran abu), `kosong`, `cache belum ada`, `node terfokus`, `node terpilih (tetangga menonjol)`, `edge terpilih`, `terlalu padat` (saran menaikkan bobot minimum). Alternatif tabel hubungan |
| **ItemRow** | `berita`, `sosial` | Lihat di bawah |
| **ItemList** | Dalam panel, dalam tabel | Memuat, kosong, galat, "lebih dari 30" (catatan batas) |
| **EvidenceDrawer** | Kata, Aktor, Hubungan (A dan B), Tanggal+Sentimen, Sumber, KPI | `membuka` (masuk 240 ms), `memuat`, `kosong`, `galat` (Coba lagi), `daftar`, `offline` |
| **FilterBar** | Penuh (≥1024), ringkas (<1024: tombol "Filter (n)" + segmented periode) | `default`, `terfilter` (menampilkan "Atur ulang"), `memuat`, `rentang kustom tidak valid` |
| **FreshnessCard** (sidebar) | Penuh, rail | Menyusun empat `FreshnessIndicator` |

**ItemRow**

| Bagian | Berita | Sosial (X, Instagram, Threads) |
| --- | --- | --- |
| Baris atas | SourceChip + nama media, waktu | SourceChip + `@akun`, waktu |
| Isi | Judul (`text-md`, 2 baris) dan cuplikan 1 baris bila ruang | Teks/caption 3 baris |
| Penyorotan | Istilah yang diklik dicetak tebal | sama |
| Baris bawah | SentimentChip (+ "Keyakinan rendah") dan tombol "Buka sumber asli" | sama, ditambah metrik interaksi bila tersedia (suka, repost, balasan) dengan ikon |
| State | default, hover (`sunken`), fokus, `tautan dibuka` (judul berubah `ink-600`) | sama |

Tidak ada gambar, thumbnail, atau video (isi penuh tidak disimpan, FR1.5 dan FR10.2).

### 7.4 Komponen admin

| Komponen | Variant | State |
| --- | --- | --- |
| **DataTable** | Standar, dengan baris yang dapat meluas (error) | Urut kolom (`aria-sort`), memuat (skeleton baris), kosong, galat, baris terpilih, baris bermasalah (latar tint merah muda dan ikon). Header lengket. Pada layar sempit menjadi daftar kartu |
| **Pagination** | Nomor halaman | Halaman pertama/terakhir nonaktif. Ukuran halaman 25/50 |
| **JobRow** | Sukses, Berjalan, Gagal, Menunggu | Meluas untuk menampilkan error terakhir dan aksi |
| **StatusBar** (distribusi status analisis) | Batang bertumpuk Selesai/Diproses/Menunggu/Gagal | Selalu dengan angka dan label, tidak hanya warna |
| **RemoteBrowserFrame** | `idle`, `menyiapkan`, `aktif`, `menyimpan`, `berakhir`, `galat` | Hitung mundur, tombol "Lepas fokus" untuk keluar dari kunci keyboard |
| **QrCard** | QR + kunci teks | `memuat`, `kedaluwarsa`, `terverifikasi` |
| **ConfirmDialog** | Biasa, destruktif | Destruktif: menyebut dampak spesifik dan tombol berlabel aksi ("Nonaktifkan pengguna", bukan "Ya") |

---

## 8. State: kosong, memuat, galat, berhasil, offline

Setiap screen kunci mendefinisikan kelima state. Tiga jenis "tidak ada isi" selalu dibedakan (Prinsip 2): **belum ada data**, **filter tidak menghasilkan data**, dan **gagal memuat**.

### 8.0 Pola global

| Pola | Perilaku |
| --- | --- |
| **Memuat** | Skeleton yang berbentuk seperti komponen aslinya. Tanpa spinner penuh layar. Wilayah diberi `aria-busy="true"` dan teks tersembunyi "Memuat…". Bila lebih dari 8 detik **[USULAN, target performa menunggu OQ-7]**: banner info "Memuat lebih lama dari biasanya." |
| **Offline** | Banner lengket di bawah top bar: "Koneksi ke server terputus. Menampilkan data yang terakhir dimuat pukul 09:42 WIB. Periksa koneksi VPN atau jaringan instansi." Data terakhir tetap terlihat. Tombol yang mengubah data (admin) dinonaktifkan dengan tooltip "Tidak tersedia saat offline". Saat tersambung lagi: banner hilang dan toast "Terhubung kembali" |
| **Galat sebagian** | Satu kartu gagal tidak menjatuhkan halaman. Kartu itu menampilkan ikon, pesan, dan "Coba lagi". Kartu lain tetap berjalan |
| **Galat penuh** | Layar tengah dengan kode rujukan dan waktu |
| **Pembaruan data** | Dashboard **tidak** menyusun ulang diri saat pembacaan berlangsung. Bila ada data baru, muncul pill di atas konten "Data baru tersedia · Muat ulang". Setelah dimuat ulang: toast "Dashboard diperbarui 09:57 WIB" |

Keputusan "tidak memuat ulang otomatis" menjaga pimpinan agar grafik tidak bergeser saat sedang dibaca atau dijelaskan di rapat.

### 8.1 D1. Dashboard

| State | Tampilan | Teks | Tindakan |
| --- | --- | --- | --- |
| Memuat | Skeleton KPI, grafik, gauge, awan kata, graf, tabel. Filter bar tampil tapi nonaktif sampai muatan pertama. Chip top bar "Memeriksa kesegaran…" | (tersembunyi) "Memuat dashboard" | n/a |
| Kosong: belum ada data (instalasi baru) | Satu state di area konten, bukan kosong per kartu. Ikon garis tipis, tanpa ilustrasi | **"Belum ada data."** "Pengumpulan berjalan otomatis. Data pertama muncul beberapa menit setelah sumber aktif." | Pimpinan: "Hubungi admin jika data belum muncul." Admin: tombol "Buka status sistem" |
| Kosong: filter tidak menghasilkan data | Bingkai kartu tetap ada. Tiap kartu menampilkan state ringkas. KPI: jumlah "0", persentase "–" (bukan "0%", karena tidak terdefinisi) | **"Tidak ada konten untuk filter ini."** | "Atur ulang filter" |
| Sebagian: satu sumber terlambat atau gagal | Dashboard tampil. Tile sumber berubah amber/merah dengan stempel waktu. Banner di atas kartu KPI | **"Data X belum diperbarui sejak 09:10 WIB."** "Angka X menunjukkan data sampai saat itu." | Pimpinan: "Lihat kesegaran". Admin: "Perbarui sesi" |
| Galat kartu | Kartu bersangkutan: ikon segitiga, pesan | "Kartu ini gagal dimuat." | "Coba lagi" |
| Galat penuh (database tak tersedia, edge 19) | Layar tengah | **"Data tidak bisa dimuat sekarang."** "Data yang sudah tersimpan tidak hilang. Kode: DB-503 · 12 Nov 2026 09:42 WIB." | "Coba lagi", "Hubungi admin" |
| Berhasil / data baru | Pill "Data baru tersedia" | "Data baru tersedia · Muat ulang" | "Muat ulang" |
| Offline | Banner global (8.0). Konten tetap ada | Lihat 8.0 | n/a |

### 8.2 D2. Jejaring aktor

| State | Tampilan | Teks | Tindakan |
| --- | --- | --- | --- |
| Memuat | Kerangka lingkaran dan garis abu di kanvas | (tersembunyi) "Memuat jejaring aktor" | n/a |
| Kosong: tidak ada hubungan | Kanvas kosong dengan pesan di tengah | **"Tidak ada hubungan antar aktor untuk filter ini."** | "Atur ulang filter" |
| Cache belum ada | Graf memakai tanggal terakhir yang tersedia | **"Jejaring dihitung harian. Menampilkan data 11 Nov 2026."** | Tautan "Cara jejaring dibentuk" |
| Terlalu padat | Graf tampil, banner kecil di atas kanvas | "Banyak hubungan ditampilkan. Naikkan bobot minimum agar lebih terbaca." | Slider bobot |
| Galat | Kanvas diganti pesan | **"Jejaring tidak bisa dimuat."** | "Coba lagi" |
| Offline | Banner global. Graf terakhir tetap ada, interaksi yang butuh panel dinonaktifkan | Lihat 8.0 | n/a |

### 8.3 D3. Panel Sumber Pendukung

| State | Tampilan | Teks | Tindakan |
| --- | --- | --- | --- |
| Memuat | Header langsung tampil (judul diketahui dari pemicu). Lima baris skeleton | (tersembunyi) "Memuat sumber pendukung" | n/a |
| Kosong | Pesan di tengah daftar | **"Tidak ada item untuk pilihan ini."** "Coba hapus filter sentimen di panel." | "Hapus filter panel" |
| Galat | Pesan di tengah, header tetap | **"Daftar tidak bisa dimuat."** | "Coba lagi" |
| Daftar lebih dari 30 | Catatan di akhir daftar | "Menampilkan 30 dari 214 item. Persempit periode atau sumber di dashboard untuk melihat sisanya." | n/a |
| Offline | Daftar yang sudah dimuat tetap ada. Item baru tidak dapat dimuat | Banner global | n/a |

### 8.4 A1 sampai A3. Masuk dan MFA

| State | Tampilan | Teks | Tindakan |
| --- | --- | --- | --- |
| Memuat | Tombol "Masuk" berubah loading dengan lebar tetap | (tombol) "Masuk…" | n/a |
| Galat kredensial | Banner galat di atas formulir. Kolom tidak ditandai individual agar tidak membocorkan mana yang salah | **"Nama pengguna atau kata sandi tidak cocok."** | Fokus ke kolom nama pengguna |
| Dibatasi (throttling) | Tombol dinonaktifkan dengan hitung mundur | **"Terlalu banyak percobaan. Coba lagi dalam 04:32."** Pesan identik untuk nama pengguna yang tidak ada | n/a |
| Kode MFA salah | Galat inline di bawah kotak kode, kotak dikosongkan | "Kode tidak cocok. Periksa jam pada perangkat dan coba lagi." | Fokus ke kotak pertama |
| Berhasil | Langsung beralih ke tujuan. Tanpa toast | n/a | n/a |
| Offline | Banner di atas kartu, tombol nonaktif | "Tidak ada koneksi. Pastikan VPN atau jaringan instansi aktif." | n/a |

### 8.5 M1. Status sistem

| State | Tampilan | Teks | Tindakan |
| --- | --- | --- | --- |
| Memuat | Skeleton banner, tabel job, kartu status | (tersembunyi) | n/a |
| Kosong (belum ada run) | Tabel job tampil dengan jadwal, kolom run "Belum berjalan", status abu | **"Belum ada run."** "Job pertama berjalan sesuai jadwal." | n/a |
| Galat memuat status | Kartu pesan | **"Status sistem tidak bisa dimuat."** "Ini tidak berarti job berhenti berjalan." | "Coba lagi" |
| Berhasil / normal | Tidak ada banner peringatan. Tabel semua sukses | "Tidak ada peringatan aktif." Bukan "Semua sehat": sistem hanya bisa menyatakan apa yang ia ukur | n/a |
| Setelah aksi | Toast | "Job dijalankan. Hasil muncul dalam beberapa menit." | n/a |
| Offline | Banner global, tombol aksi nonaktif | Lihat 8.0 | n/a |

### 8.6 M2, M3, M5, M6, M7. Halaman tabel admin

| State | Tampilan | Teks (contoh M2) | Tindakan |
| --- | --- | --- | --- |
| Memuat | Skeleton baris tabel | (tersembunyi) | n/a |
| Kosong | Pesan di tengah kartu, ikon tipis | **"Belum ada sumber RSS."** "Tambahkan sumber pertama untuk mulai mengumpulkan berita." | "Tambah sumber" |
| Kosong karena pencarian | Pesan ringkas | "Tidak ada hasil untuk 'xyz'." | "Hapus pencarian" |
| Galat | Pesan di tengah kartu | **"Daftar tidak bisa dimuat."** | "Coba lagi" |
| Berhasil | Toast + baris diperbarui | "Sumber disimpan." (kata kerja sama dengan tombol "Simpan") | n/a |
| Galat simpan | Galat inline pada kolom, atau banner di dalam modal | "Feed tidak bisa dibaca: format XML rusak." | Perbaiki lalu simpan lagi |
| Offline | Banner global, tombol ubah nonaktif | Lihat 8.0 | n/a |

M7 (audit log) tidak memiliki aksi ubah. State kosongnya: "Belum ada aktivitas yang tercatat untuk filter ini."

### 8.7 M4. Koneksi X

| State | Tampilan | Teks | Tindakan |
| --- | --- | --- | --- |
| Idle (sesi valid) | Kartu status: ikon lingkaran-centang | **"Sesi valid."** "Diperbarui 12 Nov 2026 09:55 WIB." | "Mulai sesi login" (sekunder) |
| Idle (sesi tidak valid) | Kartu status: ikon segitiga | **"Sesi tidak valid."** "Data X tidak diperbarui sampai sesi diperbarui." | "Mulai sesi login" (utama) |
| Menyiapkan | Bingkai berisi skeleton dan teks | "Menyiapkan browser jarak jauh…" | "Batalkan" |
| Aktif | Bingkai stream, hitung mundur | "Login ke X di browser ini. Kata sandi tidak disimpan." | "Selesai dan simpan sesi", "Batalkan" |
| Menyimpan | Tombol loading, bingkai membeku | "Memeriksa dan menyimpan sesi…" | n/a |
| Berhasil | Kartu status menjadi valid, bingkai ditutup, toast | "Sesi disimpan." | n/a |
| Berakhir (timeout) | Bingkai diganti pesan | **"Sesi login berakhir otomatis."** "Mulai lagi bila belum selesai." | "Mulai sesi login" |
| Galat sumber daya (edge 22) | Pesan di kartu | **"Browser jarak jauh tidak bisa dijalankan sekarang."** "Dashboard dan data tersimpan tidak terpengaruh." | "Coba lagi" |
| Offline / stream terputus | Bingkai diganti pesan | **"Koneksi ke browser jarak jauh terputus."** "Sesi login belum disimpan." | "Mulai sesi login" |

---

## 9. Responsive behaviour

### 9.1 Titik henti dan keputusan

| Nama | Rentang | Perangkat sasaran |
| --- | --- | --- |
| `base` | < 640 | Ponsel |
| `sm` | 640 sampai 1023 | Tablet, jendela sempit |
| `lg` | 1024 sampai 1599 | Laptop dan desktop (sasaran utama) |
| `2xl` | ≥ 1600 | Monitor lebar. Konten berhenti membesar di 1600 dan berada di tengah |

**Keputusan:** dashboard dibuat sebagai **web responsif hanya-baca untuk pimpinan** yang tetap nyaman di 360 px. Aplikasi mobile ada di kategori "Nanti" (PRD), dan kebutuhan akses mobile belum dipastikan **[OQ-10]**, tetapi pimpinan yang membuka tautan dari ponsel di sela jadwal adalah skenario yang masuk akal dan murah didukung bila dirancang sejak awal. Halaman admin dioptimalkan untuk ≥ 768 px; di bawah itu tabel tetap terbaca tetapi aksi berisiko (M4) disembunyikan.

### 9.2 Perilaku per komponen

| Komponen | Ponsel (< 640) | Tablet (640 sampai 1023) | Desktop (≥ 1024) |
| --- | --- | --- | --- |
| Sidebar | Laci dari kiri lewat hamburger, menutup setelah memilih | Rail ikon 72 px | 240 px, dapat diciutkan ke rail |
| Top bar | Chip kesegaran dipendekkan ("Terkini · 09:42") | Penuh | Penuh |
| Filter bar | Segmented periode (dapat digulir mendatar) + tombol **"Filter (n)"** yang membuka lembar bawah berisi Kategori/Topik/Sumber dengan tombol "Terapkan" | Satu baris, dua baris bila perlu | Satu atau dua baris, lengket |
| KPI | Grid 2×2 | 2×2 (< 900) atau 4 kolom (≥ 900) | 4 kolom |
| Tren sentimen | Lebar penuh, tinggi 220. Tooltip dengan sentuhan, titik terdekat dipilih otomatis agar target sentuh cukup | Lebar penuh | 8 kolom |
| Tile sumber | Grid 2×2 | 4 kolom | 4 kolom |
| Rasio sentimen | Lebar penuh. Gauge mengecil, legenda di bawah | 4 kolom berdampingan dengan kata kunci | 4 kolom |
| Kata kunci | **Default tampilan Daftar** (awan kata di 320 px tidak terbaca). Tombol "Awan" tetap ada | Awan | Awan |
| Jejaring aktor | Kartu menampilkan **daftar hubungan teratas**. Tombol "Buka graf" membuka layar penuh dengan sentuh-cubit dan geser; disarankan layar landscape | Graf pratinjau lebar penuh | Graf pratinjau 7 kolom |
| Konten terbaru | Tabel menjadi daftar kartu (`ItemRow`) | Tabel dengan kolom Tautan ringkas | Tabel penuh |
| Panel Sumber Pendukung | **Lembar penuh** dari bawah (tinggi 100% dikurangi area aman). Tombol kembali (panah) di kiri judul menggantikan ✕ | Lembar kanan 100% lebar | Lembar kanan 480 px |
| Halaman admin | Tabel menjadi daftar kartu. Aksi di menu "⋯". M4 menampilkan "Gunakan layar yang lebih besar" | Tabel dengan kolom sekunder disembunyikan | Tabel penuh |
| Modal | Lembar bawah | Modal tengah | Modal tengah |

Pengecualian "Terapkan" di ponsel: di desktop filter langsung berlaku (8.0), tetapi pada ponsel tiap perubahan memuat ulang melalui jaringan VPN yang lebih lambat, jadi perubahan dikelompokkan.

```
┌──────────────────────────┐
│ ☰  ✓ Terkini 09:42   (AS)│
│ Dashboard                │
│ (Hari ini│7 hari│30 h…)→ │
│ [ Filter (2) ]           │
│ ┌ Total ───┐┌ Positif ─┐ │
│ ┌ Negatif ─┐┌ Aktor ───┐ │
│ ┌ Tren sentimen ───────┐ │
│ ┌ Tile sumber 2×2 ─────┐ │
│ ┌ Rasio sentimen ──────┐ │
│ ┌ Kata kunci (daftar) ─┐ │
│ ┌ Jejaring (daftar) ───┐ │
│ ┌ Konten terbaru ──────┐ │
└──────────────────────────┘
```

Urutan vertikal di ponsel mengikuti hierarki baca yang sama dengan desktop (6.2). Tidak ada konten yang hanya tersedia di desktop, kecuali login X.

---

## 10. Accessibility

Sasaran: **WCAG 2.2 level AA** untuk seluruh screen. Produk ini dipakai di lingkungan instansi, dan pengguna dengan kebutuhan aksesibilitas tidak boleh dikecualikan dari data yang memengaruhi keputusan.

### 10.1 Struktur dan navigasi

- `<html lang="id">`. Satu `<h1>` per halaman (judul halaman). Judul kartu `<h2>`, bagian di dalam kartu `<h3>`.
- Landmark: `<header>` (top bar), `<nav aria-label="Navigasi utama">`, `<main id="konten">`, filter bar sebagai `role="group"` dengan `aria-label="Filter dashboard"`, panel sebagai dialog.
- **Tautan lewati** "Lewati ke konten utama" menjadi elemen fokus pertama.
- Item nav aktif memakai `aria-current="page"`.
- `scroll-padding-top` pada halaman diset ke tinggi top bar + filter bar (sekitar 152 px) agar elemen yang difokus tidak tertutup elemen lengket (WCAG 2.4.11).

### 10.2 Urutan fokus (Dashboard)

Urutan fokus mengikuti urutan DOM dan urutan visual. Tidak ada `tabindex` positif.

1. Tautan lewati
2. Sidebar: Dashboard, Jejaring aktor, (grup admin), "Lihat detail" kesegaran, "Cara membaca data"
3. Top bar: chip kesegaran, lonceng (admin), menu avatar
4. Filter bar: Periode (satu tab stop, panah berpindah opsi), Kategori, Topik, Sumber, Atur ulang
5. KPI (empat tab stop, karena dapat diklik)
6. Tren sentimen: tiga tombol legenda, "Bandingkan periode sebelumnya", area grafik (satu tab stop)
7. Tile sumber (empat)
8. Rasio sentimen: tiga baris legenda, info "Keyakinan rendah"
9. Kata kunci: "Awan | Daftar", lalu kata (roving tabindex: satu tab stop, panah berpindah kata)
10. Jejaring aktor: "Tabel", "Buka layar penuh", graf (roving tabindex)
11. Konten terbaru: tombol "Buka sumber asli" per baris, "Lihat 30 terbaru"

Saat panel terbuka: fokus pindah ke judul panel, fokus terkunci di dalamnya, latar belakang `inert`. Saat panel ditutup, fokus kembali ke elemen pemicu (kata, node, titik, tile).

### 10.3 Keyboard

| Tombol | Fungsi |
| --- | --- |
| Tab / Shift+Tab | Pindah antar komponen |
| Panah kiri/kanan | Dalam Segmented, Tabs, titik pada grafik tren |
| Panah | Dalam awan kata dan graf: berpindah antar elemen berurutan menurut bobot |
| Enter / Spasi | Mengaktifkan, membuka Panel Sumber Pendukung |
| Esc | Menutup panel, popover, modal, tooltip |
| Home / End | Elemen pertama / terakhir dalam grup grafik |

Tidak ada pintasan satu karakter (WCAG 2.1.4), untuk menghindari bentrok dengan pembaca layar.

### 10.4 ARIA

| Elemen | Penerapan |
| --- | --- |
| Segmented periode | `role="radiogroup"`, tiap opsi `role="radio"` dengan `aria-checked` |
| Toggle legenda dan "Bandingkan" | `<button aria-pressed>` |
| Grafik tren | `<figure>` dengan `aria-labelledby` judul dan `aria-describedby` ringkasan teks yang dibuat otomatis, misalnya "Tren sentimen 6 sampai 12 Nov. Positif naik dari 35% ke 38%. Negatif turun dari 22% ke 21%." Titik dapat difokus, dengan label "10 Nov, Negatif, 22%, 612 konten" |
| Gauge | `role="img"` dengan `aria-label` "Rasio sentimen: Positif 38%, Netral 41%, Negatif 21%". Legenda berupa tombol nyata |
| Awan kata | Daftar `role="list"`; tiap kata adalah `<button>` berlabel "anggaran, 214 kemunculan" |
| Graf jejaring | Tiap node `<button>` berlabel "Joko Widodo, tokoh, 42 kemunculan, terhubung dengan 8 aktor". Garis dapat dijangkau lewat node atau lewat tabel hubungan |
| Alternatif tabel | Setiap grafik memiliki "Lihat sebagai tabel" atau "Daftar" yang memuat data yang sama |
| Panel Sumber Pendukung | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pada judul |
| Perubahan filter | Wilayah `aria-live="polite"` menyatakan "Dashboard diperbarui: 12.480 konten, 7 hari terakhir" |
| Galat | `role="alert"` untuk galat yang memerlukan perhatian, `role="status"` untuk info seperti perubahan kesegaran |
| Tabel | `<th scope>`, `aria-sort` pada kolom yang dapat diurutkan |
| Tautan keluar | Ikon "↗" `aria-hidden`, teks tersembunyi "(membuka tab baru)" |
| Waktu | `<time datetime="2026-11-12T09:42:00+07:00">` dengan teks relatif; waktu absolut WIB di tooltip |
| Ikon dekoratif | `aria-hidden="true"`. Ikon wajah pada SentimentChip didampingi teks, jadi tidak perlu label sendiri |
| Skeleton | Induknya `aria-busy="true"` |

### 10.5 Kontras

Seluruh nilai terhitung pada hex persis (bagian 3.1).

| Pasangan | Rasio | Ketentuan |
| --- | --- | --- |
| `ink-900` di putih / canvas | 17,87 / 16,38 | teks, AA ✓ |
| `ink-600` di putih / canvas | 6,31 / 5,79 | teks sekunder ✓ |
| `ink-500` di putih | 4,69 | teks tersier ✓ **hanya di putih** |
| `ink-500` di canvas | 4,30 | ✗ dilarang untuk teks |
| Putih di `primary-600` | 5,86 | tombol utama ✓ |
| `primary-700` di `primary-50` | 7,06 | item nav aktif ✓ |
| Teks sentimen di tint-nya (pos / neu / neg) | 4,81 / 6,46 / 5,09 | chip ✓ |
| Teks status amber di tint | 4,94 | ✓ |
| Fill grafik pos / neu / neg di putih | 3,21 / 3,05 / 3,91 | grafis ≥ 3:1 ✓ (WCAG 1.4.11) |
| `border-control` di putih | 3,01 | batas input ✓ (1.4.11) |
| Cincin fokus `primary-600` di putih | 5,86 | ✓ ≥ 3:1 |
| Putih di gradasi navy (ujung terang) | 7,85 | kartu Kesegaran ✓ |
| `ink-400` | 2,62 | hanya dekoratif dan nonaktif, tidak membawa informasi |

Warna tidak pernah menjadi satu-satunya penanda:
- **Sentimen:** ikon wajah + label + urutan seri tetap. Luminansi hijau dan merah hampir sama (1,22:1), sehingga ikon dan label wajib.
- **Status:** ikon bentuk berbeda + teks.
- **Sumber:** ikon + nama.
- **Tipe entitas:** bentuk node + legenda.

Tombol/chip filter yang memuat teks boleh memakai `border-subtle` (identitas dibawa teks). Input, checkbox, dan switch memakai `border-control`.

### 10.6 Formulir, waktu, dan gerak

- Label selalu terlihat di atas kolom, bukan hanya placeholder. Galat disambungkan lewat `aria-describedby` dan memuat langkah perbaikan.
- Autentikasi (WCAG 3.3.8): kata sandi dapat di-paste, kolom kode memakai `autocomplete="one-time-code"`. CAPTCHA pada X berada di luar kendali kita dan hanya muncul pada alur admin M4.
- Batas waktu sesi (WCAG 2.2.1): dua menit sebelum sesi habis, modal S4 dengan tombol "Perpanjang sesi". Fokus dipindahkan ke modal.
- Gerak: `prefers-reduced-motion` mematikan geser panel, kilap skeleton, dan goyang kolom kode. Tidak ada autoplay.
- Zoom dan reflow: konten tetap terbaca pada zoom 200% dan reflow pada lebar 320 px (WCAG 1.4.10). Pengecualian yang sah: kanvas graf jejaring dan tabel lebar, yang menggulir secara mendatar di dalam wadahnya sendiri.
- Drag: pan dan zoom graf memiliki tombol alternatif (+, −, pas-layar) (WCAG 2.5.7). Target sentuh ≥ 36 px (≥ 44 px di layar sentuh), melampaui minimum 24 px (WCAG 2.5.8).
- Tooltip dan popover: dapat ditutup dengan Esc, dapat di-hover tanpa lenyap, tetap sampai ditutup (WCAG 1.4.13).
- Bahasa dan angka: format id-ID konsisten agar pembaca layar membacakan angka dengan benar.

### 10.7 Risiko aksesibilitas yang diketahui

| Risiko | Penanganan |
| --- | --- |
| Browser jarak jauh (M4) menangkap seluruh input keyboard dan bisa menjadi jebakan fokus (WCAG 2.1.2) | Tombol terlihat "Lepas fokus" dan urutan tombol keluar yang didokumentasikan. **Wajib diuji manual sebelum rilis** |
| Stream browser jarak jauh bukan teks, tidak terbaca pembaca layar | Penerimaan terdokumentasi: alur ini hanya untuk admin dan CAPTCHA/2FA X di luar kendali. Disediakan teks petunjuk langkah di luar bingkai |
| Graf force-directed sulit dinavigasi dengan keyboard pada banyak node | Batas node default, roving tabindex menurut bobot, dan **tabel hubungan sebagai alternatif setara** |
| Awan kata dengan ukuran bervariasi tidak memiliki urutan baca alami | Urutan DOM menurut frekuensi menurun, bukan posisi visual |

---

## Lampiran A. Keputusan sementara dan item yang menunggu konfirmasi

| # | Keputusan sementara di dokumen ini | Bergantung pada | Dampak bila berubah |
| --- | --- | --- | --- |
| 1 | MFA diperlakukan wajib dalam alur desain (A2, A3, J8) | **[OQ-4]** | Bila opsional: A2/A3 dilewati bila MFA tidak aktif, dan toggle "Wajibkan MFA" di M6 default mati |
| 2 | Filter Topik memakai dropdown. M8 hanya bila topik buatan admin | **[OQ-25]** | Sumber opsi filter dan ada/tidaknya M8 |
| 3 | Batas node graf 60 dan bobot minimum edge 2 | **[OQ-19]** | Angka default pada slider dan keterangan |
| 4 | Ambang kesegaran 30/120 mnt (berita) dan 60/180 mnt (sosial) | **[OQ-17]** | Kapan tile dan chip berubah amber atau merah |
| 5 | Admin melihat Dashboard dan landing admin adalah `/admin` | **[OQ-14]** | Dua item nav dan pengalihan setelah login |
| 6 | Ekspor/cetak tidak ada di MVP. Slot kanan filter bar dicadangkan | **[OQ-10]** | Tambah tombol "Ekspor" dan gaya cetak |
| 7 | Web responsif hanya-baca, tanpa aplikasi mobile | **[OQ-10]** | Cakupan uji perangkat |
| 8 | Konten berbahasa non-Indonesia tampil dengan sentimen netral dan penanda "Keyakinan rendah" (edge 8) | **[OQ-12]** | Bila diabaikan: item itu tidak muncul sama sekali |
| 9 | Teks dasar D4 menyebut agregat tetap tersimpan setelah 90 hari | **[OQ-8]** | Kalimat di bagian "Penyimpanan" |
| 10 | Instagram/Threads tanpa halaman koneksi sendiri | **[OQ-26]** | M4 menjadi tab X · Instagram · Threads |
| 11 | Target Instagram/Threads dimodelkan sebagai tabel target dengan kolom "jenis" | **[OQ-27]** | Bentuk formulir "Tambah target" |
| 12 | Batas rentang kustom dan ambang "memuat lebih lama" 8 detik | **[OQ-7]** | Validasi kalender dan banner |
| 13 | Pemulihan akun: A4 hanya halaman statis | **[OQ-21]** | Alur pemulihan penuh |
| 14 | Tombol "Jalankan sekarang" (J5), "Uji feed" (J9), ganti kata sandi sementara (J8) | **[USULAN]**, tidak ada FR | Perlu endpoint dan FR baru, atau dihapus tanpa memengaruhi FR lain |
| 15 | Kartu "Konten terbaru" di D1 | **[USULAN]**, tidak ada FR eksplisit | Dapat dihapus tanpa mengubah FR |
| 16 | Nama produk adalah placeholder | Keputusan instansi | Logo dan judul halaman |

## Lampiran B. Urutan pembangunan yang disarankan

Urutan ini mengikuti ketergantungan desain, bukan prioritas bisnis.

1. Token, font Manrope yang di-host sendiri, dan shell (sidebar, top bar).
2. `FreshnessIndicator`, `SentimentChip`, `SourceChip`, `StatusChip`. Semua layar memakainya.
3. `ItemRow` dan `EvidenceDrawer`. Semua grafik bergantung padanya, jadi dibangun sebelum grafik.
4. `FilterBar` dan `KpiCard`.
5. `TrendChart`, lalu `SentimentGauge` dan `SourceTile`.
6. `WordCloud` (dengan tampilan Daftar), lalu `NetworkGraph` (dengan tabel hubungan).
7. Halaman admin: M1, lalu M2/M3, M4, M5, M6, M7.

## Lampiran C. Definisi selesai untuk setiap screen

- [ ] Kelima state (kosong, memuat, galat, berhasil, offline) dirancang dan teksnya mengikuti kamus istilah.
- [ ] Tidak ada angka tanpa periode, cakupan, dan jalan ke sumber (Prinsip 1).
- [ ] Kesegaran data terlihat tanpa menggulir dan tanpa membuka menu (Prinsip 2).
- [ ] Semua warna dari token. Tidak ada hex di luar tabel 3.1.
- [ ] Sentimen, status, sumber, dan tipe entitas memiliki penanda non-warna.
- [ ] Jalur keyboard dari awal sampai akhir teruji dan urutan fokus sesuai 10.2.
- [ ] Uji kontras lolos untuk semua pasangan baru.
- [ ] Teks memakai huruf kapital kalimat, kata kerja aktif, format angka id-ID, dan waktu WIB.
- [ ] Layar diuji pada 360, 768, 1280, dan 1600 px.
