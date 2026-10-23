import { useState, useEffect, useCallback } from "react";
import { Property, propertyImages, formatPrice, formatPriceFull } from "../data/properties";
import { RoundResult } from "../App";

interface GameScreenProps {
  property: Property;
  roundNumber: number;
  totalRounds: number;
  onComplete: (result: RoundResult) => void;
}

// Логарифмическая шкала для удобной оценки
const MIN_PRICE = 3000000; // 3 млн
const MAX_PRICE = 200000000; // 200 млн

function sliderToPrice(value: number): number {
  const minLog = Math.log(MIN_PRICE);
  const maxLog = Math.log(MAX_PRICE);
  const logPrice = minLog + (value / 100) * (maxLog - minLog);
  return Math.round(Math.exp(logPrice) / 10000) * 10000;
}

function priceToSlider(price: number): number {
  const minLog = Math.log(MIN_PRICE);
  const maxLog = Math.log(MAX_PRICE);
  return ((Math.log(price) - minLog) / (maxLog - minLog)) * 100;
}

export function GameScreen({ property, roundNumber, totalRounds, onComplete }: GameScreenProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [guessedPrice, setGuessedPrice] = useState(() => sliderToPrice(50));
  const [revealed, setRevealed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Сброс при смене раунда + анимация бегунка
  useEffect(() => {
    setRevealed(false);
    setSliderValue(0);
    setGuessedPrice(MIN_PRICE);
    setShowAnimation(true);

    const timer = setTimeout(() => {
      setSliderValue(50);
      setGuessedPrice(sliderToPrice(50));
      setShowAnimation(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [property.id]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    setGuessedPrice(sliderToPrice(val));
  }, []);

  const handleGuess = () => {
    if (revealed) return;
    setRevealed(true);
  };

  const handleNext = () => {
    const diff = guessedPrice - property.price;
    const diffPercent = (Math.abs(diff) / property.price) * 100;

    // Система подсчёта баллов
    let points: number;
    if (diffPercent <= 2) points = 100;
    else if (diffPercent <= 5) points = 80;
    else if (diffPercent <= 10) points = 60;
    else if (diffPercent <= 20) points = 40;
    else if (diffPercent <= 35) points = 20;
    else if (diffPercent <= 50) points = 10;
    else points = 0;

    onComplete({
      property,
      guessedPrice,
      diff,
      diffPercent,
      points,
    });
  };

  const progress = (roundNumber / totalRounds) * 100;
  const correctSliderPos = priceToSlider(property.price);

  return (
    <div className="flex-1 flex flex-col px-4 py-3 max-w-md mx-auto w-full overflow-hidden">
      {/* Прогресс-бар */}
      <div className="mb-2 flex-shrink-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Раунд {roundNumber}/{totalRounds}</span>
          <span className="text-xs text-[#26CD94] font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#26CD94] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Карточка объекта */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Фото */}
        <div className="relative rounded-xl overflow-hidden mb-2 bg-gray-800 flex-shrink-0" style={{ aspectRatio: '16/9' }}>
          <img
            src={propertyImages[property.imageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5">
            <span className="text-xs font-medium text-white">{property.rooms}-комн.</span>
          </div>
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5">
            <span className="text-xs font-medium text-white">{property.area} м²</span>
          </div>
        </div>

        {/* Информация */}
        <div className="mb-2 flex-shrink-0">
          <h2 className="text-base font-bold text-white leading-tight">{property.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{property.address}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {property.floor}/{property.totalFloors} эт. • {property.description}
          </p>
        </div>

        {/* Бегунок */}
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 mb-2 flex-shrink-0">
          <div className="text-xs text-gray-500 mb-1">Ваша оценка:</div>
          <div className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            revealed
              ? guessedPrice > property.price ? "text-red-400" : guessedPrice < property.price ? "text-yellow-400" : "text-[#26CD94]"
              : "text-[#26CD94]"
          }`}>
            {formatPrice(guessedPrice)}
          </div>

          {/* Слайдер */}
          <div className="relative mb-1.5">
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={sliderValue}
              onChange={handleSliderChange}
              disabled={revealed}
              className={`w-full h-3 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[#26CD94]
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-[#26CD94]/40
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white/20
                ${showAnimation ? '[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-500 [&::-webkit-slider-thumb]:ease-out' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={{
                background: revealed
                  ? `linear-gradient(to right, #26CD94 0%, #26CD94 ${correctSliderPos}%, #374151 ${correctSliderPos}%, #374151 100%)`
                  : `linear-gradient(to right, #26CD94 0%, #26CD94 ${sliderValue}%, #374151 ${sliderValue}%, #374151 100%)`
              }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <span>3 млн ₽</span>
            <span>200 млн ₽</span>
          </div>
        </div>

        {/* Результат после ответа */}
        {revealed && (
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 mb-2 flex-shrink-0 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500">Правильная цена:</div>
                <div className="text-lg font-bold text-[#26CD94]">
                  {formatPriceFull(property.price)}
                </div>
              </div>
              <div className="text-right">
                {guessedPrice > property.price ? (
                  <>
                    <div className="text-xs text-red-400 font-medium">↑ Переплата</div>
                    <div className="text-sm font-bold text-red-400">{formatPrice(guessedPrice - property.price)}</div>
                  </>
                ) : guessedPrice < property.price ? (
                  <>
                    <div className="text-xs text-yellow-400 font-medium">↓ Недоплата</div>
                    <div className="text-sm font-bold text-yellow-400">{formatPrice(property.price - guessedPrice)}</div>
                  </>
                ) : (
                  <div className="text-sm font-bold text-[#26CD94]">✓ Точно!</div>
                )}
              </div>
            </div>
            <div className="mt-1.5 text-xs text-gray-500">
              Отклонение: {Math.round(Math.abs(guessedPrice - property.price) / property.price * 100)}%
            </div>
          </div>
        )}

        {/* Кнопка */}
        <button
          onClick={revealed ? handleNext : handleGuess}
          className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 transform active:scale-95 flex-shrink-0 ${
            revealed
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-[#26CD94] hover:bg-[#20b882] active:bg-[#1aa06e] text-gray-950 shadow-lg shadow-[#26CD94]/20 animate-pulse-glow"
          }`}
        >
          {revealed ? "Далее →" : "🎯 Оценить"}
        </button>
      </div>
    </div>
  );
}
