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
  };

  useEffect(() => {
    const t = setTimeout(() => {
      initGameData();
    }, 0);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDuration]);


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

      if (nextIndex >= words.length) {
        calculateResults(newHistory, "", nextIndex, timeLeft);
      }
    }
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

    setSelectedDuration,
    setCurrentInput,
    handleStartGame,
    resetToMenu,
    resetToPlaying,
    handleKeyDown,
  };
}

