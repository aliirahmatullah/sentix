# design/stitch: peta layar

Sumber kebenaran TAMPILAN untuk Sentix. Satu folder per layar berisi `code.html` dan `screen.png`.
`_tokens/stitch-design-system.md` hanya referensi; token resmi ada di DESIGN.md 3.7 (root proyek).

ID    Layar                                 Folder
A1    Masuk (normal, galat)                 masuk_normal, masuk_galat
A2    Verifikasi MFA (normal, galat)        verifikasi_mfa_normal, verifikasi_mfa_galat
A3    Pendaftaran MFA                       pendaftaran_mfa
D1    Dashboard desktop (satu halaman)      dashboard
D1    Dashboard ponsel                      dashboard_mobile_pimpinan
D1    State belum ada data                  dashboard_belum_ada_data
D1    State filter tanpa hasil              dashboard_filter_tidak_menghasilkan_data
D1    State sumber terlambat dan offline    dashboard_banner_offline_amber
D2    Jejaring aktor                        jejaring_aktor
D3    Panel Sumber Pendukung                dashboard_panel_sumber_pendukung
D4    Cara membaca data                     dashboard_cara_membaca_data
M1    Status sistem                         status_sistem
M2    Sumber RSS dan modal Tambah sumber    sumber_rss, sumber_rss_modal_tambah_sumber
M3    Media sosial                          media_sosial
M4    Koneksi X (sesi aktif)                koneksi_x_sesi_aktif
M5    Kamus alias                           kamus_alias
M6    Pengguna, modal, konfirmasi           pengguna, pengguna_modal_tambah_pengguna, pengguna_konfirmasi_nonaktifkan
M7    Audit log                             audit_log
S1    403                                   error_403_tidak_berhak
S2    404                                   error_404_tidak_ditemukan
S3    500                                   error_500_gangguan_server
S4    Modal sesi akan berakhir              sesi_akan_berakhir_modal_s4

Catatan: file code.html dan screen.png TIDAK diubah dari hasil Stitch (nama Pantau Media di dalamnya
diganti Sentix lewat src/lib/brand.ts di kode, bukan dengan mengedit file ini). Lihat bagian Pengecualian di AGENTS.md.
