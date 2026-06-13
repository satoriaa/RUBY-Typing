import { useTypingGame } from "./hooks/useTypingGame";
import LandingScreen from "./features/typing-game/LandingScreen";
import PlayingScreen from "./features/typing-game/PlayingScreen";
import FinishedScreen from "./features/typing-game/FinishedScreen";

export default function App() {
  const {
    gameState,
    selectedDuration,
    timeOptions,
    words,
    currentWordIndex,
    currentInput,
    history,
    timeLeft,
    inputRef,
    wordRefs,
    wpm,
    accuracy,
    setSelectedDuration,
    setCurrentInput,
    handleStartGame,
    resetToMenu,
    resetToPlaying,
    handleKeyDown,
  } = useTypingGame();

  return (
    /* LAYOUT GLOBAL: 
      Menggunakan h-screen (100vh) dan overflow-hidden agar halaman utama mengunci 
      dan tidak bisa di-scroll ke bawah secara tidak sengaja.
    */
    <div className="w-full h-screen bg-zinc-900 text-white flex flex-col justify-center items-center overflow-hidden p-4 sm:p-6 md:p-8 box-border select-none">
      
      {/* INNER CONTAINER:
        Membatasi lebar maksimal dan memastikan isi komponen mengambil 
        ruang vertikal secara proporsional.
      */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center transition-all duration-500">
        
        {/* LANDING SCREEN CONTAINER */}
        {gameState === "landing" && (
          <div className="w-full animate-fade-in py-4">
            <LandingScreen
              selectedDuration={selectedDuration}
              timeOptions={timeOptions}
              onSelectDuration={setSelectedDuration}
              onStartGame={handleStartGame}
            />
          </div>
        )}

        {/* PLAYING SCREEN CONTAINER */}
        {gameState === "playing" && (
          <div className="w-full animate-fade-in py-2">
            <PlayingScreen
              selectedDuration={selectedDuration}
              timeOptions={timeOptions}
              timeLeft={timeLeft}
              words={words}
              currentWordIndex={currentWordIndex}
              currentInput={currentInput}
              history={history}
              inputRef={inputRef}
              wordRefs={wordRefs}
              onResetTexts={resetToPlaying}
              onBackToMenu={resetToMenu}
              onChangeInput={setCurrentInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {/* FINISHED SCREEN CONTAINER */}
        {gameState === "finished" && (
          <div className="w-full animate-fade-in py-2">
            {/* Jika kamu memakai modifikasi grafik "gunung" sebelumnya, 
              kita pasang parameter wpmHistory (opsional, sesuaikan dengan hook kamu)
            */}
            <FinishedScreen
              wpm={wpm}
              accuracy={accuracy}
              wpmHistory={history ? history.map((w, idx) => w ? 40 + idx * 2 : 0) : []} // Contoh fallback data visual
              onPlayAgain={handleStartGame}
              onBackToMenu={resetToMenu}
            />
          </div>
        )}
        
      </div>
    </div>
  );
}