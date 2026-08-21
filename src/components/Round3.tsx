import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round3Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round3({ gameState }: Round3Props) {
  const round = gameData.round3;
  const { themeIndex, timeLeft, isActive, roundEnd } = gameState.round3;

  if (roundEnd) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)] mb-4 sm:mb-8 uppercase tracking-widest">
          Темы закончились!
        </h2>
        <div className="text-sm sm:text-xl text-slate-400 font-mono tracking-widest uppercase">
           ОЖИДАНИЕ ПУЛЬТА ВЕДУЩЕГО...
        </div>
      </div>
    );
  }

  const currentTheme = round.themes[themeIndex];

  return (
    <div className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-12 px-4 sm:px-8 min-h-screen flex flex-col items-center justify-between max-w-[1920px] mx-auto">
      
      {/* Title & Rules */}
      <div className="text-center mt-2 sm:mt-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
          // {round.title}
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-8">
        
        {/* Timer */}
        <div className={`
          text-5xl sm:text-7xl md:text-[10rem] font-mono font-black mb-6 sm:mb-10 md:mb-12 transition-colors duration-300 leading-none
          ${timeLeft <= 5 ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] status-pulse' : 'text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]'}
        `}>
          00:{timeLeft.toString().padStart(2, '0')}
        </div>

        {/* Theme Display */}
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 md:p-16 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute inset-0 bg-rose-500/5 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          <h2 className={`
             text-2xl sm:text-5xl md:text-[5rem] lg:text-[6rem] xl:text-[8rem] font-black tracking-tight text-white transition-all duration-300 z-10 text-center uppercase break-words leading-tight max-w-full
             ${!isActive && timeLeft === 60 ? 'opacity-50' : 'opacity-100'}
             ${isActive ? 'drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]' : ''}
          `}>
             {currentTheme}
          </h2>
          
          <div className="mt-6 sm:mt-12 text-[8px] sm:text-[10px] text-rose-500/80 font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase z-10 flex items-center">
             ТЕМА {themeIndex + 1} ИЗ {round.themes.length} <span className="text-white/30 mx-2 sm:mx-3">//</span> VOCAL_TRACKING_ACTIVE
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
