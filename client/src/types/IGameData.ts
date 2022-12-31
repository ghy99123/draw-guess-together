import { GameStatus } from "./gameType";

export type Player = {
  userName: string;
  uid: string | null;
};

export type Room = {
  players: Player[];
  roomId: string;
  admin: Player;
};

export type Score = {
  player: Player,
  score: number,
}

export type GameInfo = {
  painter: Player;
  painterIndex: number;
  round: number;
  totalRound: number;
  answer: string;
  status: keyof typeof GameStatus;
  correctGuess: number;
  scores: Record<string, Score>
};
