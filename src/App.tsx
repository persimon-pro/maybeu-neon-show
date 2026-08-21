import { Routes, Route, Link } from 'react-router-dom';
import { ScoreBoard } from './components/ScoreBoard';
import { MainMenu } from './components/MainMenu';
import { Round1 } from './components/Round1';
import { Round2 } from './components/Round2';
import { Round3 } from './components/Round3';
import { Round4 } from './components/Round4';
import { Round5 } from './components/Round5';
import { Round6 } from './components/Round6';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HostPanel } from './components/HostPanel';
import { useGameState } from './useGameState';

function SelectScreen() {
  const [hostUrl, setHostUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostUrl(`${window.location.origin}/host`);
    }
  }, []);

  const handleCopy = () => {
    if (hostUrl) {
      navigator.clipboard.writeText(hostUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="atmosphere" />
      <div className="max-w-4xl w-full flex flex-col gap-6 sm:gap-8 relative z-10 py-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-cyan-400 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-2 glow-cyan drop-shadow-md">
            LOFT SHOW
          </h1>
          <p className="font-mono opacity-60 text-xs sm:text-sm uppercase tracking-widest">
            made by LOFT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link to="/display" className="glass-panel p-6 sm:p-10 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center hover:scale-[1.02] transition-all duration-300 group hover:glow-cyan">
             <div className="text-5xl sm:text-7xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">📺</div>
             <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-widest mb-1 sm:mb-2">Главный Экран</h2>
             <p className="text-cyan-400/80 font-mono text-xs sm:text-sm text-center uppercase tracking-widest">Проектор / ТВ</p>
          </Link>
          
          <Link to="/host" className="glass-panel p-6 sm:p-10 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center hover:scale-[1.02] transition-all duration-300 group hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
             <div className="text-5xl sm:text-7xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">📱</div>
             <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-widest mb-1 sm:mb-2">Пульт Ведущего</h2>
             <p className="text-emerald-400/80 font-mono text-xs sm:text-sm text-center uppercase tracking-widest">Открыть в этом браузере</p>
          </Link>
        </div>

        {/* QR Code Section for Host Connection */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
            {hostUrl ? (
              <QRCodeSVG 
                value={hostUrl} 
                size={140}
                bgColor="#ffffff"
                fgColor="#050505"
                level="M"
              />
            ) : (
              <div className="w-[140px] h-[140px] bg-slate-900 animate-pulse rounded-xl" />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className="text-base sm:text-lg font-bold text-emerald-400 uppercase tracking-widest font-mono">
                QR-код для пульта ведущего
              </h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              Наведите камеру смартфона на QR-код, чтобы мгновенно открыть пульт управления игрой на мобильном устройстве.
            </p>
            {hostUrl && (
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <code className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-emerald-300 text-[11px] sm:text-xs font-mono truncate max-w-full">
                  {hostUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  {copied ? '✓ Скопировано' : 'Копировать'}
                </button>
              </div>
            )}
          </div>
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
