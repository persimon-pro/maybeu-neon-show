import { Routes, Route, Link } from 'react-router-dom';
import { ScoreBoard } from './components/ScoreBoard';
import { MainMenu } from './components/MainMenu';
import { Round1 } from './components/Round1';
import { Round2 } from './components/Round2';
import { Round3 } from './components/Round3';
import { Round4 } from './components/Round4';
import { Round5 } from './components/Round5';
import { Round6 } from './components/Round6';
import { HostPanel } from './components/HostPanel';
import { useGameState } from './useGameState';

function SelectScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="atmosphere" />
      <div className="max-w-3xl w-full flex flex-col gap-6 sm:gap-12 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-cyan-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 sm:mb-4 glow-cyan drop-shadow-md">
            LOFT SHOW
          </h1>
          <p className="font-mono opacity-60 text-xs sm:text-sm uppercase tracking-widest">
            made by LOFT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <Link to="/display" className="glass-panel p-6 sm:p-12 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group hover:glow-cyan">
             <div className="text-5xl sm:text-8xl mb-4 sm:mb-8 opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">📺</div>
             <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-widest mb-1 sm:mb-3">Главный Экран</h2>
             <p className="text-cyan-400/80 font-mono text-xs sm:text-sm text-center uppercase tracking-widest">Проектор / ТВ</p>
          </Link>
          
          <Link to="/host" className="glass-panel p-6 sm:p-12 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
             <div className="text-5xl sm:text-8xl mb-4 sm:mb-8 opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">📱</div>
             <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-widest mb-1 sm:mb-3">Пульт Ведущего</h2>
             <p className="text-emerald-400/80 font-mono text-xs sm:text-sm text-center uppercase tracking-widest">Мобильное Управление</p>
          </Link>
        </div>

        <div className="mt-4 sm:mt-12 p-4 sm:p-6 glass-panel rounded-lg sm:rounded-xl text-center">
          <p className="text-slate-400 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed">
            Для управления с другого устройства:<br/>
            1. Убедитесь, что оба устройства в одной локальной сети.<br/>
            2. Откройте адрес этого сервера в браузере мобильного устройства.<br/>
            3. Выберите "Пульт Ведущего".
          </p>
        </div>
      </div>
    </div>
  );
}

const renderSidebarName = (name: string, type: 'teams' | 'players', isOdd: boolean) => {
  const labelColor = isOdd ? 'text-cyan-500/70' : 'text-purple-400/70';
  const label = type === 'teams' ? 'Команда' : 'Участник';
  
  if (name === `${label} ${name.split(' ')[1]}`) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className={`text-[10px] uppercase font-black tracking-widest ${labelColor}`}>
          {label}
        </span>
        <span className="text-lg font-black text-white leading-none">
          {name.split(' ')[1]}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-[9px] uppercase font-black tracking-widest opacity-60 ${labelColor}`}>
        {label}
      </span>
      <span className="text-lg font-black text-white leading-none uppercase truncate max-w-[150px]">
        {name}
      </span>
    </div>
  );
};

function Display() {
  const { gameState, dispatch } = useGameState();

  if (!gameState) {
    return <div className="min-h-screen text-white flex items-center justify-center font-mono text-xl">CONNECTING TO NEURAL CORE...</div>;
  }

  const handleUpdateScore = (teamId: number, delta: number) => {
    dispatch({ type: 'UPDATE_SCORE', team: teamId, delta });
  };

  const renderRound = () => {
    switch (gameState.currentRound) {
      case 1:
        return <Round1 gameState={gameState} dispatch={dispatch} />;
      case 2:
        return <Round2 gameState={gameState} dispatch={dispatch} />;
      case 3:
        return <Round3 gameState={gameState} dispatch={dispatch} />;
      case 4:
        return <Round4 gameState={gameState} dispatch={dispatch} />;
      case 5:
        return <Round5 gameState={gameState} dispatch={dispatch} />;
      case 6:
        return <Round6 gameState={gameState} dispatch={dispatch} />;
      default:
        return <MainMenu onSelectRound={(r) => dispatch({ type: 'SET_ROUND', round: r })} />;
    }
  };

  const showSidebar = gameState.currentRound !== null && gameState.gameSettings?.isConfigured;

  return (
    <div className="min-h-screen font-sans selection:bg-cyan-500/30">
      <ScoreBoard 
        gameSettings={gameState.gameSettings} 
        onGoHome={() => dispatch({ type: 'SET_ROUND', round: null })}
      />
      
      <main className={`relative z-10 w-full h-full transition-all duration-300 ${showSidebar ? 'pr-0 lg:pr-80' : ''}`}>
        {renderRound()}
      </main>

      {showSidebar && (
        <aside className="fixed right-4 top-20 md:top-28 bottom-4 w-72 z-40 glass-panel p-6 flex flex-col border border-white/10 shadow-2xl rounded-2xl overflow-y-auto animate-fade-in">
          <div className="border-b border-white/10 pb-3 mb-4 text-center">
            <h3 className="text-xs uppercase font-mono tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] font-bold">
              ТАБЛИЦА ЛИДЕРОВ
            </h3>
            <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest mt-1">
              // Текущий счет
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {gameState.gameSettings.participants.map((p) => (
              <div 
                key={p.id} 
                className={`
                  flex items-center justify-between p-3 rounded-xl border bg-white/5 shadow-md transition-all
                  ${p.id % 2 === 1 
                    ? 'border-cyan-500/20 shadow-cyan-500/5 hover:border-cyan-500/40 hover:shadow-cyan-500/10' 
                    : 'border-purple-500/20 shadow-purple-500/5 hover:border-purple-500/40 hover:shadow-purple-500/10'}
                `}
              >
                {renderSidebarName(p.name, gameState.gameSettings.type, p.id % 2 === 1)}
                <span 
                  className={`
                    text-3xl font-black font-mono tracking-wider
                    ${p.id % 2 === 1 
                      ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]' 
                      : 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]'}
                  `}
                >
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </aside>
      )}
      
      {/* Global Background Elements */}
      <div className="atmosphere" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectScreen />} />
      <Route path="/display" element={<Display />} />
      <Route path="/host" element={<HostPanel />} />
    </Routes>
  );
}
