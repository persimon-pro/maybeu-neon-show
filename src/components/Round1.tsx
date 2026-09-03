import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round1Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round1({ gameState, dispatch }: Round1Props) {
  const round = gameData.round1;
  const { wordIndex, timeLeft, isActive, roundEnd } = gameState.round1;

  if (roundEnd) {
    return (
      <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(0,229,255,0.8)] mb-4 uppercase tracking-widest">
          Слова закончились!
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
        <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-cyan-400">
          // {round.title}
        </h1>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center my-auto py-1">
        {/* Timer */}
        <div className={`
          text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-black mb-2 sm:mb-4 transition-colors duration-300 leading-none shrink-0
          ${timeLeft <= 5 ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] status-pulse' : 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]'}
        `}>
          00:{timeLeft.toString().padStart(2, '0')}
        </div>

        {/* Word Display */}
        <div className="w-full max-w-4xl flex-1 min-h-0 max-h-[60vh] glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden my-auto shadow-2xl">
          {/* Subtle neon glow inside card based on active state */}
          <div className={`absolute inset-0 bg-cyan-500/5 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          <h2 className={`
             text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white transition-all duration-300 z-10 text-center uppercase break-words max-w-full leading-tight
             ${!isActive ? 'blur-md opacity-30 select-none' : 'blur-0 opacity-100 glow-cyan'}
          `}>
             {isActive ? round.words[wordIndex] : '****'}
          </h2>
          
          <div className="mt-4 sm:mt-6 text-[9px] sm:text-xs text-cyan-500/80 font-mono tracking-[0.2em] uppercase z-10 flex items-center shrink-0">
             СЛОВО {wordIndex + 1} ИЗ {round.words.length} <span className="text-white/30 mx-2">//</span> SYNC_ACTIVE
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
