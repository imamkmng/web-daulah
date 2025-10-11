# Panduan Deployment ke Vercel

## Masalah yang Telah Diperbaiki

1. **Routing Admin Endpoints** - Ditambahkan route untuk `/admin/*` di `vercel.json`
2. **Konfigurasi Database** - Menggunakan Turso (LibSQL) sebagai database cloud
3. **Validasi Tipe Data** - Backend sekarang menerima skor sebagai string atau number (diperbaiki di commit terbaru)
4. **BigInt Serialization** - Ditambahkan fix untuk mencegah error serialization BigInt di Vercel
5. **Error Messages** - Semua pesan error sekarang dalam Bahasa Indonesia untuk UX yang lebih baik
6. **Enhanced Logging** - Ditambahkan logging yang lebih detail untuk debugging di Vercel Function Logs

---

## Langkah-Langkah Deployment

### 1. Setup Database Turso

Sebelum deploy ke Vercel, Anda perlu membuat database di Turso:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login ke Turso
turso auth login

# Buat database baru
turso db create daulah-abbasiyah

# Dapatkan URL database
turso db show daulah-abbasiyah

# Buat auth token
turso db tokens create daulah-abbasiyah
```

Simpan **Database URL** dan **Auth Token** yang didapat.

---

### 2. Konfigurasi Environment Variables di Vercel

Setelah membuat project di Vercel, tambahkan environment variables:

1. Buka dashboard Vercel project Anda
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan dua variables berikut:

   - **Name:** `TURSO_DATABASE_URL`
     **Value:** `libsql://[your-database-name]-[your-username].turso.io`

   - **Name:** `TURSO_AUTH_TOKEN`
     **Value:** `[token yang didapat dari turso db tokens create]`

---

### 3. Deploy ke Vercel

Ada dua cara untuk deploy:

#### Cara 1: Menggunakan Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

#### Cara 2: Menggunakan GitHub

1. Push kode ke GitHub repository
2. Import project di Vercel dashboard
3. Tambahkan environment variables (lihat langkah 2)
4. Deploy otomatis akan berjalan

---

### 4. Verifikasi Deployment

Setelah deployment selesai, test endpoint-endpoint berikut:

#### Test API Scores
```bash
# GET scores
curl https://[your-vercel-url]/api/scores

# POST score (test)
curl -X POST https://[your-vercel-url]/api/scores \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test User","skor":8}'
```

#### Test Admin Login
```bash
curl -X POST https://[your-vercel-url]/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

---

## Troubleshooting

### Error: "Terjadi kesalahan saat menyimpan skor"

**Kemungkinan Penyebab & Solusi:**

#### 1. Environment Variables Tidak Dikonfigurasi

**Gejala:** Error muncul saat kuis selesai, data tidak tersimpan

**Solusi:**
1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Pastikan ada 2 variables:
   - `TURSO_DATABASE_URL`: `libsql://[database-name]-[username].turso.io`
   - `TURSO_AUTH_TOKEN`: Token dari Turso
3. Setelah menambahkan, **wajib redeploy**:
   - Pergi ke Deployments tab
   - Klik "..." pada deployment terakhir
   - Pilih "Redeploy"

#### 2. Database Turso Belum Dibuat

**Solusi:**
```bash
turso db create daulah-abbasiyah
turso db show daulah-abbasiyah
turso db tokens create daulah-abbasiyah
```

#### 3. CORS Error (Cross-Origin)

**Gejala:** Di console browser muncul "CORS policy blocked"

**Solusi:** File `api/index.js` sudah diperbaiki dengan CORS headers. Pastikan Anda deploy versi terbaru.

#### 4. Response Status 201 Dianggap Error

**Gejala:** Data tersimpan tapi frontend menampilkan error

**Solusi:** File `public/js/main.js` sudah diperbaiki untuk menerima status 201. Deploy ulang.

---

### Cara Melihat Error Detail di Vercel

1. Buka Vercel Dashboard
2. Pilih project Anda
3. Klik tab **Deployments**
4. Klik deployment yang **paling baru**
5. Klik tab **Functions**
6. Klik fungsi **api/index.js**
7. Scroll ke bawah untuk melihat **Logs**

**Yang harus dicari di logs:**
- `POST /api/scores - Request received` (menandakan request masuk)
- `Request body: { nama: "...", skor: ... }` (data yang dikirim)
- `Score inserted successfully` (berhasil simpan)
- Jika ada error, akan muncul `Error inserting score:` dengan detail

---

### Testing Endpoint Secara Manual

Untuk memastikan API berjalan, test dengan curl atau Postman:

```bash
# Replace [your-url] dengan URL Vercel Anda

# 1. Test GET scores
curl https://[your-url].vercel.app/api/scores

# 2. Test POST score
curl -X POST https://[your-url].vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test User","skor":8}'
```

**Response yang diharapkan:**
```json
{
  "success": true,
  "id": 1,
  "message": "Score saved successfully"
}
```

---

### Checklist Deployment

Sebelum deploy, pastikan:

- [ ] Database Turso sudah dibuat
- [ ] Environment variables sudah diset di Vercel:
  - [ ] `TURSO_DATABASE_URL`
  - [ ] `TURSO_AUTH_TOKEN`
- [ ] File `api/index.js` sudah ada CORS headers
- [ ] File `public/js/main.js` sudah handle status 201
- [ ] Git push sudah dilakukan (jika pakai GitHub auto-deploy)
- [ ] Setelah deploy, test endpoint `/api/scores`

---

### Browser Console Debugging

Saat testing kuis di website Vercel:

1. Buka browser (Chrome/Edge/Firefox)
2. Tekan **F12** untuk buka DevTools
3. Pilih tab **Console**
4. Isi kuis dan klik "Selesai"
5. Lihat output di console:

**Output yang diharapkan:**
```
Response status: 201
Response data: {success: true, id: 1, message: "Score saved successfully"}
```

**Jika ada error:**
```
Response status: 500
Response data: {success: false, error: "...", details: "..."}
```

Screenshot error tersebut dan cek detailnya.

---

### Error: "Admin login failed"

**Penyebab:** Routing `/admin/*` tidak mengarah ke serverless function

**Solusi:**
1. Pastikan `vercel.json` sudah include route untuk `/admin/(.*)`
2. Vercel.json sudah diperbaiki di commit terbaru
3. Redeploy project

---

### Error: Database tidak terkoneksi

**Penyebab:** URL atau token Turso salah

**Solusi:**
1. Verifikasi database URL dan token dengan command:
   ```bash
   turso db show daulah-abbasiyah
   turso db tokens create daulah-abbasiyah
   ```
2. Update environment variables di Vercel dengan nilai yang benar
3. Redeploy

---

## Struktur File untuk Vercel

```
project-daulah-abbasiyah/
├── api/
│   └── index.js          # Serverless function untuk Vercel
├── public/
│   ├── css/
│   └── js/
├── views/
│   └── *.html
├── gambar/
├── vercel.json           # Konfigurasi Vercel (sudah diperbaiki)
├── package.json
└── server.js             # Untuk development lokal saja
```

---

## Catatan Penting

1. **File `server.js`** hanya digunakan untuk development lokal
2. **File `api/index.js`** adalah file yang digunakan di Vercel (serverless)
3. Database SQLite lokal (`database.db`) TIDAK digunakan di production
4. Semua data disimpan di Turso database (cloud)
5. Kredensial admin:
   - Username: `admin`
   - Password: `password123`

---

## Redeploy Setelah Perubahan

Jika melakukan perubahan kode:

```bash
# Jika menggunakan CLI
vercel --prod

# Jika menggunakan GitHub
git add .
git commit -m "Update code"
git push origin main
# Vercel akan auto-deploy
```

---

## Kontak & Support

Jika masih mengalami masalah:
1. Check logs di Vercel Dashboard → Project → Deployments → [Latest] → Function Logs
2. Pastikan semua environment variables sudah benar
3. Test endpoints menggunakan curl atau Postman

---

**Status Fix:** ✅ Routing untuk admin endpoints sudah diperbaiki di `vercel.json`
