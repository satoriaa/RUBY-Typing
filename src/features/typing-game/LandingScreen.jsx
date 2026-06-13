export default function LandingScreen({ selectedDuration, timeOptions, onSelectDuration, onStartGame }) {
  const selectedLabel = timeOptions.find((o) => o.value === selectedDuration)?.label;

  return (
    /* CONTAINER UTAMA:
       Tetap mempertahankan tinggi viewport agar pas di mata dan layout terpusat.
    */
    <div className="w-full h-[80vh] max-h-[580px] mx-auto flex flex-col justify-between items-center px-4">
      
      {/* 1. HERO SECTION (Logo & Efek Pendar Cahaya Merah) */}
      <div className="relative w-full text-center select-none pt-4">
        {/* Glow Effects - Diubah dari kuning menjadi Merah Crimson transparan */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[480px] h-[180px] bg-gradient-to-r from-rose-500/10 via-red-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-gradient-to-b from-rose-500/5 to-transparent blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-500 to-rose-600 tracking-wide mb-2">

            <span>RUBYTyping</span>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm tracking-wide font-medium">
            Asah kecepatan dan akurasi mengetik baris kodemu di sini
          </p>
        </div>
      </div>

      {/* 2. FEATURE CARDS GRID (Aksen teks diganti ke Rose/Red) */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 select-none">
        <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md p-4 text-left transition-all duration-300 hover:border-rose-500/30 group">
          <div className="text-[10px] font-mono text-rose-400 group-hover:text-rose-300 uppercase tracking-widest font-bold transition-colors">01 / Realtime</div>
          <div className="mt-1.5 text-xs text-zinc-200 font-semibold font-mono">WPM Dinamis</div>
          <div className="mt-1 text-[11px] text-zinc-500 leading-normal">Pantau kecepatan rata-rata ketikanmu secara langsung tiap detik.</div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md p-4 text-left transition-all duration-300 hover:border-rose-500/30 group">
          <div className="text-[10px] font-mono text-rose-400 group-hover:text-rose-300 uppercase tracking-widest font-bold transition-colors">02 / Akurasi</div>
          <div className="mt-1.5 text-xs text-zinc-200 font-semibold font-mono">Evaluasi Presisi</div>
          <div className="mt-1 text-[11px] text-zinc-500 leading-normal">Setiap karakter yang salah ketik terekam akurat untuk metrik evaluasi.</div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md p-4 text-left transition-all duration-300 hover:border-rose-500/30 group">
          <div className="text-[10px] font-mono text-rose-400 group-hover:text-rose-300 uppercase tracking-widest font-bold transition-colors">03 / Fokus</div>
          <div className="mt-1.5 text-xs text-zinc-200 font-semibold font-mono">Minimalis & Bersih</div>
          <div className="mt-1 text-[11px] text-zinc-500 leading-normal">Layout terpusat, tanpa distraksi visual. Murni kamu dan kodemu.</div>
        </div>
      </div>

      {/* 3. PREVIEW TEXT CONTAINER (Syntax Highlighter Merah) */}
      <div className="w-full max-w-3xl select-none my-2">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Preview Syntax</span>
          <span className="text-[10px] font-mono bg-zinc-950/50 border border-zinc-800/60 px-2 py-0.5 rounded text-zinc-400">
            Durasi Terpilih: <span className="text-rose-400 font-bold font-mono">{selectedLabel ?? "-"}</span>
          </span>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 shadow-inner">
          <div className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
            <span className="text-rose-400 font-medium">const</span>
            <span> </span>
            <span className="text-zinc-200">hello</span>
            <span> </span>
            <span className="text-rose-400">=</span>
            <span> </span>
            <span className="text-emerald-400 font-medium">"devTyping"</span>
            <span className="text-zinc-500">;</span>
            <span> </span>
            {/* Caret Neon Merah */}
            <span className="inline-block w-[2px] h-[1.15em] align-middle bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse rounded-full" />
          </div>
        </div>
      </div>

      {/* 4. SELECTION DURATION & PLAY CONTROLS */}
      <div className="w-full flex flex-col items-center select-none pb-4">
        <div className="flex flex-col items-center mb-5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold mb-2.5">Pilih Durasi Sesi</span>
          <div className="flex flex-wrap justify-center gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 shadow-inner">
            {timeOptions.map((option) => {
              const isSelected = selectedDuration === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onSelectDuration(option.value)}
                  className={`px-4 py-1.5 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-800 text-rose-400 font-bold border border-zinc-700/50 shadow-[0_0_15px_rgba(244,63,94,0.08)]"
                      : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BUTTON ACTION UTAMA (Efek pendar bayangan merah saat di-hover) */}
        <button
          onClick={onStartGame}
          className="group px-10 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-mono font-bold rounded-xl shadow-xl hover:shadow-rose-950/20 transition-all duration-200 active:scale-98 transform hover:scale-102 relative overflow-hidden cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-1">
            {">"} Start Typing
          </span>
        </button>
      </div>

    </div>
  );
}