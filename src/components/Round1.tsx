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
      <div className="pt-20 sm:pt-24 md:pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(0,229,255,0.8)] mb-4 sm:mb-8 uppercase tracking-widest">
          Слова закончились!
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-cyan-400">
          // {round.title}
        </h1>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-8">
        {/* Timer */}
        <div className={`
          text-5xl sm:text-7xl md:text-9xl font-mono font-black mb-6 sm:mb-10 md:mb-16 transition-colors duration-300
          ${timeLeft <= 5 ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] status-pulse' : 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]'}
        `}>
          00:{timeLeft.toString().padStart(2, '0')}
        </div>

        {/* Word Display */}
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 md:p-16 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle neon glow inside card based on active state */}
          <div className={`absolute inset-0 bg-cyan-500/5 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          <h2 className={`
             text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8rem] font-black tracking-tight text-white transition-all duration-300 z-10 text-center uppercase break-all
             ${!isActive ? 'blur-md opacity-30 select-none' : 'blur-0 opacity-100 glow-cyan'}
          `}>
             {isActive ? round.words[wordIndex] : '****'}
          </h2>
          
          <div className="mt-6 sm:mt-12 text-[8px] sm:text-[10px] text-cyan-500/80 font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase z-10 flex items-center">
             СЛОВО {wordIndex + 1} ИЗ {round.words.length} <span className="text-white/30 mx-2 sm:mx-3">//</span> SYNC_ACTIVE
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
