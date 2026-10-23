import { RoundResult } from "../App";
import { formatPriceFull, formatPrice } from "../data/properties";

interface ResultScreenProps {
  results: RoundResult[];
  onRestart: () => void;
}

export function ResultScreen({ results, onRestart }: ResultScreenProps) {
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const maxPoints = results.length * 100;
  const avgAccuracy = results.reduce((sum, r) => sum + (100 - Math.min(r.diffPercent, 100)), 0) / results.length;

  const overpayTotal = results
    .filter(r => r.diff > 0)
    .reduce((sum, r) => sum + r.diff, 0);

  const underpayTotal = results
    .filter(r => r.diff < 0)
    .reduce((sum, r) => sum + Math.abs(r.diff), 0);

  // Определение титула
  const getInvestorTitle = () => {
    const percent = (totalPoints / maxPoints) * 100;
    if (percent >= 70) {
      return {
        title: "Опытный инвестор",
        emoji: "🏆",
        description: "Близок к результату! Вы отлично разбираетесь в рынке недвижимости Москвы.",
        color: "text-[#26CD94]",
        bgColor: "bg-[#26CD94]/10",
        borderColor: "border-[#26CD94]/30",
      };
    } else if (percent >= 40) {
      return {
        title: "Щедрый инвестор",
        emoji: "💰",
        description: "Я переплачиваю за недвижимость! Зато точно не останетесь без крыши над головой.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
      };
    } else {
      return {
        title: "Скряга",
        emoji: "🤏",
        description: "Экономный инвестор! Вы видите каждый рубль, но иногда стоит быть щедрее.",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
      };
    }
  };

  const investor = getInvestorTitle();
  const pointsPercent = Math.round((totalPoints / maxPoints) * 100);

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-4 max-w-md mx-auto w-full overflow-y-auto">
      {/* Титул */}
      <div className={`text-center mb-4 p-4 rounded-2xl w-full ${investor.bgColor} border ${investor.borderColor} animate-fade-in`}>
        <div className="text-5xl mb-2">{investor.emoji}</div>
        <h1 className={`text-2xl font-black ${investor.color}`}>
          {investor.title}
        </h1>
        <p className="text-sm text-gray-400 mt-1.5">
          {investor.description}
        </p>
      </div>

      {/* Круговая диаграмма баллов */}
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#1f2937"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#26CD94"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${pointsPercent * 2.64} 264`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{totalPoints}</span>
          <span className="text-xs text-gray-500">/{maxPoints}</span>
        </div>
      </div>

      {/* Статистика */}
      <div className="w-full bg-gray-900 rounded-xl p-3 border border-gray-800 mb-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-[#26CD94]">{Math.round(avgAccuracy)}%</div>
            <div className="text-xs text-gray-500">точность</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#26CD94]">{pointsPercent}%</div>
            <div className="text-xs text-gray-500">результат</div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-800 grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-sm font-bold text-red-400">
              {overpayTotal > 0 ? formatPrice(overpayTotal) : "—"}
            </div>
            <div className="text-xs text-gray-500">переплата</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-yellow-400">
              {underpayTotal > 0 ? formatPrice(underpayTotal) : "—"}
            </div>
            <div className="text-xs text-gray-500">недоплата</div>
          </div>
        </div>
      </div>

      {/* Детализация раундов */}
      <div className="w-full mb-3">
        <h3 className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Раунды</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {results.map((result, i) => (
            <div
              key={i}
              className="bg-gray-900/80 rounded-lg p-2.5 border border-gray-800/50 flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">
                  {result.property.title}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {formatPriceFull(result.property.price)}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  result.points >= 80 ? "bg-[#26CD94]/20 text-[#26CD94]" :
                  result.points >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {result.points}
                </div>
                <div className={`text-xs font-medium ${
                  result.diff > 0 ? "text-red-400" : result.diff < 0 ? "text-yellow-400" : "text-[#26CD94]"
                }`}>
                  {result.diff > 0 ? "↑" : result.diff < 0 ? "↓" : "✓"}
                  {Math.round(result.diffPercent)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка перезапуска */}
      <button
        onClick={onRestart}
        className="w-full py-3.5 bg-[#26CD94] hover:bg-[#20b882] active:bg-[#1aa06e] text-gray-950 font-bold text-base rounded-xl transition-all duration-200 transform active:scale-95 shadow-lg shadow-[#26CD94]/20"
      >
        🔄 Играть снова
      </button>
    </div>
  );
}
