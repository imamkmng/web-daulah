# Website Pembelajaran Interaktif: Daulah Abbasiyah

Website pembelajaran interaktif yang menampilkan sejarah Daulah Abbasiyah dengan fitur kuis, game drag-and-drop, dan papan peringkat.

## 🌟 Fitur

### Halaman Utama
- **Beranda**: Pengenalan singkat tentang Daulah Abbasiyah
- **Timeline Interaktif**: Linimasa peristiwa penting dengan modal pop-up
- **Infografis Visual**: 4 infografis kunci tentang sejarah Daulah Abbasiyah
- **Tokoh-Tokoh**: Profil khalifah dan ilmuwan penting

### Fitur Interaktif
- **Game Drag & Drop**: Cocokkan ilmuwan dengan penemuannya
- **Kuis 10 Soal**: Pilihan ganda dengan penyimpanan skor otomatis
- **Papan Peringkat**: Leaderboard dengan data real-time
- **Admin Dashboard**: Panel admin untuk melihat dan download data

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Export Data**: JSON to CSV

## 📦 Instalasi

1. Clone atau extract folder proyek
2. Install dependencies:
```bash
npm install
```

3. Jalankan server:
```bash
npm start
```
atau
```bash
node server.js
```

4. Buka browser dan akses:
```
http://localhost:3000
```

## 🎨 Desain

Website menggunakan skema warna **hijau Islami**:
- Hijau Tua (`#084c41`) - Header, footer, judul
- Hijau Sage (`#A3B899`) - Aksen
- Krem (`#F5F5DC`) - Background
- Emas (`#D4AF37`) - Tombol CTA

Font: **Poppins** dari Google Fonts

## 📱 Halaman Website

1. **Beranda** (`/index.html`) - Halaman utama
2. **Timeline** (`/timeline.html`) - Timeline interaktif dengan 6 peristiwa penting
3. **Infografis** (`/infografis.html`) - 4 visualisasi data
4. **Tokoh** (`/tokoh.html`) - 8 tokoh penting (4 khalifah + 4 ilmuwan)
5. **Uji Kemampuan** (`/uji-kemampuan.html`) - Game + Kuis 10 soal
6. **Papan Peringkat** (`/papan-peringkat.html`) - Leaderboard
7. **Admin Login** (`/admin-login.html`) - Login admin
8. **Admin Dashboard** (`/admin-dashboard.html`) - Dashboard admin

## 🔐 Admin Access

**Kredensial Admin:**
- Username: `admin`
- Password: `password123`

**Fitur Admin:**
- Lihat semua skor peserta
- Download data dalam format CSV
- Sorting otomatis berdasarkan skor tertinggi

## 🎮 Cara Menggunakan

### Untuk Peserta:
1. Mulai dari halaman **Beranda**
2. Navigasi melalui **Timeline** → **Infografis** → **Tokoh**
3. Ikuti **Uji Kemampuan**:
   - Masukkan nama
   - Main game drag-and-drop
   - Jawab 10 soal kuis
   - Klik "Selesai"
4. Lihat skor Anda dan posisi di **Papan Peringkat**

### Untuk Admin:
1. Buka `/admin-login.html`
2. Login dengan kredensial admin
3. Lihat semua data skor
4. Download data CSV dengan tombol "Download Data (CSV)"

## 📊 API Endpoints

### Public Endpoints
- `GET /api/scores` - Ambil semua skor (sorted by score DESC)
- `POST /api/scores` - Simpan skor baru
  ```json
  {
    "nama": "Nama Peserta",
    "skor": 8
  }
  ```

### Admin Endpoints
- `POST /admin/login` - Login admin
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- `GET /admin/download` - Download data CSV

## 📁 Struktur Proyek

```
/project-daulah-abbasiyah
├── /public
│   ├── /css
│   │   └── style.css          # Stylesheet utama
│   ├── /js
│   │   ├── main.js            # JavaScript frontend
│   │   └── admin.js           # JavaScript admin
│   └── /images                # Folder untuk gambar
├── /views
│   ├── index.html             # Halaman beranda
│   ├── timeline.html          # Halaman timeline
│   ├── infografis.html        # Halaman infografis
│   ├── tokoh.html             # Halaman tokoh
│   ├── uji-kemampuan.html     # Halaman kuis
│   ├── papan-peringkat.html   # Halaman leaderboard
│   ├── admin-login.html       # Halaman login admin
│   └── admin-dashboard.html   # Dashboard admin
├── server.js                   # Backend server
├── database.db                 # SQLite database
├── package.json               # Dependencies
└── README.md                  # Dokumentasi
```

## 🗃️ Database Schema

**Table: scores**
| Column    | Type     | Description                      |
|-----------|----------|----------------------------------|
| id        | INTEGER  | Primary key (auto increment)     |
| name      | TEXT     | Nama peserta                     |
| score     | INTEGER  | Skor (0-10)                      |
| timestamp | DATETIME | Waktu submit (auto)              |

## 🎯 Materi Pembelajaran

### Timeline Peristiwa:
- 750 M: Berdirinya Daulah Abbasiyah
- 762 M: Pendirian Kota Baghdad
- 786-809 M: Pendirian Baitul Hikmah
- 813-833 M: Pengembangan Baitul Hikmah
- 847-861 M: Pembatasan Penerjemahan
- 1258 M: Invasi Mongol

### Tokoh:
**Khalifah:**
- Abdullah as-Saffah
- Al-Manshur
- Harun Al-Rasyid
- Al-Ma'mun Ar-Rasyid

**Ilmuwan:**
- Al-Khawarizmi (Bapak Aljabar)
- Jabir bin Hayyan (Bapak Kimia)
- Ar-Razi (Kedokteran)
- Jabir Al-Batany (Astronomi)

## 🚀 Deployment

Website ini siap untuk di-deploy ke platform seperti:
- Heroku
- Vercel
- Railway
- DigitalOcean

Pastikan untuk mengatur environment variable `PORT` jika diperlukan.

## 📝 Lisensi

Website ini dibuat untuk tujuan pendidikan.

## 👨‍💻 Pengembangan

Dibuat dengan stack:
- Node.js v14+
- Express.js v4.18+
- SQLite3 v5.1+
- JSON2CSV v6.0+

---

**Selamat belajar tentang Daulah Abbasiyah!** 📚✨
