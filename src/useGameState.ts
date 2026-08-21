import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerGameState } from './types';

let socket: Socket;

export function getSocket() {
  if (!socket) {
    socket = io(window.location.origin);
  }
  return socket;
}

export function useGameState() {
  const [gameState, setGameState] = useState<ServerGameState | null>(null);

  useEffect(() => {
    const s = getSocket();
    
    s.on('state_update', (state: ServerGameState) => {
      setGameState(state);
    });

    return () => {
      s.off('state_update');
    };
  }, []);

  const dispatch = (action: any) => {
    getSocket().emit('action', action);
  };

  return { gameState, dispatch };
}
