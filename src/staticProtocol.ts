import { gameReducer, initialGameState } from './game';
import { gameData } from './data';
import type { ServerGameState } from './types';

const encoder = new TextEncoder();
const bytes = (value: Uint8Array) => value as Uint8Array<ArrayBuffer>;
export const encode = (value: Uint8Array) => btoa(String.fromCharCode(...value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const decode = (value: string) => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
export async function roomForKey(publicKey: string) {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes(decode(publicKey))));
  return 's_' + Array.from(hash.slice(0, 24), b => b.toString(16).padStart(2, '0')).join('');
}
export async function createStaticRoom() {
  const keys = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']) as CryptoKeyPair;
  const privateKey = await crypto.subtle.exportKey('jwk', keys.privateKey);
  const publicKey = encode(new Uint8Array(await crypto.subtle.exportKey('raw', keys.publicKey)));
  return { room: await roomForKey(publicKey), hostKey: encode(encoder.encode(JSON.stringify(privateKey))) };
}
export async function publicForHost(hostKey: string) {
  const jwk = JSON.parse(new TextDecoder().decode(decode(hostKey))) as JsonWebKey;
  if (jwk.kty !== 'OKP' || jwk.crv !== 'Ed25519' || typeof jwk.x !== 'string' || typeof jwk.d !== 'string') throw new Error('Ключ ведущего недействителен');
  return jwk;
}
export interface Snapshot { version: 1; room: string; publicKey: string; revision: number; updatedAt: number; clockAt: number; state: ServerGameState }
export interface Envelope { payload: string; signature: string }
export async function signSnapshot(snapshot: Snapshot, hostKey: string): Promise<Envelope> {
  const jwk = await publicForHost(hostKey);
  if (await roomForKey(jwk.x!) !== snapshot.room || snapshot.publicKey !== jwk.x) throw new Error('Ключ принадлежит другой комнате');
  const key = await crypto.subtle.importKey('jwk', jwk, 'Ed25519', false, ['sign']);
  const payload = JSON.stringify(snapshot);
  const signature = await crypto.subtle.sign('Ed25519', key, encoder.encode(payload));
  return { payload, signature: encode(new Uint8Array(signature)) };
}
export function validState(value: unknown): value is ServerGameState {
  if (!value || typeof value !== 'object') return false;
  const state = value as ServerGameState;
  if (state.currentRound !== null && (!Number.isInteger(state.currentRound) || state.currentRound < 1 || state.currentRound > 6)) return false;
  for (const key of ['round1','round2','round3','round4','round5','round6'] as const) {
    if (!state[key] || typeof state[key] !== 'object') return false;
    for (const [field, expected] of Object.entries(initialGameState[key])) {
      const actual = (state[key] as unknown as Record<string, unknown>)[field];
      if (expected === null) { if (actual !== null && (!Number.isInteger(actual) || Number(actual) < 0)) return false; }
      else if (typeof actual !== typeof expected || (typeof actual === 'number' && (!Number.isSafeInteger(actual) || actual < 0))) return false;
    }
  }
  if (state.round1.wordIndex > gameData.round1.words.length || state.round1.timeLeft > 20 || state.round3.themeIndex >= gameData.round3.themes.length || state.round3.timeLeft > 60) return false;
  for (const r of [2,4,5] as const) if (state[`round${r}`].itemIndex > gameData[`round${r}`].items.length) return false;
  const {currentThemeIndex:t,currentWordIndex:w}=state.round6;
  if (t !== null && t >= gameData.round6.themes.length) return false;
  if (w !== null && (t === null || w >= gameData.round6.themes[t].words.length)) return false;
  const settings=state.gameSettings;
  return Boolean(settings && typeof settings.isConfigured === 'boolean' && ['teams','players'].includes(settings.type) && Number.isInteger(settings.count) && settings.count>=2 && settings.count<=8 && Array.isArray(settings.participants) && settings.participants.length<=8 && (!settings.isConfigured || settings.participants.length===settings.count) && settings.participants.every((p,i)=>p.id===i+1 && typeof p.name==='string' && p.name.length<=80 && Number.isSafeInteger(p.score) && p.score>=0) && Number.isSafeInteger(state.team1Score) && state.team1Score>=0 && Number.isSafeInteger(state.team2Score) && state.team2Score>=0);
}
export async function verifySnapshot(envelope: unknown, room: string): Promise<Snapshot | null> {
  try {
    const e = envelope as Envelope;
    if (!e || typeof e.payload !== 'string' || e.payload.length > 16000 || typeof e.signature !== 'string' || e.signature.length > 100) return null;
    const data = JSON.parse(e.payload) as Snapshot;
    if (data.version !== 1 || data.room !== room || typeof data.publicKey !== 'string' || data.publicKey.length !== 43 || await roomForKey(data.publicKey) !== room || !Number.isSafeInteger(data.revision) || data.revision < 0 || !Number.isSafeInteger(data.updatedAt) || data.updatedAt < 0 || !Number.isSafeInteger(data.clockAt) || data.clockAt < 0) return null;
    const publicKey = await crypto.subtle.importKey('raw', bytes(decode(data.publicKey)), 'Ed25519', false, ['verify']);
    if (!await crypto.subtle.verify('Ed25519', publicKey, bytes(decode(e.signature)), encoder.encode(e.payload)) || !validState(data.state)) return null;
    return data;
  } catch { return null; }
}
export function projectState(snapshot: Snapshot, now = Date.now()): ServerGameState {
  let state = snapshot.state;
  const seconds = Math.min(1000, Math.max(0, Math.floor((now - snapshot.clockAt) / 1000)));
  for (let i=0; i<seconds && (state.round1.isActive || state.round3.isActive); i++) state=gameReducer(state,{type:'TICK'});
  return state;
}

export function applyStaticAction(snapshot: Snapshot, action: unknown, now = Date.now()): Snapshot {
  const state = projectState(snapshot, now);
  const type = (action as { type?: string } | null)?.type;
  const keepPhase = (type === 'UPDATE_SCORE' || type === 'RESET_SCORES') && (state.round1.isActive || state.round3.isActive);
  const clockAt = keepPhase ? now - Math.max(0, now - snapshot.clockAt) % 1000 : now;
  return { ...snapshot, revision: snapshot.revision + 1, updatedAt: now, clockAt, state: gameReducer(state, action) };
}
