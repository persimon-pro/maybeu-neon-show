import { GameSettings } from '../types';

interface ScoreBoardProps {
  gameSettings: GameSettings;
  onGoHome: () => void;
}

export function ScoreBoard({ onGoHome }: ScoreBoardProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-16 md:h-24 glass-panel flex items-center justify-center px-3 sm:px-6 md:px-8 z-50">
      
      {/* Center - Home Button */}
      <button 
        onClick={onGoHome}
        className="group flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all mx-2 shrink-0"
      >
        <span className="text-xs sm:text-lg md:text-2xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">
          MAYBEU SHOW
        </span>
      </button>

    </div>
  );
}
