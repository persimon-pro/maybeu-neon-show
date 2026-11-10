import mqtt, { type MqttClient } from 'mqtt';
import { initialGameState, isValidAction } from './game';
import { type Snapshot, type Envelope, verifySnapshot, signSnapshot, publicForHost, roomForKey, projectState, applyStaticAction } from './staticProtocol';
import type { ServerGameState } from './types';

const BROKERS = ['wss://test.mosquitto.org:8081/mqtt', 'wss://broker.emqx.io:8084/mqtt'];
export function connectStatic(room: string, hostKey: string, onState: (state: ServerGameState) => void, onConnection: (connected: boolean) => void, onError: (error: string) => void) {
  let snapshot: Snapshot | null = null;
  let envelope: Envelope | null = null;
  let closed = false;
  let queue = Promise.resolve();
  let pendingMessages = 0;
  const clients: MqttClient[] = [];
  const connected = new Set<MqttClient>();
  const ready = new Set<MqttClient>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const topic = `loft_show_v2/${room}/state`;
  const storageKey = `loft_signed_state_${room}`;
  let verifiedHost: JsonWebKey | null = null;
  const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(`loft_signed_${room}`);
  let localReady = false;
  const notify = () => { onConnection(localReady || ready.size > 0); if (ready.size > 0) onError(''); };
  const store = () => { try { if (envelope) localStorage.setItem(storageKey, JSON.stringify(envelope)); } catch {} };
  const newer = (next: Snapshot, nextEnvelope: Envelope) => !snapshot || next.revision > snapshot.revision || (next.revision === snapshot.revision && (next.updatedAt > snapshot.updatedAt || (next.updatedAt === snapshot.updatedAt && nextEnvelope.signature > (envelope?.signature || ''))));
  const accept = async (candidate: unknown) => {
    const next = await verifySnapshot(candidate, room);
    if (closed || !next || !newer(next, candidate as Envelope)) return;
    snapshot = next; envelope = candidate as Envelope; store(); onState(projectState(next)); publish();
  };
  const publish = () => {
    if (!envelope) return;
    channel?.postMessage({ type: 'STATE', envelope });
    const message = JSON.stringify(envelope);
    for (const client of connected) client.publish(topic, message, { retain: true, qos: 1 }, error => { if (!closed && error) onError('Не удалось отправить состояние. Проверьте связь.'); });
  };
  const receive = (candidate: unknown) => {
    if (closed || pendingMessages >= 16) return;
    pendingMessages++;
    queue = queue.then(() => accept(candidate)).catch(() => {}).finally(() => { pendingMessages--; });
  };
  if (channel) channel.onmessage = event => {
    if (event.data?.type === 'REQUEST') { if (envelope) channel.postMessage({ type: 'STATE', envelope }); }
    else if (event.data?.type === 'STATE') receive(event.data.envelope);
  };
  const initialize = async () => {
    try {
      if (hostKey) {
        const candidate = await publicForHost(hostKey);
        if (await roomForKey(candidate.x!) !== room) throw new Error('Ключ принадлежит другой комнате');
        verifiedHost = candidate;
      }
      const saved = localStorage.getItem(storageKey);
      if (saved) await accept(JSON.parse(saved));
    } catch (error) {
      if (hostKey && !verifiedHost) { onError((error as Error).message); return; }
    }
    if (closed) return;
    if (!snapshot && verifiedHost) {
      const now=Date.now();
      const initial: Snapshot = { version:1, room, publicKey:verifiedHost.x!, revision:0, updatedAt:now, clockAt:now, state:structuredClone(initialGameState) };
      await accept(await signSnapshot(initial,hostKey));
    }
    if (closed) return;
    localReady = Boolean(channel); notify(); channel?.postMessage({ type: 'REQUEST' });
    for (const url of BROKERS) {
      const client = mqtt.connect(url, { clean: true, clientId: `loft_${crypto.randomUUID().replace(/-/g,'').slice(0,16)}`, connectTimeout: 7000, reconnectPeriod: 3000, resubscribe: false, queueQoSZero: false });
      clients.push(client);
      client.on('connect', () => {
        connected.add(client);
        client.subscribe(topic, { qos: 1 }, error => {
          if (error || closed) return;
          // Give retained state time to arrive before publishing a local snapshot.
          const timer = setTimeout(() => {
            timers.delete(timer);
            queue = queue.then(async () => {
              if (closed || !client.connected) return;
              if (!snapshot && verifiedHost) {
                const initial: Snapshot = { version:1, room, publicKey:verifiedHost.x!, revision:0, updatedAt:Date.now(), clockAt:Date.now(), state:structuredClone(initialGameState) };
                const signed = await signSnapshot(initial, hostKey);
                if (!snapshot) await accept(signed);
              }
              if (envelope) publish();
              ready.add(client); notify();
            }).catch(() => onError('Не удалось подготовить комнату.'));
          }, 700);
          timers.add(timer);
        });
      });
      client.on('message', (_topic, message) => {
        if (message.length > 24000) return;
        try {
          const data = JSON.parse(message.toString());
          receive(data);
        } catch {}
      });
      const disconnected = () => { connected.delete(client); ready.delete(client); if (!closed) notify(); };
      client.on('offline', disconnected); client.on('close', disconnected);
      client.on('error', () => { if (!closed && !ready.size) onError(localReady ? 'Доступны вкладки этого браузера. Связь с телефоном восстанавливается…' : 'Нет связи с комнатой. Проверяем резервное соединение…'); });
    }
  };
  void initialize().catch(() => { if (!closed) onError('Не удалось подготовить комнату. Обновите страницу.'); });
  let lastTick = -1;
  const heartbeat = setInterval(() => { if (!closed && verifiedHost && envelope) publish(); }, 15000);
  const interval = setInterval(() => {
    if (snapshot && Math.floor(Date.now()/1000) !== lastTick) { lastTick=Math.floor(Date.now()/1000); onState(projectState(snapshot)); }
  }, 200);
  return {
    dispatch(action: unknown) {
      queue = queue.then(async () => {
        if (closed) return;
        if (!verifiedHost) { onError('Нужна ссылка ведущего с ключом.'); return; }
        if ((!localReady && !ready.size) || !snapshot) { onError('Нет связи с комнатой. Команда не отправлена.'); return; }
        const state = projectState(snapshot);
        if (!isValidAction(action, state) || action.type === 'TICK') { onError('Некорректная команда'); return; }
        const next = applyStaticAction(snapshot, action);
        const signed=await signSnapshot(next,hostKey);
        if (closed) return;
        await accept(signed); onError('');
      }).catch(() => { if (!closed) onError('Не удалось выполнить команду.'); });
    },
    close() { closed=true; clearInterval(interval); clearInterval(heartbeat); channel?.close(); for (const timer of timers) clearTimeout(timer); for (const client of clients) client.end(true); }
  };
}
