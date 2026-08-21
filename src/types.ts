export interface Round1State {
  wordIndex: number;
  timeLeft: number;
  isActive: boolean;
  roundEnd: boolean;
}

export interface Round2State {
  itemIndex: number;
  isAnswerRevealed: boolean;
  roundEnd: boolean;
}

export interface Round3State {
  themeIndex: number;
  timeLeft: number;
  isActive: boolean;
  roundEnd: boolean;
}

export interface Round4State {
  itemIndex: number;
  isAnswerRevealed: boolean;
  roundEnd: boolean;
}

export interface Round5State {
  itemIndex: number;
  isAnswerRevealed: boolean;
  roundEnd: boolean;
}

export interface Round6State {
  currentThemeIndex: number | null;
  currentWordIndex: number | null;
  isAnswerRevealed: boolean;
}

export interface Participant {
  id: number;
  name: string;
  score: number;
}

export interface GameSettings {
  isConfigured: boolean;
  type: 'teams' | 'players';
  count: number;
  participants: Participant[];
}

export interface ServerGameState {
  team1Score: number;
  team2Score: number;
  currentRound: number | null;
  round1: Round1State;
  round2: Round2State;
  round3: Round3State;
  round4: Round4State;
  round5: Round5State;
  round6: Round6State;
  gameSettings: GameSettings;
}

export interface Team {
  id: number;
  name: string;
  score: number;
}

export interface Round1Data {
  title: string;
  description: string;
  words: string[];
}

export interface Round2Item {
  photo: string;
  name: string;
  realAge: number;
}

export interface Round2Data {
  title: string;
  description: string;
  items: Round2Item[];
}

export interface Round3Data {
  title: string;
  description: string;
  themes: string[];
}

export interface Round4Item {
  photo: string;
  description: string;
}

export interface Round4Data {
  title: string;
  description: string;
  items: Round4Item[];
}

export interface Round5Item {
  photo: string;
  title: string;
}

export interface Round5Data {
  title: string;
  description: string;
  items: Round5Item[];
}

export interface QwertyWord {
  encoded: string;
  decoded: string;
}

export interface Round6Theme {
  theme: string;
  words: QwertyWord[];
}

export interface Round6Data {
  title: string;
  description: string;
  themes: Round6Theme[];
}

export interface GameData {
  round1: Round1Data;
  round2: Round2Data;
  round3: Round3Data;
  round4: Round4Data;
  round5: Round5Data;
  round6: Round6Data;
}
