import { useEffect } from 'react';
import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round2Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round2({ gameState }: Round2Props) {
  const round = gameData.round2;
  const { itemIndex, isAnswerRevealed, roundEnd } = gameState.round2;

  // Preload all photos in round 2 immediately so there's zero network delay
  useEffect(() => {
    round.items.forEach((item) => {
      const img = new Image();
      img.src = item.photo;
    });
  }, [round.items]);

  const currentItem = round.items[itemIndex];

  if (roundEnd || !currentItem) {
    return (
      <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-fuchsia-400 drop-shadow-[0_0_20px_rgba(192,38,211,0.8)] mb-4 uppercase tracking-widest">
          Фотографии закончились!
        </h2>
        <div className="text-xs sm:text-base text-slate-400 font-mono tracking-widest uppercase">
          ОЖИДАНИЕ ПУЛЬТА ВЕДУЩЕГО...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 sm:p-4 md:p-5 flex flex-col items-center justify-between overflow-hidden max-w-7xl mx-auto">
      
      {/* Title & Rules */}
      <div className="text-center shrink-0 my-1">
        <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-fuchsia-400 drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">
          // {round.title}
        </h1>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center my-auto py-1">
        
        <div className="w-full max-w-4xl h-full max-h-[75vh] glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl">
          
          {/* Photo container that scales gracefully within available height */}
          <div className="relative flex-1 min-h-0 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center">
            <img 
              key={currentItem.photo}
              src={currentItem.photo} 
              alt={currentItem.name}
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
              className="w-auto h-auto max-w-full max-h-full object-contain select-none"
            />

            {/* Overlay for answer */}
            {isAnswerRevealed && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-fade-in">
                <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-cyan-400 drop-shadow-[0_0_30px_rgba(0,229,255,0.8)] leading-none">
                  {currentItem.realAge}
                </div>
                <div className="text-base sm:text-2xl text-slate-300 font-mono mt-2 uppercase tracking-widest">
                  лет
                </div>
              </div>
            )}
          </div>

          {/* Actor Name */}
          <div className="shrink-0 mt-2 sm:mt-3 text-center z-10">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.25)] line-clamp-1">
              {currentItem.name}
            </h2>
          </div>
          
          <div className="shrink-0 mt-1 sm:mt-2 text-[9px] sm:text-xs text-fuchsia-400/80 font-mono tracking-[0.2em] uppercase z-10 flex items-center">
             ФОТО {itemIndex + 1} ИЗ {round.items.length} <span className="text-white/30 mx-2">//</span> BIO_SCAN_ACTIVE
          </div>
        </div>
      </div>

      {/* Controls info */}
      <div className="shrink-0 text-center text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-[0.2em] my-1">
         Управление с пульта ведущего (/host)
      </div>

    </div>
  );
}
