export default function TimerDisplay({ timeLeft, totalDuration = 30 }) {
  // Mengubah warna timer menjadi merah menyala jika waktu tinggal sedikit (di bawah 10 detik)
  const isUrgent = timeLeft <= 10;
  
  // Kalkulasi persentase yang aman dan dinamis
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  // Styling dinamis untuk teks utama
  const textStyle = isUrgent 
    ? "text-rose-500 font-black drop-shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-[pulse_0.8s_infinite]" 
    : "text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.15)]";

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      {/* LABEL ATAS */}
      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1 bg-zinc-900/40 px-2.5 py-0.5 rounded-md border border-zinc-800/30">
        Time Remaining
      </div>
      
      {/* ANGKA TIMER */}
      <div className={`text-6xl font-mono tracking-tighter transition-all duration-300 flex items-baseline ${textStyle}`}>
        {timeLeft}
        <span className="text-xl font-medium text-zinc-600 ml-0.5 font-sans">s</span>
      </div>
      
      {/* PROGRESS BAR PREMIUM */}
      <div className="w-48 h-1.5 bg-zinc-950/80 rounded-full mt-3 overflow-hidden border border-zinc-800/80 p-[1px] relative shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(251,191,36,0.3)] ${
            isUrgent 
              ? "bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]" 
              : "bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* PERSENTASE DENGAN BADGE */}
      <div className="mt-1.5 px-1.5 py-0.5 rounded bg-zinc-900/20 border border-transparent">
        <span className={`text-[10px] font-mono transition-colors duration-300 ${isUrgent ? "text-rose-400/80 font-bold" : "text-zinc-500"}`}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}