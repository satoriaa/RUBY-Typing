import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen ChartJS yang dibutuhkan termasuk Line dan Filler untuk efek gunung
ChartJS.register(ArcElement, LineElement, PointElement, Filler, CategoryScale, LinearScale, Tooltip, Legend);

export default function FinishedScreen({ wpm, accuracy, wpmHistory = [], onPlayAgain, onBackToMenu }) {
  const safeAccuracy = Number.isFinite(accuracy) ? Math.max(0, Math.min(100, accuracy)) : 0;
  const safeWpm = Number.isFinite(wpm) ? Math.max(0, wpm) : 0;
  const safeWrong = Math.max(0, Math.min(100, 100 - safeAccuracy));

  // Simulasi data jika wpmHistory kosong agar grafik "gunung" tetap terlihat proporsional
  const chartLabels = wpmHistory.length > 0 ? wpmHistory.map((_, i) => `${i + 1}s`) : ["Mulai", "Selesai"];
  const chartDataPoints = wpmHistory.length > 0 ? wpmHistory : [0, safeWpm];

  /* 1. CONFIGURATION: GRAFIK GUNUNG (AREA CHART) - Diubah ke Tema Merah/Rose */
  const lineData = {
    labels: chartLabels,
    datasets: [
      {
        label: "WPM Real-time",
        data: chartDataPoints,
        borderColor: "rgba(244, 63, 94, 1)", // Garis Rose-500 menyala bersih
        borderWidth: 2.5,
        tension: 0.4, // Membuat lekukan gunung menjadi smooth/melengkung halus
        pointBackgroundColor: "rgba(244, 63, 94, 1)",
        pointHoverRadius: 6,
        fill: true, // Mengaktifkan efek area di bawah garis
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(244, 63, 94, 0.25)"); // Rose transparan di puncak grafik
          gradient.addColorStop(1, "rgba(244, 63, 94, 0.0)");  // Menghilang di dasar grafik
          return gradient;
        },
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(9, 9, 11, 0.95)",
        borderColor: "rgba(63, 63, 70, 0.7)",
        borderWidth: 1,
        padding: 12,
        bodyFont: { family: "monospace" },
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} WPM`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#52525b", font: { size: 10, family: "monospace" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(63, 63, 70, 0.15)" },
        ticks: { color: "#52525b", font: { size: 10, family: "monospace" } },
      },
    },
  };

  /* 2. CONFIGURATION: DOUGHNUT ACCURACY */
  const doughnutData = {
    labels: ["Accuracy", "Salah"],
    datasets: [
      {
        data: [safeAccuracy, safeWrong],
        backgroundColor: ["rgba(52, 211, 153, 0.95)", "rgba(39, 39, 42, 0.6)"],
        borderWidth: 0,
        hoverOffset: 4,
        spacing: 3,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "78%", // Membuat ring donut sedikit lebih tipis & clean
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(9, 9, 11, 0.95)",
        borderColor: "rgba(63, 63, 70, 0.7)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const idx = ctx.dataIndex;
            return idx === 0 ? ` Accuracy: ${safeAccuracy}%` : ` Salah: ${safeWrong}%`;
          },
        },
      },
    },
  };

  return (
    <div className="text-center animate-fade-in flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      {/* HEADER */}
      <header className="w-full mb-8 select-none">
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.25em] font-bold">- Hasil Pengetikan -</h2>
        <p className="mt-1 text-zinc-400 text-sm">
          Ringkasan performa kamu dalam satu sesi pengetikan
        </p>
      </header>

      {/* CORE STATS CARD */}
      <div className="w-full rounded-2xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md shadow-2xl p-6 mb-8">
        
        {/* SUMMARY BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 select-none">
          {/* BADGE WPM: Berubah dari kuning (yellow-500) ke merah (rose-500) */}
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/30 p-4 transition-all duration-300 hover:border-rose-500/20">
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase font-bold">WPM</div>
            <div className="mt-1.5 text-4xl font-light text-rose-400 font-mono drop-shadow-[0_0_10px_rgba(244,63,94,0.15)]">{safeWpm}</div>
            <div className="mt-1 text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Words per minute</div>
          </div>

          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/30 p-4 transition-all duration-300 hover:border-emerald-500/20">
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase font-bold">Accuracy</div>
            <div className="mt-1.5 text-4xl font-light text-emerald-400 font-mono drop-shadow-[0_0_10px_rgba(52,211,153,0.1)]">{safeAccuracy}%</div>
            <div className="mt-1 text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Tingkat ketepatan</div>
          </div>

          <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/30 p-4 transition-all duration-300 hover:border-zinc-700/30">
            <div className="text-zinc-500 text-[10px] tracking-widest uppercase font-bold">Salah</div>
            <div className="mt-1.5 text-4xl font-light text-zinc-400 font-mono">{safeWrong}%</div>
            <div className="mt-1 text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">100% - akurasi</div>
          </div>
        </div>

        {/* CHARTS GRAPH SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          
          {/* AREA CHART (GRAFIK GUNUNG REALTIME) */}
          <section className="flex flex-col md:col-span-3 w-full">
            <div className="w-full flex items-center justify-between mb-3 px-1 select-none">
              <div className="text-zinc-500 text-xs tracking-widest uppercase font-bold">WPM History</div>
              <div className="text-zinc-600 font-mono text-[10px] px-2 py-0.5 bg-zinc-950/40 rounded border border-zinc-800/50">Mountain View</div>
            </div>
            <div className="w-full h-52 sm:h-60 bg-zinc-950/20 p-2 rounded-xl border border-zinc-800/30">
              <Line data={lineData} options={lineOptions} />
            </div>
          </section>

          {/* DOUGHNUT CHART */}
          <section className="flex flex-col md:col-span-2 w-full items-center justify-center">
            <div className="w-full flex items-center justify-between mb-3 px-1 select-none">
              <div className="text-zinc-500 text-xs tracking-widest uppercase font-bold">Accuracy Ratio</div>
              <div className="text-zinc-600 font-mono text-[10px]">Doughnut</div>
            </div>

            <div className="relative w-full h-48 sm:h-52 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-4xl font-light text-emerald-400 font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                  {safeAccuracy}%
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Akurasi</span>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* FOOTER ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center select-none mb-4">
        <button
          onClick={onPlayAgain}
          className="px-8 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-mono font-bold rounded-xl transition-all duration-200 active:scale-98 shadow-lg cursor-pointer"
        >
          Main Lagi ⟳
        </button>
        <button
          onClick={onBackToMenu}
          className="px-8 py-2.5 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 text-sm font-mono rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          [ Kembali ke Menu ]
        </button>
      </div>
    </div>
  );
}