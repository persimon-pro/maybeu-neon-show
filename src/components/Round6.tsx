import { gameData } from '../data';
import { ServerGameState } from '../types';

interface Round6Props {
  gameState: ServerGameState;
  dispatch: (action: any) => void;
}

export function Round6({ gameState }: Round6Props) {
  const round = gameData.round6;
  const { currentThemeIndex, currentWordIndex, isAnswerRevealed } = gameState.round6;

  // View: Grid of themes if no theme selected
  if (currentThemeIndex === null) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-12 px-4 sm:px-8 min-h-screen flex flex-col items-center justify-start max-w-[1920px] mx-auto">
        <div className="text-center mt-2 sm:mt-4 mb-8 sm:mb-16">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            // {round.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-5xl">
          {round.themes.map((theme, idx) => (
            <div key={idx} className="glass-panel p-6 sm:p-12 flex items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-emerald-500/20">
               <h2 className="text-lg sm:text-2xl md:text-4xl font-black text-white uppercase tracking-wider sm:tracking-widest text-center">{theme.theme}</h2>
            </div>
          ))}
        </div>
        
        <div className="mt-10 sm:mt-20 text-[8px] sm:text-[10px] font-mono opacity-50 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
           ОЖИДАНИЕ ВЫБОРА...
        </div>
      </div>
    );
  }

  const theme = round.themes[currentThemeIndex];

  // View: Grid of words for the selected theme
  if (currentWordIndex === null) {
    return (
      <div className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-12 px-4 sm:px-8 min-h-screen flex flex-col items-center justify-start max-w-[1920px] mx-auto">
        <div className="text-center mt-2 sm:mt-4 mb-8 sm:mb-16">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-emerald-400 mb-2 sm:mb-4">
            Тема: {theme.theme}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-6xl">
          {theme.words.map((word, idx) => (
            <div key={idx} className="glass-panel p-4 sm:p-8 flex items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-500/10 h-20 sm:h-28 md:h-32">
               <span className="text-sm sm:text-xl md:text-2xl font-mono opacity-30">СЛОВО {idx + 1}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-10 sm:mt-20 text-[8px] sm:text-[10px] font-mono opacity-50 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
           ОЖИДАНИЕ ВЫБОРА СЛОВА...
        </div>
      </div>
    );
  }

  const word = theme.words[currentWordIndex];

  // View: Active word guessing
  return (
    <div className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-12 px-4 sm:px-8 min-h-screen flex flex-col items-center justify-between max-w-[1920px] mx-auto">
      
      <div className="text-center mt-2 sm:mt-4">
        <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-emerald-400/50 mb-1 sm:mb-2">
          {theme.theme}
        </h1>
        <p className="text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-widest">
          Слово {currentWordIndex + 1}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 sm:mt-8">
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 md:p-16 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px] md:h-[400px]">
          
          <div className={`absolute inset-0 bg-emerald-500/5 transition-opacity duration-1000 ${isAnswerRevealed ? 'opacity-100' : 'opacity-0'}`} />
          
          <h2 className={`
             text-3xl sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-9xl font-black tracking-tight text-center uppercase transition-all duration-700 z-10 break-all
             ${isAnswerRevealed 
               ? 'text-white drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]' 
               : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] font-mono glitch-effect'}
          `}>
             {isAnswerRevealed ? word.decoded : word.encoded}
          </h2>
          
          <div className="mt-6 sm:mt-12 text-[8px] sm:text-[10px] text-emerald-400/50 font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase z-10 flex items-center">
             DECRYPTION_MODULE: {isAnswerRevealed ? 'SUCCESS' : 'PENDING'}
          </div>
        </div>
      </div>

    </div>
  );
}
