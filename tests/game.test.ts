import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameReducer, initialGameState, isValidAction } from '../src/game';
import { gameData } from '../src/data';

const configured = () => gameReducer(initialGameState, { type: 'CONFIGURE_GAME', mode: 'teams', count: 2, names: ['A', 'B'] });
test('reject malformed commands, bounds and invalid participant data', () => {
  const state = configured();
  for (const action of [null, {}, [], {type:'CONFIGURE_GAME', count:Infinity}, {type:'CONFIGURE_GAME', mode:'teams',count:2,names:[42]}, {type:'SET_ROUND',round:'1'}, {type:'SET_ROUND',round:7}, {type:'UPDATE_SCORE',team:1,delta:'5'}, {type:'R6_SET_THEME',index:999}, {type:'R6_SET_WORD',index:0}]) {
    assert.equal(isValidAction(action,state),false,JSON.stringify(action));
    assert.equal(gameReducer(state,action),state);
  }
});
test('switching rounds pauses timers and leaves other state unchanged', () => {
  let state=gameReducer(configured(),{type:'SET_ROUND',round:1});
  state=gameReducer(state,{type:'R1_START'});
  assert.equal(gameReducer(state,{type:'TICK'}).round1.timeLeft,19);
  state=gameReducer(state,{type:'SET_ROUND',round:2});
  assert.equal(state.round1.isActive,false);
  assert.equal(gameReducer(state,{type:'TICK'}).round1.timeLeft,20);
});
test('all rounds terminate/reset and QWERTY selections remain valid', () => {
  for (const r of [1,2,4,5] as const) {
    let state=configured();
    const count=r===1?gameData.round1.words.length:gameData[`round${r}`].items.length;
    for(let i=0;i<count;i++) state=gameReducer(state,{type:r===1?'R1_NEXT_WORD':`R${r}_NEXT_ITEM`});
    assert.equal(state[`round${r}`].roundEnd,true);
    state=gameReducer(state,{type:`R${r}_RESET`});
    assert.equal(state[`round${r}`].roundEnd,false);
  }
  let state=configured();
  for(let i=0;i<gameData.round3.themes.length;i++)state=gameReducer(state,{type:'R3_NEXT_THEME'});
  assert.equal(state.round3.roundEnd,true);
  state=gameReducer(state,{type:'R6_SET_THEME',index:0});
  state=gameReducer(state,{type:'R6_SET_WORD',index:0});
  state=gameReducer(state,{type:'R6_REVEAL_ANSWER'});
  assert.equal(state.round6.isAnswerRevealed,true);
  state=gameReducer(state,{type:'R6_SET_THEME',index:null});
  assert.equal(state.round6.currentWordIndex,null);
});
test('new game resets rounds and scores; scores cannot go below zero',()=>{
  let state=gameReducer(configured(),{type:'UPDATE_SCORE',team:1,delta:-1});
  assert.equal(state.team1Score,0);
  state=gameReducer(state,{type:'UPDATE_SCORE',team:1,delta:5});
  assert.equal(state.team1Score,5);
  state=gameReducer(state,{type:'R1_NEXT_WORD'});
  state=gameReducer(state,{type:'CONFIGURE_GAME',mode:'players',count:3,names:[]});
  assert.equal(state.round1.wordIndex,0);assert.equal(state.team1Score,0);assert.equal(state.gameSettings.participants.length,3);
});
