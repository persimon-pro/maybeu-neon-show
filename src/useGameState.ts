import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerGameState } from './types';
import { gameData } from './data';

export const initialGameState: ServerGameState = {
  team1Score: 0,
  team2Score: 0,
  currentRound: null,
  round1: {
    wordIndex: 0,
    timeLeft: 20,
    isActive: false,
    roundEnd: false
  },
  round2: {
    itemIndex: 0,
    isAnswerRevealed: false,
    roundEnd: false
  },
  round3: {
    themeIndex: 0,
    timeLeft: 60,
    isActive: false,
    roundEnd: false
  },
  round4: {
    itemIndex: 0,
    isAnswerRevealed: false,
    roundEnd: false
  },
  round5: {
    itemIndex: 0,
    isAnswerRevealed: false,
    roundEnd: false
  },
  round6: {
    currentThemeIndex: null,
    currentWordIndex: null,
    isAnswerRevealed: false
  },
  gameSettings: {
    isConfigured: false,
    type: 'teams',
    count: 2,
    participants: []
  }
};

const STORAGE_KEY = 'maybeu_neon_game_state_v1';
const CHANNEL_NAME = 'maybeu_neon_channel';

function loadStoredState(): ServerGameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load local state', e);
  }
  return initialGameState;
}

function saveStoredState(state: ServerGameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Ignore quota errors
  }
}

export function gameReducer(prevState: ServerGameState, action: any): ServerGameState {
  const state: ServerGameState = JSON.parse(JSON.stringify(prevState));

  switch (action.type) {
    case 'UPDATE_SCORE': {
      const participant = state.gameSettings.participants.find(p => p.id === action.team);
      if (participant) {
        participant.score = Math.max(0, participant.score + action.delta);
        if (action.team === 1) state.team1Score = participant.score;
        if (action.team === 2) state.team2Score = participant.score;
      }
      break;
    }
    case 'CONFIGURE_GAME': {
      const { mode, count, names } = action;
      const participants = [];
      for (let i = 1; i <= count; i++) {
        const defaultName = mode === 'teams' ? `Команда ${i}` : `Участник ${i}`;
        const customName = names && names[i - 1] ? names[i - 1].trim() : '';
        participants.push({
          id: i,
          name: customName || defaultName,
          score: 0
        });
      }
      state.gameSettings = {
        isConfigured: true,
        type: mode,
        count,
        participants
      };
      state.team1Score = 0;
      state.team2Score = 0;
      break;
    }
    case 'RESET_GAME_SETTINGS': {
      state.gameSettings.isConfigured = false;
      break;
    }
    case 'RESET_SCORES': {
      state.gameSettings.participants.forEach(p => {
        p.score = 0;
      });
      state.team1Score = 0;
      state.team2Score = 0;
      break;
    }
    case 'SET_ROUND':
      state.currentRound = action.round;
      break;
    case 'R1_START':
      state.round1.isActive = true;
      break;
    case 'R1_PAUSE':
      state.round1.isActive = false;
      break;
    case 'R1_NEXT_WORD':
      state.round1.wordIndex += 1;
      state.round1.timeLeft = 20;
      if (state.round1.wordIndex >= gameData.round1.words.length) {
        state.round1.roundEnd = true;
        state.round1.isActive = false;
      }
      break;
    case 'R1_RESET':
      state.round1 = {
        wordIndex: 0,
        timeLeft: 20,
        isActive: false,
        roundEnd: false
      };
      break;
    case 'R2_REVEAL_ANSWER':
      state.round2.isAnswerRevealed = true;
      break;
    case 'R2_NEXT_ITEM':
      state.round2.itemIndex += 1;
      state.round2.isAnswerRevealed = false;
      if (state.round2.itemIndex >= gameData.round2.items.length) {
        state.round2.roundEnd = true;
      }
      break;
    case 'R2_RESET':
      state.round2 = {
        itemIndex: 0,
        isAnswerRevealed: false,
        roundEnd: false
      };
      break;
    case 'R3_START':
      state.round3.isActive = true;
      break;
    case 'R3_PAUSE':
      state.round3.isActive = false;
      break;
    case 'R3_NEXT_THEME':
      if (state.round3.themeIndex < gameData.round3.themes.length - 1) {
        state.round3.themeIndex += 1;
        state.round3.timeLeft = 60;
        state.round3.isActive = false;
      } else {
        state.round3.roundEnd = true;
        state.round3.isActive = false;
      }
      break;
    case 'R3_RESET_TIME':
      state.round3.timeLeft = 60;
      state.round3.isActive = false;
      break;
    case 'R3_RESET':
      state.round3 = {
        themeIndex: 0,
        timeLeft: 60,
        isActive: false,
        roundEnd: false
      };
      break;
    case 'R4_REVEAL_ANSWER':
      state.round4.isAnswerRevealed = true;
      break;
    case 'R4_NEXT_ITEM':
      state.round4.itemIndex += 1;
      state.round4.isAnswerRevealed = false;
      if (state.round4.itemIndex >= gameData.round4.items.length) {
        state.round4.roundEnd = true;
      }
      break;
    case 'R4_RESET':
      state.round4 = {
        itemIndex: 0,
        isAnswerRevealed: false,
        roundEnd: false
      };
      break;
    case 'R5_REVEAL_ANSWER':
      state.round5.isAnswerRevealed = true;
      break;
    case 'R5_NEXT_ITEM':
      state.round5.itemIndex += 1;
      state.round5.isAnswerRevealed = false;
      if (state.round5.itemIndex >= gameData.round5.items.length) {
        state.round5.roundEnd = true;
      }
      break;
    case 'R5_RESET':
      state.round5 = {
        itemIndex: 0,
        isAnswerRevealed: false,
        roundEnd: false
      };
      break;
    case 'R6_SET_THEME':
      state.round6.currentThemeIndex = action.index;
      state.round6.currentWordIndex = null;
      state.round6.isAnswerRevealed = false;
      break;
    case 'R6_SET_WORD':
      state.round6.currentWordIndex = action.index;
      state.round6.isAnswerRevealed = false;
      break;
    case 'R6_REVEAL_ANSWER':
      state.round6.isAnswerRevealed = true;
      break;
    case 'R6_RESET':
      state.round6 = {
        currentThemeIndex: null,
        currentWordIndex: null,
        isAnswerRevealed: false
      };
      break;
    case 'TICK': {
      if (state.round1.isActive && !state.round1.roundEnd) {
        if (state.round1.timeLeft > 0) {
          state.round1.timeLeft -= 1;
        }
        if (state.round1.timeLeft === 0) {
          state.round1.wordIndex += 1;
          state.round1.timeLeft = 20;
          if (state.round1.wordIndex >= gameData.round1.words.length) {
            state.round1.roundEnd = true;
            state.round1.isActive = false;
          }
        }
      }

      if (state.round3.isActive && !state.round3.roundEnd) {
        if (state.round3.timeLeft > 0) {
          state.round3.timeLeft -= 1;
        }
        if (state.round3.timeLeft === 0) {
          state.round3.isActive = false;
        }
      }
      break;
    }
  }

  return state;
}

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    const customUrl = (import.meta as any).env?.VITE_SOCKET_URL;
    const socketUrl = customUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    socketInstance = io(socketUrl, {
      reconnectionAttempts: 3,
      timeout: 3000,
      autoConnect: true
    });
  }
  return socketInstance;
}

export function useGameState() {
  const [gameState, setGameState] = useState<ServerGameState>(() => loadStoredState());
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef<ServerGameState>(gameState);
  stateRef.current = gameState;

  useEffect(() => {
    // BroadcastChannel for cross-tab sync without server (e.g. Vercel)
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = bc;
      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_STATE' && event.data.state) {
          setGameState(event.data.state);
          saveStoredState(event.data.state);
        }
      };
    }

    // Socket.io connection
    const s = getSocket();

    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    const handleStateUpdate = (serverState: ServerGameState) => {
      setIsSocketConnected(true);
      setGameState(serverState);
      saveStoredState(serverState);
      channelRef.current?.postMessage({ type: 'SYNC_STATE', state: serverState });
    };

    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);
    s.on('state_update', handleStateUpdate);

    return () => {
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      s.off('state_update', handleStateUpdate);
      channelRef.current?.close();
    };
  }, []);

  // Client-side timer ticker when socket is not connected
  useEffect(() => {
    if (isSocketConnected) return;

    const interval = setInterval(() => {
      const current = stateRef.current;
      const r1Running = current.round1.isActive && !current.round1.roundEnd;
      const r3Running = current.round3.isActive && !current.round3.roundEnd;

      if (r1Running || r3Running) {
        const nextState = gameReducer(current, { type: 'TICK' });
        setGameState(nextState);
        saveStoredState(nextState);
        channelRef.current?.postMessage({ type: 'SYNC_STATE', state: nextState });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSocketConnected]);

  const dispatch = (action: any) => {
    const s = getSocket();
    if (s && s.connected) {
      s.emit('action', action);
    } else {
      // Local state fallback with BroadcastChannel
      const nextState = gameReducer(stateRef.current, action);
      setGameState(nextState);
      saveStoredState(nextState);
      channelRef.current?.postMessage({ type: 'SYNC_STATE', state: nextState });
    }
  };

  return { gameState, dispatch, isSocketConnected };
}
