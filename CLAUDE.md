**Tugas Utama:**
Buat sebuah website pembelajaran interaktif lengkap tentang "Daulah Abbasiyah" menggunakan stack teknologi berikut:

  - **Frontend:** HTML5, CSS3 (dengan Flexbox/Grid untuk layout), dan JavaScript (vanilla JS, tanpa framework).
  - **Backend:** Node.js dengan Express.js.
  - **Database:** SQLite untuk menyimpan data skor kuis.

**Struktur Proyek:**
Tolong buat struktur file dan folder sebagai berikut:

```
/project-daulah-abbasiyah
|-- /public
|   |-- /css
|   |   |-- style.css
|   |-- /js
|   |   |-- main.js
|   |   |-- admin.js
|   |-- /images
|       |-- (folder untuk gambar)
|-- /views
|   |-- index.html
|   |-- timeline.html
|   |-- infografis.html
|   |-- tokoh.html
|   |-- uji-kemampuan.html
|   |-- papan-peringkat.html
|   |-- admin-login.html
|   |-- admin-dashboard.html
|-- server.js
|-- database.db
|-- package.json
```

**Detail Per Halaman & Fitur:**

**1. Desain Umum (`style.css`):**

  - **Skema Warna:** Gunakan skema warna utama **hijau** yang terinspirasi dari seni Islam. Contoh palet:
      - Hijau Tua (misal: `#084c41`) untuk header, footer, dan judul utama.
      - Hijau Sage/Muda (misal: `#A3B899`) untuk aksen, latar belakang kartu, atau tombol sekunder.
      - Krem/Putih Gading (misal: `#F5F5DC`) untuk latar belakang utama halaman agar teks mudah dibaca.
      - Warna Emas (misal: `#D4AF37` atau `#C0A062`) untuk tombol *call-to-action* atau highlight penting.
  - **Font:** Gunakan font 'Poppins' atau 'Lato' dari Google Fonts.
  - **Layout:** Pastikan semua halaman responsif.
  - **Navigasi:** Buat header navigasi yang konsisten.
  - **Tombol Lanjutkan:** Buat class khusus `.btn-lanjutkan`. Buat tombol ini menonjol dengan warna emas, padding yang cukup, border-radius, dan efek hover. Posisikan di tengah bawah setiap halaman konten.

**2. Halaman Beranda (`index.html`):**

  - **Tujuan:** Halaman utama yang menarik.
  - **Layout:** Header, Hero section dengan judul "Jelajahi Masa Keemasan Islam: Daulah Abbasiyah (750-1258 M)", paragraf pengantar, tiga kartu fitur, dan footer.

**3. Halaman Timeline Sejarah (`timeline.html`):**

  - **Tujuan:** Menampilkan peristiwa penting secara kronologis.
  - **Interaktivitas (`main.js`):** Modal/pop-up saat titik acara di-klik.
  - **Data Timeline:** 750 M, 762 M, 786-809 M, 813-833 M, 847-861 M, 1258 M.
  - **Tombol Navigasi:** "Lanjutkan ke Infografis →" mengarah ke `infografis.html`.

**4. Halaman Infografis (`infografis.html`):**

  - **Tujuan:** Memvisualisasikan data kunci.
  - **Layout:** Empat bagian infografis (Peta, Silsilah, Evolusi Bayt al-Hikmah, Faktor Keruntuhan).
  - **Tombol Navigasi:** "Lanjutkan ke Halaman Tokoh →" mengarah ke `tokoh.html`.

**5. Halaman Tokoh (`tokoh.html`):**

  - **Tujuan:** Memperkenalkan tokoh penting.
  - **Layout:** Dua bagian (Khalifah dan Ilmuwan) dengan layout kartu.
  - **Data Tokoh:**
      - **Para Khalifah:** Abdullah as-Saffah, Al-Manshur, Harun Al-Rasyid, Al-Ma'mun Ar-Rasyid.
      - **Para Ilmuwan:** Al-Khawarizmi, Jabir bin Hayyan, Ar-Razi, Jabir Al-Batany.
  - **Tombol Navigasi:** "Siap Menguji Kemampuan? →" mengarah ke `uji-kemampuan.html`.

**6. Halaman Uji Kemampuan & Papan Peringkat (`uji-kemampuan.html`, `papan-peringkat.html`, `main.js`):**

  - **Layout Halaman `uji-kemampuan.html`:**
    1.  Form input untuk "Nama Pengguna".
    2.  **Bagian 1: Game Interaktif "Cocokkan Tokoh".**
    3.  **Bagian 2: Kuis Pilihan Ganda.**
    4.  Tombol "Selesai" di akhir.
  - **Game Interaktif: "Cocokkan Tokoh"**
      - **Layout Game:** Buat sebuah area dengan dua kolom.
          - **Kolom Kiri:** Empat kartu nama ilmuwan yang bisa di-drag: `Al-Khawarizmi`, `Jabir bin Hayyan`, `Ar-Razi`, `Jabir Al-Batany`.
          - **Kolom Kanan:** Empat kotak 'dropzone' statis yang berisi deskripsi karya/penemuan: `Bapak Aljabar`, `Bapak Ilmu Kimia`, `Penjelasan Campak & Cacar`, `Penemu Teropong Bintang`.
      - **Fungsionalitas (`main.js`):** Implementasikan fungsionalitas drag-and-drop. Berikan feedback visual saat jawaban benar (misal: kotak menjadi hijau dan kartu terkunci di tempat) dan salah (misal: kotak bergetar merah dan kartu kembali ke posisi awal).
  - **Kuis Pilihan Ganda:**
      - Area kuis dengan 10 soal pilihan ganda (buat soal berdasarkan materi).
  - **Fungsionalitas Akhir:**
      - Setelah selesai, tampilkan skor total (hanya dari kuis pilihan ganda) dan sebuah tombol yang mengarahkan pengguna ke **Papan Peringkat**.
      - **PENTING:** Saat pengguna menekan "Selesai", kirim data `{nama: "nama pengguna", skor: nilai_kuis}` ke backend melalui `POST` request ke endpoint `/api/scores`.
  - **Papan Peringkat:**
      - Saat halaman dimuat, lakukan `GET` request ke `/api/scores`.
      - Tampilkan data dalam bentuk tabel terurut (Peringkat, Nama, Skor).

**7. Backend (`server.js`):**

  - Gunakan Express.js untuk server dan routing.
  - **Setup Database (SQLite):** Buat database `database.db` dengan tabel `scores` (kolom: `id`, `name`, `score`, `timestamp`).
  - **API Endpoints:**
      - `GET /api/scores`: Ambil semua data skor, urutkan, kirim sebagai JSON.
      - `POST /api/scores`: Terima nama dan skor, simpan ke database.

**8. Fungsionalitas Admin (`admin-login.html`, `admin-dashboard.html`, `admin.js`, `server.js`):**

  - **Login (`admin-login.html`):** Form login sederhana dengan endpoint `POST /admin/login` (kredensial hardcode: `admin` & `password123`).
  - **Dashboard (`admin-dashboard.html`):** Halaman terproteksi, tampilkan semua skor dalam tabel, sediakan tombol "Download Data (CSV)".
  - **Fungsi Download (`server.js`):** Buat endpoint `GET /admin/download` untuk mengonversi data skor ke CSV dan mengirimnya sebagai file unduhan (gunakan library `json2csv`).


### **Materi Lengkap untuk Website Daulah Abbasiyah**

#### **1. Halaman Beranda (`index.html`)**

**[Judul Utama di Hero Section]**
### Jelajahi Masa Keemasan Islam: Daulah Abbasiyah (750-1258 M)

**[Paragraf Pengantar]**
Selamat datang dalam perjalanan menelusuri salah satu periode paling gemilang dalam sejarah peradaban Islam. Daulah Abbasiyah bukan hanya sebuah dinasti, melainkan sebuah era di mana ilmu pengetahuan, seni, dan budaya mencapai puncaknya. Selama lebih dari lima abad, kekhalifahan yang didirikan oleh keturunan paman Nabi Muhammad SAW ini menjadikan Baghdad sebagai mercusuar dunia. Mari kita gali lebih dalam warisan agung mereka!

**[Teks untuk Kartu Fitur]**

* **Timeline Interaktif**
    Telusuri alur waktu dari revolusi besar hingga momen-momen kejayaan dan keruntuhan Daulah Abbasiyah secara kronologis.

* **Infografis Visual**
    Pahami konsep-konsep kunci seperti luasnya kekuasaan, silsilah para pendiri, dan evolusi Baitul Hikmah melalui sajian visual yang menarik.

* **Tokoh Inspiratif**
    Kenali lebih dekat para khalifah visioner dan ilmuwan jenius yang menjadi pilar peradaban dan mengubah dunia selamanya.

---

#### **2. Halaman Timeline Sejarah (`timeline.html`)**

**[Judul Halaman]**
### Linimasa Sejarah Daulah Abbasiyah

**[Teks Pengantar Singkat]**
Setiap tanggal menyimpan sebuah cerita. Klik pada setiap titik waktu di bawah ini untuk mengungkap peristiwa penting yang membentuk perjalanan Daulah Abbasiyah.

**[Konten untuk Pop-up Interaktif di Setiap Titik Waktu]**

* **750 M: Berdirinya Daulah Abbasiyah**
    Setelah memimpin revolusi yang berhasil, Abu al-Abbas As-Saffah dikukuhkan sebagai khalifah pertama Daulah Abbasiyah. Ini menandai berakhirnya kekuasaan Daulah Umayyah dan dimulainya era baru yang berpusat di Irak.

* **762 M: Pendirian Kota Baghdad**
    Atas perintah Khalifah Al-Mansur, pembangunan ibu kota baru yang monumental, Baghdad, dimulai. Kota ini dirancang dengan arsitektur melingkar yang canggih, menjadikannya pusat pemerintahan, perdagangan, dan intelektual yang tak tertandingi pada masanya.

* **786-809 M: Pendirian Baitul Hikmah**
    Pada masa pemerintahan Khalifah Harun al-Rasyid, yang merupakan puncak keemasan, cikal bakal Baitul Hikmah (Rumah Kebijaksanaan) didirikan. Awalnya sebagai perpustakaan pribadi khalifah, lembaga ini menjadi fondasi bagi revolusi ilmu pengetahuan.

* **813-833 M: Pengembangan Baitul Hikmah**
    Khalifah Al-Ma'mun, seorang pecinta ilmu, mengembangkan Baitul Hikmah menjadi akademi ilmu pengetahuan terbesar di dunia. Lembaga ini menjadi pusat penerjemahan karya-karya kuno dari Yunani, Persia, dan India, serta tempat berkumpulnya para ilmuwan terhebat.

* **847-861 M: Pembatasan Penerjemahan Filsafat Yunani**
    Masa Khalifah Al-Mutawakkil menandai adanya perubahan kebijakan. Dukungan terhadap pemikiran filsafat dan rasionalis mulai dibatasi, menandakan pergeseran fokus intelektual di dalam kekhalifahan.

* **1258 M: Invasi Bangsa Mongol**
    Setelah berabad-abad mengalami kemunduran, kota Baghdad dikepung dan dihancurkan oleh pasukan Mongol di bawah pimpinan Hulagu Khan. Peristiwa tragis ini membakar habis Baitul Hikmah dan menandai akhir dari kekuasaan Daulah Abbasiyah di Baghdad.

---

#### **3. Halaman Infografis (`infografis.html`)**

**[Judul Halaman]**
### Daulah Abbasiyah dalam Visual

**[Teks Pengantar Singkat]**
Data sejarah bisa lebih mudah dipahami melalui gambar. Berikut adalah empat infografis kunci yang merangkum berbagai aspek penting dari Daulah Abbasiyah.

**[Judul dan Teks Deskripsi untuk Setiap Infografis]**

1.  **Peta Kekuasaan di Puncak Keemasan**
    * **Deskripsi:** Visualisasikan luasnya wilayah Daulah Abbasiyah pada era Khalifah Harun al-Rasyid. Kekuasaannya membentang dari perbatasan India di Timur hingga Laut Mediterania di Barat, menguasai jalur-jalur perdagangan utama dunia.

2.  **Silsilah Sederhana Para Pendiri**
    * **Deskripsi:** Bagan ini menunjukkan garis keturunan yang menjadi legitimasi Bani Abbas, yaitu dari Abbas bin Abdul Muthalib (paman Nabi Muhammad SAW) hingga ke cicitnya, Abu al-Abbas As-Saffah, sang pendiri Daulah.

3.  **Evolusi Bayt al-Hikmah (Rumah Kebijaksanaan)**
    * **Deskripsi:** Diagram alur ini menggambarkan bagaimana Baitul Hikmah bertransformasi dari sebuah perpustakaan pribadi menjadi institusi ilmu pengetahuan multifungsi yang mencakup biro penerjemahan, observatorium, hingga pusat pendidikan tinggi.

4.  **Faktor-Faktor Keruntuhan Abbasiyah**
    * **Deskripsi:** Keruntuhan Daulah Abbasiyah adalah proses yang kompleks. Diagram ini memvisualisasikan beberapa penyebab utamanya, mulai dari munculnya dinasti-dinasti merdeka yang menggerogoti kekuasaan pusat hingga invasi Mongol yang menghancurkan.

---

#### **4. Halaman Tokoh (`tokoh.html`)**

**[Judul Halaman]**
### Tokoh-Tokoh Kunci Era Abbasiyah

---

#### **Para Khalifah Pembangun Peradaban**

* **Abdullah as-Saffah**
    * **Peran:** Pendiri Daulah Abbasiyah.
    * **Deskripsi:** Sebagai proklamator dan khalifah pertama, ia berhasil memimpin revolusi melawan Bani Umayyah dan meletakkan fondasi bagi salah satu kekhalifahan terbesar dalam sejarah Islam.

* **Al-Manshur**
    * **Peran:** Arsitek Baghdad dan pembentuk sistem administrasi.
    * **Deskripsi:** Seorang visioner arsitektur dan administrasi. Ia adalah otak di balik pembangunan kota Baghdad yang megah dan pencipta sistem birokrasi yang efisien yang menopang kekaisaran.

* **Harun Al-Rasyid**
    * **Peran:** Pemimpin di puncak masa keemasan.
    * **Deskripsi:** Namanya identik dengan kemewahan, keadilan, dan kemajuan. Pada masanya, Baghdad menjadi kota terkaya di dunia, dan ia dikenal karena fokusnya pada kesejahteraan rakyat serta menjadi inspirasi kisah Seribu Satu Malam.

* **Al-Ma'mun Ar-Rasyid**
    * **Peran:** Pelindung ilmu filsafat dan pendiri Baitul Hikmah.
    * **Deskripsi:** Seorang khalifah yang sangat mencintai ilmu pengetahuan. Ia mengubah Baitul Hikmah menjadi akademi global, mendanai proyek penerjemahan besar-besaran, dan mendorong debat intelektual yang bebas.

---

#### **Para Ilmuwan Pengubah Dunia**

* **Al-Khawarizmi**
    * **Peran:** Bapak Aljabar dan penemu angka nol.
    * **Deskripsi:** Seorang jenius matematika dan astronomi. Karyanya, "Al-Jabr", memperkenalkan konsep aljabar sistematis ke seluruh dunia, sementara penggunaan angka nol yang dipopulerkannya merevolusi perhitungan.

* **Jabir bin Hayyan**
    * **Peran:** Bapak Ilmu Kimia.
    * **Deskripsi:** Dianggap sebagai pionir metode eksperimental dalam kimia. Ia mengembangkan proses-proses dasar seperti distilasi dan kristalisasi, mengubah alkimia menjadi ilmu kimia yang lebih sistematis.

* **Ar-Razi**
    * **Peran:** Ahli kedokteran yang pertama menjelaskan penyakit campak dan cacar.
    * **Deskripsi:** Seorang dokter dan filsuf brilian, Ar-Razi (Rhazes) menulis lebih dari 200 karya. Diagnosis klinisnya yang akurat merupakan lompatan besar dalam dunia kedokteran pada masanya.

* **Jabir Al-Batany (Al-Battani)**
    * **Peran:** Penemu teropong bintang.
    * **Deskripsi:** Seorang astronom dan matematikawan ulung yang membuat beberapa pengamatan astronomi paling akurat pada zamannya. Ia memperbaiki perhitungan orbit bulan dan matahari serta mengembangkan konsep trigonometri.

---

#### **5. Halaman Uji Kemampuan (`uji-kemampuan.html`)**

**[Judul Halaman]**
### Uji Kemampuan Pengetahuanmu!

**[Teks Pengantar]**
Anda telah menjelajahi sejarah gemilang Daulah Abbasiyah. Sebelum lanjut ke kuis utama, mari kita mulai dengan permainan interaktif yang seru! Masukkan nama Anda di bawah ini untuk memulai.

---

**Bagian 1: Game Interaktif "Cocokkan Tokoh"**

**[Judul Game]**
#### Cocokkan Ilmuwan dengan Penemuannya!
*Seret nama ilmuwan di sebelah kiri ke kotak penemuannya yang benar di sebelah kanan.*

**[Elemen Game - Teks]**
* **Kartu Drag (Kolom Kiri):**
    * Al-Khawarizmi
    * Jabir bin Hayyan
    * Ar-Razi
    * Jabir Al-Batany
* **Kotak Dropzone (Kolom Kanan):**
    * Bapak Aljabar
    * Bapak Ilmu Kimia
    * Penjelasan Campak & Cacar
    * Penemu Teropong Bintang

---

**Bagian 2: Kuis Pilihan Ganda**

**[Judul Kuis]**
#### Kuis Utama Daulah Abbasiyah
*Pilih jawaban yang paling tepat.*

**[Soal Kuis]**

1.  **Siapakah pendiri Daulah Abbasiyah?**
    a. Harun al-Rasyid
    b. **Abu al-Abbas As-Saffah**
    c. Al-Mansur
    d. Al-Ma'mun

2.  **Kota megah yang dibangun oleh Khalifah Al-Mansur sebagai ibu kota baru adalah...**
    a. Damaskus
    b. Kufah
    c. **Baghdad**
    d. Kairo

3.  **Puncak masa keemasan Daulah Abbasiyah sering dikaitkan dengan masa pemerintahan Khalifah...**
    a. Al-Mutawakkil
    b. Abdullah as-Saffah
    c. **Harun al-Rasyid**
    d. Al-Amin

4.  **Lembaga ilmu pengetahuan terkemuka di Baghdad yang dikembangkan oleh Khalifah Al-Ma'mun adalah...**
    a. Universitas Al-Azhar
    b. **Baitul Hikmah**
    c. Darul Ulum
    d. Madrasah Nizhamiyah

5.  **Ilmuwan Muslim yang dikenal sebagai "Bapak Aljabar" adalah...**
    a. Ar-Razi
    b. Jabir bin Hayyan
    c. **Al-Khawarizmi**
    d. Jabir Al-Batany

6.  **Apa penyebab utama runtuhnya kekuasaan Daulah Abbasiyah di Baghdad pada tahun 1258 M?**
    a. Perang Salib
    b. Wabah penyakit
    c. Bencana alam
    d. **Invasi Bangsa Mongol**

7.  **Ar-Razi adalah seorang ilmuwan yang memberikan kontribusi besar dalam bidang...**
    a. Kimia
    b. **Kedokteran**
    c. Astronomi
    d. Matematika

8.  **Garis keturunan Daulah Abbasiyah berasal dari...**
    a. Ali bin Abi Thalib
    b. Umar bin Khattab
    c. **Abbas bin Abdul Muthalib**
    d. Muawiyah bin Abi Sufyan

9.  **Siapakah ilmuwan yang dijuluki sebagai "Bapak Ilmu Kimia"?**
    a. Al-Khawarizmi
    b. **Jabir bin Hayyan**
    c. Ar-Razi
    d. Al-Ma'mun

10. **Kapan era Daulah Abbasiyah dimulai?**
    a. 661 M
    b. **750 M**
    c. 800 M
    d. 1258 M

**[Teks Halaman Hasil]**
* **Judul:** Hasil Kuis Anda
* **Tampilan Skor:** Skor Anda: [SKOR]/10
* **Pesan:** "Luar biasa! Pengetahuanmu sangat baik. Lihat posisimu di Papan Peringkat!"
* **Tombol:** "Lihat Papan Peringkat"

---

#### **6. Halaman Papan Peringkat (`papan-peringkat.html`)**

**[Judul Halaman]**
### Papan Peringkat Teratas

**[Teks Pengantar Singkat]**
Berikut adalah daftar para pembelajar dengan skor tertinggi. Teruslah belajar untuk mencapai puncak!

---

#### **7. Halaman Admin**

**Halaman Login (`admin-login.html`)**
* **Judul:** Login Admin
* **Label:** Username, Password
* **Tombol:** Login

**Halaman Dasbor (`admin-dashboard.html`)**
* **Judul:** Dasbor Admin: Hasil Uji Kemampuan
* **Header Tabel:** No, Nama Pengguna, Skor, Tanggal & Waktu
* **Tombol:** Download Data (CSV)