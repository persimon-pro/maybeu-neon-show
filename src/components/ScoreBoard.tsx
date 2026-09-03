import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GameSettings } from '../types';
import { getActiveRoomId } from '../useGameState';

interface ScoreBoardProps {
  gameSettings: GameSettings;
  onGoHome: () => void;
}

export function ScoreBoard({ onGoHome }: ScoreBoardProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [hostUrl, setHostUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const room = getActiveRoomId();
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        fetch('/api/lan-info')
          .then(res => res.json())
          .then(data => {
            if (data && data.ip && data.ip !== 'localhost') {
              setHostUrl(`http://${data.ip}:${data.port || window.location.port || 3000}/host?room=${room}`);
            } else {
              setHostUrl(`${window.location.origin}/host?room=${room}`);
            }
          })
          .catch(() => {
            setHostUrl(`${window.location.origin}/host?room=${room}`);
          });
      } else {
        setHostUrl(`${window.location.origin}/host?room=${room}`);
      }
    }
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 md:h-24 glass-panel flex items-center justify-between px-3 sm:px-6 md:px-8 z-50">
        
        {/* Left spacer / back to home */}
        <button 
          onClick={onGoHome}
          className="text-slate-400 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5"
        >
          <span>🏠</span>
          <span className="hidden sm:inline">Меню</span>
        </button>

        {/* Center - Home Button */}
        <button 
          onClick={onGoHome}
          className="group flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all mx-2 shrink-0"
        >
          <span className="text-xs sm:text-lg md:text-2xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">
            LOFT SHOW
          </span>
        </button>

        {/* Right - QR Code button for host */}
        <button
          onClick={() => setShowQrModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-mono text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          title="Открыть QR-код для телефона ведущего"
        >
          <span>📱</span>
          <span className="hidden md:inline">Пульт</span>
        </button>

      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="glass-panel border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.3)] rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center gap-5 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-widest font-mono">
                Пульт Ведущего
              </h3>
            </div>

            <div className="bg-white p-3.5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              {hostUrl && (
                <QRCodeSVG 
                  value={hostUrl} 
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#050505"
                  level="M"
                />
              )}
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Наведите камеру смартфона для подключения пульта ведущего
            </p>

            <code className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-emerald-300 text-[11px] font-mono truncate max-w-full">
              {hostUrl}
            </code>
          </div>
        </div>
      )}
    </>
  );
}
