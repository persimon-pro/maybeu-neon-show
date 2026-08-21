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
    <div className="pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-16 px-4 sm:px-8 md:px-12 min-h-screen flex flex-col items-center max-w-[1920px] mx-auto">
      <div className="mb-8 sm:mb-16 flex flex-col items-center">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-cyan-400 tracking-[0.1em] sm:tracking-[0.2em] uppercase glow-cyan drop-shadow-md text-center">
          ВЫБЕРИТЕ РАУНД
        </h1>
        <p className="text-[8px] sm:text-[10px] font-mono opacity-50 mt-2 sm:mt-4 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
          made by LOFT
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10 w-full max-w-7xl">
        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => onSelectRound(round.id)}
            className={`
              glass-panel group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 
              transition-all duration-300 hover:scale-[1.03] hover:glow-cyan
              flex flex-col items-center justify-center text-center h-40 sm:h-52 md:h-64
            `}
          >
            {/* Background gradient effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-cyan-500`} />
            
            <div className={`
              text-3xl sm:text-5xl md:text-7xl font-black mb-1 sm:mb-4 opacity-30 group-hover:opacity-100 transition-opacity
              text-cyan-500 font-mono
            `}>
              0{round.id}
            </div>
            
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-wider sm:tracking-widest uppercase">
              {round.data.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
}
