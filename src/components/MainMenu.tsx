import { gameData } from '../data';

interface MainMenuProps {
  onSelectRound: (roundNumber: number) => void;
}

export function MainMenu({ onSelectRound }: MainMenuProps) {
  const rounds = [
    { id: 1, data: gameData.round1, color: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/50" },
    { id: 2, data: gameData.round2, color: "from-fuchsia-500 to-purple-600", shadow: "shadow-fuchsia-500/50" },
    { id: 3, data: gameData.round3, color: "from-emerald-400 to-teal-600", shadow: "shadow-emerald-500/50" },
    { id: 4, data: gameData.round4, color: "from-amber-400 to-orange-600", shadow: "shadow-amber-500/50" },
    { id: 5, data: gameData.round5, color: "from-rose-500 to-red-700", shadow: "shadow-rose-500/50" },
    { id: 6, data: gameData.round6, color: "from-indigo-400 to-violet-600", shadow: "shadow-indigo-500/50" },
  ];

  return (
    <div className="w-full h-full p-3 sm:p-5 md:p-6 flex flex-col items-center justify-between overflow-hidden max-w-7xl mx-auto">
      <div className="text-center shrink-0 my-1 sm:my-2">
        <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-cyan-400 tracking-[0.15em] uppercase glow-cyan drop-shadow-md">
          ВЫБЕРИТЕ РАУНД
        </h1>
        <p className="text-[8px] sm:text-[10px] font-mono opacity-50 mt-1 uppercase tracking-[0.25em]">
          made by LOFT
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 w-full flex-1 min-h-0 my-auto py-2">
        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => onSelectRound(round.id)}
            className="glass-panel group relative overflow-hidden rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:glow-cyan flex flex-col items-center justify-center text-center h-full min-h-0 cursor-pointer"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-cyan-500" />
            
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1 opacity-30 group-hover:opacity-100 transition-opacity text-cyan-500 font-mono">
              0{round.id}
            </div>
            
            <h3 className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-white tracking-wider uppercase line-clamp-2">
              {round.data.title}
            </h3>
          </button>
        ))}
      </div>

      <div className="shrink-0 text-center text-[9px] sm:text-[11px] font-mono opacity-40 uppercase tracking-[0.2em] my-1">
        Управление с пульта ведущего (/host)
      </div>
    </div>
  );
}
