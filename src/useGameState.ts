import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import mqtt, { MqttClient } from 'mqtt';
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

const STORAGE_KEY = 'loft_neon_game_state_v1';
const CHANNEL_NAME = 'loft_neon_channel';
const ROOM_STORAGE_KEY = 'loft_neon_room_id';

export function getActiveRoomId(): string {
  if (typeof window === 'undefined') return 'loft_main';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('room');
  if (fromUrl && fromUrl.trim() !== '') {
    const clean = fromUrl.trim().toLowerCase();
    localStorage.setItem(ROOM_STORAGE_KEY, clean);
    return clean;
  }
  let saved = localStorage.getItem(ROOM_STORAGE_KEY);
  // If saved was a temporary random room from previous version (e.g. loft_xxxxxx), migrate to loft_main
  if (saved && saved.trim() !== '' && !saved.match(/^loft_[a-z0-9]{5,8}$/i)) {
    return saved.trim().toLowerCase();
  }
  const defaultRoom = 'loft_main';
  localStorage.setItem(ROOM_STORAGE_KEY, defaultRoom);
  return defaultRoom;
}

export function setCustomRoomId(newRoom: string): string {
  const clean = (newRoom.trim() || 'loft_main').toLowerCase();
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROOM_STORAGE_KEY, clean);
  }
  return clean;
}

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
  } catch (e) {}
}

export function gameReducer(prevState: ServerGameState, action: any): ServerGameState {
  if (!action || !action.type) return prevState;
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

function getSocket(): Socket {
  if (!socketInstance) {
    const customUrl = (import.meta as any).env?.VITE_SOCKET_URL;
    const socketUrl = customUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    socketInstance = io(socketUrl, {
      reconnectionAttempts: 5,
      timeout: 3000,
      autoConnect: true
    });
  }
  return socketInstance;
}

const MQTT_BROKERS = [
  'wss://test.mosquitto.org:8081/mqtt',
  'wss://broker.emqx.io:8084/mqtt',
  'wss://test.mosquitto.org:8081'
];

export function useGameState(role: 'display' | 'host' | 'general' = 'general') {
  const [gameState, setGameState] = useState<ServerGameState>(() => loadStoredState());
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isMqttConnected, setIsMqttConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>(() => getActiveRoomId());

  const channelRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef<ServerGameState>(gameState);
  stateRef.current = gameState;

  const mqttClientRef = useRef<MqttClient | null>(null);
  const roomIdRef = useRef<string>(currentRoom);
  roomIdRef.current = currentRoom;
  const senderIdRef = useRef<string>('c_' + Math.random().toString(36).substring(2, 7));
  const pendingActionsRef = useRef<Array<{ topic: string; message: string }>>([]);

  // Sync state across local tabs and MQTT
  const broadcastState = useCallback((state: ServerGameState) => {
    saveStoredState(state);
    channelRef.current?.postMessage({ type: 'SYNC_STATE', state });

    // Broadcast master state to MQTT with retain so late-joining host gets it immediately
    if (mqttClientRef.current && mqttClientRef.current.connected) {
      const topic = `loft_show_rooms/${roomIdRef.current}/state`;
      mqttClientRef.current.publish(topic, JSON.stringify({ 
        type: 'STATE_SYNC', 
        state, 
        sender: senderIdRef.current 
      }), { retain: true, qos: 0 });
    }
  }, []);

  // 1. Local BroadcastChannel (instant for tabs on same browser)
  useEffect(() => {
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

    return () => {
      channelRef.current?.close();
    };
  }, []);

  // 2. Local Socket.io connection (for Node.js dev server & Render)
  useEffect(() => {
    const s = getSocket();

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);
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
    };
  }, []);

  // 3. Ultra-Fast MQTT WebSocket Realtime Stream (Zero-Lag Cross-Device)
  useEffect(() => {
    const room = currentRoom;
    roomIdRef.current = room;

    const actionTopic = `loft_show_rooms/${room}/actions`;
    const stateTopic = `loft_show_rooms/${room}/state`;

    let client: MqttClient | null = null;
    let brokerIndex = 0;
    let isCleanedUp = false;
    let reconnectTimer: any = null;

    const connectMqtt = () => {
      if (isCleanedUp) return;
      const brokerUrl = MQTT_BROKERS[brokerIndex % MQTT_BROKERS.length];

      try {
        client = mqtt.connect(brokerUrl, {
          clientId: `${role}_${senderIdRef.current}_${Math.random().toString(36).substring(2, 6)}`,
          clean: true,
          connectTimeout: 5000,
          reconnectPeriod: 2500
        });
        mqttClientRef.current = client;

        client.on('connect', () => {
          if (isCleanedUp) return;
          setIsMqttConnected(true);

          client?.subscribe([actionTopic, stateTopic], { qos: 0 }, (err) => {
            if (!err && role === 'display') {
              // Immediately announce current state on connect
              broadcastState(stateRef.current);
            }
          });

          // Flush queued actions
          while (pendingActionsRef.current.length > 0) {
            const item = pendingActionsRef.current.shift();
            if (item) {
              client?.publish(item.topic, item.message);
            }
          }

          // If host connects, request current state from display
          if (role === 'host') {
            client?.publish(actionTopic, JSON.stringify({ 
              type: 'REQUEST_STATE', 
              sender: senderIdRef.current 
            }));
          }
        });

        client.on('message', (topic, messageBuffer) => {
          if (isCleanedUp) return;
          try {
            const payload = JSON.parse(messageBuffer.toString());
            if (!payload) return;

            // Ignore own messages
            if (payload.sender === senderIdRef.current) return;

            if (payload.type === 'ACTION' && payload.action) {
              const nextState = gameReducer(stateRef.current, payload.action);
              setGameState(nextState);
              saveStoredState(nextState);
              channelRef.current?.postMessage({ type: 'SYNC_STATE', state: nextState });

              // If display, respond with authoritative state sync
              if (role === 'display' || role === 'general') {
                broadcastState(nextState);
              }
            } else if (payload.type === 'STATE_SYNC' && payload.state) {
              setGameState(payload.state);
              saveStoredState(payload.state);
              channelRef.current?.postMessage({ type: 'SYNC_STATE', state: payload.state });
            } else if (payload.type === 'REQUEST_STATE' && (role === 'display' || role === 'general')) {
              broadcastState(stateRef.current);
            }
          } catch (e) {
            console.warn('MQTT parse error:', e);
          }
        });

        const tryNextBroker = () => {
          if (isCleanedUp) return;
          setIsMqttConnected(false);
          if (reconnectTimer) clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(() => {
            if (isCleanedUp) return;
            try {
              client?.end(true);
            } catch (e) {}
            brokerIndex++;
            connectMqtt();
          }, 4000);
        };

        client.on('offline', () => setIsMqttConnected(false));
        client.on('error', (err) => {
          console.warn('MQTT connection error, trying next broker:', err);
          tryNextBroker();
        });
      } catch (err) {
        console.warn('MQTT init error:', err);
      }
    };

    connectMqtt();

    return () => {
      isCleanedUp = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      try {
        client?.end(true);
      } catch (e) {}
      mqttClientRef.current = null;
    };
  }, [currentRoom, role, broadcastState]);

  // Authoritative timer clock on Display only (Never on Host)
  useEffect(() => {
    if (isSocketConnected) return; // Server handles clock if Socket.io is running
    if (role === 'host') return;   // Host never runs the clock

    const interval = setInterval(() => {
      const current = stateRef.current;
      const r1Running = current.round1.isActive && !current.round1.roundEnd;
      const r3Running = current.round3.isActive && !current.round3.roundEnd;

      if (r1Running || r3Running) {
        const nextState = gameReducer(current, { type: 'TICK' });
        setGameState(nextState);
        broadcastState(nextState);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSocketConnected, role, broadcastState]);

  const dispatch = (action: any) => {
    if (!action || !action.type) return;

    // 1. Optimistic immediate local UI update (0ms latency for host)
    const nextState = gameReducer(stateRef.current, action);
    setGameState(nextState);
    saveStoredState(nextState);
    channelRef.current?.postMessage({ type: 'SYNC_STATE', state: nextState });

    // 2. Send via Socket.io if running
    const s = getSocket();
    if (s && s.connected) {
      s.emit('action', action);
    }

    // 3. Send via ultra-fast MQTT WebSocket binary stream
    const topic = `loft_show_rooms/${roomIdRef.current}/actions`;
    const message = JSON.stringify({ 
      type: 'ACTION', 
      action, 
      sender: senderIdRef.current 
    });

    if (mqttClientRef.current && mqttClientRef.current.connected) {
      mqttClientRef.current.publish(topic, message);
    } else {
      pendingActionsRef.current.push({ topic, message });
    }
  };

  const changeRoom = (newRoom: string) => {
    const clean = setCustomRoomId(newRoom);
    setCurrentRoom(clean);
  };

  const isConnected = isSocketConnected || isMqttConnected;

  return { 
    gameState, 
    dispatch, 
    isConnected,
    isSocketConnected, 
    isMqttConnected,
    roomId: currentRoom,
    changeRoom
  };
}
