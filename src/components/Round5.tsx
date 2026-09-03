import { useEffect } from 'react';
import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round5Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round5({ gameState }: Round5Props) {
  const round = gameData.round5;
  const { itemIndex, isAnswerRevealed, roundEnd } = gameState.round5;

  // Preload all photos in round 5 immediately
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
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.8)] mb-4 uppercase tracking-widest text-center">
          Кадры закончились!
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
        <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]">
          // {round.title}
        </h1>
      </div>

      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center my-auto py-1">
        <div className="w-full max-w-4xl h-full max-h-[75vh] glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col items-center justify-between relative overflow-hidden shadow-2xl">
          
          <div className="relative flex-1 min-h-0 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center">
            <img 
              key={currentItem.photo}
              src={currentItem.photo} 
              alt="Какие два фильма перемешались?"
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
              className={`w-auto h-auto max-w-full max-h-full object-contain select-none transition-all ${isAnswerRevealed ? 'opacity-35 blur-[2px]' : ''}`}
            />
            {/* Overlay for answer */}
            {isAnswerRevealed && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 z-20 animate-fade-in">
                <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl text-center font-black text-indigo-300 uppercase tracking-wider leading-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  {currentItem.title}
                </h2>
              </div>
            )}
          </div>
          
          <div className="shrink-0 mt-2 text-[9px] sm:text-xs text-indigo-400/80 font-mono tracking-[0.2em] uppercase z-10 flex items-center">
             КАДР {itemIndex + 1} ИЗ {round.items.length} <span className="text-white/30 mx-2">//</span> CINEMA_SCAN_ACTIVE
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
