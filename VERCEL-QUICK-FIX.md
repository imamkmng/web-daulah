# Quick Fix: Error Saat Menyimpan Skor di Vercel

## Masalah yang Sudah Diperbaiki

✅ **Frontend (`public/js/main.js`)**
- Menambahkan pengecekan untuk status 201 (Created)
- Menambahkan logging untuk debugging
- Memperbaiki error handling

✅ **Backend (`api/index.js`)**
- Menambahkan CORS headers
- Menambahkan validasi environment variables
- Menambahkan logging detail untuk debugging
- Memperbaiki error response format

---

## Langkah Deploy Ulang ke Vercel

### Opsi 1: Via GitHub (Recommended)

```bash
git add .
git commit -m "Fix: Perbaiki error penyimpanan skor di Vercel"
git push origin main
```

Vercel akan auto-deploy.

### Opsi 2: Via Vercel CLI

```bash
vercel --prod
```

---

## Checklist Sebelum Deploy

- [ ] **Environment Variables di Vercel sudah diset:**
  - [ ] `TURSO_DATABASE_URL` = `libsql://[nama-db]-[username].turso.io`
  - [ ] `TURSO_AUTH_TOKEN` = Token dari command `turso db tokens create`

- [ ] **Cara cek Environment Variables:**
  1. Buka https://vercel.com/dashboard
  2. Pilih project Anda
  3. Settings → Environment Variables
  4. Pastikan 2 variables ada

- [ ] **Jika baru menambah Environment Variables, WAJIB redeploy:**
  1. Pergi ke tab Deployments
  2. Klik "..." di deployment terakhir
  3. Klik "Redeploy"

---

## Testing Setelah Deploy

### 1. Test API Endpoint

Ganti `[your-url]` dengan URL Vercel Anda:

```bash
# Test GET
curl https://[your-url].vercel.app/api/scores

# Test POST
curl -X POST https://[your-url].vercel.app/api/scores \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","skor":8}'
```

**Response sukses:**
```json
{
  "success": true,
  "id": 1,
  "message": "Score saved successfully"
}
```

### 2. Test di Browser

1. Buka website di Vercel
2. Tekan **F12** (buka DevTools)
3. Pilih tab **Console**
4. Buka halaman kuis: `https://[your-url].vercel.app/uji-kemampuan.html`
5. Isi nama dan jawab kuis
6. Klik "Selesai"
7. **Lihat Console:**

**Output yang benar:**
```
Response status: 201
Response data: {success: true, id: X, message: "Score saved successfully"}
```

**Jika error:**
```
Response status: 500
Response data: {success: false, error: "...", details: "..."}
```

---

## Troubleshooting

### Masalah: Data tersimpan tapi masih muncul error

**Penyebab:** Versi lama masih di-cache

**Solusi:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
2. Atau clear cache browser
3. Atau buka di Incognito/Private mode

---

### Masalah: Error "Database connection not available"

**Penyebab:** Environment variables tidak diset

**Solusi:**
1. Set environment variables di Vercel Dashboard
2. Redeploy project

---

### Masalah: CORS Error

**Penyebab:** Deploy belum menggunakan kode terbaru

**Solusi:**
1. Pastikan sudah `git push` kode terbaru
2. Atau jalankan `vercel --prod` untuk deploy manual

---

## Melihat Logs di Vercel

Jika masih ada error:

1. Buka Vercel Dashboard
2. Deployments → Pilih deployment terakhir
3. Functions → api/index.js
4. Scroll ke bawah untuk lihat **Logs**

Cari baris ini:
- `POST /api/scores - Request received`
- `Request body: {...}`
- `Error inserting score: ...` (jika ada error)

---

## File yang Diubah

1. `api/index.js` - Backend API (+ CORS + logging)
2. `public/js/main.js` - Frontend (+ handle status 201)
3. `DEPLOYMENT.md` - Dokumentasi lengkap
4. `VERCEL-QUICK-FIX.md` - File ini (quick reference)

---

## Kontak Support

Jika masih ada masalah setelah mengikuti semua langkah:

1. Screenshot error di browser console (F12)
2. Screenshot logs di Vercel Functions
3. Pastikan environment variables sudah benar

---

**Status:** ✅ All fixes applied - Ready to deploy
