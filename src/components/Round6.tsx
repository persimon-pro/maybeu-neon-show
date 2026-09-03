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
      <div className="w-full h-full p-2 sm:p-4 md:p-5 flex flex-col items-center justify-between overflow-hidden max-w-7xl mx-auto">
        <div className="text-center shrink-0 my-1">
          <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            // {round.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 w-full max-w-4xl flex-1 min-h-0 my-auto py-2">
          {round.themes.map((theme, idx) => (
            <div key={idx} className="glass-panel p-4 sm:p-8 flex items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-emerald-500/20 h-full min-h-0">
               <h2 className="text-base sm:text-xl md:text-3xl font-black text-white uppercase tracking-wider text-center">{theme.theme}</h2>
            </div>
          ))}
        </div>
        
        <div className="shrink-0 text-center text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-[0.2em] my-1">
           ОЖИДАНИЕ ВЫБОРА ТЕМЫ С ПУЛЬТА...
        </div>
      </div>
    );
  }

  const theme = round.themes[currentThemeIndex];

  // View: Grid of words for the selected theme
  if (currentWordIndex === null) {
    return (
      <div className="w-full h-full p-2 sm:p-4 md:p-5 flex flex-col items-center justify-between overflow-hidden max-w-7xl mx-auto">
        <div className="text-center shrink-0 my-1">
          <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-emerald-400">
            Тема: {theme.theme}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-5xl flex-1 min-h-0 my-auto py-2">
          {theme.words.map((_, idx) => (
            <div key={idx} className="glass-panel p-3 sm:p-6 flex items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-500/20 h-full min-h-0">
               <span className="text-sm sm:text-lg md:text-xl font-mono text-slate-300 font-bold">СЛОВО {idx + 1}</span>
            </div>
          ))}
        </div>
        
        <div className="shrink-0 text-center text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-[0.2em] my-1">
           ОЖИДАНИЕ ВЫБОРА СЛОВА С ПУЛЬТА...
        </div>
      </div>
    );
  }

  const word = theme.words[currentWordIndex];

  // View: Active word guessing
  return (
    <div className="w-full h-full p-2 sm:p-4 md:p-5 flex flex-col items-center justify-between overflow-hidden max-w-7xl mx-auto">
      
      <div className="text-center shrink-0 my-1">
        <h1 className="text-base sm:text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-emerald-400">
          {theme.theme}
        </h1>
        <p className="text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-widest">
          Слово {currentWordIndex + 1}
        </p>
      </div>

      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center my-auto py-1">
        <div className="w-full max-w-4xl flex-1 min-h-0 max-h-[60vh] glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden my-auto shadow-2xl">
          
          <div className={`absolute inset-0 bg-emerald-500/5 transition-opacity duration-1000 ${isAnswerRevealed ? 'opacity-100' : 'opacity-0'}`} />
          
          <h2 className={`
             text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-center uppercase transition-all duration-700 z-10 break-words max-w-full leading-tight
             ${isAnswerRevealed 
               ? 'text-white drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]' 
               : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] font-mono glitch-effect'}
          `}>
             {isAnswerRevealed ? word.decoded : word.encoded}
          </h2>
          
          <div className="mt-4 sm:mt-6 text-[9px] sm:text-xs text-emerald-400/50 font-mono tracking-[0.2em] uppercase z-10 flex items-center shrink-0">
             DECRYPTION_MODULE: {isAnswerRevealed ? 'SUCCESS' : 'PENDING'}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-center text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-[0.2em] my-1">
         Управление с пульта ведущего (/host)
      </div>

    </div>
  );
}
