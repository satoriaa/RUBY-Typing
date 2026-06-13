import TimerDisplay from "../../components/TimerDisplay";

export default function PlayingScreen({
  selectedDuration,
  timeOptions,
  timeLeft,
  words,
  currentWordIndex,
  currentInput,
  history,
  inputRef,
  wordRefs,
  lines,
  topLineIndex,
  onResetTexts,
  onBackToMenu,
  onChangeInput,
  onKeyDown,
}) {
  // Fallback jika array 'lines' belum siap dihitung oleh sistem induk
  const visibleWordSet = new Set();
  if (Array.isArray(lines) && lines.length) {
    const remainingLines = lines.slice(topLineIndex);
    for (const lineWords of remainingLines) {
      for (const wi of lineWords) visibleWordSet.add(wi);
    }
  } else {
    for (let i = 0; i < words.length; i++) visibleWordSet.add(i);
  }

  const visibleWords = words
    .map((word, wordIdx) => ({ word, wordIdx }))
    .filter(({ wordIdx }) => visibleWordSet.has(wordIdx));

  return (
    /* CONTAINER UTAMA */
    <div className="w-full h-[80vh] max-h-145 mx-auto flex flex-col justify-between items-center px-4">
      
      {/* 2. MIDDLE SECTION (Typing Box) */}
      <div
        className="w-full max-w-3xl flex items-center justify-center flex-1 my-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tinggi kontainer dibatasi ketat agar pas untuk 2 atau 3 baris aktif saja */}
        <div className="w-full text-2xl leading-relaxed tracking-wide select-none font-mono h-40 overflow-hidden bg-linear-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md p-6 border border-zinc-800/60 hover:border-rose-500/20 rounded-2xl transition-all duration-300 shadow-2xl relative">
          
          {Array.isArray(lines) && lines.length ? (
            /* KUNCINYA DI SINI: Kita HANYA me-render lines mulai dari 'topLineIndex' ke depan.
              Baris index 0 sampai 'topLineIndex - 1' tidak di-render sama sekali. 
              Ini memaksa baris aktif saat ini otomatis naik menempati posisi paling atas kotak!
            */
            <div className="w-full flex flex-col gap-y-4">
              {lines.slice(topLineIndex).map((lineWords, li) => {
                // li === 0 di dalam slice ini berarti baris yang sedanng diketik sekarang!
                const isCurrentLine = li === 0;
                
                return (
                  <div 
                    key={`line-${topLineIndex + li}`} 
                    className={`w-full flex flex-wrap gap-x-4 gap-y-2 transition-all duration-300 ${
                      isCurrentLine ? "opacity-100 scale-[1.005]" : "opacity-35 blur-[0.3px]"
                    }`}
                  >
                    {lineWords.map((wordIdx) => {
                      const word = words[wordIdx];
                      const isCurrentWord = wordIdx === currentWordIndex;

                      // Highlight box kata aktif (Tema Merah Cyberpunk)
                      const currentWordHighlight = isCurrentWord
                        ? "bg-rose-950/30 rounded-md px-1 ring-1 ring-rose-500/20"
                        : "px-1";

                      return (
                        <span
                          key={wordIdx}
                          ref={(el) => (wordRefs.current[wordIdx] = el)}
                          className={`${currentWordHighlight} inline-block transition-all duration-200 relative py-0.5`}
                        >
                          {word.split("").map((char, charIdx) => {
                            let charColor = "text-zinc-400"; // Warna huruf antrean

                            if (isCurrentWord) {
                              if (charIdx < currentInput.length) {
                                charColor =
                                  currentInput[charIdx] === char
                                    ? "text-emerald-400 font-medium drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]"
                                    : "text-rose-400 bg-rose-500/10 rounded-[2px] font-medium";
                              }
                            } else if (wordIdx < currentWordIndex) {
                              // Kata yang sudah diketik dalam baris yang sama
                              const typedWord = history[wordIdx] || "";
                              if (charIdx < typedWord.length) {
                                charColor = typedWord[charIdx] === char ? "text-zinc-600" : "text-rose-500/80 underline decoration-wavy decoration-1";
                              } else {
                                charColor = "text-rose-500/80 underline decoration-wavy decoration-1";
                              }
                            }

                            return (
                              <span key={charIdx} className={`${charColor} transition-colors duration-100 relative`}>
                                {/* CARET NEON */}
                                {isCurrentWord && charIdx === currentInput.length && (
                                  <span className="absolute -left-px top-1/2 -translate-y-1/2 w-0.5 h-[1.25em] bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse rounded-full" />
                                )}
                                {char}
                              </span>
                            );
                          })}

                          {/* KETIKAN BERLEBIH */}
                          {isCurrentWord && currentInput.length > word.length && (
                            <span className="text-rose-400 bg-rose-500/10 rounded-xs opacity-90 relative">
                              {currentInput.slice(word.length)}
                              <span className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-[1.25em] bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse rounded-full" />
                            </span>
                          )}

                          {/* CARET PAS DI AKHIR KATA */}
                          {isCurrentWord && currentInput.length === word.length && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-[1.25em] bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse rounded-full" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            /* FALLBACK */
            <div className="w-full flex flex-wrap gap-x-4 gap-y-4">
              {visibleWords.map(({ word, wordIdx }) => {
                const isCurrentWord = wordIdx === currentWordIndex;
                const currentWordHighlight = isCurrentWord ? "bg-rose-950/30 rounded-md px-1 ring-1 ring-rose-500/20" : "px-1";
                return (
                  <span
                    key={wordIdx}
                    ref={(el) => (wordRefs.current[wordIdx] = el)}
                    className={`text-zinc-400 ${currentWordHighlight} inline-block py-0.5 relative`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. LOWER SECTION (Timer Display) */}
      <div className="w-full flex flex-col items-center mb-4 transform hover:scale-102 transition-transform duration-300">
        <TimerDisplay timeLeft={timeLeft} totalDuration={selectedDuration} />
      </div>

      {/* 4. BOTTOM NAV SECTION */}
      <div className="flex justify-between items-center w-full max-w-3xl px-2 select-none border-t border-zinc-800/40 pt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onResetTexts}
            className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/50 active:scale-95 transition-all duration-200 cursor-pointer rounded-xl border border-transparent hover:border-zinc-800"
            title="Reset Teks (Esc)"
          >
            <span className="text-xl font-sans block transition-transform duration-500 ease-out hover:rotate-180">⟳</span>
          </button>

          <div className="text-xs font-mono bg-zinc-900/40 border border-zinc-800/50 px-3 py-1.5 rounded-lg text-zinc-400 shadow-inner hidden sm:block">
            <span className="text-zinc-600">Word:</span>{" "}
            <span className="text-rose-400/90 font-bold">{currentWordIndex + 1}</span>
            <span className="text-zinc-600">/{words.length}</span>
          </div>
        </div>

        <button
          onClick={onBackToMenu}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors duration-200 cursor-pointer bg-zinc-900/20 hover:bg-zinc-900/60 border border-zinc-800/40 hover:border-zinc-700/60 px-3 py-1.5 rounded-lg"
        >
          ← kembali ke menu
        </button>
      </div>

      {/* HIDDEN INPUT */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => onChangeInput(e.target.value)}
        onKeyDown={onKeyDown}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />
    </div>
  );
}