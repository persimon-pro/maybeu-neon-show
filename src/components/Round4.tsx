import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round4Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round4({ gameState }: Round4Props) {
  const round = gameData.round4;
  const { itemIndex, isAnswerRevealed, roundEnd } = gameState.round4;

  if (roundEnd) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] mb-4 sm:mb-8 uppercase tracking-widest text-center">
          Предметы закончились!
        </h2>
        <div className="text-sm sm:text-xl text-slate-400 font-mono tracking-widest uppercase">
           ОЖИДАНИЕ ПУЛЬТА ВЕДУЩЕГО...
        </div>
      </div>
    );
  }

  const currentItem = round.items[itemIndex];

  return (
    <div className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-12 px-4 sm:px-8 min-h-screen flex flex-col items-center justify-between max-w-[1920px] mx-auto">
      
      {/* Title & Rules */}
      <div className="text-center mt-2 sm:mt-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          // {round.title}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-8">
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-[3rem] p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="relative w-full max-h-[45vh] md:max-h-[55vh] aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
            <img 
              src={currentItem.photo} 
              alt="Что это?"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain transition-all duration-700 ${isAnswerRevealed ? 'scale-100 opacity-30 grayscale' : 'scale-105 opacity-100'}`}
            />
            {/* Overlay for answer */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 transition-opacity duration-700 ${isAnswerRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h2 className={`text-xl sm:text-3xl md:text-5xl lg:text-6xl text-center font-black text-amber-400 uppercase tracking-widest leading-tight drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-transform duration-700 delay-100 ${isAnswerRevealed ? 'translate-y-0' : 'translate-y-8'}`}>
                {currentItem.description}
              </h2>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-8 text-[8px] sm:text-[10px] text-amber-500/80 font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase z-10 flex items-center">
             АРТЕФАКТ {itemIndex + 1} ИЗ {round.items.length} <span className="text-white/30 mx-2 sm:mx-3">//</span> HISTORICAL_SCAN_ACTIVE
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
