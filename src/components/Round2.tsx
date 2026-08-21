import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round2Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round2({ gameState }: Round2Props) {
  const round = gameData.round2;
  const { itemIndex, isAnswerRevealed, roundEnd } = gameState.round2;

  if (roundEnd) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-32 px-4 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-fuchsia-400 drop-shadow-[0_0_20px_rgba(192,38,211,0.8)] mb-4 sm:mb-8 uppercase tracking-widest">
          Фотографии закончились!
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-fuchsia-400 drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">
          // {round.title}
        </h1>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-8">
        
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-[3rem] p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="relative w-full max-h-[45vh] md:max-h-[55vh] aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
            <img 
              src={currentItem.photo} 
              alt={currentItem.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain transition-all duration-700 ${isAnswerRevealed ? 'scale-100 opacity-90' : 'scale-105 opacity-100'}`}
            />
            {/* Overlay for answer */}
            <div className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-700 ${isAnswerRevealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className={`text-5xl sm:text-7xl md:text-[8rem] font-black text-cyan-400 drop-shadow-[0_0_30px_rgba(0,229,255,0.8)] transition-all duration-700 delay-200 ${isAnswerRevealed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {currentItem.realAge}
              </div>
              <div className={`text-sm sm:text-2xl text-slate-300 font-mono mt-2 sm:mt-4 uppercase tracking-widest transition-opacity duration-700 delay-300 ${isAnswerRevealed ? 'opacity-100' : 'opacity-0'}`}>
                лет
              </div>
            </div>
          </div>

          {/* Actor Name (Always visible under the photo, appearing simultaneously with the picture) */}
          <div className="mt-6 text-center z-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]">
              {currentItem.name}
            </h2>
          </div>
          
          <div className="mt-4 sm:mt-8 text-[8px] sm:text-[10px] text-fuchsia-500/80 font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase z-10 flex items-center">
             ФОТО {itemIndex + 1} ИЗ {round.items.length} <span className="text-white/30 mx-2 sm:mx-3">//</span> BIO_SCAN_ACTIVE
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
