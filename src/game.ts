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

export function gameReducer(prevState: ServerGameState, action: any): ServerGameState {
  if (!isValidAction(action, prevState)) return prevState;
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
      state.currentRound = null;
      for (const key of ['round1', 'round2', 'round3', 'round4', 'round5', 'round6'] as const) {
        Object.assign(state[key], structuredClone(initialGameState[key]));
      }
      break;
    }
    case 'RESET_GAME_SETTINGS': {
      state.gameSettings.isConfigured = false;
      state.round1.isActive = false;
      state.round3.isActive = false;
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
      state.round1.isActive = false;
      state.round3.isActive = false;
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


export function isValidAction(action: unknown, state: ServerGameState): action is Record<string, any> {
  if (!action || typeof action !== 'object' || Array.isArray(action)) return false;
  const a = action as Record<string, any>;
  if (typeof a.type !== 'string') return false;
  const index = (n: unknown, length: number) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < length;
  switch (a.type) {
    case 'CONFIGURE_GAME': return ['teams', 'players'].includes(a.mode) && Number.isInteger(a.count) && a.count >= 2 && a.count <= 8 && Array.isArray(a.names) && a.names.length <= 8 && a.names.every((n: unknown) => typeof n === 'string' && n.length <= 80);
    case 'UPDATE_SCORE': return Number.isInteger(a.team) && state.gameSettings.participants.some(p => p.id === a.team) && [-5, -1, 1, 5].includes(a.delta);
    case 'SET_ROUND': return a.round === null || (typeof a.round === 'number' && index(a.round - 1, 6));
    case 'R6_SET_THEME': return a.index === null || index(a.index, gameData.round6.themes.length);
    case 'R6_SET_WORD': return a.index === null || (state.round6.currentThemeIndex !== null && index(a.index, gameData.round6.themes[state.round6.currentThemeIndex]?.words.length ?? 0));
    case 'R6_REVEAL_ANSWER': return state.round6.currentThemeIndex !== null && state.round6.currentWordIndex !== null;
    case 'R1_START': return state.currentRound === 1 && !state.round1.roundEnd;
    case 'R3_START': return state.currentRound === 3 && !state.round3.roundEnd && state.round3.timeLeft > 0;
    case 'TICK': return true;
    case 'RESET_SCORES': case 'RESET_GAME_SETTINGS': return true;
    default: return /^(R1_(PAUSE|NEXT_WORD|RESET)|R2_(REVEAL_ANSWER|NEXT_ITEM|RESET)|R3_(PAUSE|NEXT_THEME|RESET_TIME|RESET)|R4_(REVEAL_ANSWER|NEXT_ITEM|RESET)|R5_(REVEAL_ANSWER|NEXT_ITEM|RESET)|R6_RESET)$/.test(a.type);
  }
}
