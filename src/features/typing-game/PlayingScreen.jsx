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
  onResetTexts,
  onBackToMenu,
  onChangeInput,
  onKeyDown,
}) {
  return (
    /* CONTAINER UTAMA:
       Mempertahankan tinggi viewport agar pas di layar monitor dan tidak memicu scrollbar browser.
    */
    <div className="w-full h-[80vh] max-h-[580px] mx-auto flex flex-col justify-between items-center px-4">

      {/* 2. MIDDLE SECTION (Typing Box - Sekarang Naik ke Posisi Dominan & Pas di Mata) */}
      <div 
        className="w-full max-w-3xl flex items-center justify-center flex-1 my-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="w-full text-2xl leading-relaxed tracking-wide select-none font-mono min-h-[140px] max-h-[180px] overflow-hidden flex flex-wrap gap-x-4 gap-y-4 bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 backdrop-blur-md p-6 border border-zinc-800/60 hover:border-zinc-700/50 rounded-2xl transition-all duration-300 shadow-2xl relative">
          {words.map((word, wordIdx) => {
            const currentWordEl = wordRefs.current[currentWordIndex];
            const targetWordEl = wordRefs.current[wordIdx];

            let lineStyle = "text-zinc-600 opacity-35";

            if (currentWordEl && targetWordEl) {
              const isCurrentLine = targetWordEl.offsetTop === currentWordEl.offsetTop;
              const isNextWord = wordIdx === currentWordIndex + 1;

              if (isCurrentLine || isNextWord) {
                lineStyle = "text-zinc-300 opacity-100";
              } else if (targetWordEl.offsetTop < currentWordEl.offsetTop) {
                lineStyle = "text-zinc-500 opacity-20 blur-[0.5px]";
              }
            } else if (wordIdx === 0) {
              lineStyle = "text-zinc-300 opacity-100";
            }

            const isCurrentWord = wordIdx === currentWordIndex;
            const currentWordHighlight = isCurrentWord ? "bg-zinc-800/40 rounded-md px-1 ring-1 ring-zinc-700/30" : "px-1";

            return (
              <span
                key={wordIdx}
                ref={(el) => (wordRefs.current[wordIdx] = el)}
                className={`${lineStyle} ${currentWordHighlight} inline-block transition-all duration-200 relative py-0.5`}
              >
                {word.split("").map((char, charIdx) => {
                  let charColor = "";

                  if (isCurrentWord) {
                    if (charIdx < currentInput.length) {
                      charColor = currentInput[charIdx] === char 
                        ? "text-emerald-400 font-medium drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]" 
                        : "text-rose-400 bg-rose-500/10 rounded-[2px] font-medium";
                    }
                  } else if (wordIdx < currentWordIndex) {
                    const typedWord = history[wordIdx] || "";
                    if (charIdx < typedWord.length) {
                      charColor = typedWord[charIdx] === char ? "text-zinc-500" : "text-rose-500/80 underline decoration-wavy decoration-1";
                    } else {
                      charColor = "text-rose-500/80 underline decoration-wavy decoration-1";
                    }
                  }

                  return (
                    <span key={charIdx} className={`${charColor} transition-colors duration-100 relative`}>
                      {isCurrentWord && charIdx === currentInput.length && (
                        <span className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2px] h-[1.25em] bg-yellow-400 shadow-[0_0_8px_#facc15] animate-pulse rounded-full" />
                      )}
                      {char}
                    </span>
                  );
                })}

                {isCurrentWord && currentInput.length > word.length && (
                  <span className="text-rose-400 bg-rose-500/10 rounded-[2px] opacity-90 relative">
                    {currentInput.slice(word.length)}
                    <span className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[2px] h-[1.25em] bg-yellow-400 shadow-[0_0_8px_#facc15] animate-pulse rounded-full" />
                  </span>
                )}

                {isCurrentWord && currentInput.length === word.length && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[1.25em] bg-yellow-400 shadow-[0_0_8px_#facc15] animate-pulse rounded-full" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3. LOWER SECTION (Timer Turun Ke Sini - Berfungsi sebagai jangkar visual bawah) */}
      <div className="w-full flex flex-col items-center mb-4 transform hover:scale-102 transition-transform duration-300">
        <TimerDisplay timeLeft={timeLeft} totalDuration={selectedDuration} />
      </div>

      {/* 4. BOTTOM NAV SECTION (Action Controls & Status Bar) */}
      <div className="flex justify-between items-center w-full max-w-3xl px-2 select-none border-t border-zinc-800/40 pt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onResetTexts}
            className="p-2 text-zinc-500 hover:text-yellow-400 hover:bg-zinc-800/50 active:scale-95 transition-all duration-200 cursor-pointer rounded-xl border border-transparent hover:border-zinc-800"
            title="Reset Teks (Esc)"
          >
            <span className="text-xl font-sans block transition-transform duration-500 ease-out hover:rotate-180">⟳</span>
          </button>
          
          <div className="text-xs font-mono bg-zinc-900/40 border border-zinc-800/50 px-3 py-1.5 rounded-lg text-zinc-400 shadow-inner hidden sm:block">
            <span className="text-zinc-600">Word:</span> <span className="text-yellow-400/90 font-bold">{currentWordIndex + 1}</span><span className="text-zinc-600">/{words.length}</span>
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