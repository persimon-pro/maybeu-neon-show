import express from 'express';
import path from 'node:path';
import os from 'node:os';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { gameReducer, initialGameState, isValidAction } from './src/game';
import type { ServerGameState } from './src/types';

const ROOM_PATTERN = /^[a-z0-9_-]{1,64}$/;
type Room = { state: ServerGameState; hostKey: string; touched: number };
export async function startServer(port = Number(process.env.PORT || 3000)) {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { maxHttpBufferSize: 8192 });
  const rooms = new Map<string, Room>();
  const creationLimits = new Map<string, { count: number; until: number }>();
  const authorized = (room: Room, key: unknown) => typeof key === 'string' && /^[a-f0-9]{64}$/.test(key) && timingSafeEqual(Buffer.from(key), Buffer.from(room.hostKey));
  app.use(express.json({ limit: '8kb' }));
  app.use((_req, res, next) => { res.setHeader('Referrer-Policy', 'no-referrer'); next(); });
  app.post('/api/rooms', (req, res) => {
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let limit = creationLimits.get(ip);
    if (!limit || limit.until < now) { limit = { count: 0, until: now + 60000 }; creationLimits.set(ip, limit); }
    if (++limit.count > 30 || rooms.size >= 1000) { res.status(429).json({ error: 'Слишком много комнат. Повторите позже.' }); return; }
    const id = `loft_${randomBytes(8).toString('hex')}`;
    const room = { state: structuredClone(initialGameState), hostKey: randomBytes(32).toString('hex'), touched: now };
    rooms.set(id, room);
    res.setHeader('Cache-Control', 'no-store');
    res.status(201).json({ room: id, hostKey: room.hostKey });
  });
  app.post('/api/rooms/access', (req, res) => {
    const room = rooms.get(req.body?.room);
    res.sendStatus(room && authorized(room, req.body?.hostKey) ? 204 : 403);
  });
  app.get('/api/lan-info', (_req, res) => {
    const ip = Object.values(os.networkInterfaces()).flat().find(i => i?.family === 'IPv4' && !i.internal)?.address || 'localhost';
    res.json({ ip, port: (httpServer.address() as { port?: number } | null)?.port || port });
  });
  io.use((socket, next) => {
    const { room, hostKey } = socket.handshake.auth || {};
    if (typeof room !== 'string' || !ROOM_PATTERN.test(room)) return next(new Error('Некорректная комната'));
    const session = rooms.get(room);
    if (!session) return next(new Error('Комната не найдена. Создайте игру на главной странице.'));
    if (hostKey && !authorized(session, hostKey)) return next(new Error('Ключ ведущего недействителен.'));
    socket.data.room = room;
    socket.data.canControl = authorized(session, hostKey);
    next();
  });
  io.on('connection', socket => {
    const id: string = socket.data.room;
    const room = rooms.get(id)!;
    room.touched = Date.now();
    socket.join(id);
    socket.emit('state_update', room.state);
    let count = 0, windowStart = Date.now();
    socket.on('action', (action: unknown, ack?: (result: { ok: boolean; error?: string }) => void) => {
      const reply = (ok: boolean, error?: string) => { if (typeof ack === 'function') ack({ ok, error }); };
      if (Date.now() - windowStart > 1000) { count = 0; windowStart = Date.now(); }
      if (++count > 60) { reply(false, 'Слишком много команд'); return; }
      if (!socket.data.canControl) { reply(false, 'Нужна ссылка ведущего с ключом'); return; }
      if (!isValidAction(action, room.state) || action.type === 'TICK') { reply(false, 'Некорректная команда'); return; }
      room.state = gameReducer(room.state, action);
      room.touched = Date.now();
      io.to(id).emit('state_update', room.state);
      reply(true);
    });
  });
  const ticker = setInterval(() => {
    const now = Date.now();
    for (const [id, room] of rooms) {
      const connected = io.sockets.adapter.rooms.get(id)?.size;
      if (!connected) {
        room.state.round1.isActive = false;
        room.state.round3.isActive = false;
        if (now - room.touched > 86400000) rooms.delete(id);
        continue;
      }
      room.touched = now;
      if (room.state.round1.isActive || room.state.round3.isActive) {
        room.state = gameReducer(room.state, { type: 'TICK' });
        io.to(id).emit('state_update', room.state);
      }
    }
    for (const [ip, limit] of creationLimits) if (limit.until < now) creationLimits.delete(ip);
  }, 1000);
  httpServer.on('close', () => clearInterval(ticker));
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' }, appType: 'spa' });
    app.use(vite.middlewares);
    httpServer.on('close', () => { void vite.close(); });
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
  }
  await new Promise<void>((resolve, reject) => { httpServer.once('error', reject); httpServer.listen(port, '0.0.0.0', resolve); });
  return { httpServer, io };
}

if (process.env.NODE_ENV !== 'test') {
  startServer().then(({ httpServer }) => console.log(`Server running on port ${(httpServer.address() as { port: number }).port}`)).catch(error => { console.error(error); process.exitCode = 1; });
}
