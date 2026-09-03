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
      <div className="pt-20 sm:pt-24 md:pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.8)] mb-4 sm:mb-8 uppercase tracking-widest">
          Кадры закончились!
        </h2>
        <div className="text-sm sm:text-xl text-slate-400 font-mono tracking-widest uppercase">
           ОЖИДАНИЕ ПУЛЬТА ВЕДУЩЕГО...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-12 px-4 sm:px-8 min-h-screen flex flex-col items-center justify-between max-w-[1920px] mx-auto">
      
      {/* Title & Rules */}
      <div className="text-center mt-2 sm:mt-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]">
          // {round.title}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-8">
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-[3rem] p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="relative w-full max-h-[45vh] md:max-h-[55vh] aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 flex items-center justify-center">
            <img 
              key={currentItem.photo}
              src={currentItem.photo} 
              alt="Какие два фильма перемешались?"
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${isAnswerRevealed ? 'opacity-40 blur-sm' : ''}`}
            />
            {/* Overlay for answer: appears only when revealed, disappears instantly on next */}
            {isAnswerRevealed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 z-20">
                <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl text-center font-black text-indigo-300 uppercase tracking-widest leading-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  {currentItem.title}
                </h2>
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-8 text-[8px] sm:text-[10px] text-indigo-400/80 font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase z-10 flex items-center">
             КАДР {itemIndex + 1} ИЗ {round.items.length} <span className="text-white/30 mx-2 sm:mx-3">//</span> CINEMA_SCAN_ACTIVE
          </div>
        </div>
      </div>

      {/* Controls info */}
      <div className="mt-6 sm:mt-12 text-[8px] sm:text-[10px] font-mono opacity-50 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
         Управление с пульта ведущего (/host)
      </div>

    </div>
  );
}
