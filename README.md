# devTyping — Typing Test (React + Vite)

Aplikasi **typing test** untuk mengukur **WPM (Words Per Minute)** dan **Accuracy** dalam sesi waktu tertentu, dengan tampilan minimalis dan visualisasi chart.

## Fitur Utama
- **Landing screen** untuk memilih durasi sesi: `15s`, `30s`, `45s`, `1m`, `1m 15s`, `1m 30s`, `1m 45s`, `2m`
- **Realtime typing view** per karakter (benar/salah di-highlight)
- **Timer** menghitung mundur sesuai durasi
- **Hasil akhir** menampilkan:
  - **WPM**
  - **Accuracy** dan **Salah (100% - Accuracy)**
  - Grafik:
    - **Line chart** “WPM History”
    - **Doughnut chart** “Accuracy Ratio”

## Cara Menjalankan

1) Install dependency:
```bash
npm install
```

2) Jalankan mode development:
```bash
npm run dev
```

3) Build untuk produksi (opsional):
```bash
npm run build
```

## Cara Pakai
1. Buka aplikasi.
2. Pilih durasi sesi.
3. Klik tombol **Start Typing**.
4. Ketik di keyboard (input disembunyikan, game otomatis menangkap input).
5. Setelah waktu habis, akan muncul halaman **Hasil Pengetikan**.
6. Gunakan tombol:
   - **Main Lagi ⟳** untuk mencoba lagi
   - **[ Kembali ke Menu ]** untuk kembali ke pilihan durasi

## Teknologi yang Digunakan
- **React**
- **Vite**
- **Tailwind CSS**
- **Chart.js** + **react-chartjs-2**
- **random-words** (untuk menghasilkan teks acak)

## Catatan Interaksi Keyboard
- Saat bermain, input difokuskan otomatis.
- Tombol **Escape** diarahkan untuk reset teks (sesuai kontrol pada UI).

