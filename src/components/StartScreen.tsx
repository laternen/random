import { houses } from "../data/houses";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  // Берём 6 случайных фото домов для галереи
  const galleryHouses = [...houses]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-md mx-auto w-full">
      {/* Логотип */}
      <div className="mb-4 text-center">
        <h1 className="text-5xl font-black tracking-tight">
          <span className="text-[#26CD94]">Ран</span>
          <span className="text-white">Дом</span>
        </h1>
        <div className="mt-1 text-sm text-gray-400">Симулятор оценки домов в Москве</div>
      </div>

      {/* Описание */}
      <p className="text-center text-gray-300 text-sm leading-relaxed mb-4 max-w-xs">
        Угадайте стоимость дома по фото и описанию.
        10 раундов — 10 объектов. Насколько хорошо вы знаете рынок?
      </p>

      {/* Фотогалерея из реальных объявлений */}
      <div className="grid grid-cols-3 gap-1.5 mb-4 w-full max-w-xs">
        {galleryHouses.map((house) => (
          <div
            key={house.id}
            className="aspect-square rounded-lg overflow-hidden bg-gray-800 ring-1 ring-gray-700/50"
          >
            <img
              src={house.imageUrl}
              alt={house.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Пример цены */}
      <div className="w-full max-w-xs mb-4 bg-gray-900/80 rounded-xl p-3 border border-gray-800">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-gray-500 truncate">Пример: {houses[4].title}</div>
            <div className="text-xs text-gray-400">{houses[4].location} • {houses[4].area} м²</div>
          </div>
          <div className="text-base font-bold text-[#26CD94] flex-shrink-0">
            {(houses[4].price / 1000000).toFixed(0)} млн ₽
          </div>
        </div>
      </div>

      {/* Кнопка старта */}
      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 px-8 bg-[#26CD94] hover:bg-[#20b882] active:bg-[#1aa06e] text-gray-950 font-bold text-lg rounded-xl transition-all duration-200 transform active:scale-95 shadow-lg shadow-[#26CD94]/20 animate-pulse-glow"
      >
        🏠 Запустить игру
      </button>

      {/* Статистика */}
      <div className="mt-5 flex gap-8 text-center">
        <div>
          <div className="text-xl font-bold text-[#26CD94]">{houses.length}</div>
          <div className="text-xs text-gray-500">домов</div>
        </div>
        <div>
          <div className="text-xl font-bold text-[#26CD94]">10</div>
          <div className="text-xs text-gray-500">раундов</div>
        </div>
        <div>
          <div className="text-xl font-bold text-[#26CD94]">∞</div>
          <div className="text-xs text-gray-500">попыток</div>
        </div>
      </div>
    </div>
  );
}
