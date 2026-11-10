import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { createStaticRoom, publicForHost, roomForKey } from './staticProtocol';
import { initialGameState } from './game';
import type { ServerGameState } from './types';
export { initialGameState, gameReducer } from './game';

export const isStaticHosting = (import.meta as any).env?.VITE_GAME_TRANSPORT === 'mqtt';
const ROOM_KEY = 'loft_neon_room_id';
const validRoom = (room: string) => /^[a-z0-9_-]{1,64}$/.test(room);
export function getActiveRoomId(): string {
  const fromUrl = new URLSearchParams(location.search).get('room')?.trim().toLowerCase();
  let saved: string | null = null;
  try { saved = localStorage.getItem(ROOM_KEY); } catch {}
  const room = fromUrl && validRoom(fromUrl) ? fromUrl : saved && validRoom(saved) ? saved : 'loft_main';
  try { localStorage.setItem(ROOM_KEY, room); } catch {}
  return room;
}
export function getHostKey(room = getActiveRoomId()): string {
  const fromUrl = new URLSearchParams(location.hash.slice(1)).get('key');
  if (fromUrl && /^[A-Za-z0-9_-]{64,512}$/.test(fromUrl)) {
    try { localStorage.setItem(`loft_host_${room}`, fromUrl); } catch {}
    history.replaceState(null, '', location.pathname + location.search);
    return fromUrl;
  }
  try { return localStorage.getItem(`loft_host_${room}`) || ''; } catch { return ''; }
}
export function setCustomRoomId(newRoom: string): string {
  const room = newRoom.trim().toLowerCase();
  if (!validRoom(room)) throw new Error('Название комнаты: 1–64 латинские буквы, цифры, дефис или подчёркивание.');
  try { localStorage.setItem(ROOM_KEY, room); } catch {}
  const url = new URL(location.href);
  url.searchParams.set('room', room);
  url.hash = '';
  history.replaceState(null, '', url);
  return room;
}
let creation: Promise<string> | null = null;
export async function createGame(): Promise<string> {
  if (!creation) creation = (async () => {
    let data: { room: string; hostKey: string };
    if (isStaticHosting) data = await createStaticRoom();
    else {
      const response = await fetch('/api/rooms', { method: 'POST' });
      if (!response.ok) throw new Error('Не удалось создать игру. Проверьте соединение с сервером.');
      data = await response.json();
    }
    localStorage.setItem(`loft_host_${data.room}`, data.hostKey);
    setCustomRoomId(data.room);
    return data.room as string;
  })().finally(() => { creation = null; });
  return creation;
}
export async function getHostUrl(room = getActiveRoomId()): Promise<string> {
  const url = new URL('/host', location.origin);
  if (!isStaticHosting && ['localhost', '127.0.0.1'].includes(location.hostname)) {
    try {
      const response = await fetch('/api/lan-info');
      const data = await response.json();
      if (data.ip && data.ip !== 'localhost') { url.hostname = data.ip; url.port = String(data.port); }
    } catch {}
  }
  url.searchParams.set('room', room);
  const key = getHostKey(room);
  if (key) url.hash = new URLSearchParams({ key }).toString();
  return url.toString();
}
export function useGameState(_role: 'display' | 'host' | 'general' = 'general') {
  const [gameState, setGameState] = useState<ServerGameState>(() => structuredClone(initialGameState));
  const [isConnected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState(getActiveRoomId);
  const socketRef = useRef<Socket | null>(null);
  const staticRef = useRef<{ dispatch(action: unknown): void; close(): void } | null>(null);
  const canControl = Boolean(getHostKey(roomId));
  useEffect(() => {
    setConnected(false);
    setError('');
    setGameState(structuredClone(initialGameState));
    if (isStaticHosting) {
      let disposed = false;
      void import('./staticTransport').then(({ connectStatic }) => {
        if (!disposed) staticRef.current = connectStatic(roomId, getHostKey(roomId), setGameState, setConnected, setError);
      }).catch(() => { if (!disposed) setError('Не удалось загрузить соединение. Обновите страницу.'); });
      return () => { disposed = true; staticRef.current?.close(); staticRef.current = null; };
    }
    const socket = io({ auth: { room: roomId, hostKey: getHostKey(roomId) }, timeout: 5000 });
    socketRef.current = socket;
    socket.on('connect', () => { setConnected(true); setError(''); });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', e => { setConnected(false); setError(e.message); });
    socket.on('state_update', (state: ServerGameState) => setGameState(state));
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [roomId]);
  const dispatch = (action: unknown) => {
    if (!canControl) { setError('Откройте пульт по ссылке или QR-коду создателя игры.'); return; }
    if (isStaticHosting) {
      if (!staticRef.current) setError('Подключение к комнате…');
      else staticRef.current.dispatch(action);
      return;
    }
    const socket = socketRef.current;
    if (!socket?.connected) { setError('Нет связи с сервером. Команда не отправлена.'); return; }
    socket.timeout(5000).emit('action', action, (timeout: Error | null, result?: { ok: boolean; error?: string }) => {
      if (timeout || !result?.ok) setError(result?.error || 'Сервер не подтвердил команду. Проверьте состояние игры.');
      else setError('');
    });
  };
  const changeRoom = (room: string) => {
    try { setRoomId(setCustomRoomId(room)); } catch (e) { setError((e as Error).message); }
  };
  return { gameState, dispatch, isConnected, isSocketConnected: isConnected, isMqttConnected: false, roomId, changeRoom, canControl, error };
}

export async function canResumeGame(room: string): Promise<boolean> {
  const key = getHostKey(room);
  if (!key) return false;
  if (isStaticHosting) {
    try { const jwk = await publicForHost(key); return await roomForKey(jwk.x!) === room; } catch { return false; }
  }
  const response = await fetch('/api/rooms/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room, hostKey: key }) });
  return response.ok;
}
