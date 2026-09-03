import { useState, useEffect } from 'react';
import { useGameState } from '../useGameState';
import { gameData } from '../data';

const getRoundName = (roundNum: number): string => {
  switch (roundNum) {
    case 1: return gameData.round1.title;
    case 2: return gameData.round2.title;
    case 3: return gameData.round3.title;
    case 4: return gameData.round4.title;
    case 5: return gameData.round5.title;
    case 6: return gameData.round6.title;
    default: return `Раунд ${roundNum}`;
  }
};

export function HostPanel() {
  const { gameState, dispatch, isConnected, roomId, changeRoom } = useGameState('host');
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [configType, setConfigType] = useState<'teams' | 'players'>('teams');
  const [configCount, setConfigCount] = useState<number>(2);
  const [customNames, setCustomNames] = useState<string[]>([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomInput, setRoomInput] = useState(roomId);

  useEffect(() => {
    setRoomInput(roomId);
  }, [roomId]);

  useEffect(() => {
    setCustomNames(prev => {
      const next = [...prev];
      if (next.length > configCount) {
        return next.slice(0, configCount);
      }
      while (next.length < configCount) {
        const i = next.length;
        next.push(configType === 'teams' ? `Команда ${i + 1}` : `Участник ${i + 1}`);
      }
      return next;
    });
  }, [configCount]);

  useEffect(() => {
    setCustomNames(
      Array.from({ length: configCount }, (_, i) => 
        configType === 'teams' ? `Команда ${i + 1}` : `Участник ${i + 1}`
      )
    );
  }, [configType]);

  if (!gameState) {
    return <div className="text-white p-8 font-sans">Подключение к серверу...</div>;
  }

  const handleScore = (team: number, delta: number) => {
    dispatch({ type: 'UPDATE_SCORE', team, delta });
  };

  const handleRoundSelect = (round: number | null) => {
    dispatch({ type: 'SET_ROUND', round });
    setIsMenuExpanded(false);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim()) {
      changeRoom(roomInput.trim());
      setShowRoomModal(false);
    }
  };

  const renderRoomModal = () => {
    if (!showRoomModal) return null;
    return (
      <div 
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setShowRoomModal(false)}
      >
        <div 
          className="bg-slate-950 border border-white/20 rounded-2xl p-6 max-w-xs w-full flex flex-col gap-4 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-cyan-400">
            Комната подключения
          </h3>
          <p className="text-xs text-slate-300">
            Для управления главный экран и пульт должны находиться в одной комнате.
          </p>
          <form onSubmit={handleSaveRoom} className="flex flex-col gap-3">
            <input 
              type="text" 
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
              placeholder="loft_main"
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  changeRoom('loft_main');
                  setRoomInput('loft_main');
                  setShowRoomModal(false);
                }}
                className="flex-1 py-2 text-xs font-mono rounded-lg bg-white/10 text-slate-300 hover:bg-white/15"
              >
                Сброс (loft_main)
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-mono font-bold rounded-lg bg-cyan-500 text-black hover:bg-cyan-400"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!gameState.gameSettings || !gameState.gameSettings.isConfigured) {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-sans max-w-md mx-auto flex flex-col justify-center gap-6">
        {renderRoomModal()}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider mb-3 border border-white/10 bg-white/5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={isConnected ? 'text-emerald-400' : 'text-amber-300'}>
              {isConnected ? `Связь: ${roomId}` : `Поиск экрана (${roomId})...`}
            </span>
            <button 
              onClick={() => { setRoomInput(roomId); setShowRoomModal(true); }}
              className="text-slate-400 hover:text-cyan-400 text-[10px] underline ml-1 cursor-pointer"
            >
              Сменить
            </button>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-widest mb-1 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Настройка игры
          </h1>
          <p className="text-xs font-mono opacity-55 uppercase tracking-widest">LOFT SHOW</p>
        </div>

        {/* Game Mode */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block">Режим игры:</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setConfigType('teams')}
              className={`py-3.5 rounded-xl border font-bold uppercase transition-all active:scale-95 cursor-pointer ${
                configType === 'teams'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              👥 Команды
            </button>
            <button
              onClick={() => setConfigType('players')}
              className={`py-3.5 rounded-xl border font-bold uppercase transition-all active:scale-95 cursor-pointer ${
                configType === 'players'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              👤 Участники
            </button>
          </div>
        </div>

        {/* Count Selection */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block font-semibold">
            Количество {configType === 'teams' ? 'команд' : 'участников'}:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                onClick={() => setConfigCount(count)}
                className={`py-2 rounded-lg border font-mono font-bold transition-all active:scale-90 cursor-pointer ${
                  configCount === count
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Names Inputs */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400 block font-semibold">
            Названия / Имена участников:
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 border border-white/5 bg-white/5 rounded-xl p-3">
            {customNames.map((name, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 w-5 text-right">#{idx + 1}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const nextNames = [...customNames];
                    nextNames[idx] = e.target.value;
                    setCustomNames(nextNames);
                  }}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium"
                  placeholder={configType === 'teams' ? `Команда ${idx + 1}` : `Участник ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => dispatch({ type: 'CONFIGURE_GAME', mode: configType, count: configCount, names: customNames })}
          className="w-full bg-cyan-500 text-black font-black py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95 transition-all mt-2 cursor-pointer"
        >
          Начать игру 🎮
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans max-w-md mx-auto">
      <div className="flex flex-col gap-3 mb-6 border-b border-white/10 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 uppercase tracking-wider">
            Пульт ведущего
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => dispatch({ type: 'RESET_SCORES' })}
              className="text-xs border border-amber-500/30 text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg font-bold hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              Сброс 🔄
            </button>
            <button 
              onClick={() => dispatch({ type: 'RESET_GAME_SETTINGS' })}
              className="text-xs border border-red-500/30 text-red-400 bg-red-500/10 px-2.5 py-1.5 rounded-lg font-bold hover:bg-red-500/20 active:scale-95 transition-all"
            >
              Настройки ⚙️
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
            isConnected 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isConnected ? `Связь: ${roomId}` : `Поиск экрана: ${roomId}...`}
          </span>
          <button 
            onClick={() => { setRoomInput(roomId); setShowRoomModal(true); }}
            className="text-slate-400 hover:text-cyan-400 text-[10px] underline font-mono cursor-pointer"
          >
            Комната
          </button>
        </div>
      </div>
      {renderRoomModal()}

      {/* Score Controls */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {gameState.gameSettings.participants.map((p) => (
          <div key={p.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <h2 className={`text-xs font-mono mb-1 uppercase ${p.id % 2 === 1 ? 'text-cyan-500' : 'text-purple-400'}`}>
                {p.name}
              </h2>
              <div className="text-3xl font-bold mb-3 font-mono">{p.score}</div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => handleScore(p.id, -1)} 
                className="flex-1 bg-red-500/20 text-red-400 py-1.5 rounded font-bold hover:bg-red-500/30 text-xs active:scale-90 transition-transform"
              >
                -1
              </button>
              <button 
                onClick={() => handleScore(p.id, 1)} 
                className="flex-1 bg-emerald-500/20 text-emerald-400 py-1.5 rounded font-bold hover:bg-emerald-500/30 text-xs active:scale-90 transition-transform"
              >
                +1
              </button>
              <button 
                onClick={() => handleScore(p.id, 5)} 
                className="flex-1 bg-emerald-500/40 text-emerald-400 py-1.5 rounded font-bold hover:bg-emerald-500/50 text-xs active:scale-90 transition-transform"
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Round Selection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs uppercase tracking-widest text-white/50">Текущий раунд: {gameState.currentRound === null ? 'Главное меню' : getRoundName(gameState.currentRound)}</h3>
          {gameState.currentRound !== null && (
            <button 
              onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              className="text-xs text-cyan-400 uppercase tracking-widest hover:text-cyan-300"
            >
              {isMenuExpanded ? 'Скрыть меню' : 'Сменить раунд'}
            </button>
          )}
        </div>
        
        {(gameState.currentRound === null || isMenuExpanded) && (
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleRoundSelect(null)}
              className={`py-3 rounded text-sm ${gameState.currentRound === null ? 'bg-cyan-500 text-black font-bold' : 'bg-white/10'}`}
            >
              Главное меню
            </button>
            {[1,2,3,4,5,6].map(r => (
              <button 
                key={r}
                onClick={() => handleRoundSelect(r)}
                className={`py-3 rounded text-xs px-1 text-center font-bold break-words min-h-[50px] flex items-center justify-center ${gameState.currentRound === r ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white'}`}
              >
                {getRoundName(r)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Round Specific Controls */}
      {gameState.currentRound === 1 && (
        <div className="bg-white/5 p-4 rounded-xl border border-cyan-500/30">
          <h3 className="text-cyan-400 font-bold mb-4 uppercase tracking-widest">Управление: {getRoundName(1)}</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-3xl font-mono">{gameState.round1.timeLeft} сек</div>
            <div className="text-xs font-mono text-white/50">Слово {gameState.round1.wordIndex + 1}/{gameData.round1.words.length}</div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Текущее слово</div>
            <div className="text-2xl font-bold text-white bg-black p-4 rounded border border-white/10">
               {gameData.round1.words[gameState.round1.wordIndex] || 'Конец'}
            </div>
          </div>

          {!gameState.round1.roundEnd ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {!gameState.round1.isActive ? (
                <button 
                  onClick={() => dispatch({ type: 'R1_START' })}
                  className="col-span-2 bg-emerald-500 text-black font-bold py-4 rounded-lg uppercase"
                >
                  Старт таймера
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => dispatch({ type: 'R1_PAUSE' })}
                    className="bg-amber-500 text-black font-bold py-4 rounded-lg uppercase"
                  >
                    Пауза
                  </button>
                  <button 
                    onClick={() => dispatch({ type: 'R1_NEXT_WORD' })}
                    className="bg-cyan-500 text-black font-bold py-4 rounded-lg uppercase"
                  >
                    След. слово (Угадано/Пропуск)
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-red-400 mb-4 font-bold">Раунд завершен</div>
          )}

          <button 
            onClick={() => dispatch({ type: 'R1_RESET' })}
            className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-lg uppercase text-sm mt-4 hover:bg-red-500/10"
          >
            Сброс раунда
          </button>
        </div>
      )}

      {gameState.currentRound === 2 && (
        <div className="bg-white/5 p-4 rounded-xl border border-fuchsia-500/30">
          <h3 className="text-fuchsia-400 font-bold mb-4 uppercase tracking-widest">Управление: {getRoundName(2)}</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs font-mono text-white/50">Фото {gameState.round2.itemIndex + 1}/{gameData.round2.items.length}</div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Текущая звезда</div>
            <div className="text-xl font-bold text-white bg-black p-4 rounded border border-white/10 uppercase">
               {gameData.round2.items[gameState.round2.itemIndex]?.name || 'Конец'}
            </div>
          </div>

          {!gameState.round2.roundEnd ? (
            <div className="flex flex-col gap-3 mb-4">
              {!gameState.round2.isAnswerRevealed ? (
                <button 
                  onClick={() => dispatch({ type: 'R2_REVEAL_ANSWER' })}
                  className="bg-fuchsia-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                >
                  Показать ответ
                </button>
              ) : (
                <div className="text-center space-y-4 border border-fuchsia-500/30 bg-fuchsia-500/10 p-4 rounded-xl">
                  <div className="text-sm text-fuchsia-300 uppercase tracking-widest mb-1">Настоящий возраст</div>
                  <div className="text-4xl font-bold text-white mb-4">{gameData.round2.items[gameState.round2.itemIndex]?.realAge}</div>
                  <button 
                    onClick={() => dispatch({ type: 'R2_NEXT_ITEM' })}
                    className="bg-cyan-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                  >
                    Следующее фото
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-400 mb-4 font-bold">Раунд завершен</div>
          )}

          <button 
            onClick={() => dispatch({ type: 'R2_RESET' })}
            className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-lg uppercase text-sm mt-4 hover:bg-red-500/10"
          >
            Сброс раунда
          </button>
        </div>
      )}

      {gameState.currentRound === 3 && (
        <div className="bg-white/5 p-4 rounded-xl border border-rose-500/30">
          <h3 className="text-rose-400 font-bold mb-4 uppercase tracking-widest">Управление: {getRoundName(3)}</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-3xl font-mono">{gameState.round3.timeLeft} сек</div>
            <div className="text-xs font-mono text-white/50">Тема {gameState.round3.themeIndex + 1}/{gameData.round3.themes.length}</div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Текущая тема</div>
            <div className="text-xl font-bold text-white bg-black p-4 rounded border border-white/10 uppercase">
               {gameData.round3.themes[gameState.round3.themeIndex] || 'Конец'}
            </div>
          </div>

          {!gameState.round3.roundEnd ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {!gameState.round3.isActive && gameState.round3.timeLeft === 60 ? (
                <button 
                  onClick={() => dispatch({ type: 'R3_START' })}
                  className="col-span-2 bg-rose-500 text-black font-bold py-4 rounded-lg uppercase"
                >
                  Старт таймера (60 сек)
                </button>
              ) : (
                <>
                  {!gameState.round3.isActive ? (
                    <button 
                      onClick={() => dispatch({ type: 'R3_START' })}
                      className="bg-emerald-500 text-black font-bold py-4 rounded-lg uppercase"
                    >
                      Продолжить
                    </button>
                  ) : (
                    <button 
                      onClick={() => dispatch({ type: 'R3_PAUSE' })}
                      className="bg-amber-500 text-black font-bold py-4 rounded-lg uppercase"
                    >
                      Пауза
                    </button>
                  )}
                  
                  <button 
                    onClick={() => dispatch({ type: 'R3_NEXT_THEME' })}
                    className="bg-cyan-500 text-black font-bold py-4 rounded-lg uppercase"
                  >
                    След. тема
                  </button>

                  <button 
                    onClick={() => dispatch({ type: 'R3_RESET_TIME' })}
                    className="col-span-2 bg-rose-500/20 text-rose-300 font-bold py-4 rounded-lg uppercase border border-rose-500/50"
                  >
                    Сброс таймера (60 сек)
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-red-400 mb-4 font-bold">Раунд завершен</div>
          )}

          <button 
            onClick={() => dispatch({ type: 'R3_RESET' })}
            className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-lg uppercase text-sm mt-4 hover:bg-red-500/10"
          >
            Сброс раунда
          </button>
        </div>
      )}

      {gameState.currentRound === 4 && (
        <div className="bg-white/5 p-4 rounded-xl border border-amber-500/30">
          <h3 className="text-amber-400 font-bold mb-4 uppercase tracking-widest">Управление: {getRoundName(4)}</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs font-mono text-white/50">Фото {gameState.round4.itemIndex + 1}/{gameData.round4.items.length}</div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Ответ</div>
            <div className="text-lg font-bold text-white bg-black p-4 rounded border border-white/10 uppercase">
               {gameData.round4.items[gameState.round4.itemIndex]?.description || 'Конец'}
            </div>
          </div>

          {!gameState.round4.roundEnd ? (
            <div className="flex flex-col gap-3 mb-4">
              {!gameState.round4.isAnswerRevealed ? (
                <button 
                  onClick={() => dispatch({ type: 'R4_REVEAL_ANSWER' })}
                  className="bg-amber-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                >
                  Показать ответ
                </button>
              ) : (
                <div className="text-center space-y-4 border border-amber-500/30 bg-amber-500/10 p-4 rounded-xl">
                  <div className="text-sm text-amber-300 uppercase tracking-widest mb-1">Ответ показан</div>
                  <button 
                    onClick={() => dispatch({ type: 'R4_NEXT_ITEM' })}
                    className="bg-cyan-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                  >
                    Следующее фото
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-400 mb-4 font-bold">Раунд завершен</div>
          )}

          <button 
            onClick={() => dispatch({ type: 'R4_RESET' })}
            className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-lg uppercase text-sm mt-4 hover:bg-red-500/10"
          >
            Сброс раунда
          </button>
        </div>
      )}

      {gameState.currentRound === 5 && (
        <div className="bg-white/5 p-4 rounded-xl border border-indigo-500/30">
          <h3 className="text-indigo-400 font-bold mb-4 uppercase tracking-widest">Управление: {getRoundName(5)}</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs font-mono text-white/50">Кадр {gameState.round5.itemIndex + 1}/{gameData.round5.items.length}</div>
          </div>

          <div className="text-center mb-6">
            <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Фильм</div>
            <div className="text-lg font-bold text-white bg-black p-4 rounded border border-white/10 uppercase">
               {gameData.round5.items[gameState.round5.itemIndex]?.title || 'Конец'}
            </div>
          </div>

          {!gameState.round5.roundEnd ? (
            <div className="flex flex-col gap-3 mb-4">
              {!gameState.round5.isAnswerRevealed ? (
                <button 
                  onClick={() => dispatch({ type: 'R5_REVEAL_ANSWER' })}
                  className="bg-indigo-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                >
                  Показать ответ
                </button>
              ) : (
                <div className="text-center space-y-4 border border-indigo-500/30 bg-indigo-500/10 p-4 rounded-xl">
                  <div className="text-sm text-indigo-300 uppercase tracking-widest mb-1">Ответ показан</div>
                  <button 
                    onClick={() => dispatch({ type: 'R5_NEXT_ITEM' })}
                    className="bg-cyan-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                  >
                    Следующий кадр
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-400 mb-4 font-bold">Раунд завершен</div>
          )}

          <button 
            onClick={() => dispatch({ type: 'R5_RESET' })}
            className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-lg uppercase text-sm mt-4 hover:bg-red-500/10"
          >
            Сброс раунда
          </button>
        </div>
      )}

      {gameState.currentRound === 6 && (
        <div className="bg-white/5 p-4 rounded-xl border border-emerald-500/30">
          <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-widest">Управление: {getRoundName(6)}</h3>
          
          {gameState.round6.currentThemeIndex === null ? (
            <div>
              <div className="text-xs text-white/50 mb-3 uppercase tracking-widest">Выберите тему:</div>
              <div className="grid grid-cols-2 gap-2">
                 {gameData.round6.themes.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => dispatch({ type: 'R6_SET_THEME', index: idx })}
                      className="bg-emerald-500 text-black font-bold py-3 rounded uppercase text-xs"
                    >
                      {t.theme}
                    </button>
                 ))}
              </div>
            </div>
          ) : gameState.round6.currentWordIndex === null ? (
            <div>
              <div className="flex justify-between items-center mb-3">
                 <div className="text-xs text-white/50 uppercase tracking-widest">Тема: {gameData.round6.themes[gameState.round6.currentThemeIndex].theme}</div>
                 <button onClick={() => dispatch({ type: 'R6_RESET' })} className="text-xs text-red-400 uppercase">Сброс темы</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 {gameData.round6.themes[gameState.round6.currentThemeIndex].words.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => dispatch({ type: 'R6_SET_WORD', index: idx })}
                      className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold py-3 rounded uppercase text-xs"
                    >
                      Слово {idx + 1}
                    </button>
                 ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3">
                 <div className="text-xs text-white/50 uppercase tracking-widest">Тема: {gameData.round6.themes[gameState.round6.currentThemeIndex].theme}</div>
                 <button onClick={() => dispatch({ type: 'R6_SET_THEME', index: gameState.round6.currentThemeIndex })} className="text-xs text-red-400 uppercase">Назад к словам</button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Зашифровано</div>
                <div className="text-lg font-bold text-red-400 bg-black p-4 rounded border border-white/10 uppercase mb-2">
                   {gameData.round6.themes[gameState.round6.currentThemeIndex].words[gameState.round6.currentWordIndex].encoded}
                </div>
                
                {gameState.round6.isAnswerRevealed && (
                  <>
                    <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Ответ</div>
                    <div className="text-lg font-bold text-emerald-400 bg-black p-4 rounded border border-white/10 uppercase">
                       {gameData.round6.themes[gameState.round6.currentThemeIndex].words[gameState.round6.currentWordIndex].decoded}
                    </div>
                  </>
                )}
              </div>

              {!gameState.round6.isAnswerRevealed ? (
                <button 
                  onClick={() => dispatch({ type: 'R6_REVEAL_ANSWER' })}
                  className="bg-emerald-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                >
                  Показать ответ
                </button>
              ) : (
                <button 
                  onClick={() => dispatch({ type: 'R6_SET_THEME', index: gameState.round6.currentThemeIndex })}
                  className="bg-cyan-500 text-black font-bold py-4 rounded-lg uppercase w-full"
                >
                  Назад к словам
                </button>
              )}
            </div>
          )}

          <button 
            onClick={() => dispatch({ type: 'R6_RESET' })}
            className="w-full border border-red-500/50 text-red-400 font-bold py-3 rounded-lg uppercase text-sm mt-8 hover:bg-red-500/10"
          >
            Сброс раунда
          </button>
        </div>
      )}
    </div>
  );
}
