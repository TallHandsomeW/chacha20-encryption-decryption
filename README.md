# 🔐 ChaCha20 Cipher — Web App

Implementasi algoritma enkripsi **ChaCha20 (RFC 8439)** berbasis web, berjalan sepenuhnya di sisi klien (client-side) tanpa mengirimkan data ke server.

> Mata Kuliah: Sistem Keamanan  
> Universitas Maritim Raja Ali Haji — 2025/2026  
> **Tim:** Willy Hadipermana · Cinto Aprilman Halawa · Raga Tapa Dhijaya

---

## 📋 Deskripsi

Aplikasi ini mengimplementasikan algoritma stream cipher **ChaCha20** yang dirancang oleh D.J. Bernstein (2008) dan distandardisasi dalam **RFC 8439**. Pengguna dapat melakukan enkripsi dan dekripsi teks secara langsung di browser, tanpa instalasi apapun.

---

## ✨ Fitur

- **Enkripsi teks** menggunakan ChaCha20 dengan key dan nonce
- **Dekripsi ciphertext** kembali ke plaintext asli
- **Generate key acak** 32 byte (256-bit) secara kriptografis aman
- **Generate nonce acak** 12 byte (96-bit) secara kriptografis aman
- **Sinkronisasi key & nonce** otomatis antar tab enkripsi ↔ dekripsi
- **Salin hasil** ke clipboard dengan satu klik
- **Toggle visibilitas key** untuk keamanan saat input
- **Shortcut keyboard** `Ctrl+Enter` / `⌘+Enter` untuk enkripsi/dekripsi cepat
- **100% client-side** — tidak ada data yang dikirim ke server

---

## 🗂️ Struktur File

```
chacha20-web/
├── index.html      # Tampilan antarmuka utama
├── style.css       # Styling (light theme, IBM Plex Mono + DM Sans)
├── chacha20.js     # Implementasi algoritma ChaCha20 (RFC 8439)
└── app.js          # Controller UI (event handling, validasi, copy, dll.)
```

---

## 🔬 Detail Implementasi Algoritma

Implementasi mengikuti spesifikasi **RFC 8439** secara penuh.

### State Inisialisasi (16 kata × 32-bit)

```
State[0..3]   = Konstanta "expand 32-byte k" (SIGMA)
State[4..11]  = Key (32 byte, little-endian)
State[12]     = Counter (32-bit, mulai dari 1)
State[13..15] = Nonce (12 byte, little-endian)
```

### Quarter Round

Operasi inti yang dijalankan sebanyak 20 putaran (10 column rounds + 10 diagonal rounds):

```
a += b; d ^= a; d <<<= 16
c += d; b ^= c; b <<<= 12
a += b; d ^= a; d <<<= 8
c += d; b ^= c; b <<<= 7
```

### Alur Enkripsi / Dekripsi

```
Plaintext (UTF-8)
      │
      ▼
  strToBytes()          ← TextEncoder
      │
      ▼
 chacha20Crypt()        ← XOR dengan keystream
      │
      ▼
  bytesToHex()          ← Output sebagai hex string
      │
      ▼
Ciphertext (Hex)
```

Dekripsi identik dengan enkripsi karena sifat XOR simetris.

### Parameter Kriptografi

| Parameter | Ukuran | Format Input |
|-----------|--------|-------------|
| Key       | 32 byte (256-bit) | 64 karakter hex |
| Nonce     | 12 byte (96-bit)  | 24 karakter hex |
| Counter   | 4 byte (32-bit)   | Dimulai dari 1 (RFC 8439) |
| Block     | 64 byte           | Keystream per blok |

---

## 🚀 Cara Penggunaan

Tidak diperlukan instalasi. Cukup buka `index.html` di browser modern.

### Enkripsi

1. Masukkan **plaintext** yang ingin dienkripsi
2. Masukkan **key** (64 karakter hex) atau klik ikon 🔄 untuk generate otomatis
3. Isi **nonce** atau biarkan kosong (akan di-generate otomatis saat enkripsi)
4. Klik **Enkripsi Pesan** atau tekan `Ctrl+Enter`
5. Salin **ciphertext** dan **nonce** yang dihasilkan

### Dekripsi

1. Pindah ke tab **Dekripsi**
2. Masukkan **ciphertext** (format hex)
3. Masukkan **key** dan **nonce** yang sama saat enkripsi
4. Klik **Dekripsi Pesan** atau tekan `Ctrl+Enter`

> ⚠️ **Penting:** Nonce yang dipakai saat enkripsi harus sama persis saat dekripsi. Simpan nonce bersama ciphertext.

---

## 🛡️ Catatan Keamanan

- Proses kriptografi berjalan sepenuhnya di browser — tidak ada data yang meninggalkan perangkat
- Key dan nonce di-generate menggunakan `crypto.getRandomValues()` (CSPRNG bawaan browser)
- Implementasi ini **tidak menyertakan autentikasi pesan** (MAC). Untuk keamanan produksi, gunakan **ChaCha20-Poly1305** (RFC 8439 AEAD)
- Aplikasi ini dibuat untuk tujuan **edukasi**

---

## 🌐 Kompatibilitas Browser

Memerlukan browser modern yang mendukung:

- `TextEncoder` / `TextDecoder` API
- `crypto.getRandomValues()` API
- `navigator.clipboard` API (untuk fitur salin)
- `DataView` dan `Uint8Array`

Diuji pada Chrome, Firefox, Edge, dan Safari versi terbaru.

---

## 📚 Referensi

- Bernstein, D.J. (2008). *ChaCha, a variant of Salsa20*
- [RFC 8439](https://www.rfc-editor.org/rfc/rfc8439) — ChaCha20 and Poly1305 for IETF Protocols
