# Panduan Deploy ke Vercel - Website Daulah Abbasiyah

## Masalah yang Sudah Diperbaiki ✅

### Error BigInt Serialization
**Error:** `Do not know how to serialize a BigInt`

**Penyebab:**
- SQLite di Vercel mengembalikan `this.lastID` sebagai BigInt
- JSON.stringify() tidak bisa serialize BigInt secara default

**Solusi yang Sudah Diterapkan:**
1. Menambahkan global BigInt serializer di `server.js:10-12`
2. Konversi manual BigInt ke Number di response (baris 118-120)

## Cara Deploy Ulang ke Vercel

### Opsi 1: Deploy via Git (Recommended)
```bash
# 1. Commit perubahan terbaru
git add .
git commit -m "Fix: BigInt serialization error for Vercel deployment"

# 2. Push ke repository
git push origin main

# 3. Vercel akan otomatis deploy ulang
```

### Opsi 2: Deploy Manual via Vercel CLI
```bash
# 1. Install Vercel CLI (jika belum)
npm install -g vercel

# 2. Login ke Vercel
vercel login

# 3. Deploy
vercel --prod
```

### Opsi 3: Deploy via Vercel Dashboard
1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Klik "Deployments" tab
4. Klik "Redeploy" pada deployment terakhir
5. Atau klik "..." → "Redeploy"

## Verifikasi Deployment

Setelah deploy, test dengan:
1. Buka website Anda: https://web-daulah.vercel.app
2. Klik "Uji Kemampuan"
3. Isi nama dan jawab semua soal kuis
4. Klik "Selesai"
5. **Seharusnya berhasil** - tidak ada error lagi!

## Perbaikan yang Dilakukan di `server.js`

### 1. Global BigInt Serializer (Baris 9-12)
```javascript
// Fix for BigInt serialization in JSON (important for Vercel deployment)
BigInt.prototype.toJSON = function() {
    return Number(this);
};
```

### 2. Manual Conversion di POST /api/scores (Baris 117-120)
```javascript
// Convert BigInt to Number to avoid serialization error in Vercel
const insertId = typeof this.lastID === 'bigint'
    ? Number(this.lastID)
    : this.lastID;
```

### 3. Improved Error Handling (Baris 106-112)
```javascript
if (err) {
    console.error('Error inserting score:', err.message);
    return res.status(500).json({
        success: false,
        error: 'Gagal menyimpan skor ke database',
        details: err.message
    });
}
```

## Testing Lokal

Sebelum deploy, test lokal dulu:
```bash
# 1. Install dependencies
npm install

# 2. Jalankan server
node server.js

# 3. Test dengan curl
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test User","skor":8}'

# Expected response:
# {"success":true,"id":6,"message":"Skor berhasil disimpan"}
```

## Troubleshooting

### Jika masih error setelah deploy:
1. **Check Vercel Logs:**
   - Buka Vercel Dashboard
   - Klik project → Deployments → Latest deployment
   - Klik "Function Logs" atau "Runtime Logs"

2. **Check Browser Console:**
   - Tekan F12 di browser
   - Tab Console
   - Lihat error detail

3. **Pastikan versi Node.js sesuai:**
   - Buka `package.json`
   - Tambahkan:
     ```json
     "engines": {
       "node": "18.x"
     }
     ```

### Jika database error di Vercel:
⚠️ **PENTING:** Vercel Serverless Functions bersifat stateless!

SQLite file-based database tidak cocok untuk production di Vercel karena:
- Setiap function invocation bisa beda instance
- File system adalah read-only (kecuali /tmp)
- Data akan hilang setelah function selesai

**Solusi Production:**
1. **Vercel Postgres** (Recommended untuk production)
2. **Vercel KV** (Redis)
3. **External Database:** MongoDB Atlas, PlanetScale, Railway, dll.

Untuk development/demo, SQLite masih bisa digunakan dengan catatan:
- Data mungkin tidak persistent
- Setiap deployment baru akan reset database

## Kontak Support
Jika masih ada masalah, hubungi developer atau buka issue di repository.

---
**Last Updated:** 2025-10-11
**Version:** 1.0.1
