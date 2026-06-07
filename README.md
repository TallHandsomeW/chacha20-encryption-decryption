# ChaCha20 Cipher Web Application

Aplikasi web sederhana untuk melakukan enkripsi dan dekripsi pesan teks menggunakan algoritma kriptografi stream cipher ChaCha20 berdasarkan standar RFC 8439.

## Deskripsi

Proyek ini merupakan implementasi algoritma ChaCha20 berbasis web yang dikembangkan sebagai tugas Mata Kuliah Sistem Keamanan.

Aplikasi berjalan sepenuhnya di sisi klien (client-side), sehingga seluruh proses enkripsi dan dekripsi dilakukan langsung di browser tanpa mengirim data ke server.

## Fitur

- Enkripsi pesan teks menggunakan ChaCha20
- Dekripsi ciphertext menjadi plaintext
- Generate key acak 256-bit (32 byte)
- Generate nonce acak 96-bit (12 byte)
- Validasi input key dan nonce
- Salin hasil enkripsi/dekripsi ke clipboard
- Antarmuka web sederhana dan responsif
- Tidak memerlukan koneksi server

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Web Crypto API

## Struktur Proyek

```
project/
│
├── index.html
├── style.css
├── app.js
└── chacha20.js
```

### Keterangan File

| File | Fungsi |
|--------|---------|
| index.html | Tampilan antarmuka aplikasi |
| style.css | Styling dan desain antarmuka |
| app.js | Logika interaksi pengguna |
| chacha20.js | Implementasi algoritma ChaCha20 |

## Implementasi ChaCha20

Implementasi mengikuti standar:

- RFC 8439 - ChaCha20 and Poly1305 for IETF Protocols
- D. J. Bernstein (2008)

Komponen utama yang diimplementasikan:

- Quarter Round Function
- ChaCha20 Block Function
- Key Stream Generation
- XOR Encryption/Decryption
- Key 256-bit (32 byte)
- Nonce 96-bit (12 byte)
- Counter 32-bit

## Cara Menjalankan

### Opsi 1: Langsung

1. Download seluruh file proyek.
2. Pastikan semua file berada dalam folder yang sama.
3. Buka file:

```
index.html
```

menggunakan browser.

### Opsi 2: Menggunakan Live Server

1. Buka proyek menggunakan Visual Studio Code.
2. Install extension Live Server.
3. Klik kanan pada `index.html`.
4. Pilih:

```
Open with Live Server
```

## Cara Penggunaan

### Enkripsi

1. Pilih tab **Enkripsi**.
2. Masukkan plaintext.
3. Masukkan key atau generate key otomatis.
4. Masukkan nonce atau generate nonce otomatis.
5. Klik **Enkripsi Pesan**.
6. Ciphertext akan ditampilkan.

### Dekripsi

1. Pilih tab **Dekripsi**.
2. Masukkan ciphertext.
3. Masukkan key yang sama.
4. Masukkan nonce yang sama.
5. Klik **Dekripsi Pesan**.
6. Plaintext asli akan ditampilkan.

## Keamanan

- Seluruh proses dilakukan di browser pengguna.
- Tidak ada data yang dikirim ke server.
- Key dan nonce tidak disimpan.
- Menggunakan generator angka acak dari Web Crypto API.

## Hasil

Aplikasi berhasil melakukan proses:

- Enkripsi plaintext menjadi ciphertext.
- Dekripsi ciphertext menjadi plaintext asli.
- Penggunaan key dan nonce sesuai spesifikasi ChaCha20 RFC 8439.

## Pengembang

Mata Kuliah: Sistem Keamanan

Universitas Maritim Raja Ali Haji

Tahun Akademik 2025/2026

Anggota Kelompok:

- Willy Hadipermana
- Cinto Aprilman Halawa
- Raga Tapa Dhijaya

## Referensi

1. D. J. Bernstein, "ChaCha, a variant of Salsa20", 2008.
2. RFC 8439 - ChaCha20 and Poly1305 for IETF Protocols.
3. Mozilla Developer Network (MDN) Web Crypto API.
