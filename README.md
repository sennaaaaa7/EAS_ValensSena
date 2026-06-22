# 🎬 MovieVault — EAS Mobile Computing 2025/2026

Aplikasi mobile berbasis React Native untuk menjelajahi dan menyimpan film favorit, menggunakan TMDB API dan Firebase.

---

## 👥 Anggota Tim & Pembagian Tugas

| Nama | NIM | Peran | Tanggung Jawab |
|---|---|---|---|
| Valent Febriasyah | 0923040087 | Frontend & Axios Specialist | Merancang seluruh UI/UX dan integrasi Axios ke TMDB API |
| Sena Kukuh Wiro Jatmiko | 0923040086 | Backend & Firebase Specialist | State management dan integrasi Firebase Auth + Firestore |

---

## 📱 Tentang Aplikasi

MovieVault adalah aplikasi mobile yang memungkinkan pengguna untuk menjelajahi film populer dan trending, mencari film berdasarkan judul, serta menyimpan film ke dalam daftar watchlist pribadi yang tersimpan di cloud.

---

## 🔌 API yang Digunakan

| Layanan | Kegunaan |
|---|---|
| **TMDB API** (api.themoviedb.org) | Mengambil data film (popular, trending, search, detail) via Axios |
| **Firebase Authentication** | Sistem login dan register pengguna |
| **Cloud Firestore** | Menyimpan dan membaca data watchlist per user secara real-time |

---

## ✅ 3 Fitur Utama

### Fitur 1 — Browse Film (Axios)
Menampilkan film populer dan trending di halaman Home menggunakan Axios. Dua request dijalankan secara paralel menggunakan Promise.all untuk efisiensi.

### Fitur 2 — Pencarian Film (Axios + Debounce)
Pencarian film berdasarkan judul menggunakan Axios dengan teknik debounce 500ms untuk mencegah request berlebihan.

### Fitur 3 — Watchlist (Firebase Auth + Firestore)
Sistem login/register menggunakan Firebase Authentication. Watchlist disimpan di Cloud Firestore dengan real-time listener menggunakan onSnapshot.

---

## 🚀 Cara Menjalankan

```bash
npm install
npx expo start


```

## 🌐 Link Aplikasi
[MovieVault - Vercel](https://project-qph7e.vercel.app)
-
[Repository_GitHub](https://github.com/sennaaaaa7/EAS_ValensSena)