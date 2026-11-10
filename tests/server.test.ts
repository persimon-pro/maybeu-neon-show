import {test} from 'node:test';
import assert from 'node:assert/strict';
const once = (socket: Socket, event: string): Promise<any[]> => new Promise((resolve, reject) => {
 const timer = setTimeout(() => reject(new Error(`Timeout: ${event}`)), 5000);
 socket.once(event, (...args: any[]) => { clearTimeout(timer); resolve(args); });
});
import {io, type Socket} from 'socket.io-client';
import {startServer} from '../server';

test('rooms, host permissions, validation, reconnect and timers', async()=>{
 const {httpServer,io:server}=await startServer(0);
 const port=(httpServer.address() as {port:number}).port;
 const url=`http://127.0.0.1:${port}`;
 const sockets:Socket[]=[];
 const create=async()=>{const res=await fetch(`${url}/api/rooms`,{method:'POST'});assert.equal(res.status,201);return res.json();};
 const connect=async(auth:object)=>{const socket=io(url,{auth,reconnection:false});sockets.push(socket);const [state]=await once(socket,'state_update');return {socket,state};};
 const action=(socket:Socket,value:unknown)=>new Promise<any>((resolve,reject)=>socket.timeout(2000).emit('action',value,(err:Error|null,result:any)=>err?reject(err):resolve(result)));
 try{
  const a=await create(),b=await create();
  const host=await connect(a),other=await connect(b),viewer=await connect({room:a.room});
  let foreignUpdates=0;other.socket.on('state_update',()=>foreignUpdates++);
  assert.equal((await action(viewer.socket,{type:'SET_ROUND',round:2})).ok,false);
  for(const bad of [null,{type:'CONFIGURE_GAME',mode:'teams',count:2,names:[42]},{type:'R6_SET_THEME',index:999},{type:'TICK'}])assert.equal((await action(host.socket,bad)).ok,false);
  assert.equal((await action(host.socket,{type:'CONFIGURE_GAME',mode:'teams',count:2,names:['A','B']})).ok,true);
  const update = new Promise<any>(resolve => {
    const handler = (state: any) => { if (state.team1Score === 1) { viewer.socket.off('state_update', handler); resolve(state); } };
    viewer.socket.on('state_update', handler);
  });
  assert.equal((await action(host.socket,{type:'UPDATE_SCORE',team:1,delta:1})).ok,true);
  assert.equal((await update).team1Score,1);
  assert.equal((await connect(b)).state.team1Score,0);
  assert.equal(foreignUpdates,0);
  const reconnect=await connect(a);assert.equal(reconnect.state.team1Score,1);
  const invalid=io(url,{auth:{room:a.room,hostKey:'é'.repeat(64)},reconnection:false});sockets.push(invalid);
  await once(invalid,'connect_error');
  assert.equal((await fetch(`${url}/api/lan-info`)).status,200);
  await action(host.socket,{type:'SET_ROUND',round:1});await action(host.socket,{type:'R1_START'});
  await action(host.socket,{type:'SET_ROUND',round:2});
  const check=await connect(a);assert.equal(check.state.round1.isActive,false);
 }finally{for(const socket of sockets)socket.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
