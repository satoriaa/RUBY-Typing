import { useEffect, useMemo, useRef, useState } from "react";
import { generateRandomText } from "../utils/words";

export function useTypingGame() {
  const [gameState, setGameState] = useState("landing");
  const [selectedDuration, setSelectedDuration] = useState(30);

  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState([]);

  const [timeLeft, setTimeLeft] = useState(selectedDuration);
  const [isStarted, setIsStarted] = useState(false);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const inputRef = useRef(null);
  const wordRefs = useRef([]);

  // Lines based on layout wrap (offsetTop grouping)
  const [lines, setLines] = useState([]); // Array<number[]>: list of word indices per line
  const [topLineIndex, setTopLineIndex] = useState(0);

  const timeOptions = useMemo(
    () => [
      { label: "15s", value: 15 },
      { label: "30s", value: 30 },
      { label: "45s", value: 45 },
      { label: "1m", value: 60 },
      { label: "1m 15s", value: 75 },
      { label: "1m 30s", value: 90 },
      { label: "1m 45s", value: 105 },
      { label: "2m", value: 120 },
    ],
    []
  );


  const calculateResults = (finalHistory = history, finalCurrentInput = currentInput, finalCurrentWordIndex = currentWordIndex, finalTimeLeft = timeLeft) => {
    let totalCharsTyped = 0;
    let correctChars = 0;

    finalHistory.forEach((typedWord, wordIdx) => {
      const targetWord = words[wordIdx];
      totalCharsTyped += typedWord.length + 1;

      for (let i = 0; i < typedWord.length; i++) {
        if (targetWord && typedWord[i] === targetWord[i]) correctChars++;
      }
      if (typedWord === targetWord) correctChars++;
    });

    totalCharsTyped += finalCurrentInput.length;
    for (let i = 0; i < finalCurrentInput.length; i++) {
      if (words[finalCurrentWordIndex] && finalCurrentInput[i] === words[finalCurrentWordIndex][i]) {
        correctChars++;
      }
    }

    if (totalCharsTyped === 0) {
      setWpm(0);
      setAccuracy(100);
      setGameState("finished");
      return;
    }

    const timeSpentMinutes = (selectedDuration - finalTimeLeft) / 60 || 0.5;
    const calculatedWpm = Math.round((totalCharsTyped / 5) / timeSpentMinutes);
    const calculatedAcc = Math.round((correctChars / totalCharsTyped) * 100);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAcc);
    setGameState("finished");
  };

  const initGameData = () => {
    const rawText = generateRandomText(150);
    setWords(rawText.split(" "));
    wordRefs.current = [];

    setCurrentWordIndex(0);
    setCurrentInput("");
    setHistory([]);

    setTimeLeft(selectedDuration);
    setIsStarted(false);

    setLines([]);
    setTopLineIndex(0);
  };


  useEffect(() => {
    const t = setTimeout(() => {
      initGameData();
    }, 0);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDuration]);

  // Measure lines based on actual DOM wrap (offsetTop grouping)
  useEffect(() => {
    if (gameState !== "playing") return;
    if (!words.length) return;

    let raf1 = 0;
    let raf2 = 0;

    const measureLines = () => {
      const els = wordRefs.current || [];
      if (!els.length) return;

      const offsets = els.map((el) => (el ? el.offsetTop : null));
      const indexedOffsets = offsets
        .map((top, idx) => ({ idx, top }))
        .filter((x) => x.top !== null);

      // group by offsetTop (tolerate minor pixel differences)
      indexedOffsets.sort((a, b) => a.top - b.top);

      const groups = [];
      const tolerance = 2; // px
      for (const item of indexedOffsets) {
        const targetGroup = groups[groups.length - 1];
        if (!targetGroup) {
          groups.push({ top: item.top, words: [item.idx] });
          continue;
        }
        if (Math.abs(targetGroup.top - item.top) <= tolerance) {
          targetGroup.words.push(item.idx);
        } else {
          groups.push({ top: item.top, words: [item.idx] });
        }
      }

      // sort each line indexes (for stable checking)
      const normalizedLines = groups.map((g) => g.words.sort((a, b) => a - b));
      // Keep previously-scrolled topLineIndex where possible — don't reset to 0 on every re-measure.
      setLines(normalizedLines);
      setTopLineIndex((prev) => {
        // clamp previous top index to the new number of lines
        const max = normalizedLines.length;
        if (prev < 0) return 0;
        return Math.min(prev, max);
      });
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => measureLines());
    });

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, words]);



  useEffect(() => {
    if (gameState === "playing") {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return undefined;

    let timer;

    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (isStarted && timeLeft === 0) {
      timer = setTimeout(() => {
        calculateResults();
      }, 0);
    }


    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, isStarted, timeLeft]);

  const finishIfDone = (nextHistory, nextCurrentWordIndex, nextCurrentInput) => {
    // Jika sudah melewati word terakhir, langsung finish.
    if (nextCurrentWordIndex >= words.length) {
      calculateResults(nextHistory, "", nextCurrentWordIndex, timeLeft);
      return true;
    }

    // Jika sedang berada di word terakhir dan user sudah mengetik full word tersebut (tanpa perlu spasi)
    const isLastWord = nextCurrentWordIndex === words.length - 1;
    if (isLastWord && words[nextCurrentWordIndex] && nextCurrentInput === words[nextCurrentWordIndex]) {
      // Simpan word terakhir ke history lalu finish.
      const finalHistory = [...nextHistory, nextCurrentInput];
      calculateResults(finalHistory, "", words.length, timeLeft);
      return true;
    }

    return false;
  };


  const handleKeyDown = (e) => {
    if (!isStarted && e.key !== "Escape") {
      setIsStarted(true);
    }

    if (e.key === " ") {
      e.preventDefault();
      if (currentInput.trim() === "") return;

      const newHistory = [...history, currentInput.trim()];
      const nextIndex = currentWordIndex + 1;

      setHistory(newHistory);
      setCurrentWordIndex(nextIndex);
      setCurrentInput("");

      // topLineIndex dihitung ulang oleh handler onChange (setCurrentInputWithAutoFinish)
      // namun agar lebih responsif, kita juga panggil setelah state update selesai via requestAnimationFrame
      requestAnimationFrame(() => {
        if (!lines.length) return;
        const wordDone = (wordIdx) => {
          if (wordIdx < nextIndex) return true;
          if (wordIdx > nextIndex) return false;
          // wordIdx === nextIndex => currentInput sudah "" saat spasi, jadi belum done
          return false;
        };

        let nextTop = 0;
        for (let li = 0; li < lines.length; li++) {
          const allDone = lines[li].every((wi) => wordDone(wi));
          if (allDone) nextTop = li + 1;
          else break;
        }
        setTopLineIndex(nextTop);
      });

      finishIfDone(newHistory, nextIndex, "");
    } else {
      // Auto-finish saat mengetik word terakhir selesai tanpa menekan spasi
      // (catatan: currentInput belum berubah di sini, jadi cek hanya jika karakter terakhir ditulis secara langsung via onChange.
      // Untuk memastikan, kita cek pada handler onChange di setCurrentInput wrapper di bawah.)
    }
  };


  const setCurrentInputWithAutoFinish = (value) => {
    // value adalah input yang terbaru
    setCurrentInput(value);

    // Jangan auto-finish kalau game belum mulai
    if (!isStarted) return;

    const nextCurrentWordIndex = currentWordIndex;
    const nextCurrentInput = value;
    const nextHistory = history;

    // update top line ketika line selesai
    const updateTopLineByState = () => {
      if (!lines.length) return;

      const wordDone = (wordIdx) => {
        if (wordIdx < currentWordIndex) return true;
        if (wordIdx > currentWordIndex) return false;
        // wordIdx === currentWordIndex
        return nextCurrentInput === words[wordIdx];
      };

      let nextTop = 0;
      for (let li = 0; li < lines.length; li++) {
        const allDone = lines[li].every((wi) => wordDone(wi));
        if (allDone) nextTop = li + 1;
        else break;
      }

      setTopLineIndex(nextTop);
    };

    updateTopLineByState();
    finishIfDone(nextHistory, nextCurrentWordIndex, nextCurrentInput);
  };



  const handleStartGame = () => {
    initGameData();
    setGameState("playing");
  };

  const resetToMenu = () => {
    setGameState("landing");
  };

  const resetToPlaying = () => {
    initGameData();
    setGameState("playing");
  };

  return {
    gameState,
    selectedDuration,
    timeOptions,

    words,
    currentWordIndex,
    currentInput,
    history,

    timeLeft,
    isStarted,

    wpm,
    accuracy,

    inputRef,
    wordRefs,

    lines,
    topLineIndex,

    setSelectedDuration,
    setCurrentInput: setCurrentInputWithAutoFinish,

    handleStartGame,

    resetToMenu,
    resetToPlaying,
    handleKeyDown,
  };
}

