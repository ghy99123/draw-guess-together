import { GameStatus } from "./gameType";

export type Player = {
  userName: string;
  uid: string | null;
  score: number;
};

export type Room = {
  players: Player[];
  roomId: string;
  admin: Player;
};

export type GameInfo = {
  painter: Player;
  painterIndex: number;
  round: number;
  totalRound: number;
  answer: string;
  status: keyof typeof GameStatus;
};
