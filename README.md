
<p align="center">
  <img src="frontend/public/logpilot-mark.png" alt="Logpilot Logo" width="112">
</p>

<h1 align="center">Logpilot: Otomatisasi Logbook Magang UPNVJ</h1>

<p align="center">
  Aplikasi untuk mengotomatisasi pengisian logbook magang pada portal Kampus Berdampak UPNVJ menggunakan catatan dari Google Docs, PDF, Word, atau Excel.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Node.js-20.9%2B-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/Windows-10%20%2F%2011-0078D4?style=flat-square&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/AI-GroqCloud-F55036?style=flat-square" alt="GroqCloud">
</p>

<p align="center">
  <a href="#mulai-cepat">Mulai Cepat</a> •
  <a href="#fitur">Fitur</a> •
  <a href="#konfigurasi-google-docs">Google Docs</a> •
  <a href="#konfigurasi-groqcloud">GroqCloud</a> •
  <a href="#chrome-extension">Chrome Extension</a> •
  <a href="#troubleshooting">Troubleshooting</a>
</p>

---

## Tentang Logpilot

Logpilot dibuat untuk membantu mahasiswa UPN Veteran Jakarta mengisi logbook magang tanpa harus menyalin catatan kegiatan satu per satu ke portal Kampus Berdampak.

Aplikasi membaca catatan kegiatan dari dokumen, mengelompokkannya berdasarkan tanggal, dan menampilkannya di dashboard untuk diperiksa. Setelah entri disetujui, Chrome Extension akan mengisi dan menyimpannya ke portal menggunakan sesi login pengguna yang sudah aktif.

Logpilot berjalan secara lokal di komputer pengguna. Proses login ke portal tetap dilakukan secara manual, dan aplikasi tidak memerlukan username maupun password portal untuk menjalankan automation.

> [!IMPORTANT]
> Logpilot **tidak akan menekan tombol "Selesaikan Logbook Magang"** dalam kondisi apa pun. Automation hanya menangani pengisian dan penyimpanan entri harian. Finalisasi logbook tetap menjadi tanggung jawab pengguna.

## Fitur

| Fitur | Deskripsi |
| --- | --- |
| Impor dokumen | Membaca catatan kegiatan dari Google Docs, PDF, Word (`.docx`), dan Excel (`.xlsx`). |
| Periode fleksibel | Memilih rentang tanggal sesuai kebutuhan, termasuk beberapa hari atau sebagian periode magang. |
| Review & editing | Memeriksa dan mengubah uraian, hasil, kendala, jam kerja, serta tautan dokumentasi sebelum entri disetujui. |
| AI-assisted writing | Membantu menyusun draf hasil kegiatan harian dan refleksi mingguan menggunakan GroqCloud. |
| Chrome Extension | Mengisi dan menyimpan entri melalui sesi portal yang sudah login. |
| Duplicate checking | Membandingkan entri dengan data portal untuk menghindari pengiriman data yang sama. |
| Revisi entri | Menggunakan form revisi ketika entri yang sudah ada memiliki isi berbeda. |
| Monitoring | Menampilkan status sumber, kesiapan batch, dan progres automation melalui dashboard. |

Fitur AI bersifat opsional. Seluruh proses pemeriksaan, pengeditan, dan pengisian logbook tetap bisa digunakan tanpa GroqCloud API key.

## Cara Kerja

Alur penggunaan Logpilot terdiri dari beberapa tahap:

1. **Pilih periode.** Tentukan tanggal mulai dan akhir logbook yang ingin dikerjakan.
2. **Masukkan catatan.** Hubungkan Google Docs atau unggah dokumen PDF, Word, maupun Excel.
3. **Periksa entri.** Pastikan tanggal, uraian kegiatan, hasil, kendala, jam kerja, dan dokumentasi sudah sesuai.
4. **Setujui entri.** Hanya entri yang sudah disetujui yang dapat dimasukkan ke batch.
5. **Jalankan automation.** Chrome Extension mengisi serta menyimpan entri pada portal Kampus Berdampak.

Sebelum menyimpan, Logpilot akan membandingkan entri yang disetujui dengan data yang sudah ada di portal. Entri identik dilewati, sedangkan entri dengan perubahan akan diproses melalui form revisi.

Jika hasil penyimpanan tidak dapat dipastikan, proses dihentikan agar entri yang mungkin sudah tersimpan tidak dikirim ulang secara otomatis.

---

## Mulai Cepat

Panduan instalasi berikut ditujukan untuk **Windows 10/11** dengan PowerShell.

### 1. Persyaratan

Pastikan perangkat sudah memiliki:

| Software | Versi minimum |
| --- | --- |
| Python | 3.11 |
| Node.js | 20.9 |
| npm | Terpasang bersama Node.js |
| Git | Versi yang mendukung clone repository |
| Google Chrome | 102 |

Untuk memeriksa instalasi, buka PowerShell dan jalankan:

```powershell
python --version
node --version
npm --version
git --version
```

Jika salah satu perintah tidak dikenali, instal software tersebut terlebih dahulu dan pastikan lokasinya sudah ditambahkan ke PATH.

### 2. Clone Repository

Buka PowerShell pada direktori tempat proyek akan disimpan, kemudian jalankan:

```powershell
git clone https://github.com/kanigaraa/upnvj-logpilot.git
cd upnvj-logpilot
```

### 3. Jalankan Setup

Repository sudah menyediakan skrip setup untuk menyiapkan backend, frontend, dan database lokal.

```powershell
.\scripts\setup.ps1
```

Skrip akan menjalankan beberapa proses:

- Memasang dependensi Python untuk backend.
- Memasang dependensi Node.js untuk frontend.
- Membuat database SQLite dan menjalankan migrasi.
- Menyalin `backend/.env.example` menjadi `backend/.env` jika file belum tersedia.
- Memasang Chromium untuk kompatibilitas jalur Playwright lama.

Skrip setup tidak mengubah isi dokumen sumber.

**Jika PowerShell memblokir eksekusi skrip**, jalankan:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup.ps1
```

Perubahan execution policy tersebut hanya berlaku selama sesi PowerShell yang sedang digunakan.

### 4. Jalankan Aplikasi

Setelah setup selesai, jalankan:

```powershell
.\scripts\start.ps1
```

Skrip akan membuka terminal backend dan frontend. Setelah keduanya berjalan, buka:

**http://localhost:3000**

Alamat layanan lokal:

| Service | URL |
| --- | --- |
| Dashboard | http://localhost:3000 |
| Backend API | http://127.0.0.1:8000 |
| Health Check | http://127.0.0.1:8000/api/health |
| API Documentation | http://127.0.0.1:8000/docs |

Biarkan terminal backend dan frontend tetap berjalan selama aplikasi digunakan. Untuk menghentikannya, tekan `Ctrl+C` pada masing-masing terminal.

### 5. Siapkan Sumber Catatan

Setelah dashboard terbuka, pilih salah satu metode:

- **Unggah dokumen:** langsung menggunakan file PDF, Word, atau Excel tanpa konfigurasi Google Cloud.
- **Google Docs:** membutuhkan konfigurasi Google Docs API dan OAuth untuk membaca catatan dari URL dokumen.

GroqCloud hanya perlu dikonfigurasi jika ingin menggunakan fitur penulisan berbantuan AI.

Untuk mengisi logbook di portal, lanjutkan dengan pemasangan Chrome Extension setelah sumber catatan siap.

---

## Mengimpor Catatan

### Upload Dokumen

Metode ini paling sederhana karena tidak membutuhkan Google Cloud API maupun kredensial tambahan.

1. Buka dashboard Logpilot.
2. Tentukan tanggal mulai dan akhir logbook.
3. Klik **Terapkan periode**.
4. Buka bagian **Sumber logbook → Unggah Dokumen**.
5. Pilih file PDF, Word, atau Excel.
6. Klik **Periksa isi file**.
7. Periksa hasil ekstraksi sebelum menyetujui entri.

Format yang didukung:

| Format | Keterangan |
| --- | --- |
| `.pdf` | PDF harus memiliki teks yang dapat dipilih atau disalin. |
| `.docx` | Mendukung tabel dan catatan berbasis tanggal yang dapat dikenali parser. |
| `.xlsx` | Membutuhkan kolom tanggal dan kegiatan. |

Ukuran file maksimal **10 MB** dan tidak boleh dilindungi password.

PDF hasil scan atau gambar belum didukung karena fitur OCR belum tersedia. Format Word lama (`.doc`) dan CSV juga belum didukung.

Parser dapat mengenali beberapa variasi header, baik dalam bahasa Indonesia maupun Inggris, serta format tanggal yang berbeda.

Jika terdapat catatan yang tidak dapat dipetakan dengan benar, Logpilot akan menandainya untuk diperiksa. Aplikasi tidak membuat kegiatan baru untuk mengisi tanggal yang tidak ditemukan.

File asli tidak disimpan oleh aplikasi. Catatan hasil ekstraksi disimpan di database lokal. Jika dokumen sumber berubah, entri yang terdampak perlu ditinjau dan disetujui ulang.

---

## Konfigurasi Google Docs

Bagian ini hanya diperlukan jika ingin mengambil catatan langsung dari Google Docs. Jika menggunakan fitur upload dokumen, konfigurasi berikut dapat dilewati.

Logpilot menggunakan Google Docs API dengan akses **read-only**, sehingga aplikasi hanya dapat membaca dokumen yang diizinkan tanpa mengubah isinya.

### 1. Membuat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Login menggunakan akun Google.
3. Klik menu pemilih proyek di bagian atas.
4. Pilih **New Project**.
5. Masukkan nama proyek, misalnya `Logpilot`.
6. Klik **Create** dan pilih proyek tersebut.

### 2. Mengaktifkan Google Docs API

1. Buka **APIs & Services → Library**.
2. Cari **Google Docs API**.
3. Pilih API tersebut.
4. Klik **Enable**.

Pastikan API diaktifkan pada proyek yang sama dengan proyek tempat OAuth client akan dibuat.

### 3. Mengonfigurasi OAuth Consent

Buka **Google Auth Platform → Branding**.

Jika konfigurasi belum pernah dilakukan, klik **Get Started** dan isi informasi aplikasi, termasuk nama aplikasi, email dukungan, dan email kontak.

Selanjutnya, buka menu **Audience** untuk menentukan siapa yang dapat menggunakan OAuth.

- **External:** untuk akun Gmail pribadi atau pengguna dari luar satu organisasi Google Workspace.
- **Internal:** hanya untuk pengguna dalam organisasi Google Workspace yang sama.

Untuk penggunaan pribadi, pilih **External**.

Jika aplikasi masih berstatus **Testing**, tambahkan akun yang akan digunakan:

1. Buka **Audience → Test users**.
2. Klik **Add users**.
3. Masukkan alamat email Google.
4. Simpan perubahan.

Pada menu **Data Access**, jika diminta menambahkan scope, gunakan:

```text
https://www.googleapis.com/auth/documents.readonly
```

Scope tersebut memberikan izin baca dokumen tanpa akses edit.

Dokumentasi resmi: [Configure OAuth Consent](https://developers.google.com/workspace/guides/configure-oauth-consent).

### 4. Membuat OAuth Client

1. Buka **Google Auth Platform → Clients**.
2. Klik **Create Client**.
3. Pada Application Type, pilih **Desktop app**.
4. Isi nama OAuth client, misalnya `Logpilot Desktop`.
5. Klik **Create**.
6. Download file JSON kredensial.

Jangan memilih tipe **Web application**, karena konfigurasi Logpilot menggunakan OAuth client desktop.

### 5. Menyimpan Kredensial

Simpan file JSON yang sudah diunduh dengan nama dan lokasi berikut:

```text
backend/.local/google-oauth-client.json
```

Jika folder `.local` belum tersedia, buat folder tersebut di dalam direktori `backend`.

Struktur direktori:

```text
upnvj-logpilot/
└── backend/
    └── .local/
        └── google-oauth-client.json
```

Pastikan nama file benar dan tidak memiliki ekstensi ganda seperti `google-oauth-client.json.json`.

Folder `.local` diabaikan Git agar file kredensial tidak ikut terunggah ke repository.

### 6. Menghubungkan Google Docs

Setelah konfigurasi selesai:

1. Jalankan aplikasi menggunakan `.\scripts\start.ps1`.
2. Buka dashboard di `http://localhost:3000`.
3. Klik **Hubungkan Google Docs**.
4. Login menggunakan akun yang sudah didaftarkan sebagai test user jika aplikasi masih berstatus Testing.
5. Berikan izin baca Google Docs.
6. Kembali ke dashboard setelah autentikasi selesai.
7. Masukkan URL Google Docs atau ID dokumen.
8. Pilih periode dan periksa hasil pembacaan.

Contoh URL yang didukung:

```text
https://docs.google.com/document/d/ID_DOKUMEN/edit
```

Akun yang terhubung setidaknya harus memiliki akses **Viewer** terhadap dokumen.

URL folder Google Drive atau tautan `drive.google.com/file` tidak dapat digunakan sebagai pengganti URL Google Docs.

### Mengganti Akun Google

Token autentikasi tersimpan secara lokal pada:

```text
backend/.local/google-token.json
```

Untuk mengganti akun:

1. Hentikan aplikasi.
2. Hapus file `google-token.json`.
3. Jalankan kembali aplikasi.
4. Hubungkan akun Google baru melalui dashboard.

Referensi: [Google Docs API Quickstart](https://developers.google.com/workspace/docs/api/quickstart/python).

---

## Konfigurasi GroqCloud

Logpilot mendukung GroqCloud untuk membantu menulis hasil kegiatan harian dan refleksi mingguan.

Penggunaan AI bersifat opsional. AI hanya menghasilkan draf yang tetap perlu diperiksa, diedit, dan disetujui pengguna.

### 1. Membuat API Key

1. Buka [GroqCloud Console](https://console.groq.com/).
2. Buat akun atau login.
3. Buka menu [API Keys](https://console.groq.com/keys).
4. Buat API key baru.
5. Salin API key yang dihasilkan.

### 2. Mengatur Environment Variables

Buka file:

```text
backend/.env
```

Tambahkan atau perbarui konfigurasi berikut:

```ini
AI_PROVIDER=groq
GROQ_API_KEY=key-dari-groqcloud
GROQ_MODEL=openai/gpt-oss-20b
```

Ganti `key-dari-groqcloud` dengan API key milikmu.

Model dapat diganti menggunakan ID model lain yang tersedia pada [Groq Models](https://console.groq.com/docs/models).

Setelah menyimpan `.env`, restart aplikasi:

```powershell
.\scripts\start.ps1
```

Jika proyek sudah disiapkan sebelum integrasi GroqCloud tersedia, jalankan setup ulang agar dependensi diperbarui:

```powershell
.\scripts\setup.ps1
```

> [!CAUTION]
> Jangan membagikan API key melalui screenshot, commit, atau repository publik. Simpan key di `backend/.env`, bukan di kode frontend atau variabel `NEXT_PUBLIC_`. File `.env` sudah diabaikan oleh Git.

### 3. Menggunakan AI di Dashboard

Terdapat dua penggunaan utama.

**Hasil Kegiatan Harian**

Klik **Buat dengan AI** pada entri untuk menghasilkan draf hasil kegiatan berdasarkan uraian yang sudah dimasukkan.

**Refleksi Mingguan**

Editor refleksi menggunakan catatan kegiatan dari Senin sampai Jumat dalam minggu yang sama, termasuk jika periode yang dipilih hanya mencakup sebagian minggu.

Jika terdapat hari yang catatannya belum lengkap, dashboard akan menampilkan penanda agar pengguna dapat memeriksanya.

Setiap hasil AI tetap dapat diedit sebelum disimpan dan disetujui.

### Privasi Data AI

Sebelum mengirim teks ke GroqCloud, Logpilot menyamarkan beberapa informasi, seperti:

- Alamat email dan nomor telepon.
- Nomor yang diberi label NIM, NPM, NIK, atau KTP.

Tautan dokumentasi dan rincian izin tidak ikut dikirim ke GroqCloud.

Penyamaran ini tidak menjamin seluruh informasi sensitif akan terdeteksi. Periksa isi catatan sebelum meminta AI membuat draf, terutama jika dokumen mengandung data perusahaan atau informasi pribadi.

Referensi: [GroqCloud Quickstart](https://console.groq.com/docs/quickstart).

---

## Chrome Extension

Chrome Extension digunakan untuk mengisi dan menyimpan logbook melalui portal Kampus Berdampak.

Ekstensi bekerja menggunakan sesi Chrome yang sudah login. Pengguna tidak perlu memasukkan username atau password portal ke dashboard Logpilot.

### 1. Build Extension

Buka PowerShell pada root proyek, lalu jalankan:

```powershell
npm --prefix frontend run build:extension
```

### 2. Instal Extension

1. Buka Google Chrome.
2. Masukkan `chrome://extensions` pada address bar.
3. Aktifkan **Developer mode**.
4. Klik **Load unpacked**.
5. Pilih folder `extension` pada direktori proyek.
6. Pastikan file `manifest.json` tersedia dalam folder tersebut.

Setelah berhasil, ekstensi Logpilot akan muncul di daftar ekstensi Chrome.

### 3. Pairing dengan Backend

Pairing diperlukan agar ekstensi dapat berkomunikasi dengan backend lokal Logpilot.

1. Jalankan Logpilot dan buka dashboard.
2. Cari panel **Isi logbook di portal**.
3. Klik **Buat kode pairing**.
4. Buka popup Logpilot melalui ikon Extensions Chrome.
5. Tempel kode pairing.
6. Klik **Hubungkan extension**.

Kode pairing hanya berlaku selama **5 menit** dan dapat digunakan satu kali.

Jika kode kedaluwarsa, buat kode baru melalui dashboard.

### 4. Menjalankan Automation

Pastikan backend, frontend, dan extension sudah terhubung.

1. Buka portal [Kampus Berdampak UPNVJ](https://kampusberdampak.upnvj.ac.id/logbook-harian).
2. Login menggunakan akun masing-masing.
3. Biarkan tab portal tetap terbuka.
4. Kembali ke dashboard Logpilot.
5. Pilih sumber catatan dan rentang tanggal yang ingin diisi.
6. Periksa seluruh entri dan lakukan pengeditan jika diperlukan.
7. Setujui entri yang sudah benar.
8. Klik **Periksa entri yang disetujui**.
9. Klik **Siapkan batch**.
10. Buka popup ekstensi Logpilot.
11. Pastikan backend terhubung, pairing aktif, dan tab portal terdeteksi.
12. Klik **Mulai automation**.

Ekstensi akan memproses entri yang sudah disetujui. Progres dapat dipantau melalui dashboard meskipun popup ekstensi ditutup.

### Penanganan Entri yang Sudah Ada

Sebelum melakukan pengisian, ekstensi memeriksa entri pada portal.

| Kondisi | Tindakan |
| --- | --- |
| Entri belum tersedia | Mengisi dan menyimpan entri baru. |
| Entri sudah ada dengan isi sama | Melewati entri tersebut. |
| Entri sudah ada dengan isi berbeda | Menggunakan form revisi. |
| Status penyimpanan tidak dapat dipastikan | Menghentikan proses untuk pemeriksaan manual. |

Logpilot tidak mengirim ulang entri secara otomatis ketika hasil Simpan belum dapat dipastikan.

> [!IMPORTANT]
> Automation hanya melakukan pengisian, revisi, dan penyimpanan entri harian. Tombol **Selesaikan Logbook Magang** tidak termasuk dalam proses automation dan tidak akan ditekan secara otomatis.

### Memperbarui Extension

Setelah ada perubahan kode ekstensi, lakukan build ulang:

```powershell
npm --prefix frontend run build:extension
```

Kemudian:

1. Buka `chrome://extensions`.
2. Klik **Reload** pada ekstensi Logpilot.
3. Refresh tab portal Kampus Berdampak.

Restart backend saja tidak cukup untuk memuat ulang content script yang sudah berjalan di Chrome.

---

## Troubleshooting

Beberapa masalah yang mungkin ditemui saat setup atau penggunaan:

| Masalah | Solusi |
| --- | --- |
| Dashboard gagal terhubung ke backend | Pastikan backend dari `start.ps1` masih berjalan dan port `8000` tidak digunakan aplikasi lain. |
| PowerShell memblokir skrip | Gunakan `Set-ExecutionPolicy -Scope Process Bypass` pada terminal yang sama. |
| Akses Google ditolak | Periksa konfigurasi OAuth Audience dan tambahkan akun ke daftar Test users jika masih Testing. |
| Dokumen Google Docs gagal dibaca | Periksa URL/ID dokumen, akses Viewer, serta Google Docs API. |
| Upload dokumen gagal | Pastikan format didukung, tidak dilindungi password, dan ukuran maksimal 10 MB. |
| Isi dokumen tidak dikenali | Periksa format tanggal, nama kolom, dan struktur catatan. PDF scan gambar belum didukung. |
| GroqCloud gagal membuat draf | Periksa `GROQ_API_KEY` dan `GROQ_MODEL`, lalu restart backend. |
| GroqCloud terkena rate limit | Periksa [rate limits Groq](https://console.groq.com/docs/rate-limits) dan coba kembali setelah kuota tersedia. |
| Extension tidak terhubung | Pastikan backend berjalan dan kode pairing masih berlaku. |
| Extension menjalankan kode lama | Build ulang, Reload extension, lalu refresh tab portal. |
| Status Simpan tidak diketahui | Periksa entri langsung di portal sebelum melanjutkan. Jangan mengirim ulang entri yang mungkin sudah tersimpan. |

Jika terjadi masalah saat automation, periksa status entri pada portal sebelum mencoba menjalankan ulang batch.

---

## Struktur Proyek

Repository dibagi menjadi beberapa direktori utama:

```text
upnvj-logpilot/
├── backend/        # API, pemrosesan dokumen, database lokal
├── frontend/       # Dashboard web
├── extension/      # Chrome Extension untuk automation
├── scripts/        # Setup dan startup aplikasi
└── docs/           # Dokumentasi tambahan
```

Backend menangani pemrosesan dokumen, integrasi Google Docs, GroqCloud, dan penyimpanan data lokal.

Frontend menyediakan dashboard untuk pengelolaan sumber, periode, review entri, serta monitoring.

Chrome Extension menangani interaksi dengan portal menggunakan sesi browser yang sudah diautentikasi pengguna.

## Pengembangan dan Testing

Untuk menjalankan unit test backend:

```powershell
Push-Location backend
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
Pop-Location
```

Pemeriksaan lint dan build frontend:

```powershell
npm --prefix frontend run lint
npm --prefix frontend run build -- --webpack
```

Build dan testing Chrome Extension:

```powershell
npm --prefix frontend run build:extension
node --test extension/tests/*.test.mjs
```

Tes automation menggunakan mock dan tidak mengirim logbook sungguhan ke portal.

## Keamanan dan Batasan

Logpilot dirancang untuk berjalan di lingkungan lokal dengan beberapa batasan:

- Login portal tetap dilakukan langsung oleh pengguna.
- Kredensial Google OAuth dan API key disimpan di backend lokal.
- File `.env` dan direktori `.local` diabaikan oleh Git.
- Google Docs hanya menggunakan izin baca.
- Data yang dikirim ke GroqCloud digunakan untuk membuat draf dan tetap memerlukan review pengguna.
- Automation tidak melakukan finalisasi logbook.
- Status penyimpanan yang tidak pasti harus diperiksa sebelum entri diproses kembali.

Logpilot tidak menjamin kesesuaian dengan setiap perubahan antarmuka portal. Jika struktur atau perilaku portal berubah, ekstensi mungkin memerlukan penyesuaian.

Informasi lebih lanjut mengenai penanganan data dan kredensial tersedia pada [Security Documentation](docs/SECURITY.md).

---

<p align="center">
  <strong>Logpilot</strong><br>
  Otomatisasi Logbook Magang UPNVJ
</p>
