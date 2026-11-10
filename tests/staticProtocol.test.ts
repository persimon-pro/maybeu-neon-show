import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialGameState,gameReducer} from '../src/game';
import {createStaticRoom,publicForHost,signSnapshot,verifySnapshot,projectState,applyStaticAction,type Snapshot} from '../src/staticProtocol';

test('signed static rooms reject tampered, malformed and foreign states',async()=>{
 const owner=await createStaticRoom(),foreign=await createStaticRoom();
 const jwk=await publicForHost(owner.hostKey);
 const snapshot:Snapshot={version:1,room:owner.room,publicKey:jwk.x!,revision:1,updatedAt:Date.now(),clockAt:Date.now(),state:structuredClone(initialGameState)};
 const signed=await signSnapshot(snapshot,owner.hostKey);
 assert.deepEqual(await verifySnapshot(signed,owner.room),snapshot);
 assert.equal(await verifySnapshot(signed,foreign.room),null);
 const tampered={...signed,payload:signed.payload.replace('"revision":1','"revision":9')};
 assert.equal(await verifySnapshot(tampered,owner.room),null);
 assert.equal(await verifySnapshot({payload:'{}',signature:'x'},owner.room),null);
 await assert.rejects(signSnapshot(snapshot,foreign.hostKey));
 const malformed=await signSnapshot({...snapshot,state:{...snapshot.state,round6:{currentThemeIndex:999,currentWordIndex:0,isAnswerRevealed:true}}},owner.hostKey);
 assert.equal(await verifySnapshot(malformed,owner.room),null);
});
test('static clocks derive elapsed time without duplicate ticks from multiple displays',()=>{
 let state=gameReducer(initialGameState,{type:'SET_ROUND',round:1});
 state=gameReducer(state,{type:'R1_START'});
 const snapshot:Snapshot={version:1,room:'test',publicKey:'test',revision:1,updatedAt:10000,clockAt:10000,state};
 const a=projectState(snapshot,15000),b=projectState(snapshot,15000);
 assert.equal(a.round1.timeLeft,15);assert.deepEqual(a,b);assert.equal(snapshot.state.round1.timeLeft,20);
 assert.equal(projectState(snapshot,31000).round1.wordIndex,1);
 assert.equal(projectState(snapshot,31000).round1.timeLeft,19);
 assert.equal(projectState(snapshot,1000000).round1.roundEnd,true);
});

test('rapid score changes do not reset fractional timer progress',()=>{
 let state=gameReducer(initialGameState,{type:'CONFIGURE_GAME',mode:'teams',count:2,names:[]});
 state=gameReducer(state,{type:'SET_ROUND',round:1});state=gameReducer(state,{type:'R1_START'});
 let snapshot:Snapshot={version:1,room:'test',publicKey:'test',revision:1,updatedAt:10000,clockAt:10000,state};
 snapshot=applyStaticAction(snapshot,{type:'UPDATE_SCORE',team:1,delta:1},10600);
 snapshot=applyStaticAction(snapshot,{type:'UPDATE_SCORE',team:1,delta:1},11200);
 assert.equal(snapshot.state.round1.timeLeft,19);assert.equal(projectState(snapshot,12000).round1.timeLeft,18);
 assert.equal(snapshot.state.team1Score,2);
});
