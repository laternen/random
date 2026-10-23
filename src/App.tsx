import { useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { House, getRandomHouses } from "./data/houses";

type Screen = "start" | "game" | "result";

export interface RoundResult {
  house: House;
  guessedPrice: number;
  diff: number;
  diffPercent: number;
  points: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [rounds, setRounds] = useState<House[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  const startGame = () => {
    const selected = getRandomHouses(10);
    setRounds(selected);
    setResults([]);
    setCurrentRound(0);
    setScreen("game");
  };

  const handleRoundComplete = (result: RoundResult) => {
    const newResults = [...results, result];
    setResults(newResults);

    if (currentRound + 1 >= rounds.length) {
      setScreen("result");
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const restartGame = () => {
    setScreen("start");
    setResults([]);
    setRounds([]);
    setCurrentRound(0);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {screen === "start" && <StartScreen onStart={startGame} />}
        {screen === "game" && rounds.length > 0 && (
          <GameScreen
            key={rounds[currentRound].id}
            house={rounds[currentRound]}
            roundNumber={currentRound + 1}
            totalRounds={rounds.length}
            onComplete={handleRoundComplete}
          />
        )}
        {screen === "result" && (
          <ResultScreen results={results} onRestart={restartGame} />
        )}
      </div>
      <footer className="text-center py-2.5 text-xs text-gray-600 border-t border-gray-800/50 flex-shrink-0">
        <span>РанДом © 2026 • Симулятор оценки домов</span>
      </footer>
    </div>
  );
}
